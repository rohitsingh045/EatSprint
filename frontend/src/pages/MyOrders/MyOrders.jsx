import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { showToast } from '../../utils/toast';

const MyOrders = () => {
  const { url, token, addToCart, food_list } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackedOrderId, setTrackedOrderId] = useState(null);

  // Check if order can be cancelled (before admin confirmation)
  const canCancelOrder = (status) => {
    const s = (status || '').toLowerCase();
    return s.includes('food processing') || 
           s.includes('pending') || 
           s.includes('placed') ||
           s === 'cod - pending';
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${url}/api/order/cancel`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        showToast.success('Order cancelled successfully');
        fetchOrders();
      } else {
        showToast.error(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      showToast.error('Failed to cancel order. Please try again.');
    }
  };

  const handleReorder = (order) => {
    let addedCount = 0;
    order.items.forEach((orderItem) => {
      const foodItem = food_list.find(item => item.name === orderItem.name);
      if (foodItem) {
        for (let i = 0; i < orderItem.quantity; i++) {
          addToCart(foodItem._id);
        }
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      showToast.success(`${addedCount} item(s) added to cart!`);
    } else {
      showToast.error('Unable to add items. Products may no longer be available.');
    }
  };

  const generateInvoice = (order) => {
    try {
      const doc = new jsPDF();
      
      // Header - Pink/Magenta gradient background (left side)
      doc.setFillColor(236, 72, 153); // Pink color
      doc.rect(0, 0, 140, 50, 'F');
      
      // Purple section for INVOICE (right side)
      doc.setFillColor(139, 92, 246); // Purple color
      doc.rect(140, 0, 70, 50, 'F');
      
      // Company Name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('EATSPRINT', 15, 22);
      
      // Taglines
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Food Delivery Service', 15, 32);
      doc.setFontSize(10);
      doc.text('Delicious Food at Your Doorstep', 15, 40);
      
      // INVOICE text on purple background
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', 155, 30);
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Invoice Details Box
      doc.setDrawColor(230, 230, 230);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 60, 85, 45, 3, 3, 'FD');
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Invoice Details', 22, 72);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const orderId = order._id ? order._id.slice(-8).toUpperCase() : 'N/A';
      doc.text(`Invoice No: #${orderId}`, 22, 82);
      doc.text(`Date: ${new Date(order.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })}`, 22, 90);
      doc.text(`Status: ${(order.status || 'Processing').toUpperCase()}`, 22, 98);
      
      // Bill To Box
      doc.setDrawColor(230, 230, 230);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(110, 60, 85, 45, 3, 3, 'FD');
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To', 117, 72);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      if (order.address) {
        doc.text(`${order.address.firstName || ''} ${order.address.lastName || ''}`, 117, 82);
        doc.text(`${order.address.street || ''}`, 117, 90);
        doc.text(`${order.address.city || ''}, ${order.address.state || ''}`, 117, 98);
        doc.text(`${order.address.zipcode || ''}`, 117, 106);
      }
      
      // Order Items Table
      const tableColumn = ['#', 'Item', 'Qty', 'Price', 'Total'];
      const tableRows = [];
      
      // Check if prices are in paise (stored as paise in DB) or rupees
      // If price > 1000, it's likely in paise, so convert to rupees
      order.items.forEach((item, index) => {
        let itemPrice = item.price || 0;
        // Convert from paise to rupees if price seems to be in paise
        if (itemPrice > 1000) {
          itemPrice = itemPrice / 100;
        }
        const itemTotal = itemPrice * item.quantity;
        tableRows.push([
          index + 1,
          item.name,
          item.quantity,
          `Rs. ${itemPrice.toFixed(2)}`,
          `Rs. ${itemTotal.toFixed(2)}`
        ]);
      });
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 115,
        theme: 'plain',
        headStyles: {
          fillColor: [236, 72, 153],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 10
        },
        styles: {
          fontSize: 9,
          cellPadding: 6,
          lineColor: [230, 230, 230],
          lineWidth: 0.5
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center' },
          1: { cellWidth: 70 },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 35, halign: 'center' },
          4: { cellWidth: 35, halign: 'center' }
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        }
      });
      
      // Calculate totals
      const finalY = doc.lastAutoTable.finalY + 20;
      // Calculate subtotal - convert from paise if needed
      const subtotal = order.items.reduce((sum, item) => {
        let price = item.price || 0;
        if (price > 1000) {
          price = price / 100;
        }
        return sum + (price * item.quantity);
      }, 0);
      const total = order.amount;
      const deliveryFee = total - subtotal;
      
      // Payment Method (left side)
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Payment Method: ${order.paymentMethod === 'COD' ? 'COD' : 'Online'}`, 22, finalY + 10);
      
      // Totals section (right side) - with box
      doc.setDrawColor(230, 230, 230);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(110, finalY - 5, 85, 50, 3, 3, 'FD');
      
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10);
      doc.text('Subtotal:', 117, finalY + 8);
      doc.text(`Rs. ${subtotal.toFixed(2)}`, 188, finalY + 8, { align: 'right' });
      
      doc.text('Delivery:', 117, finalY + 20);
      doc.text(deliveryFee > 0 ? `Rs. ${deliveryFee.toFixed(2)}` : 'FREE', 188, finalY + 20, { align: 'right' });
      
      // Total line
      doc.setDrawColor(230, 230, 230);
      doc.line(117, finalY + 27, 188, finalY + 27);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(236, 72, 153);
      doc.setFontSize(11);
      doc.text('Total:', 117, finalY + 38);
      doc.text(`Rs. ${total.toFixed(2)}`, 188, finalY + 38, { align: 'right' });
      
      // Footer
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const footerY = 280;
      doc.text('Thank you for ordering with EatSprint!', 105, footerY, { align: 'center' });
      doc.text('For any queries, contact us at support@eatsprint.com', 105, footerY + 5, { align: 'center' });
      
      // Save the PDF
      doc.save(`EatSprint_Invoice_${orderId}.pdf`);
    } catch (error) {
      showToast.error('Failed to generate invoice. Please try again.');
    }
  };

  const fetchOrders = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/api/order/user-orders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      showToast.error('Failed to load orders. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Set up periodic refresh
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="container">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='my-orders'>
      <div className="orders-header">
        <h2>My Orders</h2>
        <p className="orders-subtitle">Track and manage your orders</p>
      </div>
      
      <div className='orders-container'>
        {data.length === 0 ? (
          <div className="empty-orders">
            <svg className="empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h3>No Orders Yet</h3>
            <p>Start ordering your favorite meals</p>
          </div>
        ) : (
          data.map((order) => (
            <div key={order._id} className='order-card'>
              <div className="order-card-header">
                <div className="order-info">
                  <div className="order-icon">
                    <img src={assets.parcel_icon} alt="Order" />
                  </div>
                  <div>
                    <h3 className="order-id">#{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">
                      {new Date(order.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <span className={`status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-items-list">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span className="summary-label">Payment</span>
                    <span className="summary-value">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span className="summary-label">Total Amount</span>
                    <span className="summary-value total-amount">₹{order.amount.toFixed(2)}</span>
                  </div>
                </div>

                {trackedOrderId === order._id && (
                  <div className="tracking-timeline">
                    {(() => {
                      const steps = [
                        { label: 'Order Placed' },
                        { label: 'Confirmed' },
                        { label: 'Preparing' },
                        { label: 'Out for Delivery' },
                        { label: 'Delivered' }
                      ];
                      const idx = (() => {
                        const s = (order.status || '').toLowerCase();
                        if (s.includes('deliver') && !s.includes('delivered')) return 3;
                        if (s.includes('delivered')) return 4;
                        if (s.includes('prepared') || s.includes('preparing')) return 2;
                        if (s.includes('confirmed')) return 1;
                        return 0;
                      })();

                      return steps.map((step, i) => (
                        <div key={step.label} className={`timeline-step ${i <= idx ? 'completed' : ''} ${i === idx ? 'active' : ''}`}>
                          <div className="step-indicator">
                            <div className="step-circle">
                              {i <= idx && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>
                            {i < steps.length - 1 && <div className="step-line"></div>}
                          </div>
                          <span className="step-text">{step.label}</span>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>

              <div className="order-card-actions">
                <button
                  className="action-btn reorder-btn"
                  onClick={() => handleReorder(order)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Reorder
                </button>
                <button
                  className={`action-btn track-btn ${order.status === 'Delivered' || order.status === 'Cancelled' ? 'disabled' : ''}`}
                  disabled={order.status === "Delivered" || order.status === "Cancelled"}
                  onClick={() => setTrackedOrderId(trackedOrderId === order._id ? null : order._id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  {trackedOrderId === order._id ? 'Hide' : order.status === 'Delivered' ? 'Delivered' : order.status === 'Cancelled' ? 'Cancelled' : 'Track'}
                </button>
                <button
                  className="action-btn invoice-btn"
                  onClick={() => generateInvoice(order)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Invoice
                </button>
                {canCancelOrder(order.status) && order.status !== 'Cancelled' && (
                  <button
                    className="action-btn cancel-btn"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;