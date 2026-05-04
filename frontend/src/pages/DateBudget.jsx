import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../api/axiosClient";
import { toast } from 'react-toastify';
import { getToken } from '../utils/auth';
import '../styles/dateBudget.css';

export default function DateBudget() {
  const { date } = useParams();
  const token = getToken();

  const [showForm, setShowForm] = useState(false);
  const [expenditure, setExpenditure] = useState({
    price: '',
    description: '',
    need: 'necessity',
    category: 'Uncategorized',
    mlPredicted: false,
    categoryConfidence: 0,
    needConfidence: 0,
    keywords: [],
    mlFailed: false
  });
  const [expendituresList, setExpendituresList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = '/';
    }
  }, [token]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExpenditure((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchExpenditures = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/budget/${date}`
      );
      setExpendituresList(response.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setExpendituresList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchExpenditures();
    }
  }, [date, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `/budget/post/${date}`,
        {
          price: Number(expenditure.price),
          description: expenditure.description,
          need: expenditure.need,
          category: expenditure.category,
          mlPredicted: expenditure.mlPredicted,
          categoryConfidence: expenditure.categoryConfidence,
          needConfidence: expenditure.needConfidence
        }
      );

      setExpendituresList((prev) => [...prev, response.data.data]);
      setExpenditure({
        price: '',
        description: '',
        need: 'necessity',
        category: 'Uncategorized',
        mlPredicted: false,
        categoryConfidence: 0,
        needConfidence: 0,
        keywords: [],
        mlFailed: false
      });
      setShowForm(false);
      toast.success('Expense added successfully');
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handlePredict = async () => {
    if (!expenditure.description || !expenditure.price) {
      toast.error('Please enter description and amount first to predict');
      return;
    }

    try {
      setIsPredicting(true);
      const response = await axios.post('/budget/predict', {
        description: expenditure.description,
        price: Number(expenditure.price)
      });
      
      setExpenditure(prev => ({
        ...prev,
        category: response.data.category,
        need: response.data.need,
        mlPredicted: !response.data.mlFailed,
        categoryConfidence: response.data.categoryConfidence,
        needConfidence: response.data.needConfidence,
        keywords: response.data.keywords || [],
        mlFailed: response.data.mlFailed || false
      }));
      
      if (response.data.mlFailed) {
        toast.error('AI unavailable — please fill manually');
      } else {
        toast.success('AI Prediction applied!');
      }
    } catch (err) {
      console.error(err);
      toast.error('AI Prediction failed, you can still save manually.');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleDelete = async (expenditureId) => {
    try {
      await axios.delete('/budget/delete', {
        data: { _id: expenditureId }
      });

      setExpendituresList((prev) =>
        prev.filter((item) => item._id !== expenditureId)
      );
      toast.success('Expense deleted');
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const totalForDay = expendituresList.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  return (
    <div className="app-page">
      <div className="date-budget-page">
        <div className="date-budget-top soft-card">
          <div>
            <div className="date-budget-badge">Daily Expense View</div>
            <h1 className="date-budget-title">{date}</h1>
            <p className="date-budget-subtitle">
              Add, review, and manage all spending recorded for this day.
            </p>
          </div>

          <div className="date-budget-total-card">
            <span className="date-budget-total-label">Total spent</span>
            <span className="date-budget-total-value">₹{totalForDay}</span>
          </div>
        </div>

        <div className="date-budget-grid">
          <div className="date-budget-form-panel soft-card">
            <div className="panel-head">
              <div>
                <h2>Add Expense</h2>
                <p>Keep your daily entries updated for accurate insights.</p>
              </div>
              <button
                className={showForm ? 'secondary-btn' : 'primary-btn'}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Close Form' : 'New Expense'}
              </button>
            </div>

            {showForm ? (
              <form className="date-budget-form" onSubmit={handleSubmit}>
                <div>
                  <label className="label-text">Amount</label>
                  <input
                    className="input-field"
                    type="number"
                    name="price"
                    placeholder="Enter amount"
                    value={expenditure.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'end', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="label-text">Description</label>
                    <input
                      className="input-field"
                      type="text"
                      name="description"
                      placeholder="Enter description"
                      value={expenditure.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button type="button" className="secondary-btn" onClick={handlePredict} disabled={isPredicting}>
                    {isPredicting ? 'Predicting...' : 'Predict with AI'}
                  </button>
                </div>

                {expenditure.mlPredicted && !expenditure.mlFailed && (
                  <div style={{ padding: '12px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                      AI Prediction
                    </p>
                    
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#334155' }}>
                        <strong>Category:</strong> {expenditure.category} ({Math.round(expenditure.categoryConfidence * 100)}% confidence)
                      </span>
                      <span style={{ fontSize: '13px', color: '#334155' }}>
                        <strong>Type:</strong> {expenditure.need} ({Math.round(expenditure.needConfidence * 100)}% confidence)
                      </span>
                    </div>

                    {(expenditure.categoryConfidence < 0.6 || expenditure.needConfidence < 0.6) && (
                      <div style={{ padding: '6px 10px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #fecaca', display: 'inline-block', marginBottom: '8px' }}>
                        Low confidence – please verify
                      </div>
                    )}

                    {expenditure.keywords?.length > 0 && (
                      <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                        Based on: {expenditure.keywords.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="label-text">Category</label>
                  <input
                    className="input-field"
                    type="text"
                    name="category"
                    placeholder="E.g., Food, Transport..."
                    value={expenditure.category}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="label-text">Type</label>
                  <select
                    className="select-field"
                    name="need"
                    value={expenditure.need}
                    onChange={handleInputChange}
                  >
                    <option value="necessity">Necessity</option>
                    <option value="miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <button className="primary-btn" type="submit">
                  Save Expense
                </button>
              </form>
            ) : (
              <div className="empty-form-state">
                Open the form to add a new expense entry for this date.
              </div>
            )}
          </div>

          <div className="date-budget-list-panel soft-card">
            <div className="panel-head">
              <div>
                <h2>Expenses</h2>
                <p>Your recorded transactions for this selected date.</p>
              </div>
            </div>

            {loading ? (
              <p className="list-message">Loading expenses...</p>
            ) : expendituresList.length === 0 ? (
              <p className="list-message">No expenses added yet for this date.</p>
            ) : (
              <div className="expense-list">
                {expendituresList.map((item) => (
                  <div key={item._id} className="expense-item-card">
                    <div className="expense-main">
                      <div className="expense-price">₹{item.price}</div>
                      <div className="expense-details">
                        <h3>{item.description}</h3>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                          <span
                            className={`expense-tag ${
                              item.need === 'necessity'
                                ? 'tag-necessity'
                                : 'tag-misc'
                            }`}
                          >
                            {item.need}
                          </span>
                          <span className="expense-tag" style={{ background: '#e2e8f0', color: '#475569' }}>
                            {item.category || 'Uncategorized'}
                          </span>
                          {item.mlPredicted && (
                            <span className="expense-tag" style={{ background: '#fef08a', color: '#854d0e' }}>
                              ML Predicted
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      className="delete-expense-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}