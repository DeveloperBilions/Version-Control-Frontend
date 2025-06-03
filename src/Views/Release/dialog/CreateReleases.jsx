import React from "react";
// react admin
import { TextInput, required, RadioButtonGroupInput } from "react-admin";
// mui
import { Grid, Dialog } from "@mui/material";
// component
import { CreateForm } from "../../../Layout/CreateForm";

export const CreateReleases = ({ open, onClose, appId }) => {

  const validateVersion = (value) => {
    if (!value) {
      return "Version is required";
    }
    // Regex for semantic versioning: e.g. 1.0.0, 2.1.3, 1.0.0-beta, 1.0.0+build.1 etc.
    // You can simplify or extend this regex as needed
    const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?(\+[a-zA-Z0-9]+)?$/;

    return versionRegex.test(value)
      ? undefined
      : "Version must be in the format (e.g. 1.0.0)";
  };

  return (
    <React.Fragment>
      <Dialog fullWidth={true} open={open} onClose={onClose}>
        <CreateForm
          title="Create Release"
          handleClose={onClose}
          resource="release"
          extraData={{ appId }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextInput
                id="version"
                name="version"
                source="version"
                label="Version"
                fullWidth
                validate={[required(), validateVersion]}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <RadioButtonGroupInput
                    source="mandatory"
                    label="Mandatory"
                    choices={[
                      { id: true, name: "Yes" },
                      { id: false, name: "No" },
                    ]}
                    validate={[required()]}
                  />
                </Grid>
                <Grid item xs={4}>
                  <RadioButtonGroupInput
                    source="whitelisted"
                    label="Whitelisted"
                    choices={[
                      { id: true, name: "Yes" },
                      { id: false, name: "No" },
                    ]}
                    validate={[required()]}
                  />
                </Grid>
                <Grid item xs={4}>
                  <RadioButtonGroupInput
                    source="blacklisted"
                    label="Blacklisted"
                    choices={[
                      { id: true, name: "Yes" },
                      { id: false, name: "No" },
                    ]}
                    validate={[required()]}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextInput
                id="releaseNotes"
                name="releaseNotes"
                source="releaseNotes"
                label="Release Notes"
                multiline
                minRows={2}
                fullWidth
                validate={[required()]}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                id="remarks"
                name="remarks"
                source="remarks"
                label="Remarks"
                multiline
                minRows={2}
                fullWidth
                validate={[required()]}
              />
            </Grid>
          </Grid>
        </CreateForm>
      </Dialog>
    </React.Fragment>
  );
};
