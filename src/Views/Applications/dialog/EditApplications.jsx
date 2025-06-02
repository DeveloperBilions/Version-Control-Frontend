import React from "react";
// react admin
import { TextInput, SelectInput, required } from "react-admin";
// mui
import { Grid, Dialog } from "@mui/material";
// component
import { EditForm } from "../../../Layout/EditForm";

export const EditApplications = ({ open, onClose, record }) => {
  const platformChoices = [
    { id: "android", name: "Android" },
    { id: "ios", name: "iOS" },
    { id: "web", name: "Web" },
  ];

  return (
    <React.Fragment>
      <Dialog fullWidth={true} open={open} onClose={onClose}>
        <EditForm
          title="Edit Application"
          handleClose={onClose}
          id={record?.id}
          resource="applications"
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextInput
                id="appName"
                name="appName"
                source="appName"
                label="App Name"
                fullWidth
                validate={[required()]}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectInput
                id="platform"
                name="platform"
                source="platform"
                label="Platform"
                choices={platformChoices}
                fullWidth
                validate={[required()]}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                id="packageId"
                name="packageId"
                source="packageId"
                label="Package ID"
                fullWidth
                validate={[required()]}
              />
            </Grid>
          </Grid>
        </EditForm>
      </Dialog>
    </React.Fragment>
  );
};
