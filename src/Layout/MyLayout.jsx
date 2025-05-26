import * as React from "react";
import { Layout } from "react-admin";
import MyAppBar from "./MyAppBar";
import { MySidebar } from "./MySidebar";

export const MyLayout = (props) => {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Layout
      {...props}
      appBar={(appBarProps) => (
        <MyAppBar {...appBarProps} open={open} toggleDrawer={toggleDrawer} />
      )}
      sidebar={(sidebarProps) => (
        <MySidebar {...sidebarProps} open={open} toggleDrawer={toggleDrawer} />
      )}
    />
  );
};
