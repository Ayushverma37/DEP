import React from 'react'
import NavbarCompHome from './NavbarCompHome';



export default function Home() {
  function refreshPage() {
    window.location.reload(false);
  }
  return (
    <>
    <NavbarCompHome />
    <div className='homeClass text-center' >
        <div className='homeText'>
        <h4>Welcome To </h4>
        <br /> <h2>RnD Grant Management Portal</h2>
        </div>
        
    </div>
    </>
    
  );
}
