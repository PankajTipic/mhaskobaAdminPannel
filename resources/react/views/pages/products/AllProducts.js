// import React, { useEffect, useState } from 'react'
// import {
//   CBadge,
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
// } from '@coreui/react'
// import { deleteAPICall, getAPICall, post } from '../../../util/api'
// import ConfirmationModal from '../../common/ConfirmationModal'
// import { useNavigate } from 'react-router-dom'

// const AllProducts = () => {
//   const navigate = useNavigate()
//   const [products, setProducts] = useState([])
//   const [deleteProduct, setDeleteProduct] = useState()
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false)
//   const fetchProducts = async () => {
//     const response = await getAPICall('/api/contact-us')
//     setProducts(response)
//   }

//   useEffect(() => {
//     fetchProducts()
//   }, [])

//   const handleDelete = (p) => {
//     setDeleteProduct(p)
//     setDeleteModalVisible(true)
//   }

//   const onDelete = async () => {
//     await deleteAPICall('/api/product/' + deleteProduct.id)
//     setDeleteModalVisible(false)
//     fetchProducts()
//   }

//   const handleEdit = (p) => {
//     navigate('/products/edit/' + p.id)
//   }

//   return (
//     <CRow>
//       <ConfirmationModal
//         visible={deleteModalVisible}
//         setVisible={setDeleteModalVisible}
//         onYes={onDelete}
//         resource={'Delete product - ' + deleteProduct?.name}
//       />
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>All Products</strong>
//           </CCardHeader>
//           <CCardBody>
//             <CTable>
//               <CTableHead>
             
//                 <CTableRow>
//                   <CTableHeaderCell scope="col">#</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Name</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Email</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Mobile No</CTableHeaderCell>
//                    <CTableHeaderCell scope="col">Subject</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">queries</CTableHeaderCell>
//                   {/* <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Actions</CTableHeaderCell> */}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {products.map((p, index) => {
//                   return (
//                     <CTableRow key={p.slug + p.id}>
//                       <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
//                       <CTableDataCell>{p.name}</CTableDataCell>
//                       <CTableDataCell>{p.email}</CTableDataCell>
//                       <CTableDataCell>{p.phone}</CTableDataCell>
//                       <CTableDataCell>{p.subject}</CTableDataCell>
//                       <CTableDataCell>{p.message}</CTableDataCell>

//                       {/* <CTableDataCell>{p.sizes?.[0]?.bPrice || ''}</CTableDataCell>
//                       <CTableDataCell>{p.sizes?.[0]?.oPrice || ''}</CTableDataCell>
//                       <CTableDataCell>{p.sizes?.[0]?.qty || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         {p.show == 1 ? (
//                           <CBadge color="success">Visible</CBadge>
//                         ) : (
//                           <CBadge color="danger">Hidden</CBadge>
//                         )}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge
//                           color="info"
//                           onClick={() => {
//                             handleEdit(p)
//                           }}
//                         >
//                           Edit
//                         </CBadge>{' '}
//                         &nbsp;
//                         <CBadge
//                           color="danger"
//                           onClick={() => {
//                             handleDelete(p)
//                           }}
//                         >
//                           Delete
//                         </CBadge> */}
//                       {/* </CTableDataCell> */}
//                     </CTableRow>
//                   )
//                 })}
//               </CTableBody>
//             </CTable>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   )
// }

// export default AllProducts



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
  CFormSelect,
  CFormInput,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { getAPICall, post } from '../../../util/api' // make sure postAPICall exists
import { useNavigate } from 'react-router-dom'

const ContactMessages = () => {
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })

  const [filters, setFilters] = useState({
    status: 'all', // all | read | unread
    search: '',
    page: 1,
    per_page: 15,
  })

  const [loading, setLoading] = useState(false)

//   const fetchMessages = async () => {
//     setLoading(true)
//     try {
//      const params = {
//   status: filters.status === 'all' ? undefined : filters.status,  // 'read' or 'unread'
//   search: filters.search.trim() || undefined,
//   page: filters.page,
//   per_page: filters.per_page,
// };
//       const res = await getAPICall('/api/contact-us', { params })

//       // Laravel paginator response structure
//       setMessages(res.data || [])
//       setPagination({
//         current_page: res.current_page || 1,
//         last_page: res.last_page || 1,
//         per_page: res.per_page || 15,
//         total: res.total || 0,
//       })
//     } catch (err) {
//       console.error('Failed to load contact messages:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

  // Initial load + when page, status, per_page changes
  
  
  
