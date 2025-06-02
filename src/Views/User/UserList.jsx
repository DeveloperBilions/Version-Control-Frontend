import React, { useState } from "react";
// react admin
import {
  Datagrid,
  List,
  TextField,
  SearchInput,
  ReferenceField,
  FunctionField,
} from "react-admin";
// mui
import { Button, Box, Card, Chip } from "@mui/material";
// mui icon
import AddIcon from "@mui/icons-material/Add";
// component
import { CreateUser } from "./dialog/CreateUser";

import { Parse } from "parse";
// Initialize Parse
Parse.initialize(process.env.REACT_APP_APPID, process.env.REACT_APP_MASTER_KEY);
Parse.serverURL = process.env.REACT_APP_URL;

export const UserList = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const dataFilters = [
    <SearchInput source="q" alwaysOn resettable variant="outlined" />,
  ];

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add User
        </Button>
      </Box>

      <Card
        variant="elevation"
        elevation={1}
        sx={{
          mt: 2,
          backgroundColor: "#242424",
          borderRadius: 2,
          padding: { xs: 1.5, sm: 2 },
        }}
      >
        <List
          title="Users"
          sort={{ field: "createdAt", order: "DESC" }}
          // filters={dataFilters}
          sx={{ pt: 1, mt: "2px" }}
          actions={null}
        >
          <Datagrid size="small" rowClick={false} bulkActionButtons={false}>
            <TextField source="username" label="Username" />
            <TextField source="publicEmail" label="Email" />
            <ReferenceField
              source="role.id"
              reference="roles"
              label="Role"
              emptyText="Missing Role"
              link={false}
              sortBy="role.rolename"
            >
              <FunctionField
                render={(record) => {
                  const getColor = (status) => {
                    switch (status) {
                      case "Super-User":
                        return "primary";
                      case "Editor":
                        return "info";
                      case "Reader":
                        return "secondary";
                      default:
                        return "default";
                    }
                  };
                  return (
                    <Chip
                      label={record.name}
                      color={getColor(record.name)}
                      size="small"
                      variant="fill"
                    />
                  );
                }}
              />
            </ReferenceField>
            <ReferenceField
              source="manager.id"
              reference="users"
              label="Manager"
              emptyText="Missing User"
              link={false}
              sortBy="manager.username"
            >
              <TextField source="username" />
            </ReferenceField>
          </Datagrid>
        </List>
      </Card>

      <CreateUser open={openDialog} onClose={() => setOpenDialog(false)} />
    </React.Fragment>
  );
};
