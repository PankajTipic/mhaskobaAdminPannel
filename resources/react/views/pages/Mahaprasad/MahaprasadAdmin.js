
// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { deleteAPICall, getAPICall, post } from '../../../util/api';



// // ── Built-in toast (no external dep) ─────────────────────────────────────────
// let toastId = 0;
// function useToast() {
//   const [toasts, setToasts] = useState([]);

//   const show = useCallback((msg, type = 'success') => {
//     const id = ++toastId;
//     setToasts(prev => [...prev, { id, msg, type }]);
//     setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
//   }, []);

//   const toast = {
//     success: (msg) => show(msg, 'success'),
//     error:   (msg) => show(msg, 'error'),
//   };

//   const ToastContainer = () => (
//     <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
//       {toasts.map(t => (
//         <div key={t.id} style={{
//           padding: '10px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600,
//           background: t.type === 'success' ? '#16a34a' : '#dc2626',
//           color: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
//           animation: 'fadeIn 0.2s ease',
//         }}>
//           {t.type === 'success' ? '✓ ' : '✕ '}{t.msg}
//         </div>
//       ))}
//     </div>
//   );

//   return { toast, ToastContainer };
// }
// // ─────────────────────────────────────────────────────────────────────────────

// function MahaprasadAdmin() {
//   const { toast, ToastContainer } = useToast();

//   const [dates, setDates] = useState([]);
//   const [expandedDateId, setExpandedDateId] = useState(null);
//   const [bookingsMap, setBookingsMap] = useState({});
//   const [loadingMap, setLoadingMap] = useState({});

//   const [newDate, setNewDate] = useState({
//     event_date: '',
//     max_limit: 10,
//     type: 'sunday',
//     event_details: '',
//   });

//   const [showShiftModal, setShowShiftModal] = useState(false);
//   const [bookingToShift, setBookingToShift] = useState(null);
//   const [availableDates, setAvailableDates] = useState([]);
//   const [shiftDateId, setShiftDateId] = useState('');

//   const [confirmCancel, setConfirmCancel] = useState(null); // { id, name }

//   useEffect(() => { fetchDates(); }, []);

//   const fetchDates = async () => {
//     try {
//       const res = await getAPICall(`/api/admin/mahaprasad/dates`);
//       setDates(res.data);
//     } catch {
//       toast.error('Failed to load dates');
//     }
//   };

//   const handleToggle = async (dateId) => {
//     if (expandedDateId === dateId) { setExpandedDateId(null); return; }
//     setExpandedDateId(dateId);
//     if (bookingsMap[dateId] !== undefined) return;
//     setLoadingMap(prev => ({ ...prev, [dateId]: true }));
//     try {
//       const res = await getAPICall(`/api/admin/mahaprasad/dates/${dateId}/bookings`);
//       const list = res.data.bookings ?? res.data ?? [];
//       setBookingsMap(prev => ({ ...prev, [dateId]: list }));
//     } catch {
//       toast.error('Could not load bookings');
//       setBookingsMap(prev => ({ ...prev, [dateId]: [] }));
//     } finally {
//       setLoadingMap(prev => ({ ...prev, [dateId]: false }));
//     }
//   };

//   const refreshBookings = async (dateId) => {
//     try {
//       const res = await getAPICall(`/api/admin/mahaprasad/dates/${dateId}/bookings`);
//       const list = res.data.bookings ?? res.data ?? [];
//       setBookingsMap(prev => ({ ...prev, [dateId]: list }));
//     } catch {/* silent */}
//     fetchDates();
//   };

//   const openShiftModal = async (bookingId) => {
//     setBookingToShift(bookingId);
//     setShiftDateId('');
//     try {
//       const res = await getAPICall(`/api/admin/mahaprasad/available-dates`);
//       setAvailableDates(res.data);
//       setShowShiftModal(true);
//     } catch {
//       toast.error('Failed to load available dates');
//     }
//   };

//   const handleShift = async () => {
//     if (!shiftDateId) return toast.error('Please select a date');
//     try {
//       await post(`/api/admin/mahaprasad/bookings/${bookingToShift}/shift`, {
//         new_date_id: parseInt(shiftDateId),
//       });
//       toast.success('Booking shifted successfully');
//       setShowShiftModal(false);
//       refreshBookings(expandedDateId);
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Shift failed');
//     }
//   };

