import "./App.css";
// react admin
import { Admin, Resource, CustomRoutes } from "react-admin";

import { Route, Navigate } from "react-router-dom";

import LoginPage from "./Views/SignIn/forms/LoginPage";
// provider
import { authProvider } from "./Provider/parseAuthProvider";
import { dataProvider } from "./Provider/parseDataProvider";
// layout
import { MyLayout } from "./Layout/MyLayout";
import { MyTheme } from "./Layout/MyDefaultTheme";
// users component
import { UserList } from "./Views/User/UserList";
// applications component
import { ApplicationsList } from "./Views/Applications/ApplicationsList";
import { ReleaseList } from "./Views/Release/ReleaseList";
// mui icon
import PersonIcon from "@mui/icons-material/Person";
import AppsIcon from "@mui/icons-material/Apps";

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      layout={MyLayout}
      theme={MyTheme}
    >
      {(permissions) =>
        permissions ? (
          <>
            <Resource
              name="users"
              list={UserList}
              options={{ label: "User List" }}
              icon={PersonIcon}
            />
            <Resource
              name="applications"
              list={ApplicationsList}
              options={{ label: "Applications" }}
              icon={AppsIcon}
            />
          </>
        ) : (
          <CustomRoutes noLayout>
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
          </CustomRoutes>
        )
      }

      <CustomRoutes>
        <Route path="/applications/:id" element={<ReleaseList />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
