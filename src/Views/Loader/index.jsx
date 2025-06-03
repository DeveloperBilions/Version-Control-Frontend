import React from "react";
// mui
import { Backdrop, CircularProgress } from "@mui/material";

export const Loader = () => {
  return (
    <React.Fragment>
      <Backdrop
        open={true}
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
};
