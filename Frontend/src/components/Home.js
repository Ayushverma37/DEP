import React from 'react'
import NavbarCompHome from './NavbarCompHome';
import Login from '../Login';

export default function Home() {


  return (
    <>
    <NavbarCompHome />
    <div className='homeClass text-center' >
        <div className='homeText dangle' >
        <h4>Welcome To </h4>
        <br /> <h2>RnD Grant Management Portal</h2>
        <Login />
        </div>
        
    </div>
    </>
    
  );
}
