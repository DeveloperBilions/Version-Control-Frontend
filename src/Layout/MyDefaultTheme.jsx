import { defaultTheme } from "react-admin";

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
    // MuiDrawer: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: "#1C1C1E",
    //       width: "15em",
    //       position: "fixed",
    //       top: 0,
    //       left: 0,
    //       height: "100%",
    //     },
    //   },
    // },
    // MuiAppBar: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: "white",
    //       position: "fixed",
    //       left: "16em",
    //       top: 0,
    //       right: 0,
    //       width: "calc(100% - 16em)",
    //       height: "4em",
    //       color: "black",
    //       justifyContent: "center",
    //     },
    //   },
    // },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#333",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          // width: 100,
          // maxWidth: 100,
          overflow: "hidden",
          textOverflow: "ellipsis",
          paddingLeft: "0.5",
          fontSize: "0.75em",
          color: "#FFF",
          borderBottom: "1px solid rgba(255, 239, 153, 0.20)",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          "&:hover": {
            color: "#FFD700",
          },
          "&.Mui-active": {
            color: "#FFD700",
            ".MuiTableSortLabel-icon": {
              color: "#FFD700",
            },
          },
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
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: "#fff",
          "& .MuiSelect-icon ": {
            color: "#fff",
          },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#fff",
          "&.Mui-selected": {
            backgroundColor: "#FFC107",
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#FFF",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          color: "#FFF",
        },
        paper: {
          backgroundColor: "#333 !important",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "#FFF",
        },
        paper: {
          backgroundColor: "#333 !important",
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: "#FFF",
        },
        paper: {
          backgroundColor: "#333 !important",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "#333 !important",
          color: "#FFF",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "#333 !important",
          color: "#FFF",
        },
      },
    },
    RaLayout: {
      styleOverrides: {
        root: {
          height: "calc(100% - 4em)",
          "& .RaLayout-appFrame": {
            // margin: 0,
            top: "4em",
            backgroundColor: "#1A1A1A",
          },
          "& .RaLayout-content": {
            backgroundColor: "rgba(3, 2, 2, 0)",
            height: "calc(100% - 4em)",
            top: "4em",
            paddingLeft: "1em",
            paddingRight: "1em",
            overflow: "auto",
            // position: "absolute",
            // left: "16em",
            // width: "calc(100% - 16em)",
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
    RaMenu: {
      styleOverrides: {
        root: {
          "&.RaMenu-closed": {
            width: "100%",
          },
        },
      },
    },
    RaListToolbar: {
      styleOverrides: {
        root: {
          // "margin-top": "10px",
          "@media (max-width: 599.95px)": {
            backgroundColor: "#242424",
          },
          "@media (max-width: 899.95px)": {
            flexWrap: "nowrap",
          },
        },
      },
    },
    RaTopToolbar: {
      styleOverrides: {
        root: {
          // padding: 0,
          "@media (max-width: 599.95px)": {
            // position: "absolute",
            width: "100%",
            display: "block",
            backgroundColor: "#242424",
            // padding: 0,
          },
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
          active: {
            color: "#FFD700",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#2B2B2B",
          color: "#fff",
          "& .MuiOutlinedInput-input": {
            "&.Mui-disabled": {
              "-webkit-text-fill-color": "rgba(255, 255, 255, 0.70)",
            },
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff !important",
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.70)",
          "&.Mui-focused": {
            color: "#fff",
          },
          "&.Mui-disabled": {
            color: "rgba(255, 255, 255, 0.70)",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#ECF15E",
          },
        },
      },
    },
    // MuiFormHelperText: {
    //   styleOverrides: {
    //     root: {
    //       "text-align": "right",
    //     },
    //   },
    // },
  },
};
