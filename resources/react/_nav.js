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
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Invoice',
  //   to: '/invoice',
  //   icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Contact Us',
    to: '/products/all',
  },
  // {
  //   component: CNavItem,
  //   name: 'All Payments',
  //   to: '/category/all',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Work With Us',
  //   to: '/category/work',
  // },

  // {
  //   component: CNavGroup,
  //   name: 'Products',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'New Product',
  //       to: '/products/new',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'All ContactUs',
  //       to: '/products/all',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Category',
  //   to: '/base',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
      // {
      //   component: CNavItem,
      //   name: 'New Category',
      //   to: '/category/new',
      // },
  //     {
  //       component: CNavItem,
  //       name: 'All Category',
  //       to: '/category/all',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Orders',
  //   to: '/order',
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Advance Booking',
  //       to: '/bookings',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Regular Orders',
  //       to: '/regular',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'All Orders',
  //       to: '/order',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Expense',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'New Expense',
  //       to: '/expense/new',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Expense Report',
  //       to: '/expense/report',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'New Expense Type',
  //       to: '/expense/new-type',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'All Expense Types',
  //       to: '/expense/all-type',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Icons',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Notifications',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
