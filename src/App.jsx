import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(24000);
  const [annualRate, setAnnualRate] = useState(24);
  const [totalMonths, setTotalMonths] = useState(24);
  const [reinvestMonths, setReinvestMonths] = useState(24);
  const [startMonth, setStartMonth] = useState('6/2022');
  const [penalty, setPenalty] = useState(1000); // Penalty amount
  const [endMonth, setEndMonth] = useState('');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, principalInvested: 0, totalInterest: 0, penalty: 0 });

  useEffect(() => {
    calculateInvestment();
  }, []);

  const calculateInvestment = (e) => {
    if (e) e.preventDefault();
    const newResults = [];
    let principal = 0;
    let totalInterest = 0;
    let principalInvested = 0;
    const monthlyInterestRate = annualRate / 100 / 12;
    const [startMonthNum, startYear] = startMonth.split('/');
    const startDate = new Date(startYear, parseInt(startMonthNum, 10) - 1);

    for (let monthIndex = 1; monthIndex <= totalMonths; monthIndex++) {
      const currentDate = new Date(startDate.getFullYear(), startDate.getMonth() + monthIndex - 1);
      let interestEarned = principal * monthlyInterestRate;
      const initialPrincipal = principal;

      if (monthIndex <= reinvestMonths) {
        principal += monthlyInvestment + interestEarned;
      } else {
        principal += monthlyInvestment;
        interestEarned = 0;
      }

      totalInterest += interestEarned;
      principalInvested += monthlyInvestment;

      newResults.push({
        month: monthIndex,
        date: `${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear()} (${monthIndex}) महीना का`,
        initialPrincipal,
        interestEarned,
        totalInterest,
        investment: monthlyInvestment,
        finalPrincipal: principal
      });

      if (monthIndex === totalMonths) {
        setEndMonth(`${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear()} (${monthIndex}) महीना`);
      }
    }

    setResults(newResults);
    setSummary({ totalAmount: principal, principalInvested, totalInterest, penalty });
  };

  const formatIndianCurrency = (amount) => {
    return amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const amountPerPerson = (summary.totalAmount + summary.penalty) / 48;

  return (
    <div className="app">
      <h1>समृद्धि साथी कैलक्यूलेटर</h1>
      <div className="card">
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
            <small className="info">प्रति महीने निवेश की राशि</small>
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
            <small className="info">सालाना ब्याज दर</small>
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
            <small className="info">निवेश की कितने महीनों तक योजना है</small>
          </div>

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

          <div className="input-group">
            <label htmlFor="penalty">Penalty (₹)</label>
            <input
              id="penalty"
              type="number"
              value={penalty}
              onChange={(e) => setPenalty(Number(e.target.value))}
              required
            />
            <small className="info">Penalty amount in case of default</small>
          </div>

          <button type="submit">गणना करें</button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="results">
          <div className="summary card">
            <h2>सारांश {results.length + ' महीने का'} </h2>
            <p><strong>मूलधन:</strong> <span className="number">₹{formatIndianCurrency(summary.principalInvested)}</span></p>
            <p><strong>कुल ब्याज:</strong> <span className="number">₹{formatIndianCurrency(summary.totalInterest)}</span></p>
            <p><strong>पेनल्टी:</strong> <span className="number">₹{formatIndianCurrency(summary.penalty)}</span></p>
            <p><strong>निवेश का अंतिम महीना:</strong> <span className="number">{endMonth}</span></p>
            <p><strong>अंतिम राशि निवेश की ब्याज सहित:</strong> <span className="number">₹{formatIndianCurrency(summary.totalAmount)}</span> + <span className="number">₹{formatIndianCurrency(summary.penalty)}</span> Penalty = <span className="number">₹{formatIndianCurrency(summary.totalAmount + summary.penalty)}</span></p>
            <p><strong>प्रति व्यक्ति राशि (48 लोगों में बंटवारा):</strong> <span className="number">₹{formatIndianCurrency(amountPerPerson)}</span></p>
          </div>

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
