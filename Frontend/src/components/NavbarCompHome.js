import React from 'react'
import logoIIT from "../images/logo.jpg"
import logoIIT1 from "../images/logo1.jpg"
import {Navbar, Nav, Form, FormControl, Button, NavDropdown} from 'react-bootstrap'
import Login from '../Login'
export default function NavbarCompHome() {
  let user=null;
  return (
    <>
    <Navbar bg="grey" expand="lg" className='navbarClassHome'>
    <Navbar.Brand href="#"><img className='photo' src={logoIIT1} alt="" height='20%'/></Navbar.Brand>
    <Navbar.Brand href="#" className='IITText'>Indian Institute <br />
    of Technology, Ropar</Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarScroll" />
    <Navbar.Collapse id="navbarScroll">
      <Nav
        className="me-auto my-2 my-lg-0"
        style={{ maxHeight: '100px' }}
        navbarScroll
      >
        
      
      </Nav>
     
    </Navbar.Collapse>
</Navbar>
    </>
  )
}
