import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";

export const RemarksDialog = ({ open, onClose, content }) => {
  const [scroll] = useState("paper");
  const descriptionElementRef = useRef(null);

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        open={open}
        onClose={onClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Remarks</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{
              border: "1px solid rgba(255, 239, 153, 0.20)",
              color: "#FFF",
              "&:hover": {
                border: "1px solid #fff",
                background: "none",
              },
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
