import React, { useEffect, useState } from 'react';
import { CCol, CRow } from '@coreui/react';
import { MantineReactTable } from 'mantine-react-table';
import { getAPICall } from '../../../util/api';
import UpdatePopUp from './UpdatePopUp';

function Credit() {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null); // State to hold selected row data
    const [orders, setOrders] = useState([]);
    const route = window.location.href.split('/').pop();

    const fetchOrders = async () => {
        const response = await getAPICall(`/api/credit`);
        setOrders(response);
    };

    console.log(orders);
    useEffect(() => {
        fetchOrders();
    }, [route]);

    const showPopup = (row) => {
        setSelectedOrder(row.original); // Store the entire row's data in the state
        setPopupVisible(true);
    };

    const hidePopup = () => setPopupVisible(false);

    const columns = [
        { accessorKey: 'customerName', header: 'Name' },
        { accessorKey: 'customerMobile', header: 'Mobile' },
        { accessorKey: 'finalAmount', header: 'Total Amount' },
        { accessorKey: 'paidAmount', header: 'Amount Paid' },
        { accessorKey: 'balance', header: 'Balance' },
        {
            header: 'Action',
            Cell: ({ row }) => (
                <button className="btn btn-primary" onClick={() => showPopup(row)}>
                    Pay 
                </button>
            )
        }
    ];

    const data = orders.map(order => ({
        ...order,
        balance: order.finalAmount - order.paidAmount,
    }));

    return (
        <div>
            <UpdatePopUp 
                isVisible={isPopupVisible} 
                onClose={hidePopup} 
                orderData={selectedOrder} // Pass the selected order data to the popup
            />
            <CRow>
                <div className={`relative ${isPopupVisible ? 'blur-background' : ''}`}>
                    <CCol xs={12}>
                        <MantineReactTable columns={columns} data={data} enableFullScreenToggle={false} />
                    </CCol>
                </div>
            </CRow>
        </div>
    );
}

export default Credit;
