import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StockRegister.css";

const StockRegister = () => {
  const [department, setDepartment] = useState("");
  const [folioNo, setFolioNo] = useState("");
  const [article, setArticle] = useState("");
  const [unit, setUnit] = useState("");
  const [stockEntries, setStockEntries] = useState([]);

  const [filterDepartment, setFilterDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);

  // ✅ Fetch Stock Register Data
  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/stock-register`, {
        params: { department: filterDepartment, startDate, endDate }
      });
      setRecords(res.data);
    } catch (error) {
      console.error("❌ Error fetching records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ✅ Add New Stock Entry
  const addStockEntry = () => {
    setStockEntries([
      ...stockEntries,
      { date: "", reference: "", receipts: "", issues: "", balance: "", initials: "" }
    ]);
  };

  // ✅ Handle Input Change in Table
  const handleStockChange = (index, field, value) => {
    const updatedEntries = [...stockEntries];
    updatedEntries[index][field] = value;

    // ✅ Automatically Calculate Balance
    if (field === "receipts" || field === "issues") {
      const receipts = parseInt(updatedEntries[index].receipts) || 0;
      const issues = parseInt(updatedEntries[index].issues) || 0;
      updatedEntries[index].balance = receipts - issues;
    }

    setStockEntries(updatedEntries);
  };

  // ✅ Delete a Stock Row
  const deleteStockEntry = (index) => {
    setStockEntries(stockEntries.filter((_, i) => i !== index));
  };

  // ✅ Submit Stock Register Data
  const submitStockRegister = async () => {
    if (!department || !folioNo || !article || !unit || stockEntries.length === 0) {
      alert("All fields must be filled out before submitting.");
      return;
    }

    try {
      const newStockData = { department, folioNo, article, unit, stockEntries };
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/stock-register/add`, newStockData);
      setRecords([res.data, ...records]);
      
      // ✅ Clear Form After Submission
      setDepartment("");
      setFolioNo("");
      setArticle("");
      setUnit("");
      setStockEntries([]);
      alert("Stock register entry added successfully!");
    } catch (error) {
      console.error("❌ Error submitting stock register:", error);
      alert("Failed to submit stock register.");
    }
  };

  // ✅ Export Data to CSV
  const exportToCSV = () => {
    let csv = "Department,Folio No,Article,Unit,Date,Reference,Receipts,Issues,Balance,Initials\n";
    records.forEach((record) => {
      record.stockEntries.forEach((entry) => {
        csv += `${record.department},${record.folioNo},${record.article},${record.unit},${entry.date},${entry.reference},${entry.receipts},${entry.issues},${entry.balance},${entry.initials}\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "stock_register.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="stock-container">
      <h1>Stock Register</h1>

      {/* Form Section */}
      <div className="form-container">
        <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <input type="text" placeholder="Folio No" value={folioNo} onChange={(e) => setFolioNo(e.target.value)} />
        <input type="text" placeholder="Article" value={article} onChange={(e) => setArticle(e.target.value)} />
        <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Receipts</th>
              <th>Issues</th>
              <th>Balance</th>
              <th>Initials</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockEntries.map((entry, index) => (
              <tr key={index}>
                <td>
                  <input 
                    type="date" 
                    value={entry.date} 
                    onChange={(e) => handleStockChange(index, "date", e.target.value)} 
                  />
                </td>
                {Object.keys(entry).map((field) => {
                  if (field !== "date") {
                    return (
                      <td key={field}>
                        <input 
                          type="text" 
                          value={entry[field]} 
                          onChange={(e) => handleStockChange(index, field, e.target.value)} 
                        />
                      </td>
                    );
                  }
                  return null;
                })}
                <td><button onClick={() => deleteStockEntry(index)}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={addStockEntry}>➕ Add Row</button>
      <button onClick={submitStockRegister}>✔ Submit</button>
      <button onClick={exportToCSV}>📤 Export CSV</button>

      {/* Filter Section */}
      <h2>Filter Records</h2>
      <div className="filter-container">
        <input type="text" placeholder="Department" value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={fetchRecords}>🔍 Fetch Data</button>
      </div>

      {/* Display Records */}
      <h2>Stock Records</h2>
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Folio No</th>
            <th>Article</th>
            <th>Unit</th>
            <th>Date</th>
            <th>Reference</th>
            <th>Receipts</th>
            <th>Issues</th>
            <th>Balance</th>
            <th>Initials</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) =>
            record.stockEntries.map((entry, index) => (
              <tr key={`${record._id}-${index}`}>
                <td>{record.department}</td>
                <td>{record.folioNo}</td>
                <td>{record.article}</td>
                <td>{record.unit}</td>
                <td>{entry.date}</td>
                <td>{entry.reference}</td>
                <td>{entry.receipts}</td>
                <td>{entry.issues}</td>
                <td>{entry.balance}</td>
                <td>{entry.initials}</td>
                <td>
                  <button onClick={() => deleteStockEntry(index)}>🗑</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockRegister;