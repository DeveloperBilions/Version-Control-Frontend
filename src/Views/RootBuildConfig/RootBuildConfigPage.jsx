import React, { useState, useEffect } from 'react';
import Parse from 'parse';
import {
  Box,
  Typography,
  Button,
  Alert,
  Grid,
  Card,
  CircularProgress,
  Chip
} from '@mui/material';
import { useGetIdentity } from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { CreateRootBuildConfigDialog } from './dialog/CreateRootBuildConfigDialog';
import { UpdateRootBuildConfigDialog } from './dialog/UpdateRootBuildConfigDialog';

export const RootBuildConfigPage = () => {
  const { data } = useGetIdentity();
  const [currentBuildConfig, setCurrentBuildConfig] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userRole, setUserRole] = useState(null);

  // Load user role from Parse directly
  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const currentUser = Parse.User.current();
        if (currentUser) {
          const roleQuery = new Parse.Query(Parse.Role);
          roleQuery.equalTo('users', currentUser);
          const roles = await roleQuery.find();
          if (roles.length > 0) {
            setUserRole(roles[0].get('name'));
          }
        }
      } catch (error) {
        console.error('Error loading user role:', error);
      }
    };
    loadUserRole();
  }, []);

  // Load current build config on mount and when refreshKey changes
  useEffect(() => {
    loadCurrentBuildConfig();
  }, [refreshKey]);

  const loadCurrentBuildConfig = async (showLoading = true) => {
    try {
      if (showLoading) {
        setInitialLoading(true);
      }
      const result = await Parse.Cloud.run('getRootBuildConfig');
      
      if (result.success) {
        setCurrentBuildConfig(result.buildConfig);
        setMessage('');
      } else if (result.code === 404) {
        setCurrentBuildConfig(null);
        setMessage('');
      } else {
        setMessage('Failed to load build config: ' + result.message);
      }
    } catch (error) {
      setMessage('Error loading build config: ' + error.message);
    } finally {
      if (showLoading) {
        setInitialLoading(false);
      }
    }
  };

  const handleDialogClose = () => {
    setCreateDialogOpen(false);
    setUpdateDialogOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Use Parse role as fallback if react-admin hook fails
  const effectiveUserRole = data?.userRoleName || userRole;
  const shouldShowButton = effectiveUserRole === "Super-User";
  const buttonText = currentBuildConfig ? "Update Configuration" : "Create Configuration";

  return (
    <React.Fragment>
      <Box sx={{ p: 4 }}>
        {shouldShowButton && (
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={currentBuildConfig ? <EditIcon /> : <AddIcon />}
              onClick={() => currentBuildConfig ? setUpdateDialogOpen(true) : setCreateDialogOpen(true)}
            >
              {buttonText}
            </Button>
          </Box>
        )}

        <Card
          variant="elevation"
          elevation={1}
          sx={{
            mt: data?.userRoleName === "Super-User" ? 2 : 4,
            backgroundColor: "#242424",
            borderRadius: 2,
            padding: { xs: 1.5, sm: 2 },
          }}
        >
          {/* Message Alert */}
          {message && (
            <Alert 
              severity={message.includes('successfully') ? 'success' : 'error'} 
              sx={{ mb: 3 }}
              onClose={() => setMessage('')}
            >
              {message}
            </Alert>
          )}

          {/* Current Configuration Display */}
          {currentBuildConfig?.latest_build ? (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ color: "#FFD700", mb: 3 }}>
                Current Configuration
              </Typography>
              
              <Grid container spacing={3}>
                {/* Version and WebGL Version */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: "#AAA", mb: 0.5 }}>
                    Version
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#FFF" }}>
                    {currentBuildConfig.latest_build.version}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: "#AAA", mb: 0.5 }}>
                    WebGL Version
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#FFF" }}>
                    {currentBuildConfig.latest_build.WebGLVersion || 'N/A'}
                  </Typography>
                </Grid>

                {/* Build URL */}
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: "#AAA", mb: 0.5 }}>
                    Build URL
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "#4A9EFF",
                      wordBreak: "break-all"
                    }}
                  >
                    {currentBuildConfig.latest_build.build_url}
                  </Typography>
                </Grid>

                {/* Force Update and Manual Update */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: "#AAA", mb: 0.5 }}>
                    Force Update
                  </Typography>
                  <Chip 
                    label={currentBuildConfig.latest_build.forceUpdate ? "Enabled" : "Disabled"}
                    color={currentBuildConfig.latest_build.forceUpdate ? "success" : "default"}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: "#AAA", mb: 0.5 }}>
                    Manual Update
                  </Typography>
                  <Chip 
                    label={currentBuildConfig.latest_build.manualUpdate ? "Enabled" : "Disabled"}
                    color={currentBuildConfig.latest_build.manualUpdate ? "success" : "default"}
                    size="small"
                  />
                </Grid>

                {/* Manual Update Message */}
                {currentBuildConfig.latest_build.manualUpdate_message && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: "#AAA", mb: 0.5 }}>
                      Manual Update Message
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#FFF" }}>
                      {currentBuildConfig.latest_build.manualUpdate_message}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {/* Configuration Info */}
              <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #444" }}>
                <Typography variant="body2" sx={{ color: "#FFD700", mb: 1 }}>
                  Configuration Info
                </Typography>
                <Typography variant="body2" sx={{ color: "#AAA" }}>
                  Last Updated: {new Date(currentBuildConfig.latest_build.lastUpdated || Date.now()).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "#AAA" }}>
                  S3 URL: https://s3.us-east-2.amazonaws.com/dev.vegasempire.addressables/build.json
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: "#AAA", mb: 2 }}>
                No Configuration Found
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Click "Create Configuration" to set up the root build.json file.
              </Typography>
            </Box>
          )}
        </Card>

      {/* Create Dialog */}
      <CreateRootBuildConfigDialog
        open={createDialogOpen}
        onClose={handleDialogClose}
      />

      {/* Update Dialog */}
      <UpdateRootBuildConfigDialog
        open={updateDialogOpen}
        onClose={handleDialogClose}
        currentConfig={currentBuildConfig}
      />
      </Box>
    </React.Fragment>
  );
};
