import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Router, useNavigate } from 'react-router-dom'
import { isLogIn } from '../util/session'

const DefaultLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLogIn()) {
      navigate('/login')
    }
  }, [])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
