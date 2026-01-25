import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to get correct image URL
  const getImageUrl = (img) => {
    if (img && (img.startsWith('http://') || img.startsWith('https://'))) {
      return img;
    }
    return `${url}/images/${img}`;
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`)
      if (response.data.success) {
        setList(response.data.data);
      }
      else {
        toast.error("Error")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch list')
    } finally {
      setLoading(false);
    }
  }

  const removeFood = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId
      })
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      }
      else {
        toast.error("Error")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item')
    }
  }

  const filteredList = list.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      {loading ? <p className="loading-text">Loading...</p> : (
      <>
      <input 
        type="text" 
        placeholder="Search by name or category..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {filteredList.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={getImageUrl(item.image)} alt={item.name} onError={(e) => e.target.style.opacity = 0.3} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <button onClick={() => removeFood(item._id)} className="delete-btn">Delete</button>
            </div>
          )
        })}
      </div>
      </>
      )}
    </div>
  )
}

export default List
