import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import NavbarComp from "./components/NavbarComp";
import DashboardTAble from "./components/Dashboard";
import CustomizedTables from "./components/Dashboard2";
import ResponsiveDrawer from "./components/sidebar";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import { Navigate } from "react-router";

import PermanentDrawerLeft from "./components/sidebar_final";
import DashboardFinal from "./components/DashboardFinal";
// import { Switch } from "@mui/material";

function App() {
  return (

      <div className="homePageClass">
        {/* <Home /> */}
        {/* <DashboardFinal /> */}
      </div>



  );
}

export default App;
