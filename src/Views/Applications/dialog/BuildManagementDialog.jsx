import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Parse from 'parse';
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Grid
} from '@mui/material';

const BuildManagementDialog = ({ open, onClose, record }) => {
  const [currentBuildConfig, setCurrentBuildConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Load current build config when dialog opens or record changes
  useEffect(() => {
    if (open && record?.id) {
      loadCurrentBuildConfig(record.id);
    }
  }, [open, record]);

  // Clear form when dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentBuildConfig(null);
      setMessage('');
      reset();
    }
  }, [open, reset]);

  const loadCurrentBuildConfig = async (applicationId) => {
    try {
      setLoading(true);
      const result = await Parse.Cloud.run('getBuildConfig', { applicationId });
      if (result.success) {
        setCurrentBuildConfig(result.buildConfig);
        // Pre-fill form with current values
        const latestBuild = result.buildConfig.latest_build;
        setValue('version', latestBuild.version);
        setValue('WebGLVersion', latestBuild.WebGLVersion);
        setValue('build_url', latestBuild.build_url);
        setValue('forceUpdate', latestBuild.forceUpdate);
        setValue('manualUpdate', latestBuild.manualUpdate);
        setValue('manualUpdate_message', latestBuild.manualUpdate_message);
      } else if (result.code === 404) {
        setCurrentBuildConfig(null);
        reset(); // Clear form
        setMessage('No build configuration found for this application');
      } else {
        setMessage('Failed to load build config: ' + result.message);
      }
    } catch (error) {
      setMessage('Error loading build config: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!record?.id) {
      setMessage('No application selected');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const params = {
        applicationId: record.id,
        ...data
      };

      // Use update if config exists, create if it doesn't
      const functionName = currentBuildConfig ? 'updateBuildConfig' : 'createBuildConfig';
      const result = await Parse.Cloud.run(functionName, params);

      if (result.success) {
        setMessage(`Build configuration ${currentBuildConfig ? 'updated' : 'created'} successfully!`);
        setCurrentBuildConfig(result.buildConfig);
        // Auto close after 2 seconds on success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage(`Failed to ${currentBuildConfig ? 'update' : 'create'} build config: ` + result.message);
      }
    } catch (error) {
      setMessage(`Error ${currentBuildConfig ? 'updating' : 'creating'} build config: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <Box
        sx={{
          p: 3,
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
        }}
      >
        <Typography component="h1" variant="h6" sx={{ mb: 3, color: "#FFD700" }}>
          Create Build Configuration
        </Typography>
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

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={1}>
            {/* Version and WebGL Version on same line */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Version *"
                placeholder="e.g., 1.0.0"
                error={!!errors.version}
                helperText={errors.version?.message}
                InputLabelProps={{ shrink: true }}
                {...register('version', { required: 'Version is required' })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="WebGL Version"
                placeholder="e.g., 1.0.0 (defaults to version if empty)"
                InputLabelProps={{ shrink: true }}
                {...register('WebGLVersion')}
              />
            </Grid>
            
            {/* Build URL on its own line */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Build URL *"
                type="url"
                placeholder="https://example.com/path/to/build"
                error={!!errors.build_url}
                helperText={errors.build_url?.message}
                InputLabelProps={{ shrink: true }}
                {...register('build_url', { required: 'Build URL is required' })}
              />
            </Grid>
            
            {/* Force Update and Manual Update on same line */}
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox {...register('forceUpdate')} />}
                label="Force Update - Force users to update to this version"
                sx={{ 
                  color: '#FFF',
                  '& .MuiFormControlLabel-label': { 
                    color: '#FFF' 
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox {...register('manualUpdate')} />}
                label="Manual Update - Require manual user action to update"
                sx={{ 
                  color: '#FFF',
                  '& .MuiFormControlLabel-label': { 
                    color: '#FFF' 
                  }
                }}
              />
            </Grid>
            
            {/* Manual Update Message on its own line */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Manual Update Message"
                multiline
                rows={3}
                placeholder="Message to show users when manual update is required"
                InputLabelProps={{ shrink: true }}
                {...register('manualUpdate_message')}
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
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
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#FFD700",
                  color: "#000",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#FFA000",
                  },
                }}
              >
                {loading ? 'Processing...' : 'Create Configuration'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
};

export default BuildManagementDialog;
