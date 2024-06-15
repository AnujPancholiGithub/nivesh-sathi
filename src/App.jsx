import React, { useState } from 'react';
import './App.css';

function App() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(24000);
  const [annualRate, setAnnualRate] = useState(24);
  const [totalMonths, setTotalMonths] = useState(24);
  const [reinvestMonths, setReinvestMonths] = useState(22);
  const [startMonth, setStartMonth] = useState('01-2023');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, interestLastTwoMonths: 0, grandTotal: 0 });

  const calculateInvestment = (e) => {
    e.preventDefault();
    const newResults = [];
    let principal = 0;
    const monthlyRate = annualRate / 100 / 12;
    const [month, year] = startMonth.split('-');
    const startDate = new Date(year, month - 1);

    for (let month = 1; month <= totalMonths; month++) {
      const currentDate = new Date(startDate.getFullYear(), startDate.getMonth() + month - 1);
      const interest = principal * monthlyRate;
      const principalStart = principal;

      if (month <= reinvestMonths) {
        principal += monthlyInvestment + interest;
      } else {
        principal += monthlyInvestment;
      }

      newResults.push({
        month,
        date: currentDate.toLocaleString('default', { month: 'short' }) + '-' + currentDate.getFullYear(),
        principalStart,
        interest,
        investment: monthlyInvestment,
        principalEnd: principal
      });
    }

    setResults(newResults);

    const totalAmount = principal;
    const interestLastTwoMonths = principal * monthlyRate * 2;
    const grandTotal = totalAmount + interestLastTwoMonths;

    setSummary({ totalAmount, interestLastTwoMonths, grandTotal });
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Nivesh Sathi Calculato By Anuj Pancholi</h1>
        <form onSubmit={calculateInvestment}>
          <div className="input-group">
            <label htmlFor="monthlyInvestment">Monthly Investment (₹)</label>
            <input 
              id="monthlyInvestment"
              type="number" 
              value={monthlyInvestment} 
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))} 
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="annualRate">Annual Interest Rate (%)</label>
            <input 
              id="annualRate"
              type="number" 
              value={annualRate} 
              onChange={(e) => setAnnualRate(Number(e.target.value))} 
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="totalMonths">Total Months</label>
            <input 
              id="totalMonths"
              type="number" 
              value={totalMonths} 
              onChange={(e) => setTotalMonths(Number(e.target.value))} 
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="reinvestMonths">Reinvest Months</label>
            <input 
              id="reinvestMonths"
              type="number" 
              value={reinvestMonths} 
              onChange={(e) => setReinvestMonths(Number(e.target.value))} 
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="startMonth">Start Month (MM-YYYY)</label>
            <input 
              id="startMonth"
              type="text" 
              value={startMonth} 
              onChange={(e) => setStartMonth(e.target.value)} 
              pattern="\d{2}-\d{4}" 
              required 
            />
          </div>

          <button type="submit">Calculate</button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="results">
          <div className="card summary">
            <h2>Summary</h2>
            <p><strong>Total Investment:</strong><br />₹{summary.totalAmount.toFixed(2)}</p>
            <p><strong>Interest (last 2 months):</strong><br />₹{summary.interestLastTwoMonths.toFixed(2)}</p>
            <p><strong>Grand Total:</strong><br />₹{summary.grandTotal.toFixed(2)}</p>
          </div>

          <h2>Monthly Breakdown</h2>
          {results.map((row, index) => (
            <div key={index} className="card result-card">
              <h3>{row.date} (Month {row.month})</h3>
              <p><strong>Principal Start:</strong> ₹{row.principalStart.toFixed(2)}</p>
              <p><strong>Interest:</strong> ₹{row.interest.toFixed(2)}</p>
              <p><strong>Investment:</strong> ₹{row.investment.toFixed(2)}</p>
              <p><strong>Principal End:</strong> ₹{row.principalEnd.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;