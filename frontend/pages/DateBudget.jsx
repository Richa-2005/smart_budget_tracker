import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

export default function DateBudget()  {
  const { date } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [expenditure, setExpenditure] = useState({
    price: '',
    description: '',
    need: 'Necessity'
  });
  const [expendituresList, setExpendituresList] = useState([]); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExpenditure(prevExpenditure => ({
      ...prevExpenditure,
      [name]: value
    }));
  };
 const userId ="68aefcc8b89931fdda551904"
  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      price: expenditure.price,
      description: expenditure.description,
      need: expenditure.need
    };

    try {
      const response = await axios.post(`http://localhost:5500/budget/post/${userId}/${date}`, postData);
      
      setExpendituresList(prevList => [...prevList, response.data.data]);

      alert('Expenditure added successfully!');

    } catch (err) {
      console.error('Error adding expenditure:', err.response?.data || err.message);
      alert('Failed to add expenditure.');
    }
    
    setExpenditure({
      price: '',
      description: '',
      need: 'Necessity'
    });
    setShowForm(false);
  };
 

  useEffect(() => {
    const fetchExpenditures = async () => {
      try {
        const response = await axios.get(`http://localhost:5500/budget/${userId}/${date}`);
        setExpendituresList(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch expenditures.');
        setExpendituresList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenditures();
  }, [date]);
  

  return (
    <div className="expenditure-page-container">
      <div className="date-box">
        <h1 className="date-title">{date}</h1>
      </div>
      
      <div className="button-container">
        <button 
          className="add-expenditure-btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Expenditure"}
        </button>
      </div>

      {showForm && (
        <form className="expenditure-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input 
              type="number" 
              id="price" 
              name="price"
              value={expenditure.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input 
              type="text" 
              id="description" 
              name="description"
              value={expenditure.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="need">Need</label>
            <select 
              id="need" 
              name="need"
              value={expenditure.need}
              onChange={handleInputChange}
            >
              <option value="Necessity">Necessity</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          
          <button type="submit" className="submit-btn">Save Expenditure</button>
          
        </form>
      )}

      <div className="expenditure-list">
      <h2>Expenditures for this date</h2>
      {loading && <p>Loading expenditures...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && expenditure.length === 0 && <p>No expenditures added yet for this date.</p>}

      <ul>
      
      {expendituresList.map(item => (
        <li key={item._id} className="expenditure-item">
          <span className="expenditure-price">{item.price}</span>
          <span className="expenditure-description">{item.description}</span>
          <span className="expenditure-category">({item.need})</span>
        </li>
      ))}
    </ul>
      </div>
    </div>
  );
};
