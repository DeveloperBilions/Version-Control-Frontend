import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const PDFViewerDialog = ({ open, onClose, fileUrl }) => {
  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          PDF Viewer
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <iframe
            src={fileUrl}
            title="PDF Viewer"
            width="100%"
            height="500px"
            style={{
              border: "none",
            }}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
