import React, { use, useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {

 const [searchParams,setSearchParams] = useSearchParams();
  const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const {url, clearCart} = useContext(StoreContext);
    const navigate = useNavigate();

  const verifyPayment = async () => {
  try {
    const response = await axios.post(`${url}/api/order/verify`, {
      success,
      orderId
    });
    
    if (response.data.success) {
      // Clear cart after successful payment
      await clearCart();
      // Small delay to ensure order is updated in database
      setTimeout(() => {
        navigate('/myorders');
      }, 1000);
    } else {
      navigate("/");
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    navigate("/");
  }
};
    useEffect(() =>{
       verifyPayment(); 
    },[])

  return (
    <div className='verify'>
        <div className='spinner'></div>
     
    </div>
  )
}

export default Verify
