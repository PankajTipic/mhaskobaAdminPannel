import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CRow,
  CCol,
  CSpinner
} from '@coreui/react';
import { deleteAPICall, getAPICall } from '../../../util/api';



function YadnyaList() {
  const [yadnyas, setYadnyas] = useState([]);   // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchYadnyas();
  }, []);

  const fetchYadnyas = async () => {
    setLoading(true);
    try {
      const res = await getAPICall(`/api/yadnya`);
      setYadnyas(res || []);   // Safe fallback
    } catch (err) {
      console.error('Error fetching yadnyas:', err);
      setYadnyas([]);               // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const deleteYadnya = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Yadnya?')) {
      return;
    }

    try {
      await deleteAPICall(`/api/yadnya/${id}`);
      alert('Yadnya deleted successfully!');
      fetchYadnyas();        // Refresh the list
    } catch (err) {
      console.error(err);
      alert('Failed to delete Yadnya. Please try again.');
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="shadow-sm">
          <CCardHeader className="d-flex justify-content-between align-items-center py-3">
            <h4 className="mb-0">Yadnya Management</h4>
            <CButton 
              color="success" 
              onClick={() => navigate('/yadnyaAdd')}
            >
              + Add New Yadnya
            </CButton>
          </CCardHeader>

          <CCardBody className="p-3">
            <CTable bordered hover responsive small>
              <CTableHead>
                <tr>
                  <CTableHeaderCell className="text-center" style={{ width: '5%' }}>#</CTableHeaderCell>
                  <CTableHeaderCell>Yadnya Title</CTableHeaderCell>
                  <CTableHeaderCell>Price (₹)</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Dates</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={{ width: '18%' }}>Actions</CTableHeaderCell>
                </tr>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <tr>
                    <CTableDataCell colSpan="6" className="text-center py-5">
                      <CSpinner color="primary" />
                      <div className="mt-2">Loading Yadnya...</div>
                    </CTableDataCell>
                  </tr>
                ) : yadnyas.length === 0 ? (
                  <tr>
                    <CTableDataCell colSpan="6" className="text-center py-5 text-muted">
                      No Yadnya found
                    </CTableDataCell>
                  </tr>
                ) : (
                  yadnyas.map((y, index) => (
                    <tr key={y.id}>
                      <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{y.title}</strong>
                        {y.description && (
                          <p className="text-muted small mb-0 mt-1">
                            {y.description.substring(0, 80)}...
                          </p>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>₹{y.price_per_person}</CTableDataCell>
                      <CTableDataCell>
                        <span className={`badge ${y.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                          {y.status?.toUpperCase() || 'N/A'}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <small>
                          {y.dates && y.dates.length > 0 
                            ? y.dates.map(d => d.event_date).join(', ')
                            : 'No dates added'}
                        </small>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton 
                          color="primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => navigate(`/admin/yadnya/edit/${y.id}`)}
                        >
                          Edit
                        </CButton>
                        <CButton 
                          color="danger" 
                          size="sm"
                          onClick={() => deleteYadnya(y.id)}
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </tr>
                  ))
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}

export default YadnyaList;