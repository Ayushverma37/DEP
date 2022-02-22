import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CustomizedTables from './Dashboard2'
import NavbarComp from './NavbarComp'
import PermanentDrawerLeft from './sidebar_final'

export default function DashboardFinal() {
  useEffect(() => {
    return () => {
      // This is the cleanup function
    }
  }, []);
  const {state} = useLocation();

  return (
    <div>
        <NavbarComp />
        <CustomizedTables />
        {/* <center>{state.emailid}</center> */}
        {/* <PermanentDrawerLeft/> */}
        <PermanentDrawerLeft emailid={state.emailid}/>
    </div>
  )
}