//   const handleCancel = async (bookingId) => {
//     try {
//       await deleteAPICall(`/api/admin/mahaprasad/bookings/${bookingId}`);
//       toast.success('Booking cancelled');
//       setConfirmCancel(null);
//       refreshBookings(expandedDateId);
//     } catch {
//       toast.error('Cancel failed');
//     }
//   };

//   const handleCreateDate = async () => {
//     if (!newDate.event_date) return toast.error('Please select a date');
//     try {
//       await post(`/api/admin/mahaprasad/dates`, newDate);
//       toast.success('Date created successfully');
//       setNewDate({ event_date: '', max_limit: 10, type: 'sunday', event_details: '' });
//       fetchDates();
//     } catch {
//       toast.error('Failed to create date');
//     }
//   };

//   const generateSundays = async () => {
//     if (!window.confirm('Generate all Sundays for current month?')) return;
//     try {
//       await post(`/api/admin/mahaprasad/generate-sundays`);
//       toast.success('Sundays generated successfully');
//       fetchDates();
//     } catch {
//       toast.error('Failed to generate Sundays');
//     }
//   };

//   const statusColor = (status) => {
//     if (status === 'confirmed') return { background: '#dcfce7', color: '#15803d' };
//     if (status === 'cancelled') return { background: '#fee2e2', color: '#dc2626' };
//     return { background: '#fef9c3', color: '#a16207' };
//   };








//   const confirmBooking = async (id) => {
//   try {
//     await post(`/api/admin/mahaprasad/bookings/${id}/confirm`);
//     toast.success("Booking confirmed");
//     refreshBookings(expandedDateId);
//   } catch {
//     toast.error("Confirm failed");
//   }
// };

// const pendingBooking = async (id) => {
//   try {
//     await post(`/api/admin/mahaprasad/bookings/${id}/pending`);
//     toast.success("Marked as pending");
//     refreshBookings(expandedDateId);
//   } catch {
//     toast.error("Update failed");
//   }
// };

// const cancelBooking = async (id) => {
//   try {
//     await post(`/api/admin/mahaprasad/bookings/${id}/cancel`);
//     toast.success("Booking cancelled");
//     refreshBookings(expandedDateId);
//   } catch {
//     toast.error("Cancel failed");
//   }
// };

// const shiftBooking = (id) => {
//   openShiftModal(id);
// };








//   return (
//     <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto', fontFamily: 'sans-serif' }}>
//       <ToastContainer />

//       {/* CSS for expand animation + chevron */}
//       <style>{`
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
//         .expand-row { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.25s ease, opacity 0.2s ease; }
//         .expand-row.open { max-height: 2000px; opacity: 1; }
//         .chevron { display: inline-block; transition: transform 0.2s ease; }
//         .chevron.open { transform: rotate(90deg); }
//         tr.date-row:hover { background: #f9fafb; }
//         tr.date-row.expanded { background: #eef2ff; }
//         .btn { cursor: pointer; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; padding: 6px 14px; }
//         .btn-primary { background: #4f46e5; color: #fff; }
//         .btn-primary:hover { background: #4338ca; }
//         .btn-success { background: #16a34a; color: #fff; }
//         .btn-success:hover { background: #15803d; }
//         .btn-outline-amber { background: #fff; color: #b45309; border: 1px solid #fcd34d; }
//         .btn-outline-amber:hover { background: #fffbeb; }
//         .btn-outline-red { background: #fff; color: #dc2626; border: 1px solid #fca5a5; }
//         .btn-outline-red:hover { background: #fef2f2; }
//         .btn-secondary { background: #e5e7eb; color: #374151; }
//         .btn-secondary:hover { background: #d1d5db; }
//         .btn-danger { background: #dc2626; color: #fff; }
//         .btn-danger:hover { background: #b91c1c; }
//         .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 50; }
//         .modal-box { background: #fff; border-radius: 12px; padding: 24px; width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
//         input[type=date], input[type=number], input[type=text], select, textarea {
//           border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 10px; font-size: 14px;
//           width: 100%; box-sizing: border-box; outline: none;
//         }
//         input:focus, select:focus, textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.15); }
//         table { width: 100%; border-collapse: collapse; }
//         th { text-align: left; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding: 10px 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
//         td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
//         .badge { display: inline-block; font-size: 11px; font-weight: 700; border-radius: 5px; padding: 2px 8px; }
//       `}</style>

