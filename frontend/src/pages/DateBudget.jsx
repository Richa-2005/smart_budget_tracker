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
  });
  const [expendituresList, setExpendituresList] = useState([]);
  const [loading, setLoading] = useState(true);

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
        }
      );

      setExpendituresList((prev) => [...prev, response.data.data]);
      setExpenditure({
        price: '',
        description: '',
        need: 'necessity',
      });
      setShowForm(false);
      toast.success('Expense added successfully');
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to add expense');
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

                <div>
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
                        <span
                          className={`expense-tag ${
                            item.need === 'necessity'
                              ? 'tag-necessity'
                              : 'tag-misc'
                          }`}
                        >
                          {item.need}
                        </span>
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