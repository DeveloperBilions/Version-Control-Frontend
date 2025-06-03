import React, { useState } from "react";
// react admin
import {
  Datagrid,
  List,
  TextField,
  useRecordContext,
  WrapperField,
  useGetIdentity,
} from "react-admin";
// component
import { CreateApplications } from "./dialog/CreateApplications";
import { EditApplications } from "./dialog/EditApplications";
import { DeleteDialog } from "../../Layout/DeleteDialog";
// mui
import { Button, Box, Menu, MenuItem, Card } from "@mui/material";
// mui icon
import AddIcon from "@mui/icons-material/Add";
// react router dom
import { useNavigate } from "react-router-dom";

const CustomButton = ({ onEdit, onDelete }) => {
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

  const handleDeleteClick = () => {
    onDelete?.(record);
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
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export const ApplicationsList = () => {
  const navigate = useNavigate();
  const { data } = useGetIdentity();

  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  return (
    <React.Fragment>
      {data?.userRoleName === "Super-User" && (
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add Application
          </Button>
        </Box>
      )}

      <Card
        variant="elevation"
        elevation={1}
        sx={{
          mt: data?.userRoleName === "Super-User" ? 2 : 4,
          backgroundColor: "#242424",
          borderRadius: 2,
          padding: { xs: 1.5, sm: 2 },
        }}
      >
        <List
          title="Application List"
          sort={{ field: "createdAt", order: "DESC" }}
          // filters={dataFilters}
          sx={{ pt: 1 }}
          actions={false}
        >
          <Datagrid
            size="small"
            bulkActionButtons={false}
            rowClick={(id, basePath, record) => {
              navigate(`/applications/${id}?appName=${record.appName}`);
              return false;
            }}
          >
            {data?.userRoleName === "Super-User" && (
              <WrapperField label="Actions">
                <CustomButton
                  onEdit={(record) => {
                    setSelectedRecord(record);
                    setEditDialogOpen(true);
                  }}
                  onDelete={(record) => {
                    setSelectedRecord(record);
                    setDeleteDialogOpen(true);
                  }}
                />
              </WrapperField>
            )}
            <TextField source="appName" label="App Name" />
            <TextField source="platform" label="Platform" />
            <TextField source="packageId" label="Package ID" />
          </Datagrid>
        </List>
      </Card>
      <CreateApplications
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
      <EditApplications
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        record={selectedRecord}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        handleClose={() => setDeleteDialogOpen(false)}
        id={selectedRecord?.id}
        resource="applications"
      />
    </React.Fragment>
  );
};
