import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ExpenditurePage = () => {
  // Get the date from the URL parameters
  const { date } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [expenditure, setExpenditure] = useState({
    price: '',
    description: '',
    category: 'Necessity'
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExpenditure(prevExpenditure => ({
      ...prevExpenditure,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('New Expenditure:', expenditure);
    // Here you would add the logic to save the expenditure data
    // to a database or state manager.
    alert('Expenditure added! Check the console for details.');
    // Reset form
    setExpenditure({
      price: '',
      description: '',
      category: 'Necessity'
    });
    setShowForm(false);
  };

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
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              name="category"
              value={expenditure.category}
              onChange={handleInputChange}
            >
              <option value="Necessity">Necessity</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          
          <button type="submit" className="submit-btn">Save Expenditure</button>
        </form>
      )}

      {/* This section will eventually display a list of expenditures for the date */}
      <div className="expenditure-list">
        <h2>Expenditures for this date</h2>
        <p>No expenditures added yet.</p>
      </div>
    </div>
  );
};

export default ExpenditurePage;