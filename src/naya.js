
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import NavbarComp from './components/NavbarComp';
import DashboardTAble from './components/Dashboard';
import CustomizedTables from './components/Dashboard2';

function naya() {
  return (
    <div className="homePageClass">
      <NavbarComp/>
      
      {/* <Home/> */}
      {/* <DashboardTAble/> */}
      <CustomizedTables/>

    </div>
  );
}

export default naya;
