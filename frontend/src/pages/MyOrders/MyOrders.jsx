import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
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

  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
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
        alert('Order cancelled successfully');
        fetchOrders(); // Refresh orders
      } else {
        alert(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
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
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
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
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
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
        <h2>📦 My Orders</h2>
        <p className="orders-subtitle">Track and manage your delicious orders</p>
      </div>
      <div className='container'>
        {data.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">🛒</div>
            <h3>No orders yet!</h3>
            <p>Start shopping to place your first order</p>
          </div>
        ) : (
          data.map((order) => (
            <div key={order._id} className='my-orders-order'>
              <div className="order-icon-wrapper">
                <img src={assets.parcel_icon} alt="" />
                <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-details">
                <div className="order-header-info">
                  <h3 className="order-id">Order #{order._id.slice(-8).toUpperCase()}</h3>
                  <p className="order-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {new Date(order.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div className="order-items-wrapper">
                  <p className="order-items">
                    <span className="items-icon">🍽️</span>
                    {order.items.map((item, i) => (
                      <span key={i} className="item-tag">
                        {item.name} × {item.quantity}
                        {i < order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                </div>
                
                <div className="order-footer-info">
                  <p className="order-amount">
                    <span className="amount-label">Total:</span>
                    <span className="amount-value">₹{order.amount.toFixed(2)}</span>
                  </p>
                  <p className="payment-method">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                  </p>
                </div>

                <div className="order-status">
                  {trackedOrderId === order._id && (
                    <div className="tracking-container">
                      <div className="progress-steps">
                        {(() => {
                          const steps = [
                            { label: 'Placed', icon: '📝' },
                            { label: 'Confirmed', icon: '✅' },
                            { label: 'Prepared', icon: '👨‍🍳' },
                            { label: 'Out for delivery', icon: '🚚' },
                            { label: 'Delivered', icon: '🎉' }
                          ];
                          const idx = (() => {
                            const s = (order.status || '').toLowerCase();
                            if (s.includes('deliver') && !s.includes('delivered')) return 3;
                            if (s.includes('delivered')) return 4;
                            if (s.includes('prepared')) return 2;
                            if (s.includes('confirmed')) return 1;
                            if (s.includes('food processing') || s.includes('placed') || s.includes('cod')) return 0;
                            return 0;
                          })();

                          return steps.map((step, i) => (
                            <div key={step.label} className={`step ${i <= idx ? 'done' : ''} ${i === idx ? 'active' : ''}`}>
                              <div className="step-connector" style={{ display: i === 0 ? 'none' : 'block' }}></div>
                              <div className="step-dot">
                                {i <= idx ? <span className="step-icon">{step.icon}</span> : <span className="step-number">{i + 1}</span>}
                              </div>
                              <div className="step-label">{step.label}</div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-actions">
                <button
                  className={`track-button ${order.status.toLowerCase().replace(/\s+/g, '-')}`}
                  disabled={order.status === "Delivered" || order.status === "Cancelled"}
                  onClick={() => setTrackedOrderId(trackedOrderId === order._id ? null : order._id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  {trackedOrderId === order._id ? 'Hide Track' : (order.status === 'Delivered' ? '✓ Delivered' : order.status === 'Cancelled' ? '✕ Cancelled' : 'Track Order')}
                </button>
                <button
                  className="invoice-button"
                  onClick={() => generateInvoice(order)}
                  title="Download Invoice"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Invoice
                </button>
                {canCancelOrder(order.status) && order.status !== 'Cancelled' && (
                  <button
                    className="cancel-button"
                    onClick={() => handleCancelOrder(order._id)}
                    title="Cancel Order"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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