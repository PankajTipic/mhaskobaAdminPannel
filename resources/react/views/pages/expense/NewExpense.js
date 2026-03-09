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
import { getAPICall, post } from '../../../util/api'
import { useNavigate } from 'react-router-dom'

const NewExpense = () => {
  const [validated, setValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [successMessage, setSuccessMessage] = useState()
  const [expenseTypes, setExpenseTypes] = useState()
  const navigate = useNavigate()
  const [state, setState] = useState({
    name: '',
    desc: '',
    expense_id: undefined,
    typeNotSet: true,
    qty: 0,
    price: 0,
    total_price: 0,
    expense_date: '',
    show: true,
  })

  const fetchExpenseTypes = async () => {
    const response = await getAPICall('/api/expenseType')
    const options = ['Select Expense Type']
    options.push(
      ...response
        .filter((p) => p.show == 1)
        .map((p) => {
          return {
            label: p.name,
            value: p.id,
            disabled: p.show !== 1,
          }
        }),
    )
    setExpenseTypes(options)
  }

  useEffect(() => {
    fetchExpenseTypes()
  }, [])

  const calculateFinalAmount = (old) => {
    old.total_price = (parseFloat(old.price) || 0) * (parseInt(old.qty) || 0)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'price' || name === 'qty') {
      setState((prev) => {
        const old = { ...prev }
        old[name] = value
        calculateFinalAmount(old)
        return { ...old }
      })
    } else if (name === 'expense_id') {
      setState((prev) => {
        const old = { ...prev }
        old[name] = value
        old.typeNotSet = value === undefined
        return { ...old }
      })
    } else {
      setState({ ...state, [name]: value })
    }
  }

  const handleSubmit = async (event) => {
    try {
      const form = event.currentTarget
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
      if (form.checkValidity() === true && state.expense_id && state.price > 0 && state.qty > 0) {
        const resp = await post('/api/expense', { ...state })
        console.log('Response', resp)
        // if (res) {
        //   navigate('/invoice-details/' + res.id)
        // }
        if (resp) {
          setSuccessMessage('New expense added successfully')
          setErrorMessage(null)
        } else {
          setSuccessMessage(null)
          setErrorMessage('Failed to add new expense')
        }
        handleClear()
      } else {
        setState((old) => {
          return { ...old, typeNotSet: old.expense_id === undefined }
        })
      }
    } catch (error) {
      setErrorMessage('Failed to create order. ' + error.message)
    }
  }

  const handleClear = async () => {
    setState({
      name: '',
      desc: '',
      expense_id: state.expense_id,
      qty: 0,
      price: 0,
      total_price: 0,
      expense_date: '',
      show: true,
      typeNotSet: state.expense_id === undefined,
    })
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>New Expense</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="invoiceDate">Expense Type</CFormLabel>
                    <CFormSelect
                      aria-label="Select ExpenseTypes"
                      value={state.expense_id}
                      id="expense_id"
                      name="expense_id"
                      options={expenseTypes}
                      onChange={handleChange}
                      invalid={state.typeNotSet}
                      required
                      feedbackInvalid="Select Expense type."
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="name">About Expense</CFormLabel>
                    <CFormInput
                      type="text"
                      id="name"
                      placeholder="About Expense"
                      name="name"
                      value={state.name}
                      onChange={handleChange}
                      required
                      feedbackInvalid="Please provide some note."
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="invoiceDate">Expense Date</CFormLabel>
                    <CFormInput
                      type="date"
                      id="expense_date"
                      name="expense_date"
                      value={state.expense_date}
                      onChange={handleChange}
                      required
                      feedbackInvalid="Please select date."
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="price">Price Per Unit</CFormLabel>
                    <CFormInput
                      type="number"
                      id="price"
                      placeholder=""
                      name="price"
                      value={state.price}
                      onChange={handleChange}
                      invalid={state.price <= 0}
                      required
                      feedbackInvalid="Please provide price per unit."
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="price">Total Units</CFormLabel>
                    <CFormInput
                      type="number"
                      id="qty"
                      placeholder=""
                      name="qty"
                      value={state.qty}
                      onChange={handleChange}
                      required
                      invalid={state.qty < 1}
                      feedbackInvalid="Please provide total units."
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="price">Total Price</CFormLabel>
                    <CFormInput
                      type="number"
                      id="price"
                      placeholder=""
                      name="price"
                      value={state.total_price}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                </div>
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

export default NewExpense
