import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
  cilNoteAdd,
  cilStar,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  
  {
    component: CNavItem,
    name: 'Contact Us',
    to: '/products/all',
  },
 

   {
        component: CNavGroup,
        name: "Yadnya",
        // icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        items: [

   {
    component: CNavItem,
    name: 'Yadnya',
    to: '/yadnyaList',
  },

    {
    component: CNavItem,
    name: 'Yadnya Booking List',
    to: '/yadnyaPerson',
  } ]},

   {
    component: CNavItem,
    name: 'Mahaprasad',
    to: '/mahaprasad',
  },  

 
   


  //  {
  //   component: CNavItem,
  //   name: 'Yadnya',
  //   to: '/yadnyaAdd',
  // },


]

export default _nav
