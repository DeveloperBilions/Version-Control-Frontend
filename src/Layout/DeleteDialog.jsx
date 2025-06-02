import React, { useState } from "react";
// react admin
import { useDataProvider, useNotify, useRefresh } from "react-admin";
// mui
import {
  Dialog,
  Container,
  Box,
  Grid,
  Button,
  Typography,
} from "@mui/material";
// loader
import { Loader } from "../Views/Loader";

export const DeleteDialog = ({ open, handleClose, id, resource }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const [loading, setLoading] = useState(false);

  // Define messages based on resource
  const successMessages = {
    users: "User created successfully!",
    applications: "Application deleted successfully!",
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await dataProvider.delete(resource, {
        id,
      });
      if (response) {
        notify(successMessages[resource], {
          type: "success",
        });

        handleClose();
        refresh();
      }
    } catch (error) {
      notify("Error while deleting", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        {loading && <Loader />}
        <Container component="overlay" maxWidth="sm" sx={{ p: 3 }}>
          <Box className="overlayFormBox">
            <Typography variant="h6" sx={{ mb: 2 }}>
              Confirm Deletion
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete the record? This action cannot be
              undone.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    border: "1px solid rgba(255, 239, 153, 0.20)",
                    color: "#FFF",
                    "&:hover": {
                      border: "1px solid #fff",
                      background: "none",
                    },
                  }}
                  onClick={handleClose}
                >
                  cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  onClick={handleDelete}
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#FFD700",
                    color: "#000",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#FFA000",
                    },
                  }}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Dialog>
    </React.Fragment>
  );
};