//       {/* ── Header ── */}
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
//         <div>
//           <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111827' }}>Mahaprasad Admin</h1>
//           <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>Manage dates and bookings</p>
//         </div>
//         <button className="btn btn-success" onClick={generateSundays}>
//           ✦ Auto-Generate Sundays
//         </button>
//       </div>

//       {/* ── Add New Date Card ── */}
//       <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
//         <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#1f2937' }}>Add New Mahaprasad Date</h2>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
//           <input
//             type="date"
//             value={newDate.event_date}
//             onChange={e => setNewDate({ ...newDate, event_date: e.target.value })}
//           />
//           <select
//             value={newDate.type}
//             onChange={e => setNewDate({ ...newDate, type: e.target.value })}
//           >
//             <option value="sunday">Sunday</option>
//             <option value="event">Special Event</option>
//           </select>
//           <input
//             type="number"
//             placeholder="Max limit"
//             value={newDate.max_limit}
//             onChange={e => setNewDate({ ...newDate, max_limit: parseInt(e.target.value) || 10 })}
//           />
//           <button className="btn btn-primary" onClick={handleCreateDate}>
//             + Create Date
//           </button>
//         </div>
//         {newDate.type === 'event' && (
//           <input
//             type="text"
//             style={{ marginTop: 10 }}
//             placeholder="Event details (e.g. Guru Purnima, Full Moon Day…)"
//             value={newDate.event_details}
//             onChange={e => setNewDate({ ...newDate, event_details: e.target.value })}
//           />
//         )}
//       </div>

//       {/* ── Dates Table ── */}
//       <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
//         <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
//           <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1f2937' }}>All Dates</h2>
//         </div>
//         <table>
//           <thead>
//             <tr>
//               <th style={{ width: 32 }} />
//               <th>Date</th>
//               <th>Type</th>
//               <th>Details</th>
//               <th>Booked</th>
//               <th>Remaining</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dates.length === 0 ? (
//               <tr>
//                 <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
//                   No dates added yet
//                 </td>
//               </tr>
//             ) : (
//               dates.map(d => {
//                 const isExpanded = expandedDateId === d.id;
//                 const isLoadingBookings = loadingMap[d.id];
//                 const bookings = bookingsMap[d.id] ?? [];
//                 const remaining = d.max_limit - d.booked_count;

//                 return (
//                   <>
//                     {/* Date row */}
//                     <tr
//                       key={`date-${d.id}`}
//                       className={`date-row${isExpanded ? ' expanded' : ''}`}
//                       style={{ cursor: 'pointer' }}
//                       onClick={() => handleToggle(d.id)}
//                     >
//                       <td style={{ paddingLeft: 16 }}>
//                         <span className={`chevron${isExpanded ? ' open' : ''}`} style={{ color: '#9ca3af', fontSize: 14 }}>▶</span>
//                       </td>
//                       <td style={{ fontWeight: 600, color: '#111827' }}>{d.event_date}</td>
//                       <td>
//                         <span
//                           className="badge"
//                           style={d.type === 'sunday'
//                             ? { background: '#dbeafe', color: '#1d4ed8' }
//                             : { background: '#f3e8ff', color: '#7e22ce' }}
//                         >
//                           {d.type === 'sunday' ? 'Sunday' : 'Special'}
//                         </span>
//                       </td>
//                       <td style={{ color: '#6b7280' }}>{d.event_details || '—'}</td>
//                       <td>
//                         <span style={{ fontWeight: 700, color: '#111827' }}>{d.booked_count}</span>
//                         <span style={{ color: '#9ca3af', fontSize: 12 }}> / {d.max_limit}</span>
//                       </td>
//                       <td>
//                         <span
//                           className="badge"
//                           style={remaining === 0
//                             ? { background: '#fee2e2', color: '#dc2626' }
//                             : { background: '#dcfce7', color: '#15803d' }}
//                         >
//                           {remaining} left
//                         </span>
//                       </td>
//                     </tr>

