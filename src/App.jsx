import React, { useState } from 'react';
import './App.css';

function App() {
  // State variables for user inputs and results
  const [monthlyInvestment, setMonthlyInvestment] = useState(24000); // Monthly investment amount
  const [annualRate, setAnnualRate] = useState(24); // Annual interest rate
  const [totalMonths, setTotalMonths] = useState(24); // Total investment duration in months
  const [reinvestMonths, setReinvestMonths] = useState(22); // Duration to reinvest interest
  const [startMonth, setStartMonth] = useState('1/2023'); // Start month of investment
  const [endMonth, setEndMonth] = useState(''); // End month of investment
  const [results, setResults] = useState([]); // Array to store monthly investment results
  const [summary, setSummary] = useState({ totalAmount: 0, principalInvested: 0, totalInterest: 0 }); // Summary of investment details

  // Function to calculate investment details
  const calculateInvestment = (e) => {
    e.preventDefault();
    const newResults = [];
    let principal = 0;
    let totalInterest = 0;
    let principalInvested = 0;
    const monthlyInterestRate = annualRate / 100 / 12; // Monthly interest rate calculation
    const [startMonthNum, startYear] = startMonth.split('/');
    const startDate = new Date(startYear, parseInt(startMonthNum, 10) - 1);

    // Loop through each month of the investment duration
    for (let monthIndex = 1; monthIndex <= totalMonths; monthIndex++) {
      const currentDate = new Date(startDate.getFullYear(), startDate.getMonth() + monthIndex - 1);
      let interestEarned = principal * monthlyInterestRate; // Interest earned in the current month
      const initialPrincipal = principal;

      // Check if the current month is within the reinvestment period
      if (monthIndex <= reinvestMonths) {
        principal += monthlyInvestment + interestEarned; // Add monthly investment and interest earned
      } else {
        principal += monthlyInvestment; // Add only the monthly investment
        interestEarned = 0; // No interest earned beyond reinvestment period
      }

      // Accumulate total interest and principal invested
      totalInterest += interestEarned;
      principalInvested += monthlyInvestment;

      // Store monthly investment details in the results array
      newResults.push({
        month: monthIndex,
        date: `${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear()} (${monthIndex}) महीना का`,
        initialPrincipal,
        interestEarned,
        totalInterest,
        investment: monthlyInvestment,
        finalPrincipal: principal
      });

      // Set the end month when the loop completes
      if (monthIndex === totalMonths) {
        setEndMonth(`${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear()} (${monthIndex}) महीना`);
      }
    }

    // Update state with calculation results
    setResults(newResults);
    setSummary({ totalAmount: principal, principalInvested, totalInterest });
  };

  // Function to format amounts into Indian currency format
  const formatIndianCurrency = (amount) => {
    return amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  return (
    <div className="app">
      <h1>समृद्धि साथी कैलक्यूलेटर</h1>
      <div className="card">
        <form onSubmit={calculateInvestment}>
          {/* Monthly investment input */}
          <div className="input-group">
            <label htmlFor="monthlyInvestment">मासिक निवेश (₹)</label>
            <input
              id="monthlyInvestment"
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              required
            />
            <small className="info">प्रति महीने निवेश की राशि</small>
          </div>

          {/* Annual interest rate input */}
          <div className="input-group">
            <label htmlFor="annualRate">वार्षिक ब्याज दर (%)</label>
            <input
              id="annualRate"
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              required
            />
            <small className="info">सालाना ब्याज दर</small>
          </div>

          {/* Total investment duration input */}
          <div className="input-group">
            <label htmlFor="totalMonths">निवेश अवधि (महीने)</label>
            <input
              id="totalMonths"
              type="number"
              value={totalMonths}
              onChange={(e) => setTotalMonths(Number(e.target.value))}
              required
            />
            <small className="info">निवेश की कितने महीनों तक योजना है</small>
          </div>

          {/* Reinvestment period input */}
          <div className="input-group">
            <label htmlFor="reinvestMonths">ब्याज पुनर्निवेश अवधि (महीने)</label>
            <input
              id="reinvestMonths"
              type="number"
              value={reinvestMonths}
              onChange={(e) => setReinvestMonths(Number(e.target.value))}
              required
              max={totalMonths}
            />
            <small className="info">ब्याज कमाने के लिए निवेश की कितने महीनों तक योजना है</small>
          </div>

          {/* Start month input */}
          <div className="input-group">
            <label htmlFor="startMonth">शुरुआती महीना (म/व)</label>
            <input
              id="startMonth"
              type="text"
              value={startMonth}
              onChange={(e) => setStartMonth(e.target.value)}
              pattern="\d{1,2}/\d{4}"
              required
            />
            <small className="info">उदाहरण: 1/2023 (महीना/वर्ष)</small>
          </div>

          {/* Submit button */}
          <button type="submit">गणना करें</button>
        </form>
      </div>

      {/* Display results if available */}
      {results.length > 0 && (
        <div className="results">
          {/* Summary section */}
          <div className="summary card">
            <h2>सारांश {results?.length + ' महीने का'} </h2>
            <p><strong>अंतिम राशि निवेश की ब्याज सहित:</strong> ₹{formatIndianCurrency(summary.totalAmount)}</p>
            <p><strong>मूलधन:</strong> ₹{formatIndianCurrency(summary.principalInvested)}</p>
            <p><strong>कुल ब्याज:</strong> ₹{formatIndianCurrency(summary.totalInterest)}</p>
            <p><strong>निवेश का अंतिम महीना:</strong> {endMonth}</p>
          </div>

          {/* Monthly details section */}
          <h2>मासिक विवरण</h2>
          {results.map((row, index) => (
            <div key={index} className={`result-card ${index % 2 === 0 ? 'even' : 'odd'}`}>
              <h3>{row.date}</h3>
              <p><strong>पिछले महीने तक की कुल राशि:</strong> <span className="amount">₹{formatIndianCurrency(row.initialPrincipal)}</span></p>
              <p><strong>इस महीने के ब्याज कमाया:</strong> <span className="amount">₹{formatIndianCurrency(row.interestEarned)}</span></p>
              <p><strong>कुल ब्याज कमाया अब तक:</strong> <span className="amount">₹{formatIndianCurrency(row.totalInterest)}</span></p>
              <p><strong>हर महीने निवेश:</strong> <span className="amount">₹{formatIndianCurrency(row.investment)}</span></p>
              <p><strong>अंतिम कुल राशि इस महीने तक की:</strong> <span className="amount">₹{formatIndianCurrency(row.finalPrincipal)}</span></p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default App;
