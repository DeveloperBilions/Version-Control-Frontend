import React, { useState } from "react";
// react admin
import {
  Pagination,
  Datagrid,
  List,
  TextField,
  FunctionField,
  useRecordContext,
  WrapperField,
} from "react-admin";
// mui
import { Card, Typography, Button, Box, Menu, MenuItem } from "@mui/material";
// mui icon
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
// react router dom
import { useParams, useSearchParams } from "react-router-dom";
// component
import { CreateReleases } from "./dialog/CreateReleases";
import { EditReleases } from "./dialog/EditReleases";

const CustomButton = ({ onEdit }) => {
  const record = useRecordContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(record);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
        sx={{ textTransform: "none" }}
      >
        Actions
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "actions-button" }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
        >
          Edit
        </MenuItem>
      </Menu>
    </>
  );
};

export const ReleaseList = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const id = params.id;
  const appName = searchParams.get("appName");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Typography
          mt={2}
          variant="h4"
          sx={{ color: "#999", fontWeight: 400, fontSize: 18 }}
        >
          Releases for <b>{appName}</b>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Releases
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
          title="Release List"
          resource="release"
          // filters={<CustomFilter />}
          filter={{ appId: id }}
          sort={{ field: "createdAt", order: "DESC" }}
          actions={null}
          pagination={<Pagination />}
          sx={{ mt: "2px" }}
        >
          <Datagrid bulkActionButtons={false}>
            <WrapperField label="Actions">
              <CustomButton
                onEdit={(record) => {
                  setSelectedRecord(record);
                  setEditDialogOpen(true);
                }}
              />
            </WrapperField>
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
      <CreateReleases
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        appId={id}
      />
      <EditReleases
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        record={selectedRecord}
      />
    </React.Fragment>
  );
};
