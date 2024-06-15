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

    for (let month = 0; month <= totalMonths; month++) {
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
        date: currentDate.toLocaleString('default', { month: 'short' }) + ' ' + currentDate.getFullYear(),
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
        <h1>समृद्धि साथी कैलक्यूलेटर अनुज पंचोली द्वारा</h1>
        <form onSubmit={calculateInvestment}>
          <div className="input-group">
            <label htmlFor="monthlyInvestment">मासिक निवेश (₹)</label>
            <input 
              id="monthlyInvestment"
              type="number" 
              value={monthlyInvestment} 
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))} 
              required 
            />
            <small className="info">हर महीने कितना निवेश कर सकते हैं, वह दर्ज करें।</small>
          </div>

          <div className="input-group">
            <label htmlFor="annualRate">वार्षिक ब्याज दर (%)</label>
            <input 
              id="annualRate"
              type="number" 
              value={annualRate} 
              onChange={(e) => setAnnualRate(Number(e.target.value))} 
              required 
            />
            <small className="info">आपके निवेश के लिए अपेक्षित वार्षिक ब्याज दर दर्ज करें।</small>
          </div>

          <div className="input-group">
            <label htmlFor="totalMonths">निवेश अवधि (महीने)</label>
            <input 
              id="totalMonths"
              type="number" 
              value={totalMonths} 
              onChange={(e) => setTotalMonths(Number(e.target.value))} 
              required 
            />
            <small className="info">आपकी निवेश अवधि को दर्ज करें (महीनों में)।</small>
          </div>

          <div className="input-group">
            <label htmlFor="reinvestMonths">पुनः निवेश अवधि (महीने)</label>
            <input 
              id="reinvestMonths"
              type="number" 
              value={reinvestMonths} 
              onChange={(e) => setReinvestMonths(Number(e.target.value))} 
              required 
            />
            <small className="info">ब्याज कमाने के लिए कितने महीने पुनः निवेश करने की योजना है, वह दर्ज करें।</small>
          </div>

          <div className="input-group">
            <label htmlFor="startMonth">शुरुआत महीना (मम-वर्ष)</label>
            <input 
              id="startMonth"
              type="text" 
              value={startMonth} 
              onChange={(e) => setStartMonth(e.target.value)} 
              pattern="\d{2}-\d{4}" 
              required 
            />
            <small className="info">उदाहरण: 01-2023 (महीना-वर्ष)</small>
          </div>

          <button type="submit">गणना करें</button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="results">
          <div className="card summary">
            <h2>सारांश</h2>
            <p><strong>कुल निवेश:</strong><br />₹{summary.totalAmount.toFixed(2)}</p>
            <p><strong>ब्याज कमाया (पिछले 2 महीने):</strong><br />₹{summary.interestLastTwoMonths.toFixed(2)}</p>
            <p><strong>कुल राशि:</strong><br />₹{summary.grandTotal.toFixed(2)}</p>
          </div>

          <h2>मासिक विवरण</h2>
          {results.map((row, index) => (
            <div key={index} className="card result-card">
              <h3>{row.date} (महीना {row.month})</h3>
              <p><strong>प्रारंभिक राशि:</strong> ₹{row.principalStart.toFixed(2)}</p>
              <p><strong>ब्याज कमाया:</strong> ₹{row.interest.toFixed(2)}</p>
              <p><strong>निवेश:</strong> ₹{row.investment.toFixed(2)}</p>
              <p><strong>अंतिम राशि:</strong> ₹{row.principalEnd.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
