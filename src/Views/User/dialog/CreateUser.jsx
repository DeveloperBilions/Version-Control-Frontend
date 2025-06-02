import React, { useState } from "react";
// react admin
import {
  TextInput,
  AutocompleteInput,
  useGetList,
  required,
} from "react-admin";
// mui
import { Grid, Dialog, IconButton, InputAdornment } from "@mui/material";
// mui icon
import { Visibility, VisibilityOff } from "@mui/icons-material";
// component
import { CreateForm } from "../../../Layout/CreateForm";

export const CreateUser = ({ open, onClose }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRolePrecedence, setSelectedRolePrecedence] = useState(null);

  const { data: roleData, isPending: isRolesPending } = useGetList(
    "roles",
    {
      pagination: { page: 1, perPage: 20 },
      sort: { field: "createdAt", order: "ASC" },
      filter: { notSelf: true },
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const { data: userData, isPending: isUsersPending } = useGetList(
    "users",
    {
      pagination: { page: 1, perPage: 10000 },
      sort: { field: "roleName", order: "ASC" },
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const filteredUsers = userData?.filter(
    (ele) => ele.rolePrecedence < selectedRolePrecedence
  );

  const validatePassword = (value) => {
    if (!value) return "Required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return undefined;
  };

  const validateConfirmPassword = (password) => (value) => {
    if (!value) return "Required";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (value !== password) return "Passwords do not match";
    return undefined;
  };

  return (
    <React.Fragment>
      <Dialog fullWidth={true} open={open} onClose={onClose}>
        <CreateForm title="Create User" handleClose={onClose} resource="users">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextInput
                id="username"
                name="username"
                source="username"
                label="Username"
                fullWidth
                validate={[required()]}
              />
            </Grid>

            <Grid item xs={12}>
              <TextInput
                id="email"
                name="email"
                source="email"
                label="Email"
                fullWidth
                validate={[required()]}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <AutocompleteInput
                label="Role"
                id="Role"
                source="role"
                choices={
                  isRolesPending ? [{ id: "Null", name: "Loading" }] : roleData
                }
                optionText="name"
                optionValue="id"
                resettable
                emptyText="Select Role"
                validate={[required()]}
                onChange={(value) => {
                  const selectedRole = roleData?.find(
                    (role) => role.id === value
                  );
                  setSelectedRolePrecedence(selectedRole?.precedence);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <AutocompleteInput
                label="Manager"
                id="manager"
                source="manager"
                choices={
                  isUsersPending
                    ? [{ id: "Null", name: "Loading" }]
                    : filteredUsers
                }
                optionText={(choice) =>
                  `${choice.username} (${choice.roleName})`
                }
                optionValue="id"
                resettable
                emptyText="Current User"
                validate={[required()]}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextInput
              id="password"
              name="password"
              source="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              validate={[required(), validatePassword]}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextInput
              id="confirmpassword"
              name="confirmpassword"
              source="confirmpassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              validate={[required(), validateConfirmPassword(password)]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </CreateForm>
      </Dialog>
    </React.Fragment>
  );
};
