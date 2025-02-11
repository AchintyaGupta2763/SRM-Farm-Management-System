import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./MovementRegister.css";

const MovementRegister = () => {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [place, setPlace] = useState("");
  const [outTime, setOutTime] = useState("");
  const [inTime, setInTime] = useState("");
  const [sign, setSign] = useState("");
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Fetch Records Based on Date Filters
  const fetchRecords = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/movement-register",
        {
          params: { startDate, endDate },
        }
      );
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching records", error);
    }
  }, [startDate, endDate]);

  // ✅ Fetch Data on Component Mount or Filter Change
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // ✅ Handle Adding a New Record
  const handleAddRecord = async () => {
    if (!date || !name || !purpose || !place || !outTime || !inTime || !sign) {
      alert("Please fill all fields before adding the record.");
      return;
    }

    try {
      const newRecord = { date, name, purpose, place, outTime, inTime, sign };

      const res = await axios.post(
        "http://localhost:5000/api/movement-register/add",
        newRecord
      );
      setRecords([res.data, ...records]);

      // ✅ Clear Fields After Adding Record
      setDate("");
      setName("");
      setPurpose("");
      setPlace("");
      setOutTime("");
      setInTime("");
      setSign("");

      alert("Record added successfully!");
    } catch (error) {
      console.error("Error adding record", error);
      alert("Failed to add record. Check console for errors.");
    }
  };

  // ✅ Handle Deleting a Record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/movement-register/${id}`);
      setRecords(records.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Error deleting record", error);
      alert("Failed to delete record.");
    }
  };

  // ✅ Export Records as CSV
  const handleExportCSV = () => {
    if (records.length === 0) {
      alert("No records available to export.");
      return;
    }

    let csv = "Date,Name,Purpose,Place,Out Time,In Time,Sign\n";
    records.forEach((record) => {
      csv += `${record.date},${record.name},${record.purpose},${record.place},${record.outTime},${record.inTime},${record.sign}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "movement_register.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="movement-register-container">
      <h1>Farm Staff Movement Register</h1>

      {/* Add Record Form */}
      <h2>Add New Record</h2>
      <div className="form-container">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Purpose:</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Place of Visit:</label>
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Out Time:</label>
          <input
            type="time"
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>In Time:</label>
          <input
            type="time"
            value={inTime}
            onChange={(e) => setInTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Sign:</label>
          <input
            type="text"
            value={sign}
            onChange={(e) => setSign(e.target.value)}
          />
        </div>

        <button onClick={handleAddRecord}>➕ Add Record</button>
      </div>

      {/* Filter & Export */}
      <h2>Fetch Data</h2>
      <div className="filter-container">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={fetchRecords}>🔍 Fetch Data</button>
        <button onClick={handleExportCSV}>📤 Export CSV</button>
      </div>

      {/* Display Records */}
      <h2>Movement Register Data</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Purpose</th>
            <th>Place</th>
            <th>Out Time</th>
            <th>In Time</th>
            <th>Sign</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.date}</td>
              <td>{record.name}</td>
              <td>{record.purpose}</td>
              <td>{record.place}</td>
              <td>{record.outTime}</td>
              <td>{record.inTime}</td>
              <td>{record.sign}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(record._id)}
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovementRegister;
