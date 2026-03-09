import React, { useEffect, useState } from 'react'
import {
  CBadge,
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
import { deleteAPICall, getAPICall } from '../../../util/api'
import ConfirmationModal from '../../common/ConfirmationModal'
import { useNavigate } from 'react-router-dom'

const AllExpenseType = () => {
  const navigate = useNavigate()
  const [expenseType, setExpenseType] = useState([])
  const [deleteResource, setDeleteResource] = useState()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const fetchExpenseType = async () => {
    const response = await getAPICall('/api/expenseType')
    setExpenseType(response)
  }

  useEffect(() => {
    fetchExpenseType()
  }, [])

  const handleDelete = (p) => {
    setDeleteResource(p)
    setDeleteModalVisible(true)
  }

  const onDelete = async () => {
    await deleteAPICall('/api/expenseType/' + deleteResource.id)
    setDeleteModalVisible(false)
    fetchExpenseType()
  }

  const handleEdit = (p) => {
    navigate('/expense/edit-type/' + p.id)
  }

  return (
    <CRow>
      <ConfirmationModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onYes={onDelete}
        resource={'Delete expense type - ' + deleteResource?.name}
      />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All ExpenseType</strong>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Local Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Short Desc</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {expenseType.map((p, index) => {
                  return (
                    <CTableRow key={p.slug + p.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{p.name}</CTableDataCell>
                      <CTableDataCell>{p.localName}</CTableDataCell>
                      <CTableDataCell>{p.desc}</CTableDataCell>
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
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AllExpenseType
