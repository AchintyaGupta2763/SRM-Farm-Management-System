import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./FarmProduces.css";

const FarmProduces = () => {
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [receiptQty, setReceiptQty] = useState("");
  const [receiptRs, setReceiptRs] = useState("");
  const [issueQty, setIssueQty] = useState("");
  const [issueRate, setIssueRate] = useState("");
  const [pageNo, setPageNo] = useState("");

  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Fetch records based on date filters (sorted in descending order)
  const fetchRecords = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/farm-produces", { 
        params: { startDate, endDate } 
      });
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching records", error);
    }
  }, [startDate, endDate]);

  // ✅ Fetch records when filters change
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // ✅ Fix: Convert number fields before sending
  const handleAddRecord = async () => {
    if (!date || !details || !receiptQty || !receiptRs || !issueQty || !issueRate || !pageNo) {
      alert("Please fill all fields before adding the record.");
      return;
    }

    try {
      const newRecord = {
        date,
        details,
        receiptQty: Number(receiptQty),
        receiptRs: Number(receiptRs),
        issueQty: Number(issueQty),
        issueRate: Number(issueRate),
        pageNo,
      };

      const res = await axios.post("http://localhost:5000/api/farm-produces/add", newRecord);
      setRecords([res.data, ...records]); // Add new record at the top (descending order)

      // Clear the input fields after adding the record
      setDate(""); setDetails(""); setReceiptQty(""); setReceiptRs("");
      setIssueQty(""); setIssueRate(""); setPageNo("");

      alert("Record added successfully!");
    } catch (error) {
      console.error("Error adding record", error);
      alert("Failed to add record. Check console for errors.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/farm-produces/${id}`);
      setRecords(records.filter(record => record._id !== id));
    } catch (error) {
      console.error("Error deleting record", error);
    }
  };

  // ✅ Export Records as CSV
  const handleExportCSV = () => {
    if (records.length === 0) {
      alert("No records available to export.");
      return;
    }

    let csv = "Date,Details,Receipt Qty,Receipt Rs.,Issue Qty,Issue Rate,Page No.\n";
    records.forEach((record) => {
      csv += `${record.date},${record.details},${record.receiptQty},${record.receiptRs},${record.issueQty},${record.issueRate},${record.pageNo}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "farm_produces_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="farm-container">
      <h1>Farm Produce Records</h1>

      {/* Form Section */}
      <h2>Add New Record</h2>
      <div className="form-container">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="text" placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} />
        <input type="number" placeholder="Receipt Qty" value={receiptQty} onChange={(e) => setReceiptQty(e.target.value)} />
        <input type="number" placeholder="Receipt Rs." value={receiptRs} onChange={(e) => setReceiptRs(e.target.value)} />
        <input type="number" placeholder="Issue Qty" value={issueQty} onChange={(e) => setIssueQty(e.target.value)} />
        <input type="number" placeholder="Issue Rate" value={issueRate} onChange={(e) => setIssueRate(e.target.value)} />
        <input type="text" placeholder="Page No." value={pageNo} onChange={(e) => setPageNo(e.target.value)} />
        <button onClick={handleAddRecord}>➕ Add Record</button>
      </div>


      {/* Filter Section */}
      <h2>Fetch Data</h2>
      <div className="filter-container">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={fetchRecords}>Fetch Data</button>
        <button onClick={handleExportCSV}>📤 Export CSV</button>
      </div>

      {/* Table Section */}
      <h2>Farm Produce Data</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Details</th>
            <th>Receipt Qty</th>
            <th>Receipt Rs.</th>
            <th>Issue Qty</th>
            <th>Issue Rate</th>
            <th>Page No.</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.date}</td>
              <td>{record.details}</td>
              <td>{record.receiptQty}</td>
              <td>{record.receiptRs}</td>
              <td>{record.issueQty}</td>
              <td>{record.issueRate}</td>
              <td>{record.pageNo}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(record._id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FarmProduces;
