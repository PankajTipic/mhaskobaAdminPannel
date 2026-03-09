import React, { useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { post } from '../../../util/api'

const NewCategory = () => {
  const [errorMessage, setErrorMessage] = useState()
  const [successMessage, setSuccessMessage] = useState()
  const [state, setState] = useState({
    name: '',
    slug: '',
    localName: '',
    show: true,
    image: 'NA',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const handleCBChange = (e) => {
    const { name, checked } = e.target
    setState({ ...state, [name]: checked })
  }

  const handleSubmit = async () => {
    let data = { ...state }
    data.slug = data.name.replace(/[^\w]/g, '_')
    try {
      const resp = await post('/api/category', data)
      if (resp) {
        setSuccessMessage('Category added successfully')
        setErrorMessage(null)
      } else {
        setSuccessMessage(null)
        setErrorMessage('Failed to add category')
      }
      handleClear()
    } catch (error) {
      setErrorMessage(error.message ?? 'Please provide valid data')
    }
  }

  const handleClear = async () => {
    setState({
      name: '',
      slug: '',
      localName: '',
      image: 'NA',
      show: true,
    })
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Create New Category</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <div className="mb-3">
                <CFormLabel htmlFor="pname">Category Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="pname"
                  placeholder="Product Name"
                  name="name"
                  value={state.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="pname">Category Local Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="plname"
                  placeholder="Product Name"
                  name="localName"
                  value={state.localName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <CFormCheck
                  id="flexCheckDefault"
                  label="Show for invoicing"
                  name="show"
                  checked={state.show}
                  // value={state.show}
                  onChange={handleCBChange}
                />
              </div>
              {/* TODO: image uploader in future */}
              <div>
                {successMessage && (
                  <CRow>
                    <CAlert color="success">{successMessage}</CAlert>
                  </CRow>
                )}
                {errorMessage && (
                  <CRow>
                    <CAlert color="danger">{errorMessage}</CAlert>
                  </CRow>
                )}
              </div>
              <div className="mb-3">
                <CButton color="success" onClick={handleSubmit}>
                  Submit
                </CButton>
                &nbsp;
                <CButton color="secondary" onClick={handleClear}>
                  Clear
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default NewCategory
