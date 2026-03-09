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
import { getAPICall, post, put } from '../../../util/api'
import { useParams } from 'react-router-dom'

const EditProduct = () => {
  const params = useParams()
  const [errorMessage, setErrorMessage] = useState()
  const [successMessage, setSuccessMessage] = useState()
  const [state, setState] = useState({
    id: 0,
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

  const loadProductData = async () => {
    const data = await getAPICall('/api/product/' + params.id)
    console.log('Data', data)
    setState({
      id: data.id,
      name: data.name,
      localName: data.localName,
      slug: data.slug,
      categoryId: data.categoryId,
      incStep: data.incStep,
      desc: data.desc,
      multiSize: data.multiSize,
      show: data.show,
      qty: parseInt(data.sizes[0].qty),
      oPrice: parseFloat(data.sizes[0].oPrice),
      bPrice: parseFloat(data.sizes[0].bPrice),
      media: data.media,
      sizes: data.sizes,
    })
  }
  useEffect(() => {
    loadProductData()
  }, [])

  const handleSubmit = async () => {
    console.log(state)
    let data = { ...state }
    data.slug = data.name.replace(/[^\w]/g, '_')
    if (!state.multiSize) {
      data.sizes[0].name = data.name
      data.sizes[0].localName = data.localName
      data.sizes[0].qty = parseInt(data.qty)
      data.sizes[0].oPrice = parseFloat(data.oPrice)
      data.sizes[0].bPrice = parseFloat(data.bPrice)
      data.sizes[0].dPrice = -1
      data.sizes[0].show = true
      delete data.oPrice
      delete data.bPrice
      delete data.qty
    }
    try {
      console.log('Data', data)
      const resp = await put('/api/product/' + data.id, data)
      if (resp) {
        setSuccessMessage('Product updated successfully')
        setErrorMessage(null)
      } else {
        setSuccessMessage(null)
        setErrorMessage('Failed to update product')
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
            <strong>Edit Product</strong>
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

export default EditProduct
