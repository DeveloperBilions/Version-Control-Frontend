import React, { useState } from "react";
// react admin
import { Datagrid, List, TextField } from "react-admin";
// component
import { CreateApplications } from "./dialog/CreateApplications";
// mui
import { Button, Box } from "@mui/material";
// mui icon
import AddIcon from "@mui/icons-material/Add";

export const ApplicationsList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <React.Fragment>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Application
        </Button>
      </Box>

      <List
        title="Application List"
        // filters={dataFilters}
        sx={{ pt: 1 }}
        actions={false}
      >
        <Datagrid size="small" bulkActionButtons={false}>
          <TextField source="appName" label="App Name" />
          <TextField source="platform" label="Platform" />
          <TextField source="packageId" label="Package ID" />
        </Datagrid>
      </List>
      <CreateApplications
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </React.Fragment>
  );
};
