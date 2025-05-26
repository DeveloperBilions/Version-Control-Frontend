import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Typography, Box, MenuItem } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  TitlePortal,
  RefreshIconButton,
  UserMenu,
  useLogout,
  useGetIdentity,
} from "react-admin";
import { Loader } from "../Views/Loader";

const drawerWidth = "16em";
const collapsedWidth = "0em"; // Adjust when sidebar is collapsed

export default function MyAppBar({ props, open, toggleDrawer }) {
  const { data } = useGetIdentity();

  const [loading, setLoading] = React.useState(false);
  const logout = useLogout();

  const handleLogout = () => {
    setLoading(true);
    logout();
  };

  return (
    <AppBar
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 1,
        alignItems: "center",
        paddingRight: "1em",

        background: "linear-gradient(0deg, #242424 0%, #121212 83.59%)",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        position: "fixed",
        left: open ? drawerWidth : collapsedWidth, // Adjust position based on sidebar
        top: 0,
        right: 0,
        width: `calc(100% - ${open ? drawerWidth : collapsedWidth})`, // Adjust width
        height: "4em",
        color: "#fff",
        transition: "width 0.3s ease, left 0.3s ease",
      }}
    >
      {/* Sidebar Toggle Button */}
      <IconButton
        onClick={toggleDrawer}
        sx={[{ color: "#fff", marginLeft: 1 }, open && { display: "none" }]}
      >
        <MenuIcon />
      </IconButton>

      <TitlePortal variant="h5" component="h3" sx={{ paddingLeft: 3 }} />

      <RefreshIconButton />
      <NotificationsNoneIcon />

      {loading ? (
        <Loader />
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>{data?.username}</Typography>

            <UserMenu>
              <MenuItem onClick={handleLogout} disabled={loading}>
                Logout
              </MenuItem>
            </UserMenu>
          </Box>
        </>
      )}
    </AppBar>
  );
}
