import React, { useState, useEffect } from "react";
// react admin
import {
  useLogin,
  useNotify,
  usePermissions,
  useRefresh,
  useRedirect,
} from "react-admin";
// mui
import {
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  FormHelperText,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
// mui ison
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// loader
import { Loader } from "../../Loader";
// hook form
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const { refetch } = usePermissions();
  const refresh = useRefresh();
  const login = useLogin();
  const notify = useNotify();
  const redirect = useRedirect();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const encryptedPassword = localStorage.getItem("rememberedPassword");
    if (savedUsername && encryptedPassword) {
      setValue("username", savedUsername);
      setValue("password", encryptedPassword);
      setRememberMe(true);
    }
  }, [setValue]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    // event.preventDefault();
    const username = data?.username;
    const password = data?.password;
    setLoading(true);

    try {
      await login({ username, password }).catch((err) => notify(err?.message));

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }
      await refetch();
      await refresh();
      redirect("/users");
    } catch (error) {
      notify(error?.message || "Login failed. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      {loading && <Loader />}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh", // Ensure full height
          width: "100vw", // Ensure full width
          backgroundColor: "#000",
          backgroundImage: "url('/Assets/Images/login.svg')",
          backgroundSize: "cover", // Fully covers the screen
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          "@media (max-width: 600px)": {
            backgroundImage: "none", // Remove image on mobile
            backgroundColor: "#000", // Keep background color
          },
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: 400,
            p: 4,
            bgcolor: "#0E0F11",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography htmlFor="username" sx={{ color: "white", mb: 1 }}>
            Username
          </Typography>
          <OutlinedInput
            fullWidth
            placeholder="Enter Your Username"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
            sx={{ backgroundColor: "#222", color: "#fff" }}
          />
          {errors.username && (
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.username.message}
            </FormHelperText>
          )}

          <Typography htmlFor="password" sx={{ color: "white", mb: 1, mt: 2 }}>
            Password
          </Typography>
          <OutlinedInput
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? (
                    <VisibilityOff sx={{ color: "#fff" }} />
                  ) : (
                    <Visibility sx={{ color: "#fff" }} />
                  )}
                </IconButton>
              </InputAdornment>
            }
            sx={{ backgroundColor: "#222", color: "#fff" }}
          />
          {errors.password && (
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.password.message}
            </FormHelperText>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{ color: "#FFC107" }}
              />
            }
            label={<Typography color="white">Remember Me</Typography>}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#FFC107",
              color: "#0E0F11",
              fontSize: "16px",
              "&:hover": { bgcolor: "#e6c300" },
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default LoginPage;
