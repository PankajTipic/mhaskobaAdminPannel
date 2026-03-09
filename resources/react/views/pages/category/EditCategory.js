import React, { useEffect, useState } from 'react'
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
import { getAPICall, post, put } from '../../../util/api'
import { useParams } from 'react-router-dom'

const EditCategory = () => {
  const params = useParams()
  const [errorMessage, setErrorMessage] = useState()
  const [successMessage, setSuccessMessage] = useState()
  const [state, setState] = useState({
    id: 0,
    name: '',
    slug: '',
    localName: '',
    image: 'NA',
    show: true,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const handleCBChange = (e) => {
    const { name, checked } = e.target
    setState({ ...state, [name]: checked })
  }

  const loadCategoryData = async () => {
    const data = await getAPICall('/api/category/' + params.id)
    setState({
      id: data.id,
      name: data.name,
      localName: data.localName,
      slug: data.slug,
      show: data.show == 1,
      image: data.image,
    })
  }
  useEffect(() => {
    loadCategoryData()
  }, [])

  const handleSubmit = async () => {
    console.log(state)
    let data = { ...state }
    data.slug = data.name.replace(/[^\w]/g, '_')
    try {
      const resp = await put('/api/category/' + data.id, data)
      if (resp) {
        setSuccessMessage('Category updated successfully')
        setErrorMessage(null)
      } else {
        setSuccessMessage(null)
        setErrorMessage('Failed to update category')
      }
    } catch (error) {
      setErrorMessage(error.message ?? 'Please provide valid data')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit Category</strong>
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
                  Update
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditCategory
