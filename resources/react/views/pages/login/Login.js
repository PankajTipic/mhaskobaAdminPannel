import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { login } from '../../../util/api'
import { isLogIn, storeUserData } from '../../../util/session'

const Login = () => {
  const [errorMessage, setErrorMessage] = useState()
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()
  const userNameRef = useRef()
  const userPwdRef = useRef()

  useEffect(() => {
    if (isLogIn()) {
      navigate('/')
    }
  }, [])

  const handleLogin = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity() !== true) {
      console.log('Invalid')
      setValidated(true)
      return
    }
    setValidated(true)
    const email = userNameRef.current?.value
    const password = userPwdRef.current?.value
    console.log(userPwdRef.current?.value)
    try {
      const resp = await login({ email, password })
      console.log(resp)
      storeUserData(resp)
      navigate('/products/all')
    } catch (error) {
      setErrorMessage('Please provide valid email and password')
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm noValidate={true} validated={validated} onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        ref={userNameRef}
                        id="username"
                        placeholder="Username"
                        autoComplete="username"
                        feedbackInvalid="Please provide username."
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        ref={userPwdRef}
                        id="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        feedbackInvalid="Please provide password."
                        required
                      />
                    </CInputGroup>

                    {errorMessage && (
                      <CRow className="mb-1 mt-1">
                        <CAlert color="danger">{errorMessage}</CAlert>
                      </CRow>
                    )}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type="submit" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                      {/* <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton> */}
                        <CButton color="button" className="px-0">
                          Contact with us ?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
