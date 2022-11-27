import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Users from "./Components/Users";
import Header from "./Components/Header";
import LoginForm from "./Components/LoginForm";
import LogOut from "./Components/LogOut";
import SignUpForm from "./Components/SignUpForm";
import Logs from "./Components/Logs";
import Edit from "./Components/Edit";
import Delete from "./Components/Delete";
import RoleChange from "./Components/RoleChange";
import Orders from "./Components/Orders";
import Transactions from "./Components/Transactions";
import Predictions from "./Components/Predictions";
import Authorization from "./Components/Authorization";
import QrCodeValidator from "./Components/QrCodeValidator";
import QrCode from "./Components/QrCode";
import { getRole } from "./Utility/UserControl";
import Home from "./Components/Home";
import Questions from "./Components/Questions"
import ResetPasswordViaEmail from "./Components/ResetPasswordViaEmail";
import ChangePasswordOptions from "./Components/ChangePasswordOptions";
import Postavke from "./Components/Settings";
import RadniDani from "./Components/RadniDani";
import Sezonalnosti from "./Components/Sezonalnosti";
import {
  adminRoles,
  korisnikRoles,
  signedInRoles,
  kreatorDistMrežeRoles,
} from "./Utility/Roles";
import DistMreza from "./Components/DistMreza";
import EditProfile from "./Components/EditProfile";
function App() {
  return (
    <div>
      <Router>
        <Header></Header>
        <div
          style={{
            minHeight: "calc(100vh)",
            margin: 'auto',
            paddingTop: "50px",
            paddingLeft: "25px",
            paddingRight: "25px",
            width: '70%',
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
          }}>
          <Routes>
            <Route exact path="/" element={<Home></Home>}></Route>
            <Route
              exact
              path="/login"
              element={<LoginForm></LoginForm>}
            ></Route>
            <Route
              exact
              path="/addUser"
              element={Authorization(
                <SignUpForm></SignUpForm>,
                adminRoles,
                getRole()
              )}
            ></Route>
            <Route exact path="/logout" element={<LogOut></LogOut>}></Route>
            <Route
              exact
              path="/users"
              element={Authorization(
                <Users></Users>,
                [...adminRoles],
                getRole()
              )}
            ></Route>
            <Route
              exact
              path="/logs"
              element={Authorization(<Logs></Logs>, [...adminRoles], getRole())}
            ></Route>
            <Route
              exact
              path="/edit/:id"
              element={Authorization(<Edit></Edit>, [...adminRoles], getRole())}
            ></Route>
            <Route
              exact
              path="/delete"
              element={Authorization(
                <Delete></Delete>,
                [...adminRoles],
                getRole()
              )}
            ></Route>
            <Route
              exact
              path="/roleChange"
              element={Authorization(
                <RoleChange></RoleChange>,
                [...adminRoles],
                getRole()
              )}
            ></Route>
             <Route
              exact
              path="/orders"
              element={<Orders></Orders>}
                      ></Route>
             <Route
                exact
                path="/transakcije"
                element={<Transactions></Transactions>}
            ></Route>
            <Route
              exact
              path="/QrCodeValidator"
              element={<QrCodeValidator></QrCodeValidator>}
            ></Route>
            <Route
              exact
              path="/qrcode"
              element={Authorization(
                <QrCode></QrCode>,
                [...signedInRoles],
                getRole()
              )}
            ></Route>
            <Route
              exact
              path="/resetPassword"
              element={<ChangePasswordOptions />}
            ></Route>
            <Route
              exact
              path="/resetPasswordEmail"
              element={<ResetPasswordViaEmail />}
            ></Route>
            <Route
              exact
              path="/resetPasswordQuestions"
              element={<Questions />}
            ></Route>
            <Route
              exact
              path="/editProfile"
              element={Authorization(
                <EditProfile></EditProfile>,
                [...signedInRoles],
                getRole()
              )}
            ></Route>
            <Route
              exact
              path="/distMreze"
              element={Authorization(
                  <DistMreza></DistMreza>,
                  [...signedInRoles],
                getRole()
              )}
             ></Route>
            <Route
              exact
              path="/postavke"
              element={Authorization(
                  <Postavke></Postavke>,
                  [...signedInRoles],
                getRole()
              )}
             ></Route>
             <Route
              exact
              path="/radnidani"
              element={Authorization(
                  <RadniDani></RadniDani>,
                  [...signedInRoles],
                getRole()
              )}
             ></Route>
             <Route
              exact
              path="/sezonalnosti"
              element={Authorization(
                  <Sezonalnosti></Sezonalnosti>,
                  [...signedInRoles],
                getRole()
              )}
             ></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
