import React, { useState } from "react";
// react admin
import {
  Form,
  EditBase,
  useDataProvider,
  useNotify,
  useRefresh,
} from "react-admin";
// mui
import { Button, Grid, Box, Typography, Container } from "@mui/material";
// loader
import { Loader } from "../Views/Loader";

const SubmitForm = ({ handleClose, children, resource }) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  const [loading, setLoading] = useState(false);

  // Define messages based on resource
  const successMessages = {
    users: "User updated successfully!",
    applications: "Application updated successfully!",
    release: "Release updated successfully!",
  };

  const handleSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await dataProvider.update(resource, {
        data,
      });
      if (response) {
        notify(successMessages[resource], {
          type: "success",
        });

        handleClose();
        refresh();
      }
    } catch (error) {
      notify(error.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Form
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 3, alignSelf: "stretch" }}
      >
        {children}
      </Form>
    </>
  );
};

export const EditForm = ({ title, handleClose, id, resource, children }) => {
  return (
    <React.Fragment>
      <EditBase resource={resource} id={id}>
        <Container component="overlay" maxWidth="sm" sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              "& .MuiInputLabel-root": {
                textAlign: "left",
                fontSize: "0.75em",
              },
              "& .MuiButton-root": { textTransform: "capitalize" },
              "& .MuiGrid-item": {
                gap: 1,
              },
              "& .MuiTextField-root": {
                flexBasis: "75%",
                alignItems: "stretch",
              },
              "& .MuiAutocomplete-root": {
                flexBasis: "75%",
                alignItems: "stretch",
              },
            }}
          >
            <Typography component="h1" variant="h6" sx={{ mb: 3 }}>
              {title}
            </Typography>
            <SubmitForm handleClose={handleClose} resource={resource}>
              <Grid container>{children}</Grid>
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
                    confirm
                  </Button>
                </Grid>
              </Grid>
            </SubmitForm>
          </Box>
        </Container>
      </EditBase>
    </React.Fragment>
  );
};
