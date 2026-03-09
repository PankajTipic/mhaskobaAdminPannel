import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react'
import { cilDelete, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { getAPICall, post } from '../../../util/api'
import { useNavigate } from 'react-router-dom'

const Invoice = () => {
  const [validated, setValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [products, setProducts] = useState()
  const [allProducts, setAllProducts] = useState()
  const navigate = useNavigate()
  const [state, setState] = useState({
    customerName: '',
    customerMobile: '',
    customerAddress: '',
    invoiceDate: '',
    deliveryDate: '',
    invoiceType: 1,
    items: [
      {
        product_id: undefined,
        product_sizes_id: 0,
        product_name: '',
        product_unit: '',
        product_local_name: '',
        size_name: '',
        size_local_name: '',
        oPrice: 0,
        dPrice: 0,
        qty: 0,
        total_price: 0,
      },
    ],
    totalAmount: 0,
    discount: 0,
    balanceAmount: 0,
    paidAmount: 0,
    finalAmount: 0,
    paymentType: 1,
  })

  const fetchProduct = async () => {
    const response = await getAPICall('/api/products')
    setAllProducts(response)
    console.log(response);
    const options = ['Pick Product']
    options.push(
      ...response
        .filter((p) => p.show == 1)
        .map((p) => {
          return {
            label:`${ p.name} (${ p.localName})`,
            value: p.id,
            disabled: p.show !== 1,
          }
        }),
    )
    setProducts(options)
  }

  const handleAddProductRow = () => {
    setState((prev) => {
      const old = { ...prev }
      old.items.push({
        product_id: undefined,
        product_sizes_id: 0,
        product_name: '',
        product_unit: '',
        product_local_name: '',
        size_name: '',
        size_local_name: '',
        oPrice: 0,
        dPrice: 0,
        qty: 0,
        total_price: 0,
      })
      return { ...old }
    })
  }

  const calculateTotal = (items) => {
    let total = 0
    items.forEach((item) => {
      total += item.total_price
    })
    return total
  }

  const handleRemoveProductRow = (index) => {
    setState((prev) => {
      const old = { ...prev }
      old.items.splice(index, 1)
      return { ...old }
    })
  }

  useEffect(() => {
    fetchProduct()
  }, [])

  const calculateFinalAmount = (old) => {
    old.finalAmount = old.totalAmount - ((old.totalAmount * old.discount) / 100 || 0)
    old.balanceAmount = 0
    old.paidAmount = old.finalAmount
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'discount') {
      setState((prev) => {
        const old = { ...prev }
        old.discount = value
        calculateFinalAmount(old)
        return { ...old }
      })
    } else if (name === 'paidAmount') {
      setState((prev) => {
        const old = { ...prev }
        old.paidAmount = value
        old.balanceAmount = old.finalAmount - old.paidAmount
        return { ...old }
      })
    } else {
      setState({ ...state, [name]: value })
    }
  }

  const handleProductChange = (e, index) => {
    const { value } = e.target
    const p = allProducts.find((p) => p.id == value)
    if (p && p.sizes[0]) {
      setState((prev) => {
        const old = { ...prev }
        old.items[index].product_id = value
        old.items[index].product_sizes_id = p.sizes[0].id
        old.items[index].size_name = p.sizes[0].name
        old.items[index].size_local_name = p.sizes[0].localName
        old.items[index].product_name = p.name
        old.items[index].product_local_name = p.localName
        old.items[index].product_unit = p.unit
        old.items[index].oPrice = p.sizes[0].oPrice
        old.items[index].qty = p.sizes[0].qty
        old.items[index].stockQty = p.sizes[0].qty
        old.items[index].total_price = p.sizes[0].oPrice * old.items[index].qty
        old.totalAmount = calculateTotal(old.items)
        calculateFinalAmount(old)
        return { ...old }
      })
    }
  }

  const handleQtyChange = (e, index) => {
    const { value } = e.target
    setState((prev) => {
      const old = { ...prev }
      if(value <= 0){
        old.items[index].qty = 0;
      }else{
        old.items[index].qty = value;
      }
      old.items[index].total_price = old.items[index].oPrice * old.items[index].qty
      old.totalAmount = calculateTotal(old.items)
      calculateFinalAmount(old)
      return { ...old }
    })
  }

  const handleSubmit = async (event) => {
    try {
      const form = event.currentTarget
      event.preventDefault()
      event.stopPropagation()
      //const isInvalid = state.items.findIndex((i) => !i.product_id) > -1

      //Valdation
      let isInvalid = false
      let clonedState = { ...state }
      clonedState.items.forEach((i) => {
        if (!i.product_id) {
          i.notSelected = true
          isInvalid = true
        } else {
          i.notSelected = false
        }
        if (clonedState.invoiceType == 1 && i.qty > i.stockQty) {
          i.invalidQty = true
          isInvalid = true
        } else {
          i.invalidQty = false
        }
      })

      if (!isInvalid && form.checkValidity() === true) {
        const res = await post('/api/order', { ...state, orderStatus: state.invoiceType })
        console.log('Response', state)
        if (res) {
          navigate('/invoice-details/' + res.id)
        }
        handleClear()
      } else {
        setState(clonedState)
      }
      setValidated(true)
      //
    } catch (error) {
      setErrorMessage('Failed to create order. ' + error.message)
    }
  }

  
    const [inputValue, setInputValue] = useState('');
  
    const handleInputChange = (event) => {
      const value = event.target.value;
      const filteredValue = value.replace(/[0-9]/g, ''); // Remove numbers
      setState((prevState) => ({...prevState,customerName: filteredValue,}));
    }
  


  const today = new Date().toISOString().split('T')[0];
  const handleClear = async () => {
    setState({
      customerName: '',
      customerMobile: '',
      customerAddress: '',
      invoiceDate: '',
      deliveryDate: '',
      invoiceType: 1,
      items: [
        {
          product_id: undefined,
          product_sizes_id: 0,
          product_name: '',
          product_unit: '',
          product_local_name: '',
          size_name: '',
          size_local_name: '',
          oPrice: 0,
          dPrice: 0,
          qty: 0,
          total_price: 0,
        },
      ],
      totalAmount: 0,
      discount: 0,
      balanceAmount: 0,
      paidAmount: 0,
      finalAmount: 0,
      paymentType: 1,
    })
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>New invoice</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="pname">Customer Name</CFormLabel>
                    <CFormInput
                          type="text"
                          pattern="^[a-zA-Z ]+$"
                          id="pname"
                          placeholder="Customer Name"
                          name="customerName"
                          value={state.customerName}
                          onChange={handleInputChange}
                          required
                          feedbackInvalid="Please provide a valid name."
                          feedbackValid="Looks good!"
                        />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="customerAddress">Customer Address</CFormLabel>
                    <CFormInput
                      type="text"
                      id="customerAddress"
                      placeholder="Address"
                      name="customerAddress"
                      value={state.customerAddress}
                      onChange={handleChange}
                      required
                      feedbackInvalid="Please provide a valid address."
                    />
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="customerMobile">Mobile Number</CFormLabel>
                    <CFormInput
                         type="number"
                         maxLength="10"
                         minLength = "10"
                         pattern="[0-9]*"
                         id="customerMobile"
                         placeholder="XXXXXX"
                         name="customerMobile"
                         value={state.customerMobile}
                         onChange={handleChange}
                         required
                         feedbackInvalid="Please provide a valid 10-digit mobile number."
                       />

                  </div>
              </div>
              <div className="row">
                
                </div>
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="invoiceType">Invoice Type</CFormLabel>
                    <CFormSelect
                      aria-label="Select Invoice Type"
                      name="invoiceType"
                      value={state.invoiceType}
                      options={[
                        {
                          label: 'Regular',
                          value: 1,
                        },
                        {
                          label: 'Advance Booking',
                          value: 2,
                        },
                      ]}
                      onChange={handleChange}
                      required
                      feedbackInvalid="Please select type."
                    />
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="invoiceDate">Invoice Date</CFormLabel>
                    <CFormInput
                      type="date"
                      id="invoiceDate"
                      placeholder="Pune"
                      name="invoiceDate"
                      max={today}
                      value={state.invoiceDate}
                      onChange={handleChange}
                      required
                      feedbackInvalid="Please select date."
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  {state.invoiceType == 2 && (
                    <div className="mb-3">
                      <CFormLabel htmlFor="deliveryDate">Delivery Date</CFormLabel>
                      <CFormInput
                        type="date"
                        id="deliveryDate"
                        placeholder="Pune"
                        name="deliveryDate"
                        value={state.deliveryDate}
                        onChange={handleChange}
                        min={state.invoiceDate} 
                        required={state.invoiceType == 2}
                        feedbackInvalid="Please select date."
                      />
                    </div>
                  )}
                </div>

              </div>



              <div className="row">
                
                
              </div>

              <hr className='mt-4'/>
            
              <div className="row">
                <div className="col-1">
                  <div className="mb-1">
                    <b>Sr. No </b>
                  </div>
                </div>
                <div className="col-2">
                  <div className="mb-1">
                    <b>Product</b>
                  </div>
                </div>
                <div className="col-2">
                  <div className="mb-1">
                    <b>Price ₹ (1N) </b>
                  </div>
                </div>
                <div className="col-2">
                  <div className="mb-1">
                    <b>Stock </b>
                  </div>
                </div>
                <div className="col-2">
                  <div className="mb-1">
                    <b>Quantity</b>
                  </div>
                </div>
                <div className="col-2">
                  <div className="mb-1">
                    <b>Total ₹</b>
                  </div>
                </div>
                <div className="col-1">
                  <div className="mb-1">
                    <b>Action</b>
                  </div>
                </div>
              </div>

              {state.items?.map((oitem, index) => (
                <div key={index} className="row">
                  <div className="col-1">
                    <div className="mb-1"> {index + 1} </div>
                  </div>
                  <div className="col-2">
                    <div className="mb-1">
                      <CFormSelect
                        aria-label="Select Product"
                        value={oitem.product_id}
                        options={products}
                        onChange={() => handleProductChange(event, index)}
                        invalid={oitem.notSelected == true}
                        required
                        feedbackInvalid="Select product."
                      />
                    </div>
                  </div>
                  <div className="col-2">
                    <CFormInput type="number" placeholder="" readOnly value={oitem.oPrice} />
                  </div>
                  <div className="col-2">
                    <CFormInput type="number" placeholder="" readOnly value={oitem.stockQty} />
                  </div>
                  <div className="col-2">
                    <CFormInput
                      type="number"
                      min="1"
                      invalid={oitem.invalidQty == true}
                      required
                      feedbackInvalid={`Quantity ${oitem.stockQty}`}
                      onChange={() => handleQtyChange(event, index)}
                    />
                  </div>
                  <div className="col-2">
                    <CFormInput type="number" readOnly value={oitem.total_price} />
                  </div>
                  <div className="col-1">
                    {state.items.length > 1 && (
                      <CButton color="" onClick={() => handleRemoveProductRow(index)}>
                        <CIcon icon={cilDelete} size="xl" style={{ '--ci-primary-color': 'red' }} />
                      </CButton>
                    )}
                    &nbsp;
                    {index === state.items.length - 1 && (
                      <CButton onClick={handleAddProductRow} color="">
                        <CIcon icon={cilPlus} size="xl" style={{ '--ci-primary-color': 'green' }} />
                      </CButton>
                    )}
                  </div>
                </div>
              ))}
              <div className="row">
                <div className="col-1">
                  <div className="mb-1"> </div>
                </div>
                <div className="col-2">
                  <div className="mb-1"></div>
                </div>
                <div className="col-2"></div>
                <div className="col-2"></div>
                <div className="col-2">
                  <b> Grand Total ₹ </b>
                </div>
                <div className="col-2">
                  <CFormInput
                    type="number"
                    name="totalAmount"
                    readOnly
                    value={state.totalAmount}
                    onChange={handleChange}
                  />
                </div>
                <hr className='mt-4'/>
                <div className="col-2"></div>
              </div>
              {/* Payment info */}
              <div className="row">
                <div className="col-sm-2">
                  <div className="mb-3">
                    <CFormLabel htmlFor="discount">Discount (%)</CFormLabel>
                    <CFormInput
                      type="number"
                      id="discount"
                      placeholder=""
                      name="discount"
                      min='0'
                      max='100'
                      value={state.discount}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="mb-3">
                  <CFormLabel htmlFor="finalAmount">Final Amount ₹</CFormLabel>
                    <CFormInput
                      type="number"
                      id="finalAmount"
                      placeholder=""
                      name="finalAmount"
                      readOnly
                      value={state.finalAmount}
                      onChange={handleChange}
                    />

                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="mb-3">
                    <CFormLabel htmlFor="paidAmount">Paid Amount ₹</CFormLabel>
                    <CFormInput
                      type="number"
                      id="paidAmount"
                      placeholder=""
                      name="paidAmount"
                      value={state.paidAmount}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="mb-3">
                  <CFormLabel htmlFor="paidAmount">Balance Amount ₹</CFormLabel>
                    <CFormInput
                      type="number"
                      id="balanceAmount"
                      placeholder=""
                      readOnly
                      name="balanceAmount"
                 
                      value= {state.balanceAmount}
                      onChange={handleChange}
                    />
                    
                  </div>
                </div>

                <div className="col-sm-3">
                  <div className="mb-3">
                    <CFormLabel htmlFor="paymentType">Payment Type</CFormLabel>
                    <CFormSelect
                      aria-label="Select Invoice Type"
                      name="paymentType"
                      value={state.paymentType}
                      options={[
                        {
                          label: 'Cash',
                          value: 1,
                        },
                        {
                          label: 'Online - (UPI / NEFT)',
                          value: 2,
                        },
                      ]}
                      onChange={handleChange}
                      required
                      feedbackInvalid="Please select type."
                    />
                  </div>
                </div>
              </div>
             

              <div>
                {errorMessage && (
                  <CRow>
                    <CAlert color="danger">{errorMessage}</CAlert>
                  </CRow>
                )}
              </div>
              <div className="mb-3 mt-3">
                <CButton color="success" type="submit">
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

export default Invoice
