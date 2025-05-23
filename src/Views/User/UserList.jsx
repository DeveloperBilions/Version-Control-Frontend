import React, { useEffect, useState } from "react";
import {
  Datagrid,
  List,
  TextField,
  SearchInput,
  CreateButton,
  TopToolbar,
  WrapperField,
  useRecordContext,
  useResourceContext,
} from "react-admin";
import { Menu, MenuItem, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RechargeDialog from "./dialog/RechargeDialog";
import RedeemDialog from "./dialog/RedeemDialog";

import { Parse } from "parse";
// Initialize Parse
Parse.initialize(process.env.REACT_APP_APPID, process.env.REACT_APP_MASTER_KEY);
Parse.serverURL = process.env.REACT_APP_URL;

const CustomButton = ({ fetchAllUsers }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);

  const record = useRecordContext();
  const resource = useResourceContext();
  if (!record) return null;

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    navigate(`/users/${record.id}`);
  };

  const handleDelete = async () => {
    const userId = record.id;
    handleClose();
    await Parse.Cloud.run("deleteUser", { userId });
    fetchAllUsers();
  };

  const handleRecharge = () => {
    handleClose();
    setRechargeDialogOpen(true);
  };

  const handleRedeem = () => {
    handleClose();
    setRedeemDialogOpen(true);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Editor
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleRedeem}>Redeem</MenuItem>
        <MenuItem onClick={handleRecharge}>Recharge</MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <RechargeDialog
        open={rechargeDialogOpen}
        onClose={() => setRechargeDialogOpen(false)}
        record={record}
        resource={resource}
        fetchAllUsers={fetchAllUsers}
      />
      <RedeemDialog
        open={redeemDialogOpen}
        onClose={() => setRedeemDialogOpen(false)}
        record={record}
        resource={resource}
        fetchAllUsers={fetchAllUsers}
      />
    </React.Fragment>
  );
};

export const UserList = () => {
  const [userData, setUserData] = useState();

  const fetchAllUsers = async () => {
    try {
      const response = await Parse.Cloud.run("fetchAllUsers");
      setUserData(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const dataFilters = [
    <SearchInput source="q" alwaysOn resettable variant="outlined" />,
  ];

  const PostListActions = () => (
    <TopToolbar>
      <CreateButton />
    </TopToolbar>
  );

  return (
    <>
      <List
        title="Users"
        filters={dataFilters}
        sx={{ pt: 1 }}
        actions={<PostListActions />}
      >
        <Datagrid size="small" data={userData} rowClick={false}>
          <WrapperField label="Actions">
            <CustomButton fetchAllUsers={fetchAllUsers} />
          </WrapperField>
          <TextField source="username" label="Username" />
          <TextField source="email" label="Email" />
        </Datagrid>
      </List>
    </>
  );
};
