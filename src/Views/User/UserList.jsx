import React from "react";
// react admin
import { Datagrid, List, TextField, SearchInput } from "react-admin";
// mui
import { Card } from "@mui/material";
import { Parse } from "parse";

// Initialize Parse
Parse.initialize(process.env.REACT_APP_APPID, process.env.REACT_APP_MASTER_KEY);
Parse.serverURL = process.env.REACT_APP_URL;

export const UserList = () => {
  const dataFilters = [
    <SearchInput source="q" alwaysOn resettable variant="outlined" />,
  ];

  return (
    <React.Fragment>
      <Card
        variant="elevation"
        elevation={1}
        sx={{
          mt: 4,
          backgroundColor: "#242424",
          borderRadius: 2,
          padding: { xs: 1.5, sm: 2 },
        }}
      >
        <List
          title="Users"
          filters={dataFilters}
          sx={{ pt: 1, mt: "2px" }}
          actions={null}
        >
          <Datagrid size="small" rowClick={false} bulkActionButtons={false}>
            <TextField source="username" label="Username" />
            <TextField source="email" label="Email" />
          </Datagrid>
        </List>
      </Card>
    </React.Fragment>
  );
};
