import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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

export const CreateRootBuildConfigDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMessage('');

      const result = await Parse.Cloud.run('createRootBuildConfig', data);

      if (result.success) {
        setMessage('Build configuration created successfully!');
        // Close dialog and let parent reload config
        setTimeout(() => {
          setMessage('');
          reset();
          onClose();
        }, 1000);
      } else {
        setMessage('Failed to create build config: ' + result.message);
      }
    } catch (error) {
      setMessage('Error creating build config: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setMessage('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
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
          Create Root Build Configuration
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
          <Grid container spacing={2}>
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
                placeholder="e.g., 1.0.0"
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
              <Controller
                name="forceUpdate"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Force Update"
                    sx={{ 
                      color: '#FFF',
                      '& .MuiFormControlLabel-label': { 
                        color: '#FFF',
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="manualUpdate"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Manual Update"
                    sx={{ 
                      color: '#FFF',
                      '& .MuiFormControlLabel-label': { 
                        color: '#FFF',
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                )}
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
                onClick={handleClose}
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
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
};
