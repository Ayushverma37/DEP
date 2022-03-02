import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import Dashboard from "./components/Dashboard";
import SOE from "./components/SOE";
import Manageuser from "./components/manageuser";
// import { Switch } from "@mui/material";

function App() {
  // const [isLogin, setisLogin] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/manageuser" element={<Manageuser />} />
        {/* <Route exact path="/dashboard" element={<SOE />} /> */}
        

       
        
      </Routes>
    </BrowserRouter>

  );
}
export default App;
