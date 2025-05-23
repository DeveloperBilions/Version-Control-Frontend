import React, { useState } from "react";
// react admin
import {
  Datagrid,
  List,
  TextField,
  useRecordContext,
  WrapperField,
} from "react-admin";
// component
import { CreateApplications } from "./dialog/CreateApplications";
import { EditApplications } from "./dialog/EditApplications";
// mui
import { Button, Box, Menu, MenuItem } from "@mui/material";
// mui icon
import AddIcon from "@mui/icons-material/Add";

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
    if (onEdit && record) {
      onEdit(record); // Pass current row's record to parent
    }
    handleClose();
  };

  const handleDeleteClick = () => {
    // If you implement delete logic later, trigger it here
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        onClick={handleClick}
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
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export const ApplicationsList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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
          <WrapperField label="Actions">
            <CustomButton
              onEdit={(record) => {
                setSelectedRecord(record);
                setEditDialogOpen(true);
              }}
            />
          </WrapperField>
          <TextField source="appName" label="App Name" />
          <TextField source="platform" label="Platform" />
          <TextField source="packageId" label="Package ID" />
        </Datagrid>
      </List>
      <CreateApplications
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
      <EditApplications
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        record={selectedRecord}
      />
    </React.Fragment>
  );
};
