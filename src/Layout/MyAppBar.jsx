import * as React from 'react';
import Toolbar  from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import AppBar from "@mui/material/AppBar";
import { TitlePortal, RefreshIconButton, UserMenu, Logout } from "react-admin";
import { Title } from "react-admin";

//to be used when we create custom user menu
const MyUserMenu = React.forwardRef((props, ref) => {
    return <></>;
})

export default function MyAppBar({props}){
    return (
      <AppBar
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 1,
          alignItems: "center",
          paddingRight: "1em",
        //   backgroundColor: "white",
          background: "linear-gradient(0deg, #242424 0%, #121212 83.59%)",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          position: "fixed",
          left: "16em",
          top: 0,
          right: 0,
          width: "calc(100% - 16 em)",
          height: "4em",
          color: "#fff",
        }}
      >
        <TitlePortal variant="h5" component="h3" sx={{ paddingLeft: 3 }} />
        <RefreshIconButton />
        <NotificationsNoneIcon />
        {/* <AccountCircleIcon /> */}
        <UserMenu>
          <Logout />
        </UserMenu>
      </AppBar>
    );
}