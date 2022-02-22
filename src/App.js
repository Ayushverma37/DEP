import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import NavbarComp from "./components/NavbarComp";
import DashboardTAble from "./components/Dashboard";
import CustomizedTables from "./components/Dashboard2";
import ResponsiveDrawer from "./components/sidebar";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PermanentDrawerLeft from "./components/sidebar_final";
import DashboardFinal from "./components/DashboardFinal";
// import { Switch } from "@mui/material";

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path ="/dashboard" element={<DashboardFinal />} />
      </Routes>
    </BrowserRouter>



  );
}

export default App;
