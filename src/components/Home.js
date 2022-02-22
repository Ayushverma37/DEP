import React from 'react'
import NavbarCompHome from './NavbarCompHome';
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Home() {
  useEffect(() => {

  }, [])
  
  // useEffect(() => {
  //   window.location.reload();
  // }, [showlogoutButton]);
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
