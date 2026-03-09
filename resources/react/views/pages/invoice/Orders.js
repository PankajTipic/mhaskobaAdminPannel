import React, { useEffect, useState } from 'react';
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import { MantineReactTable } from 'mantine-react-table';
import { getAPICall, put } from '../../../util/api';
import ConfirmationModal from '../../common/ConfirmationModal';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [deleteOrder, setDeleteOrder] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const route = window.location.href.split('/').pop();

  const fetchOrders = async () => {
    const type = route === 'order' ? -1 : route === 'bookings' ? 2 : 1;
    const response = await getAPICall(`/api/order?invoiceType=${type}&page=${currentPage}`);
    setOrders(response?.data ?? []);
    setCurrentPage(response.current_page);
    setTotalPage(response.total);
  };

  useEffect(() => {
    fetchOrders();
  }, [route, currentPage]);

  const handleDelete = (order) => {
    setDeleteOrder(order);
    setDeleteModalVisible(true);
  };

  const onDelete = async () => {
    await put(`/api/order/${deleteOrder.id}`, { ...deleteOrder, orderStatus: 0 });
    setDeleteModalVisible(false);
    fetchOrders();
  };

  const handleEdit = async (order) => {
    await put(`/api/order/${order.id}`, { ...order, orderStatus: 1 });
    fetchOrders();
  };

  const handleShow = (order) => {
    navigate(`/invoice-details/${order.id}`);
  };

  const columns = [
    { accessorKey: 'id', header: 'Sr.No.' },
    { accessorKey: 'customerName', header: 'Name' },
    { accessorKey: 'customerMobile', header: 'Mobile' },
    {
      accessorKey: 'orderStatus',
      header: 'Status',
      Cell: ({ cell }) => (
        <CBadge color={cell.row.original.orderStatus === 0 ? 'danger' : cell.row.original.orderStatus === 1 ? 'success' : 'warning'}>
          {cell.row.original.orderStatus === 0 ? 'Canceled' : cell.row.original.orderStatus === 1 ? 'Delivered' : 'Pending'}
        </CBadge>
      ),
    },
    {
      accessorKey: 'paymentType',
      header: 'Payment Type',
      Cell: ({ cell }) => (
        <CBadge color={cell.row.original.paymentType === 1 ? 'success' : 'warning'}>
          {cell.row.original.paymentType === 1 ? 'Cash' : 'Online'}
        </CBadge>
      ),
    },
    { accessorKey: 'balance', header: 'Balance' },
    { accessorKey: 'paidAmount', header: 'Amount Paid' },
    { accessorKey: 'finalAmount', header: 'Total Amount' },
    { accessorKey: 'invoiceDate', header: 'Date' },
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ cell }) => (
        <div>
          <CBadge
            role="button"
            color="success"
            onClick={() => handleShow(cell.row.original)}
          >
            Show
          </CBadge>{' '}
          {cell.row.original.orderStatus === 2 && (
            <CBadge
              role="button"
              color="info"
              onClick={() => handleEdit(cell.row.original)}
            >
              Mark Delivered
            </CBadge>
          )}{' '}
          {cell.row.original.orderStatus !== 0 && (
            <CBadge
              role="button"
              color="danger"
              onClick={() => handleDelete(cell.row.original)}
            >
              Cancel
            </CBadge>
          )}
        </div>
      ),
    },
  ];

  const data = orders.map((order, index) => ({
    ...order,
    id: index + 1,
    balance: order.finalAmount - order.paidAmount,
  }));

  return (
    <CRow>
      <ConfirmationModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onYes={onDelete}
        resource={'Cancel order - ' + deleteOrder?.id}
      />
      <CCol xs={12}>
        
            <MantineReactTable columns={columns} data={data}  enableFullScreenToggle={false}/>
          
              
      </CCol>
    </CRow>
  );
};

export default Orders;
