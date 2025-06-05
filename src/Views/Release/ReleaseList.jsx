import React, { useState } from "react";
// react admin
import {
  Pagination,
  Datagrid,
  List,
  TextField,
  FunctionField,
  WrapperField,
  useDataProvider,
  useRecordContext,
  useGetIdentity,
  useRefresh,
  useNotify,
} from "react-admin";
// mui
import {
  Card,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
// mui icon
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
// react router dom
import { useParams, useSearchParams } from "react-router-dom";
// component
import { CreateReleases } from "./dialog/CreateReleases";
import { EditReleases } from "./dialog/EditReleases";
import { RemarksDialog } from "./dialog/RemarksDialog";
import { PDFViewerDialog } from "./dialog/PDFViewerDialog";

import Parse from "parse";

const CustomButton = ({ onEdit }) => {
  const record = useRecordContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(record);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
        sx={{ textTransform: "none" }}
      >
        Actions
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "actions-button" }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
        >
          Edit
        </MenuItem>
      </Menu>
    </>
  );
};

export const ReleaseList = () => {
  const dataProvider = useDataProvider();
  const params = useParams();
  const refresh = useRefresh();
  const notify = useNotify();
  const { data } = useGetIdentity();
  const [searchParams] = useSearchParams();

  const id = params.id;
  const appName = searchParams.get("appName");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Typography
          mt={2}
          variant="h4"
          sx={{ color: "#999", fontWeight: 400, fontSize: 18 }}
        >
          Releases for <b>{appName}</b>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Releases
        </Button>
      </Box>

      <Card
        variant="elevation"
        elevation={1}
        sx={{
          mt: 2,
          backgroundColor: "#242424",
          borderRadius: 2,
          padding: { xs: 1.5, sm: 2 },
        }}
      >
        <List
          title="Release List"
          resource="release"
          // filters={<CustomFilter />}
          filter={{ appId: id }}
          sort={{ field: "createdAt", order: "DESC" }}
          actions={null}
          pagination={<Pagination />}
          sx={{ mt: "2px" }}
        >
          <Datagrid bulkActionButtons={false}>
            {["Super-User", "Editor"].includes(data?.userRoleName) && (
              <WrapperField label="Actions">
                <CustomButton
                  onEdit={(record) => {
                    setSelectedRecord(record);
                    setEditDialogOpen(true);
                  }}
                />
              </WrapperField>
            )}

            <TextField source="version" label="Version" />
            <FunctionField
              label="Mandatory"
              render={(record) => {
                const isMandatory = Boolean(record.mandatory);

                return isMandatory ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                );
              }}
            />
            <FunctionField
              label="Whitelisted"
              render={(record) => {
                const isWhitelisted = Boolean(record.whitelisted);

                return isWhitelisted ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                );
              }}
            />
            <FunctionField
              label="Blacklisted"
              render={(record) => {
                const isBlacklisted = Boolean(record.blacklisted);

                return isBlacklisted ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                );
              }}
            />

            <FunctionField
              label="Release Notes"
              render={(record) => (
                <Box display="flex" gap={1}>
                  <Tooltip title="View Release Notes">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const response = await Parse.Cloud.run(
                            "getSignedS3Url",
                            {
                              fullUrl: record.releaseNotes.src,
                              disposition: "inline",
                            }
                          );

                          setPdfUrl(response.url);
                          setOpenPdfDialog(true);
                        } catch (err) {
                          console.error("Failed to view PDF", err);
                          notify("Failed to load PDF. Try again later.", {
                            type: "error",
                          });
                        }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {record.status === 1 && (
                    <Tooltip title="Download PDF">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={async (e) => {
                          e.stopPropagation();

                          const fullUrl = record.releaseNotes.src;

                          try {
                            const response = await Parse.Cloud.run(
                              "getSignedS3Url",
                              {
                                fullUrl: record.releaseNotes.src,
                                disposition: "attachment",
                              }
                            );
                            const signedUrl = response.url;

                            const link = document.createElement("a");
                            link.href = signedUrl;

                            const fileName = fullUrl.split("/").pop();
                            link.setAttribute("download", fileName);

                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } catch (err) {
                            console.error("Failed to download PDF", err);
                            notify(
                              "Failed to download PDF. Please try again later.",
                              {
                                type: "error",
                              }
                            );
                          }
                        }}
                      >
                        <PictureAsPdfIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )}
            />

            <FunctionField
              label="Remarks"
              render={(record) => (
                <Box display="flex" gap={1}>
                  <Tooltip title="Remarks">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteContent(record.remarks);
                        setOpenNoteDialog(true);
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            />

            <FunctionField
              label="Status"
              render={(record) => {
                const getColor = (status) => {
                  switch (status) {
                    case 0:
                      return "warning";
                    case 1:
                      return "success";
                    case 2:
                      return "error";
                    default:
                      return "default";
                  }
                };
                const getLabel = (status) => {
                  switch (status) {
                    case 0:
                      return "Pending";
                    case 1:
                      return "Approved";
                    case 2:
                      return "Rejected";
                    default:
                      return "Unknown";
                  }
                };

                const handleApprove = () => {
                  dataProvider
                    .update("releaseStatus", {
                      id: record.id,
                      data: { status: 1 },
                      previousData: record,
                    })
                    .then(() => refresh());
                };

                const handleReject = () => {
                  dataProvider
                    .update("releaseStatus", {
                      id: record.id,
                      data: { status: 2 },
                      previousData: record,
                    })
                    .then(() => refresh());
                };

                if (
                  record.status === 0 &&
                  ["Super-User", "Editor"].includes(data?.userRoleName)
                ) {
                  return (
                    <Box display="flex" gap={1}>
                      <Tooltip title="Approve">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={handleApprove}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={handleReject}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  );
                }

                return (
                  <Chip
                    label={getLabel(record.status)}
                    color={getColor(record.status)}
                    size="small"
                    variant="filled"
                  />
                );
              }}
            />
          </Datagrid>
        </List>
      </Card>
      <CreateReleases
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        appId={id}
      />
      <EditReleases
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        record={selectedRecord}
      />
      <RemarksDialog
        open={openNoteDialog}
        onClose={() => setOpenNoteDialog(false)}
        content={noteContent}
      />
      <PDFViewerDialog
        open={openPdfDialog}
        onClose={() => setOpenPdfDialog(false)}
        fileUrl={pdfUrl}
      />
    </React.Fragment>
  );
};