//                     {/* Expanded bookings row */}
//                     <tr key={`bookings-${d.id}`}>
//                       <td colSpan={6} style={{ padding: 0, borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none' }}>
//                         <div className={`expand-row${isExpanded ? ' open' : ''}`}>
//                           <div style={{ background: '#eef2ff', borderTop: '1px solid #c7d2fe', padding: '14px 20px' }}>
//                             {isLoadingBookings ? (
//                               <p style={{ color: '#6b7280', fontSize: 14 }}>Loading bookings…</p>
//                             ) : bookings.length === 0 ? (
//                               <p style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', margin: 0 }}>No bookings for this date.</p>
//                             ) : (
//                               <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #c7d2fe' }}>
//                                 <table>
//                                   <thead>
//                                     <tr style={{ background: '#eef2ff' }}>
//                                       <th style={{ color: '#4338ca' }}>Name</th>
//                                       <th style={{ color: '#4338ca' }}>Email</th>
//                                       <th style={{ color: '#4338ca' }}>Phone</th>
//                                       <th style={{ color: '#4338ca' }}>Status</th>
//                                       <th style={{ color: '#4338ca' }}>Actions</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     {bookings.map(b => (
//                                       <tr key={b.id}>
//                                         <td style={{ fontWeight: 600, color: '#111827' }}>{b.name}</td>
//                                         <td style={{ color: '#6b7280' }}>{b.email}</td>
//                                         <td style={{ color: '#6b7280' }}>{b.phone}</td>
//                                         <td>
//                                           <span className="badge" style={statusColor(b.status)}>{b.status}</span>
//                                         </td>
//                                         {/* <td onClick={e => e.stopPropagation()}>
//                                           <div style={{ display: 'flex', gap: 6 }}>
//                                             <button className="btn btn-outline-amber" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => openShiftModal(b.id)}>
//                                               Shift
//                                             </button>
//                                             <button className="btn btn-outline-red" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setConfirmCancel({ id: b.id, name: b.name })}>
//                                               Cancel
//                                             </button>
//                                           </div>
//                                         </td> */}



// <td onClick={e => e.stopPropagation()}>
//   <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>

//     {b.status !== "confirmed" && (
//       <button
//         className="btn btn-success"
//         onClick={() => confirmBooking(b.id)}
//       >
//         Confirm
//       </button>
//     )}

//     {b.status !== "shifted" && (
//       <button
//         className="btn btn-outline-amber"
//         onClick={() => shiftBooking(b.id)}
//       >
//         Shift
//       </button>
//     )}

//     {b.status !== "cancelled" && (
//       <button
//         className="btn btn-outline-red"
//         onClick={() => cancelBooking(b.id)}
//       >
//         Cancel
//       </button>
//     )}

//     {b.status !== "pending" && (
//       <button
//         className="btn btn-secondary"
//         onClick={() => pendingBooking(b.id)}
//       >
//         Pending
//       </button>
//     )}

//   </div>
// </td>



//                                       </tr>
//                                     ))}
//                                   </tbody>
//                                 </table>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   </>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ── Cancel Confirm Modal ── */}
//       {confirmCancel && (
//         <div className="overlay" onClick={() => setConfirmCancel(null)}>
//           <div className="modal-box" onClick={e => e.stopPropagation()}>
//             <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>Cancel this booking?</h3>
//             <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: 14 }}>
//               This will permanently cancel the booking for <strong>{confirmCancel.name}</strong>.
//             </p>
//             <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//               <button className="btn btn-secondary" onClick={() => setConfirmCancel(null)}>Go Back</button>
//               <button className="btn btn-danger" onClick={() => handleCancel(confirmCancel.id)}>Yes, Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Shift Modal ── */}
//       {showShiftModal && (
//         <div className="overlay" onClick={() => setShowShiftModal(false)}>
//           <div className="modal-box" onClick={e => e.stopPropagation()}>
//             <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700 }}>Shift Booking</h3>
//             <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Select New Date</label>
//             <select value={shiftDateId} onChange={e => setShiftDateId(e.target.value)}>
//               <option value="">— Choose a date —</option>
//               {availableDates.map(d => (
//                 <option key={d.id} value={String(d.id)}>
//                   {d.event_date}{d.event_details ? ` (${d.event_details})` : ''}
//                 </option>
//               ))}
//             </select>
//             <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
//               <button className="btn btn-secondary" onClick={() => setShowShiftModal(false)}>Close</button>
//               <button className="btn btn-primary" onClick={handleShift}>Confirm Shift</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MahaprasadAdmin;















import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { deleteAPICall, getAPICall, post } from '../../../util/api';

