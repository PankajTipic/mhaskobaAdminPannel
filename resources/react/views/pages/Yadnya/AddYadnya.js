import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CRow,
  CCol,
  CAlert
} from '@coreui/react';
import { post } from '../../../util/api';



function AddYadnya() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price_per_person: '',
    status: 'active',
    dates: ['']
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await post(`/api/yadnya`, form);
      alert('Yadnya created successfully!');
      navigate('/yadnyaList');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const addDateField = () => {
    setForm({ ...form, dates: [...form.dates, ''] });
  };

  const removeDate = (index) => {
    const newDates = form.dates.filter((_, i) => i !== index);
    setForm({ ...form, dates: newDates });
  };

  const updateDate = (index, value) => {
    const newDates = [...form.dates];
    newDates[index] = value;
    setForm({ ...form, dates: newDates });
  };

  return (
    <CRow className="justify-content-center">
      <CCol xs={12} md={10} lg={8}>
        <CCard className="shadow-sm">
          <CCardHeader>
            <h4 className="mb-0">Add New Yadnya</h4>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {error && <CAlert color="danger">{error}</CAlert>}

              <CRow className="mb-4">
                <CCol md={12}>
                  <label className="form-label">Yadnya Title <span className="text-danger">*</span></label>
                  <CFormInput
                    type="text"
                    placeholder="Enter Yadnya Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-4">
                <CCol md={12}>
                  <label className="form-label">Description</label>
                  <CFormTextarea
                    rows={4}
                    placeholder="Enter description of this Yadnya"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-4">
                <CCol md={6}>
                  <label className="form-label">Price Per Person (₹) <span className="text-danger">*</span></label>
                  <CFormInput
                    type="number"
                    placeholder="251"
                    value={form.price_per_person}
                    onChange={(e) => setForm({ ...form, price_per_person: e.target.value })}
                    required
                  />
                </CCol>

                <CCol md={6}>
                  <label className="form-label">Status</label>
                  <CFormSelect
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Dynamic Dates Section */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Event Dates <span className="text-danger">*</span></h5>
                  <CButton type="button" color="primary" size="sm" onClick={addDateField}>
                    + Add Date
                  </CButton>
                </div>

                {form.dates.map((date, index) => (
                  <CRow key={index} className="mb-3">
                    <CCol md={10}>
                      <CFormInput
                        type="date"
                        value={date}
                        onChange={(e) => updateDate(index, e.target.value)}
                        required
                      />
                    </CCol>
                    <CCol md={2}>
                      {form.dates.length > 1 && (
                        <CButton
                          type="button"
                          color="danger"
                          variant="outline"
                          onClick={() => removeDate(index)}
                        >
                          Remove
                        </CButton>
                      )}
                    </CCol>
                  </CRow>
                ))}
              </div>

              <div className="d-grid">
                <CButton 
                  type="submit" 
                  color="success" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Creating Yadnya...' : 'Create Yadnya'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}

export default AddYadnya;