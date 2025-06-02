import Parse from "parse";
Parse.initialize(
  process.env.REACT_APP_APPID,
  null,
  process.env.REACT_APP_MASTER_KEY
);
Parse.masterKey = process.env.REACT_APP_MASTER_KEY;
Parse.serverURL = process.env.REACT_APP_URL;

export const authProvider = {
  login: async (params) => {
    //works
    const { username, password } = params;
    try {
      if (!username || !password) {
        throw new Error("username and password are required.");
      }
      if (username.includes("@")) {
        throw new Error("Username cannot be an email address.");
      }

      const response = await Parse.Cloud.run("caseInsensitiveLogin", {
        username,
        password,
      });

      localStorage.setItem("role", response?.user?.roleName);

      await Parse.User.logIn(username, password);

      // return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  checkError: async (error) => {
    const isInvalidSession =
      error?.status === 401 ||
      error?.status === 403 ||
      error?.message?.toLowerCase().includes("invalid session token") ||
      error?.code === 209;

    if (isInvalidSession) {
      console.warn("Invalid session detected, logging out...");

      try {
        await Parse.User.logOut();
      } catch (err) {
        console.error("Error during logout:", err);
      }

      // Clear localStorage
      localStorage.clear();

      return Promise.reject();
    }

    return Promise.resolve();
  },
  checkAuth: async (params) => {
    return Parse.User.current() ? Promise.resolve() : Promise.reject();
  },
  logout: async () => {
    //works
    console.log("LOGOUT");
    try {
      const user = Parse.User.current();

      if (user) {
        localStorage.removeItem("role");

        // Clear session token from local storage
        localStorage.removeItem(
          `Parse/${process.env.REACT_APP_APP_ID}/sessionToken`
        );
        localStorage.removeItem(
          `Parse/${process.env.REACT_APP_APP_ID}/currentUser`
        );
      }

      // localStorage.clear();
      await Parse.User.logOut();

      return Promise.resolve();
    } catch (error) {
      throw Error(error.toString());
    }
  },
  getIdentity: async () => {
    let user = Parse.User.current();

    // Restore session if user is null
    if (!user) {
      const sessionToken = localStorage.getItem(
        `Parse/${process.env.REACT_APP_APPID}/sessionToken`
      );

      if (sessionToken) {
        console.log("Restoring session...");
        try {
          user = await Parse.User.become(sessionToken);
        } catch (err) {
          console.error("Session restoration failed:", err);
          throw new Error("Session expired. Please log in again.");
        }
      } else {
        throw new Error("No active session found.");
      }
    }

    // Ensure the user is fully fetched
    user = await user.fetch();

    // const user = Parse.User.current();
    const userRole = await user.get("role");
    await userRole.fetch({ useMasterKey: true });

    const manager = await user.get("manager");
    return {
      userId: user.id,
      username: user.get("username"),
      userRoleId: userRole.id,
      userRoleName: userRole.get("name"),
      email: user.get("email"),
      managerId: manager.id,
      createdAt: user.get("createdAt"),
      sessionToken: user.getSessionToken(),
    };
  },
  getPermissions: () => {
    const currentUserData = localStorage.getItem("role");
    const roleName = currentUserData;
    return roleName;
  },
};
