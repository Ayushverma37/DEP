import React from 'react'
import CustomizedTables from './Dashboard2'
import NavbarComp from './NavbarComp'
import PermanentDrawerLeft from './sidebar_final'

export default function DashboardFinal() {
  return (
    <div>
        <NavbarComp />
        <CustomizedTables />
        <PermanentDrawerLeft />
    </div>
  )
}
