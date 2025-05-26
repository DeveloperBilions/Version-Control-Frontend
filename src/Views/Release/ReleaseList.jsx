import React from "react";
// react admin
import {
  Pagination,
  Datagrid,
  List,
  TextField,
  FunctionField,
} from "react-admin";
// mui
import { Card, Typography } from "@mui/material";
// mui icon
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
// react router dom
import { useParams, useSearchParams } from "react-router-dom";

export const ReleaseList = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const id = params.id;
  const appName = searchParams.get("appName");

  return (
    <React.Fragment>
      <Typography
        mt={2}
        variant="h4"
        sx={{ color: "#999", fontWeight: 400, fontSize: 24 }}
      >
        Releases for <b>{appName}</b>
      </Typography>
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
          resource="release"
          // filters={<CustomFilter />}
          filter={{ appId: id }}
          sort={{ field: "createdAt", order: "DESC" }}
          actions={null}
          pagination={<Pagination />}
          sx={{ mt: "2px" }}
        >
          <Datagrid bulkActionButtons={false}>
            <TextField source="version" label="Version" />
            <FunctionField
              label="Mandatory"
              render={(record) => {
                const isMandatory = Boolean(record.mandatory);

                return isMandatory ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                );
              }}
            />
            <FunctionField
              label="Whitelisted"
              render={(record) => {
                const isWhitelisted = Boolean(record.whitelisted);

                return isWhitelisted ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                );
              }}
            />
            <FunctionField
              label="Blacklisted"
              render={(record) => {
                const isBlacklisted = Boolean(record.blacklisted);

                return isBlacklisted ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                );
              }}
            />
            <TextField source="notes" label="Notes" />
          </Datagrid>
        </List>
      </Card>
    </React.Fragment>
  );
};
