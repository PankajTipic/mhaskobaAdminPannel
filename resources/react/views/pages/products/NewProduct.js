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
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { getAPICall, post } from '../../../util/api'

const NewProduct = () => {
  const [errorMessage, setErrorMessage] = useState()
  const [successMessage, setSuccessMessage] = useState()
  const [state, setState] = useState({
    name: '',
    localName: '',
    slug: '',
    categoryId: 0,
    incStep: 1,
    desc: '',
    multiSize: false,
    show: true,
    qty: 0,
    oPrice: 0,
    bPrice: 0,
    media: [],
    sizes: [],
  })

  const [categoryOptions, setCategoryOptions] = useState([])

  const fetchCategory = async () => {
    const response = await getAPICall('/api/category')
    setCategoryOptions(
      response.map((c) => {
        return {
          label: c.name,
          value: c.id,
          disabled: c.show !== 1,
        }
      }),
    )
  }

  useEffect(() => {
    fetchCategory()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const handleCBChange = (e) => {
    const { name, checked } = e.target
    setState({ ...state, [name]: checked })
  }

  const handleSubmit = async () => {
    console.log(state)
    let data = { ...state }
    data.slug = data.name.replace(/[^\w]/g, '_')
    if (!state.multiSize) {
      data.sizes.push({
        name: data.name,
        localName: data.localName,
        qty: data.qty,
        oPrice: data.oPrice,
        bPrice: data.bPrice,
        dPrice: -1,
        show: true,
      })
      delete data.oPrice
      delete data.bPrice
      delete data.qty
    }
    try {
      const resp = await post('/api/product', data)
      if (resp) {
        setSuccessMessage('Product added successfully')
        setErrorMessage(null)
      } else {
        setSuccessMessage(null)
        setErrorMessage('Failed to add product')
      }
      handleClear()
    } catch (error) {
      setErrorMessage(error.message ?? 'Please provide valid data')
    }
  }

  const handleClear = async () => {
    setState({
      name: '',
      localName: '',
      slug: '',
      categoryId: 0,
      incStep: 1,
      desc: '',
      multiSize: false,
      show: true,
      qty: 0,
      oPrice: 0,
      bPrice: 0,
      media: [],
      sizes: [],
    })
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Create New Product</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <div className="mb-3">
                <CFormLabel htmlFor="pname">Product Name</CFormLabel>
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
                <CFormLabel htmlFor="pname">Local Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="plname"
                  placeholder="Product Name"
                  name="localName"
                  value={state.localName}
                  onChange={handleChange}
                />
              </div>
              {/* TODO: image uploader in future */}

              <div className="mb-3">
                <CFormLabel htmlFor="pname">Product Category</CFormLabel>
                <CFormSelect
                  aria-label="Select Category"
                  name="categoryId"
                  value={state.categoryId}
                  options={categoryOptions}
                  onChange={handleChange}
                />
                {/* <CFormInput
                  type="number"
                  id="plname"
                  placeholder="0"
                  name="categoryId"
                  value={state.categoryId}
                  onChange={handleChange}
                /> */}
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="desc">Product Description</CFormLabel>
                <CFormTextarea
                  id="desc"
                  rows={3}
                  name="desc"
                  value={state.desc}
                  onChange={handleChange}
                ></CFormTextarea>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="qty">Product Quantity</CFormLabel>
                <CFormInput
                  type="number"
                  id="qty"
                  placeholder="0"
                  name="qty"
                  value={state.qty}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="bPrice">Base Price</CFormLabel>
                <CFormInput
                  type="number"
                  id="bPrice"
                  placeholder="0"
                  name="bPrice"
                  value={state.bPrice}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="oPrice">Selling Price</CFormLabel>
                <CFormInput
                  type="number"
                  id="oPrice"
                  placeholder="0"
                  name="oPrice"
                  value={state.oPrice}
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

export default NewProduct