const fetchMessages = async () => {
  setLoading(true)

  try {
    const params = {
      status: filters.status === 'all' ? '' : filters.status,
      search: filters.search.trim(),
      page: filters.page,
      per_page: filters.per_page,
    }

    const query = new URLSearchParams(params).toString()

    const res = await getAPICall(`/api/contact-us?${query}`)

    setMessages(res.data || [])

    setPagination({
      current_page: res.current_page || 1,
      last_page: res.last_page || 1,
      per_page: res.per_page || 15,
      total: res.total || 0,
    })
  } catch (err) {
    console.error('Failed to load contact messages:', err)
  } finally {
    setLoading(false)
  }
}

  
  
  
  
  useEffect(() => {
    fetchMessages()
  }, [filters.page, filters.status, filters.per_page])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Reset to page 1 when search changes (except when already on page 1)
      if (filters.page !== 1) {
        setFilters((prev) => ({ ...prev, page: 1 }))
      } else {
        fetchMessages()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [filters.search])

  const handleMarkRead = async (msg) => {
    try {
      await post(`/api/contact-us/${msg.id}/read`)
      fetchMessages()
    } catch (err) {
      console.error('Failed to mark as read:', err)
      alert('Could not mark message as read')
    }
  }

  const handleMarkUnread = async (msg) => {
    try {
      await post(`/api/contact-us/${msg.id}/unread`)
      fetchMessages()
    } catch (err) {
      console.error('Failed to mark as unread:', err)
      alert('Could not mark message as unread')
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setFilters((prev) => ({ ...prev, page: newPage }))
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Contact Messages</strong>
          </CCardHeader>

          <CCardBody>
            {/* Filters */}
            <CRow className="mb-4 g-3 align-items-end">
              <CCol md={5} lg={4}>
                <CFormInput
                  placeholder="Search by name, email, subject, message..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </CCol>

              <CCol md={3} lg={2}>
                <CFormSelect
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: e.target.value,
                      page: 1,
                    }))
                  }
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </CFormSelect>
              </CCol>

              {/* You can add more filters later (date, etc.) */}
            </CRow>

            {/* Table */}
            <CTable hover responsive bordered>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Subject</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Message</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center">
                      Loading...
                    </CTableDataCell>
                  </CTableRow>
                ) : messages.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center">
                      No messages found
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  messages.map((msg, index) => (
                    <CTableRow key={msg.id}>
                      <CTableHeaderCell scope="row">
                        {(pagination.current_page - 1) * pagination.per_page + index + 1}
                      </CTableHeaderCell>
                      <CTableDataCell>{msg.name || '-'}</CTableDataCell>
                      <CTableDataCell>{msg.email || '-'}</CTableDataCell>
                      <CTableDataCell>{msg.phone || '-'}</CTableDataCell>
                      <CTableDataCell>{msg.subject || '-'}</CTableDataCell>
                      <CTableDataCell style={{ maxWidth: '280px' }}>
                        <div
                          style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontSize: '0.9rem',
                          }}
                        >
                          {msg.message?.substring(0, 140)}
                          {msg.message?.length > 140 ? '...' : ''}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {msg.is_read ? (
                          <CBadge color="success">Read</CBadge>
                        ) : (
                          <CBadge color="warning" shape="rounded-pill">
                            Unread
                          </CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
  {msg.is_read ? (
    <>
      {/* <CBadge color="success" className="me-2">Read</CBadge> */}
      {/* Option: still allow revert, but with confirmation or less prominent */}
      <CButton
        size="sm"
        color="warning"
        variant="ghost"
        disabled={true}                     // ← disabled
        title="Already read"
      >
        Mark Unread
      </CButton>
    </>
  ) : (
    <CButton
      size="sm"
      color="success"
      variant="outline"
      onClick={() => handleMarkRead(msg)}
    >
      Mark Read
    </CButton>
  )}
</CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <CPagination aria-label="Contact messages pagination">
                  <CPaginationItem
                    aria-label="Previous"
                    disabled={pagination.current_page === 1}
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                  >
                    Previous
                  </CPaginationItem>

                  {[...Array(pagination.last_page)].map((_, i) => {
                    const page = i + 1
                    return (
                      <CPaginationItem
                        key={page}
                        active={page === pagination.current_page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </CPaginationItem>
                    )
                  })}

                  <CPaginationItem
                    aria-label="Next"
                    disabled={pagination.current_page === pagination.last_page}
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ContactMessages