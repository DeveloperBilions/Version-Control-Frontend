import Parse from "parse";
import semver from "semver";

Parse.initialize(
  process.env.REACT_APP_APPID,
  null,
  process.env.REACT_APP_MASTER_KEY
);
Parse.serverURL = process.env.REACT_APP_URL;
Parse.masterKey = process.env.REACT_APP_MASTER_KEY;

export const dataProvider = {
  create: async (resource, params) => {
    try {
      if (resource === "users") {
        const data = (({ username, email, password, role, manager }) => ({
          username,
          email,
          password,
          role,
          manager,
        }))(params.data);
        data.email = data.email.toLowerCase();

        const result = await Parse.Cloud.run("createUser", params.data);

        return { data: { id: result.id, ...result.attributes } };
      } else if (resource === "applications") {
        const Applications = Parse.Object.extend("Applications");
        const application = new Applications();

        // Set fields from params.data
        application.set("appName", params.data.appName);
        application.set("platform", params.data.platform);
        application.set("packageId", params.data.packageId);

        try {
          // Save application to Parse
          const savedApp = await application.save();

          // Attempt to create corresponding folder in S3
          try {
            const folderName = savedApp.id;
            const folderResult = await Parse.Cloud.run("createS3Folder", {
              folderName,
            });

            if (!folderResult || !folderResult.success) {
              console.warn(
                "S3 folder creation failed or returned unexpected response:",
                folderResult
              );
            }
          } catch (cloudError) {
            console.error(
              "Error calling Cloud Function `createS3Folder`:",
              cloudError.message || cloudError
            );
          }

          return { data: { id: savedApp.id, ...savedApp.attributes } };
        } catch (error) {
          console.error("Error creating application:", error);
          throw new Error("Failed to create application");
        }
      } else if (resource === "release") {
        const { version, appId, releaseNotes } = params.data;

        let fileUrl = "";
        if (releaseNotes?.rawFile) {
          const fileName = releaseNotes.rawFile.name;

          // Convert rawFile to base64
          const pdfBase64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(releaseNotes.rawFile);
            reader.onload = () => {
              const base64 = reader.result.split(",")[1]; // Remove `data:application/pdf;base64,`
              resolve(base64);
            };
            reader.onerror = (err) => reject(err);
          });

          // ✅ Call Parse Cloud Function to upload to S3
          try {
            const result = await Parse.Cloud.run("uploadPDF", {
              applicationId: appId,
              version: version,
              fileName,
              fileBase64: pdfBase64,
            });

            fileUrl = result.fileUrl;
          } catch (error) {
            console.error("PDF upload failed:", error);
            throw new Error("PDF upload failed");
          }
        }

        const ReleaseQuery = Parse.Object.extend("Release");
        const releaseQuery = new ReleaseQuery();

        const toBoolean = (value) => value === "true" || value === true;

        // ✅ Create a pointer to Application
        const Application = Parse.Object.extend("Applications");
        const appPointer = new Application();
        appPointer.id = params.data.appId;

        // ✅ Step 1: Query for the latest version for this app
        const prevReleaseQuery = new Parse.Query("Release");
        prevReleaseQuery.equalTo("appId", appPointer);
        prevReleaseQuery.descending("createdAt");
        prevReleaseQuery.limit(1);
        const previousReleases = await prevReleaseQuery.find();

        const previousVersion =
          previousReleases.length > 0
            ? previousReleases[0].get("version")
            : null;

        const newVersion = params.data.version;

        // ✅ Step 2: Validate version format and ensure it's higher
        if (!semver.valid(newVersion)) {
          throw new Error(
            `Invalid version format "${newVersion}". Use version format like 1.0.0`
          );
        }

        if (previousVersion && !semver.gt(newVersion, previousVersion)) {
          throw new Error(
            `Version "${newVersion}" must be greater than previous version "${previousVersion}"`
          );
        }

        // Step 3: Save release
        releaseQuery.set("appId", appPointer);
        releaseQuery.set("version", newVersion);
        releaseQuery.set("mandatory", toBoolean(params.data.mandatory));
        releaseQuery.set("whitelisted", toBoolean(params.data.whitelisted));
        releaseQuery.set("blacklisted", toBoolean(params.data.blacklisted));
        releaseQuery.set("releaseNotes", {
          src: fileUrl,
          title: releaseNotes.rawFile.name,
        });
        releaseQuery.set("remarks", params.data.remarks);

        try {
          const savedApp = await releaseQuery.save();

          return { data: { id: savedApp.id, ...savedApp.attributes } };
        } catch (error) {
          console.error("Error creating release:", error);
          throw new Error("Failed to create release");
        }
      } else {
        const Resource = Parse.Object.extend(resource);
        const query = new Resource();
        const result = await query.save(params.data);

        return { data: { id: result.id, ...result.attributes } };
      }
    } catch (error) {
      throw error;
    }
  },
  getOne: async (resource, params) => {
    var query = null;
    var result = null;
    try {
      if (resource === "users") {
        query = new Parse.Query(Parse.User);
        result = await query.get(params.id);
      } else if (resource === "applications") {
        const Resource = Parse.Object.extend("Applications");
        query = new Parse.Query(Resource);
        result = await query.get(params.id);
      } else if (resource === "release") {
        const Resource = Parse.Object.extend("Release");
        query = new Parse.Query(Resource);
        result = await query.get(params.id);
      } else {
        const Resource = Parse.Object.extend(resource);
        query = new Parse.Query(Resource);
        result = await query.get(params.id);
      }
      return { data: { id: result.id, ...result.attributes } };
    } catch (error) {
      return error;
    }
  },
  getList: async (resource, params) => {
    Parse.masterKey = process.env.REACT_APP_MASTER_KEY;
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const filter = params.filter;
    var query = null;
    var count = null;

    if (resource === "root-build-config") {
      // Root build config doesn't use pagination, return empty list
      // The actual page component will handle fetching the config
      return {
        total: 0,
        data: [],
      };
    } else if (resource === "users") {
      query = new Parse.Query(Parse.User);
      query.include("role");

      filter &&
        Object.keys(filter).map((f) =>
          typeof filter[f] === "string"
            ? query.matches(f, filter[f], "i")
            : query.equalTo(f, filter[f])
        );
    } else if (resource === "roles") {
      query = new Parse.Query(Parse.Role);
      filter.notSelf &&
        query.notEqualTo(
          "objectId",
          (await Parse.User.current().get("role")).id
        );
    } else if (resource === "applications") {
      const Resource = Parse.Object.extend("Applications");
      query = new Parse.Query(Resource);
      // Show applications that are not deleted (including those without isDeleted field)
      query.notEqualTo("isDeleted", true);
    } else if (resource === "release") {
      const Resource = Parse.Object.extend("Release");
      query = new Parse.Query(Resource);

      // Create a pointer to the Application object
      const application = new Parse.Object("Applications");
      application.id = filter.appId; // or use yourAppId directly

      // Filter releases by appId (pointer match)
      query.equalTo("appId", application);
    } else {
      const Resource = Parse.Object.extend(resource);
      query = new Parse.Query(Resource);
      filter &&
        Object.keys(filter).map((f) =>
          typeof filter[f] === "string"
            ? query.matches(f, filter[f], "i")
            : query.equalTo(f, filter[f])
        );
    }

    count = await query.count();
    query.limit(perPage);
    query.skip((page - 1) * perPage);

    if (order === "DESC") query.descending(field);
    else if (order === "ASC") query.ascending(field);

    try {
      const results = await query.find();

      return {
        total: count,
        data: results.map((o) => {
          // Add role name and precedence only if resource is "users"
          if (resource === "users") {
            const role = o.get("role");

            const roleName = role ? role.get("name") : null;
            const rolePrecedence = role ? role.get("precedence") : null;
            const userId = o.id;

            // Ensure that user data is updated in the cache
            const userData = {
              id: userId,
              roleName,
              rolePrecedence,
              ...o.attributes,
            };

            return userData;
          } else {
            return { id: o.id, ...o.attributes };
          }
        }),
      };
    } catch (error) {
      return error;
    }
  },
  getMany: async (resource, params) => {
    var query = null;
    var results = null;
    if (resource === "users") {
      results = params.ids
        .map((obj) => {
          if (typeof obj === "string")
            return new Parse.Query(Parse.User)
              .get(obj, { useMasterKey: true })
              .then((user) => {
                console.log("✅ Found user:", user.obj);
                return user;
              })
              .catch((err) => {
                console.log("❌ User not found:", obj, err.message);
                return null;
              });
        })
        .filter((n) => n);
    } else if (resource === "roles") {
      results = params.ids
        .map((obj) => {
          if (typeof obj === "string")
            return new Parse.Query(Parse.Role).get(obj, { useMasterKey: true });
        })
        .filter((n) => n);
    } else {
      const Resource = Parse.Object.extend(resource);
      query = new Parse.Query(Resource);
      results = params.ids.map((id) => new Parse.Query(Resource).get(id));
    }
    try {
      const data = await Promise.all(results);
      return {
        // total: data.length,
        data: data.map((o) => ({ id: o.id, ...o.attributes })),
      };
    } catch (error) {
      throw error;
    }
  },
  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const Resource = Parse.Object.extend(resource);
    var query = null;

    if (resource === "users") {
      query = new Parse.Query(Parse.User);
    } else {
      const Resource = Parse.Object.extend(resource);
      query = new Resource();
    }

    query.equalTo(params.target, params.id);
    const count = await query.count();
    if (perPage) query.limit(perPage);
    if (page) query.skip((page - 1) * perPage);
    if (order === "DESC") query.descending(field);
    else if (order === "ASEC") query.ascending(field);

    try {
      const results = await query.find();
      return {
        total: count,
        data: results.map((o) => ({ id: o.id, ...o.attributes })),
      };
    } catch (error) {
      return error;
    }
  },
  update: async (resource, params) => {
    var query = null;
    var obj = null;
    var r = null;
    const keys = Object.keys(params.data).filter((o) =>
      o === "id" || o === "createdAt" || o === "updatedAt" ? false : true
    );
    const data = keys.reduce((r, f, i) => {
      r[f] = params.data[f];
      return r;
    }, {});
    try {
      if (resource === "users") {
        query = new Parse.Query(Parse.User);
        obj = await query.get(params.id);
        r = await obj.save(data);
      } else if (resource === "applications") {
        const Resource = Parse.Object.extend("Applications");
        query = new Parse.Query(Resource);
        obj = await query.get(params?.data?.id);
        r = await obj.save(data);
      } else if (resource === "release") {
        const { version, appId, releaseNotes } = params.data;

        let fileUrl = "";
        if (releaseNotes?.rawFile) {
          const fileName = releaseNotes.rawFile.name;

          // Convert rawFile to base64
          const pdfBase64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(releaseNotes.rawFile);
            reader.onload = () => {
              const base64 = reader.result.split(",")[1];
              resolve(base64);
            };
            reader.onerror = (err) => reject(err);
          });

          // ✅ Call Parse Cloud Function to upload to S3
          try {
            const result = await Parse.Cloud.run("editPDF", {
              applicationId: appId.id,
              version: version,
              fileName,
              fileBase64: pdfBase64,
            });

            fileUrl = result.fileUrl;
          } catch (error) {
            console.error("PDF upload failed:", error);
            throw new Error("PDF upload failed");
          }
        }

        const Resource = Parse.Object.extend("Release");
        const query = new Parse.Query(Resource);
        const obj = await query.get(params?.data?.id);

        // Convert string booleans to real booleans
        const toBoolean = (value) => value === true || value === "true";

        const newBlacklist = toBoolean(params.data.blacklisted);

        // Only check blacklist condition if blacklisting is requested
        if (newBlacklist) {
          // Create pointer to Application
          const Application = Parse.Object.extend("Applications");
          const appPointer = new Application();
          appPointer.id = params.data.appId;

          // Query releases with higher versions for same app
          const higherReleaseQuery = new Parse.Query("Release");
          higherReleaseQuery.equalTo("appId", params.data.appId);

          // Get all releases for app (will filter by version manually)
          const allReleases = await higherReleaseQuery.find();

          // Filter releases where:
          // version > current release version
          // whitelist === true
          // blacklist === false
          const suitableHigherVersions = allReleases.filter((r) => {
            const v = r.get("version");
            return (
              semver.valid(v) &&
              semver.gt(v, obj.get("version")) &&
              r.get("whitelisted") === true &&
              r.get("blacklisted") === false
            );
          });

          if (suitableHigherVersions.length === 0) {
            throw new Error(
              "Cannot blacklist this version because no higher stable version exists."
            );
          }
        }

        // Prepare updated data
        const data = {
          ...params.data,
          mandatory: toBoolean(params.data.mandatory),
          whitelisted: toBoolean(params.data.whitelisted),
          blacklisted: toBoolean(params.data.blacklisted),
          releaseNotes: releaseNotes?.rawFile
            ? {
                src: fileUrl,
                title: releaseNotes.rawFile.name,
              }
            : releaseNotes,
        };

        const updatedRelease = await obj.save(data);
        return {
          data: { id: updatedRelease.id, ...updatedRelease.attributes },
        };
      } else if (resource === "releaseStatus") {
        const { id, data } = params;

        const ParseObject = Parse.Object.extend("Release");
        const query = new Parse.Query(ParseObject);

        try {
          const object = await query.get(id);
          Object.entries(data).forEach(([key, value]) => {
            object.set(key, value);
          });
          const updatedObject = await object.save();

          return {
            data: {
              id: updatedObject.id,
              ...updatedObject.toJSON(),
            },
          };
        } catch (error) {
          throw new Error(error.message);
        }
      } else {
        // const Resource = Parse.Object.extend(resource);
        // query = new Resource();

        query = new Parse.Query(resource);

        obj = await query.get(params.id);
        r = await obj.save(data);
      }
      return { data: { id: r.id, ...r.attributes } };
    } catch (error) {
      throw error;
    }
  },
  updateMany: async (resource, params) => {
    const Resource = Parse.Object.extend(resource);
    try {
      const qs = await Promise.all(
        params.ids.map((id) => new Parse.Query(Resource).get(id))
      );
      qs.map((q) => q.save(params.data));
      return { data: params.ids };
    } catch {
      throw Error("Failed to update all");
    }
  },
  delete: async (resource, params) => {
    const userId = params.id;

    try {
      if (resource === "users") {
        const response = await Parse.Cloud.run("deleteUser", { userId });
        // console.log("---", response);
        const data = { data: { id: userId, ...userId.attributes } };
        // console.log("%%%", data);
        return data;
      } else if (resource === "applications") {
        const Resource = Parse.Object.extend("Applications");
        const query = new Parse.Query(Resource);
        const obj = await query.get(userId);

        // Mark the object as deleted (soft delete)
        obj.set("isDeleted", true);
        await obj.save();

        const data = { data: { id: obj.id, ...obj.attributes } };

        return data;
      } else {
        const Resource = Parse.Object.extend(resource);
        const query = new Parse.Query(Resource);
        const obj = await query.get(params.id);
        const data = { data: { id: obj.id, ...obj.attributes } };

        await obj.destroy();
        return data;
      }
    } catch (error) {
      console.log("^^^^^^^^^^", error);

      throw Error("Unable to delete");
    }
  },
  deleteMany: async (resource, params) => {
    const Resource = Parse.Object.extend(resource);
    try {
      const qs = await Promise.all(
        params.ids.map((id) => new Parse.Query(Resource).get(id))
      );
      await Promise.all(qs.map((obj) => obj.destroy()));
      return { data: params.ids };
    } catch (error) {
      throw Error("Unable to delete all");
    }
  },
};
