import * as React from "react";
import {
  Drawer,
  Toolbar,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = "16em";
const collapsedWidth = "0em"; // Adjust collapsed width

export const MySidebar = ({ open, toggleDrawer, children }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          transition: "width 0.3s ease",
          boxSizing: "border-box",
          backgroundColor: "#1C1C1E",
          padding: "8px",
          overflow: "hidden",
        },
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* {open && (
          <img
            src="/Assets/Logos/sidebar-logo.svg"
            alt="Company Logo"
            loading="lazy"
            width="100%"
          />
        )} */}
        <Typography variant="h6" sx={{ color: "#fff" }}>
          Version Control
        </Typography>
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon sx={{ color: "#fff" }} />
        </IconButton>
      </Toolbar>
      <Divider />
      {children}
    </Drawer>
  );
};
