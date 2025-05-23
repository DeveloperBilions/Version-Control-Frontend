import {
  borderRadius,
  fontSize,
  fontStyle,
  fontWeight,
  lineHeight,
} from "@mui/system";
import { color } from "echarts";
import { defaultTheme } from "react-admin";
import { defaultDarkTheme } from "react-admin";

export const MyTheme = {
  ...defaultTheme,
  palette: {
    primary: { main: "#0288d1" },
    secondary: { main: "#ab47bc" },
    error: { main: "#d32f2f" },
    warning: { main: "#f57c00" },
    info: { main: "#737373" },
    success: { main: "#388e3c" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        root: {
          backgroundColor: "#1C1C1E",
          width: "15em",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          position: "fixed",
          left: "16em",
          top: 0,
          right: 0,
          width: "calc(100% - 16em)",
          height: "4em",
          color: "black",
          justifyContent: "center",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          width: 100,
          maxWidth: 100,
          overflow: "hidden",
          textOverflow: "ellipsis",
          paddingLeft: "0.5",
          fontSize: "0.75em",
          // backgroundColor: "#242424",
          color: "#FFF",
          borderBottom: "1px solid rgba(255, 239, 153, 0.20)",
        },
        "& .RaDatagrid-headerCell": {
          // color: "red",
          // backgroundColor: "#FFD700",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          boxShadow:
            "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiBox: {
      //doesn't work
      styleOverrides: {
        // root: ({ownerState}) => ({
        //     ...(ownerState.className==='overlayFormBox' && {
        //         backgroundColor: "red",
        //     }),
        // }),
        ".overlayFormBox": {
          backgroundColor: "green",
        },
      },
    },
    RaLayout: {
      styleOverrides: {
        root: {
          height: "calc(100% - 4em)",
          "& .RaLayout-appFrame": {
            margin: 0,
            backgroundColor: "#1A1A1A",
          },
          "& .RaLayout-content": {
            backgroundColor: "rgba(0,0,0,0)",
            position: "absolute",
            left: "16em",
            top: "4em",
            width: "calc(100% - 16em)",
            paddingLeft: "1em",
            paddingRight: "1em",
            overflow: "auto",
          },
        },
      },
    },
    RaSidebar: {
      styleOverrides: {
        root: {
          height: "100%",
        },
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          color: "#e6e6e6",
          "&.RaMenuItemLink-active": {
            color: "#000",
            backgroundColor: "#FFC107",
            borderRadius: "4px",
            "& .MuiSvgIcon-root": {
              color: "#000",
            },
          },
          "&:not(.RaMenuItemLink-active) .MuiSvgIcon-root": {
            color: "white",
          },
        },
      },
    },
    RaList: {
      styleOverrides: {
        "& .RaList-content": {
          boxShadow: "none",
        },
      },
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          backgroundColor: "#242424",
          "& .RaDatagrid-headerCell": {
            backgroundColor: "#242424",
            color: "#FFD700",
            fontSize: "14px",
            fontWeight: 600,
          },
          "& .RaDatagrid-checkbox": {
            color: "#fff",
            fill: "#fff",
          },
        },
      },
    },
  },
};
//appbar position: fixed left: 15em