// ── Built-in toast ─────────────────────────────────────────
let toastId = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  const toast = {
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error'),
  };
  const ToastContainer = () => (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: '10px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600,
          background: t.type === 'success' ? '#16a34a' : '#dc2626',
          color: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {t.type === 'success' ? '✓ ' : '✕ '}{t.msg}
        </div>
      ))}
    </div>
  );
  return { toast, ToastContainer };
}
// ───────────────────────────────────────────────────────────

function MahaprasadAdmin() {
  const { toast, ToastContainer } = useToast();

  const [dates, setDates] = useState([]);           // ← Safe default
  const [expandedDateId, setExpandedDateId] = useState(null);
  const [bookingsMap, setBookingsMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [newDate, setNewDate] = useState({
    event_date: '',
    max_limit: 10,
    type: 'sunday',
    event_details: '',
  });
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [bookingToShift, setBookingToShift] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [shiftDateId, setShiftDateId] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(null);

  useEffect(() => { 
    fetchDates(); 
  }, []);

  const fetchDates = async () => {
    try {
      const res = await getAPICall(`/api/admin/mahaprasad/dates`);
      setDates(res|| []);        // ← Safe fallback
    } catch {
      toast.error('Failed to load dates');
      setDates([]);                    // ← Safe fallback
    }
  };

  const handleToggle = async (dateId) => {
    if (expandedDateId === dateId) { 
      setExpandedDateId(null); 
      return; 
    }
    setExpandedDateId(dateId);

    if (bookingsMap[dateId] !== undefined) return;

    setLoadingMap(prev => ({ ...prev, [dateId]: true }));

    try {
      const res = await getAPICall(`/api/admin/mahaprasad/dates/${dateId}/bookings`);
      const list = res.bookings ?? res.data ?? [];
      setBookingsMap(prev => ({ ...prev, [dateId]: list }));
    } catch {
      toast.error('Could not load bookings');
      setBookingsMap(prev => ({ ...prev, [dateId]: [] }));
    } finally {
      setLoadingMap(prev => ({ ...prev, [dateId]: false }));
    }
  };

  const refreshBookings = async (dateId) => {
    if (!dateId) return;
    try {
      const res = await getAPICall(`/api/admin/mahaprasad/dates/${dateId}/bookings`);
      const list = res.bookings ?? res.data ?? [];
      setBookingsMap(prev => ({ ...prev, [dateId]: list }));
    } catch {/* silent */}
    fetchDates();
  };

  const openShiftModal = async (bookingId) => {
    setBookingToShift(bookingId);
    setShiftDateId('');
    try {
      const res = await getAPICall(`/api/admin/mahaprasad/available-dates`);
      setAvailableDates(res || []);
      setShowShiftModal(true);
    } catch {
      toast.error('Failed to load available dates');
    }
  };

  const handleShift = async () => {
    if (!shiftDateId) return toast.error('Please select a date');
    try {
      await post(`/api/admin/mahaprasad/bookings/${bookingToShift}/shift`, {
        new_date_id: parseInt(shiftDateId),
      });
      toast.success('Booking shifted successfully');
      setShowShiftModal(false);
      refreshBookings(expandedDateId);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Shift failed');
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await deleteAPICall(`/api/admin/mahaprasad/bookings/${bookingId}`);
      toast.success('Booking cancelled');
      setConfirmCancel(null);
      refreshBookings(expandedDateId);
    } catch {
      toast.error('Cancel failed');
    }
  };

  const handleCreateDate = async () => {
    if (!newDate.event_date) return toast.error('Please select a date');
    try {
      await post(`/api/admin/mahaprasad/dates`, newDate);
      toast.success('Date created successfully');
      setNewDate({ event_date: '', max_limit: 10, type: 'sunday', event_details: '' });
      fetchDates();
    } catch {
      toast.error('Failed to create date');
    }
  };

  const generateSundays = async () => {
    if (!window.confirm('Generate all Sundays for current month?')) return;
    try {
      await post(`/api/admin/mahaprasad/generate-sundays`);
      toast.success('Sundays generated successfully');
      fetchDates();
    } catch {
      toast.error('Failed to generate Sundays');
    }
  };

  const statusColor = (status) => {
    if (status === 'confirmed') return { background: '#dcfce7', color: '#15803d' };
    if (status === 'cancelled') return { background: '#fee2e2', color: '#dc2626' };
    return { background: '#fef9c3', color: '#a16207' };
  };

  const confirmBooking = async (id) => {
    try {
      await post(`/api/admin/mahaprasad/bookings/${id}/confirm`);
      toast.success("Booking confirmed");
      refreshBookings(expandedDateId);
    } catch {
      toast.error("Confirm failed");
    }
  };

  const pendingBooking = async (id) => {
    try {
      await post(`/api/admin/mahaprasad/bookings/${id}/pending`);
      toast.success("Marked as pending");
      refreshBookings(expandedDateId);
    } catch {
      toast.error("Update failed");
    }
  };

  const cancelBooking = async (id) => {
    try {
      await post(`/api/admin/mahaprasad/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      refreshBookings(expandedDateId);
    } catch {
      toast.error("Cancel failed");
    }
  };

  const shiftBooking = (id) => {
    openShiftModal(id);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <ToastContainer />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .expand-row { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.25s ease, opacity 0.2s ease; }
        .expand-row.open { max-height: 2000px; opacity: 1; }
        .chevron { display: inline-block; transition: transform 0.2s ease; }
        .chevron.open { transform: rotate(90deg); }
        tr.date-row:hover { background: #f9fafb; }
        tr.date-row.expanded { background: #eef2ff; }
        .btn { cursor: pointer; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; padding: 6px 14px; }
        .btn-primary { background: #4f46e5; color: #fff; }
        .btn-primary:hover { background: #4338ca; }
        .btn-success { background: #16a34a; color: #fff; }
        .btn-success:hover { background: #15803d; }
        .btn-outline-amber { background: #fff; color: #b45309; border: 1px solid #fcd34d; }
        .btn-outline-amber:hover { background: #fffbeb; }
        .btn-outline-red { background: #fff; color: #dc2626; border: 1px solid #fca5a5; }
        .btn-outline-red:hover { background: #fef2f2; }
        .btn-secondary { background: #e5e7eb; color: #374151; }
        .btn-secondary:hover { background: #d1d5db; }
        .btn-danger { background: #dc2626; color: #fff; }
        .btn-danger:hover { background: #b91c1c; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .modal-box { background: #fff; border-radius: 12px; padding: 24px; width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        input[type=date], input[type=number], input[type=text], select, textarea {
          border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 10px; font-size: 14px;
          width: 100%; box-sizing: border-box; outline: none;
        }
        input:focus, select:focus, textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.15); }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 12px; font-weight: 700; color: '#6b7280'; text-transform: uppercase; letter-spacing: 0.05em; padding: 10px 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
        td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
        .badge { display: inline-block; font-size: 11px; font-weight: 700; border-radius: 5px; padding: 2px 8px; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111827' }}>Mahaprasad Admin</h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>Manage dates and bookings</p>
        </div>
        <button className="btn btn-success" onClick={generateSundays}>
          ✦ Auto-Generate Sundays
        </button>
      </div>

      {/* Add New Date Card */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#1f2937' }}>Add New Mahaprasad Date</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          <input
            type="date"
            value={newDate.event_date}
            onChange={e => setNewDate({ ...newDate, event_date: e.target.value })}
          />
          <select
            value={newDate.type}
            onChange={e => setNewDate({ ...newDate, type: e.target.value })}
          >
            <option value="sunday">Sunday</option>
            <option value="event">Special Event</option>
          </select>
          <input
            type="number"
            placeholder="Max limit"
            value={newDate.max_limit}
            onChange={e => setNewDate({ ...newDate, max_limit: parseInt(e.target.value) || 10 })}
          />
          <button className="btn btn-primary" onClick={handleCreateDate}>
            + Create Date
          </button>
        </div>
        {newDate.type === 'event' && (
          <input
            type="text"
            style={{ marginTop: 10 }}
            placeholder="Event details (e.g. Guru Purnima, Full Moon Day…)"
            value={newDate.event_details}
            onChange={e => setNewDate({ ...newDate, event_details: e.target.value })}
          />
        )}
      </div>

      {/* Dates Table - FIXED: Safe check for dates */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1f2937' }}>All Dates</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ width: 32 }} />
              <th>Date</th>
              <th>Type</th>
              <th>Details</th>
              <th>Booked</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {dates.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                  No dates added yet
                </td>
              </tr>
            ) : (
              dates.map(d => {
                const isExpanded = expandedDateId === d.id;
                const isLoadingBookings = loadingMap[d.id];
                const bookings = bookingsMap[d.id] ?? [];
                const remaining = d.max_limit - (d.booked_count || 0);

                return (
                  <>
                    <tr
                      key={`date-${d.id}`}
                      className={`date-row${isExpanded ? ' expanded' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleToggle(d.id)}
                    >
                      <td style={{ paddingLeft: 16 }}>
                        <span className={`chevron${isExpanded ? ' open' : ''}`} style={{ color: '#9ca3af', fontSize: 14 }}>▶</span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#111827' }}>{d.event_date}</td>
                      <td>
                        <span className="badge" style={d.type === 'sunday' ? { background: '#dbeafe', color: '#1d4ed8' } : { background: '#f3e8ff', color: '#7e22ce' }}>
                          {d.type === 'sunday' ? 'Sunday' : 'Special'}
                        </span>
                      </td>
                      <td style={{ color: '#6b7280' }}>{d.event_details || '—'}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#111827' }}>{d.booked_count || 0}</span>
                        <span style={{ color: '#9ca3af', fontSize: 12 }}> / {d.max_limit}</span>
                      </td>
                      <td>
                        <span className="badge" style={remaining === 0 ? { background: '#fee2e2', color: '#dc2626' } : { background: '#dcfce7', color: '#15803d' }}>
                          {remaining} left
                        </span>
                      </td>
                    </tr>

                    <tr key={`bookings-${d.id}`}>
                      <td colSpan={6} style={{ padding: 0, borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none' }}>
                        <div className={`expand-row${isExpanded ? ' open' : ''}`}>
                          <div style={{ background: '#eef2ff', borderTop: '1px solid #c7d2fe', padding: '14px 20px' }}>
                            {isLoadingBookings ? (
                              <p style={{ color: '#6b7280', fontSize: 14 }}>Loading bookings…</p>
                            ) : bookings.length === 0 ? (
                              <p style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', margin: 0 }}>No bookings for this date.</p>
                            ) : (
                              <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #c7d2fe' }}>
                                <table>
                                  <thead>
                                    <tr style={{ background: '#eef2ff' }}>
                                      <th style={{ color: '#4338ca' }}>Name</th>
                                      <th style={{ color: '#4338ca' }}>Email</th>
                                      <th style={{ color: '#4338ca' }}>Phone</th>
                                      <th style={{ color: '#4338ca' }}>Status</th>
                                      <th style={{ color: '#4338ca' }}>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bookings.map(b => (
                                      <tr key={b.id}>
                                        <td style={{ fontWeight: 600, color: '#111827' }}>{b.name}</td>
                                        <td style={{ color: '#6b7280' }}>{b.email}</td>
                                        <td style={{ color: '#6b7280' }}>{b.phone}</td>
                                        <td>
                                          <span className="badge" style={statusColor(b.status)}>{b.status}</span>
                                        </td>
                                        <td onClick={e => e.stopPropagation()}>
                                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                            {b.status !== "confirmed" && (
                                              <button className="btn btn-success" onClick={() => confirmBooking(b.id)}>Confirm</button>
                                            )}
                                            {b.status !== "shifted" && (
                                              <button className="btn btn-outline-amber" onClick={() => shiftBooking(b.id)}>Shift</button>
                                            )}
                                            {b.status !== "cancelled" && (
                                              <button className="btn btn-outline-red" onClick={() => cancelBooking(b.id)}>Cancel</button>
                                            )}
                                            {b.status !== "pending" && (
                                              <button className="btn btn-secondary" onClick={() => pendingBooking(b.id)}>Pending</button>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Cancel Confirm Modal */}
      {confirmCancel && (
        <div className="overlay" onClick={() => setConfirmCancel(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>Cancel this booking?</h3>
            <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: 14 }}>
              This will permanently cancel the booking for <strong>{confirmCancel.name}</strong>.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setConfirmCancel(null)}>Go Back</button>
              <button className="btn btn-danger" onClick={() => handleCancel(confirmCancel.id)}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Shift Modal */}
      {showShiftModal && (
        <div className="overlay" onClick={() => setShowShiftModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700 }}>Shift Booking</h3>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Select New Date</label>
            <select value={shiftDateId} onChange={e => setShiftDateId(e.target.value)}>
              <option value="">— Choose a date —</option>
              {availableDates.map(d => (
                <option key={d.id} value={String(d.id)}>
                  {d.event_date}{d.event_details ? ` (${d.event_details})` : ''}
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setShowShiftModal(false)}>Close</button>
              <button className="btn btn-primary" onClick={handleShift}>Confirm Shift</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MahaprasadAdmin;