// import React, { useEffect, useState } from 'react'
// import {
//   CBadge,
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
// import { deleteAPICall, getAPICall } from '../../../util/api'
// import ConfirmationModal from '../../common/ConfirmationModal'
// import { useNavigate } from 'react-router-dom'

// const AllCategory = () => {
//   const navigate = useNavigate()
//   const [category, setCategory] = useState([])
//   const [deleteProduct, setDeleteProduct] = useState()
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false)
//   const fetchCategory = async () => {
//     const response = await getAPICall('/api/donations')
//     setCategory(response)
//   }

//   useEffect(() => {
//     fetchCategory()
//   }, [])

//   const handleDelete = (p) => {
//     setDeleteProduct(p)
//     setDeleteModalVisible(true)
//   }
//   const handleViewClick = (row) => {
//     const imageBase64 = row.original.payment_image;
//     console.log(imageBase64); // Verify base64 data format in console
//     if (imageBase64) {
//       setSelectedImage(`${imageBase64}`);
//     } else {
//       setSelectedImage(null);
//     }
//     setIsModalOpen(true);
//   };

//   const onDelete = async () => {
//     await deleteAPICall('/api/category/' + deleteProduct.id)
//     setDeleteModalVisible(false)
//     fetchCategory()
//   }

//   const handleEdit = (p) => {
//     navigate('/category/edit/' + p.id)
//   }

//   return (
//     <CRow>
//       <ConfirmationModal
//         visible={deleteModalVisible}
//         setVisible={setDeleteModalVisible}
//         onYes={onDelete}
//         resource={'Delete category - ' + deleteProduct?.name}
//       />
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>All Category</strong>
//           </CCardHeader>
//           <CCardBody>
//             <CTable>
//               <CTableHead>
//               {/* 'name', 
//         'mobile', 
//         'delivery_address', 
//         'fileName', 
//         'transactionId' */}
//                 <CTableRow>
//                   <CTableHeaderCell scope="col">#</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Name</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Mobile NO</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Address</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Payment Image</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">TransactionId</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {category.map((p, index) => {
//                   return (
//                     <CTableRow key={p.slug + p.id}>
//                       <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
//                       <CTableDataCell>{p.name}</CTableDataCell>
//                       <CTableDataCell>{p.mobile}</CTableDataCell>
//                       <CTableDataCell>{p.delivery_address}</CTableDataCell>
//                       <CTableDataCell>{p.fileName}</CTableDataCell>
//                       <CTableDataCell>{p.transactionId}</CTableDataCell>


//                       {/* <CTableDataCell>
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
//                         </CBadge>
//                       </CTableDataCell> */}
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

// export default AllCategory

import React, { useEffect, useState } from 'react'
import {
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
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
} from '@coreui/react'
import { getAPICall } from '../../../util/api'

const AllCategory = () => {
  const [category, setCategory] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchCategory = async () => {
    const response = await getAPICall('/api/donations') // Fetch your data
    setCategory(response)
  }

  useEffect(() => {
    fetchCategory()
  }, [])

  const handleViewClick = (fileName) => {
    if (fileName) {
      setSelectedImage(`/img/${fileName}`) // Use Base64 image string
    } else {
      setSelectedImage(null)
    }
    setIsModalOpen(true)
  }

  return (
    <CRow>
      {/* Modal to display the image */}
      <CModal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CModalHeader>Payment Image</CModalHeader>
        <CModalBody>
          {selectedImage ? (
            <img
              src={`https://nladmin.tipic.co.in/${selectedImage}`}
              alt="Selected"
              style={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <p>No Image Available</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Table to display data */}
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Category</strong>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Mobile No</CTableHeaderCell>
                  <CTableHeaderCell>Address</CTableHeaderCell>
                  <CTableHeaderCell>TransactionId</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {category.map((p, index) => (
                  <CTableRow key={p.slug + p.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{p.name}</CTableDataCell>
                    <CTableDataCell>{p.mobile}</CTableDataCell>
                    <CTableDataCell>{p.delivery_address}</CTableDataCell>
                    <CTableDataCell>{p.transactionId}</CTableDataCell>
                    <CTableDataCell>
                      {p.fileName ? (
                        <CButton
                          color="success"
                          onClick={() => handleViewClick(p.fileName)}
                        >
                          View
                        </CButton>
                      ) : (
                        <p>No Image Available</p>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AllCategory


