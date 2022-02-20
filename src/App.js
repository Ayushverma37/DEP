
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import NavbarComp from './components/NavbarComp';
import DashboardTAble from './components/Dashboard';
import sidebar from './components/sidebar';

function App() {
  return (
    <div className="homePageClass">
      {/* <NavbarComp/> */}
      
      {/* <Home/> */}
      {/* <DashboardTAble/> */}
      <sidebar/>

    </div>
  );
}

export default App;
