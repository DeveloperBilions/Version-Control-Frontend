import React from "react";
// react admin
import { TextInput, required } from "react-admin";
// mui
import { Grid, Dialog } from "@mui/material";
// component
import { CreateForm } from "../../../Layout/CreateForm";

export const CreateApplications = ({ open, onClose }) => {
  return (
    <React.Fragment>
      <Dialog fullWidth={true} open={open} onClose={onClose}>
        <CreateForm
          title="Create Application"
          handleClose={onClose}
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
              <TextInput
                id="platform"
                name="platform"
                source="platform"
                label="Platform"
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
        </CreateForm>
      </Dialog>
    </React.Fragment>
  );
};
