import React from "react";
// react admin
import {
  Form,
  CreateBase,
  useDataProvider,
  useNotify,
  useRefresh,
} from "react-admin";
// mui
import { Button, Grid, Box, Typography, Container } from "@mui/material";

const SubmitForm = ({ handleClose, children, resource, extraData = {} }) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  // Define messages based on resource
  const successMessages = {
    users: "User created successfully!",
    applications: "Application created successfully!",
    release: "Release created successfully!",
  };

  const handleSubmit = async (data) => {
    try {
      const response = await dataProvider.create(resource, {
        data: {
          ...data,
          ...extraData,
        },
      });
      if (response) {
        notify(successMessages[resource], {
          type: "success",
        });

        handleClose();
        refresh();
      }
    } catch (error) {}
  };

  return (
    <>
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

export const CreateForm = ({
  title,
  handleClose,
  children,
  record,
  resource,
  extraData = {},
}) => {
  return (
    <React.Fragment>
      <CreateBase record={record} resource={resource}>
        <Container component="overlay" maxWidth="sm" sx={{ p: 3 }}>
          <Box
            className="overlayFormBox"
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
            <SubmitForm
              handleClose={handleClose}
              resource={resource}
              extraData={extraData}
            >
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
      </CreateBase>
    </React.Fragment>
  );
};
