
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import NavbarComp from './components/NavbarComp';

function App() {
  return (
    <div className="homePageClass">
      <NavbarComp/>
      
      <Home/>

    </div>
  );
}

export default App;
