import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Forecast.css";

const Forecast = () => {
  const [date, setDate] = useState("");
  const [fieldNumber, setFieldNumber] = useState("");
  const [area, setArea] = useState("");
  const [crop, setCrop] = useState("");
  const [operations, setOperations] = useState("");
  const [men, setMen] = useState("");
  const [women, setWomen] = useState("");
  const [total, setTotal] = useState("");
  const [forecaster, setForecaster] = useState("");

  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Fetch records based on date filters (sorted in descending order)
  const fetchRecords = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/forecast", { 
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

  // ✅ Handle adding a new record
  const handleAddRecord = async () => {
    if (!date || !fieldNumber || !area || !crop || !operations || !men || !women || !forecaster) {
      alert("Please fill all fields before adding the record.");
      return;
    }
    try {
        const newRecord = {
            date,
            fieldNumber,
            area,
            crop,
            operations,
            men: Number(men),
            women: Number(women),
            total: Number(men) + Number(women),
            forecaster,
        };
        const res = await axios.post("http://localhost:5000/api/forecast/add", newRecord);
        setRecords([res.data, ...records]); // Add new record at the top (descending order)

        // Clear the input fields after adding the record
        setDate("");setFieldNumber("");setArea("");setCrop("");setOperations("");setMen("");setWomen("");setTotal("");setForecaster("");

        alert("Record added successfully!");
    } catch (error) {
        console.error("Error adding record", error);
        alert("Failed to add record. Check console for errors.");
    }
  };      

  // ✅ Handle deleting a record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/forecast/${id}`);
      setRecords(records.filter((record) => record._id !== id));
    } catch (error) {
      console.error("❌ Error deleting record:", error);
      alert("Failed to delete record.");
    }
  };

  // ✅ Export Records as CSV
  const handleExportCSV = () => {
    if (records.length === 0) {
      alert("No records available to export.");
      return;
    }

    let csv = "Date,Field Number,Area,Crop,Operations,Men,Women,Total,Forecaster\n";
    records.forEach((record) => {
      csv += `${record.date},${record.fieldNumber},${record.area},${record.crop},${record.operations},${record.men},${record.women},${record.total},${record.forecaster}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "forecast_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="forecast-container">
      <h1>Forecast & Allocation</h1>

      {/* ✅ Form Section */}
      <h2>Add New Record</h2>
      <div className="form-container">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="text" placeholder="Field Number" value={fieldNumber} onChange={(e) => setFieldNumber(e.target.value)} />
        <input type="text" placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)} />
        <input type="text" placeholder="Crop" value={crop} onChange={(e) => setCrop(e.target.value)} />
        <input type="text" placeholder="Operations" value={operations} onChange={(e) => setOperations(e.target.value)} />
        <input type="number" placeholder="Men" value={men} onChange={(e) => setMen(e.target.value)} />
        <input type="number" placeholder="Women" value={women} onChange={(e) => setWomen(e.target.value)} />
        <input type="text" placeholder="Forecaster" value={forecaster} onChange={(e) => setForecaster(e.target.value)} />
        <button onClick={handleAddRecord}>➕ Add Record</button>
      </div>

      {/* ✅ Filter Section */}
      <h2>Fetch Data</h2>
      <div className="filter-container">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={fetchRecords}>🔍 Fetch Data</button>
        <button onClick={handleExportCSV}>📤 Export CSV</button>
      </div>

      {/* ✅ Table Section */}
      <h2>Forecast Data</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Field Number</th>
            <th>Area</th>
            <th>Crop</th>
            <th>Operations</th>
            <th>Men</th>
            <th>Women</th>
            <th>Total</th>
            <th>Forecaster</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.date}</td>
              <td>{record.fieldNumber}</td>
              <td>{record.area}</td>
              <td>{record.crop}</td>
              <td>{record.operations}</td>
              <td>{record.men}</td>
              <td>{record.women}</td>
              <td>{record.total}</td>
              <td>{record.forecaster}</td>
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

export default Forecast;
