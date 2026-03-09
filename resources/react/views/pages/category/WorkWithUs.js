import React, { useEffect, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { deleteAPICall, getAPICall, post } from '../../../util/api'
import ConfirmationModal from '../../common/ConfirmationModal'
import { useNavigate } from 'react-router-dom'

const WorkWithUs = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [deleteProduct, setDeleteProduct] = useState()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const fetchProducts = async () => {
    const response = await getAPICall('/api/workwithus')
    setProducts(response)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = (p) => {
    setDeleteProduct(p)
    setDeleteModalVisible(true)
  }

  const onDelete = async () => {
    await deleteAPICall('/api/product/' + deleteProduct.id)
    setDeleteModalVisible(false)
    fetchProducts()
  }

  const handleEdit = (p) => {
    navigate('/products/edit/' + p.id)
  }

  return (
<>


{/* <CButton onClick={handlePayment}>Pay Now</CButton> */}


    <CRow>
      <ConfirmationModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onYes={onDelete}
        resource={'Delete product - ' + deleteProduct?.name}
      />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Work With Us</strong>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
             
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mobile No</CTableHeaderCell>
                  <CTableHeaderCell scope="col">queries</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell> */}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {products.map((p, index) => {
                  return (
                    <CTableRow key={p.slug + p.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{p.name}</CTableDataCell>
                      <CTableDataCell>{p.email}</CTableDataCell>
                      <CTableDataCell>{p.mobile}</CTableDataCell>
                      <CTableDataCell>{p.queries}</CTableDataCell>

                      {/* <CTableDataCell>{p.sizes?.[0]?.bPrice || ''}</CTableDataCell>
                      <CTableDataCell>{p.sizes?.[0]?.oPrice || ''}</CTableDataCell>
                      <CTableDataCell>{p.sizes?.[0]?.qty || ''}</CTableDataCell>
                      <CTableDataCell>
                        {p.show == 1 ? (
                          <CBadge color="success">Visible</CBadge>
                        ) : (
                          <CBadge color="danger">Hidden</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color="info"
                          onClick={() => {
                            handleEdit(p)
                          }}
                        >
                          Edit
                        </CBadge>{' '}
                        &nbsp;
                        <CBadge
                          color="danger"
                          onClick={() => {
                            handleDelete(p)
                          }}
                        >
                          Delete
                        </CBadge> */}
                      {/* </CTableDataCell> */}
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    </>
  )
}

export default WorkWithUs;
