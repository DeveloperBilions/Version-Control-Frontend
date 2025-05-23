import "./App.css";
import { Admin, Resource, CustomRoutes } from "react-admin";

import PersonIcon from "@mui/icons-material/Person";

import { Route } from "react-router-dom";

import LoginPage from "./Views/SignIn/forms/LoginPage";

import { authProvider } from "./Provider/parseAuthProvider";
import { dataProvider } from "./Provider/parseDataProvider";

import { MyLayout } from "./Layout/MyLayout";
import { MyTheme } from "./Layout/MyDefaultTheme";
// users component
import { UserList } from "./Views/User/UserList";
import { CreateUser } from "./Views/User/CreateUser";
import { EditUser } from "./Views/User/EditUser";
// applications component
import { ApplicationsList } from "./Views/Applications/ApplicationsList";

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      layout={MyLayout}
      theme={MyTheme}
    >
      <Resource
        name="users"
        list={UserList}
        create={CreateUser}
        edit={EditUser}
        options={{ label: "User List" }}
        icon={PersonIcon}
      />
      <Resource
        name="applications"
        list={ApplicationsList}
        options={{ label: "Applications" }}
        icon={PersonIcon}
      />

      <CustomRoutes noLayout></CustomRoutes>
    </Admin>
  );
}

export default App;
