import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Programme.css";

const Programme = () => {
  const [date, setDate] = useState("");
  const [fieldNumber, setFieldNumber] = useState("");
  const [area, setArea] = useState("");
  const [crop, setCrop] = useState("");
  const [operations, setOperations] = useState("");
  const [trDrM, setTrDrM] = useState("");
  const [amM, setAmM] = useState("");
  const [amW, setAmW] = useState("");
  const [hM, setHM] = useState("");
  const [hW, setHW] = useState("");
  const [drclrM, setDrclrM] = useState("");
  const [drclrW, setDrclrW] = useState("");

  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch records based on date filters
  const fetchRecords = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/programme", {
        params: { startDate, endDate }
      });
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching records", error);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleAddRecord = async () => {
    if (!date || !fieldNumber || !area || !crop || !operations || 
        !trDrM || !amM || !amW || !hM || !hW || !drclrM || !drclrW) {
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
        trDrM: Number(trDrM),
        amM: Number(amM),
        amW: Number(amW),
        hM: Number(hM),
        hW: Number(hW),
        drclrM: Number(drclrM),
        drclrW: Number(drclrW)
      };

      const res = await axios.post("http://localhost:5000/api/programme/add", newRecord);
      setRecords([res.data, ...records]);

      // Clear form fields
      setDate("");
      setFieldNumber("");
      setArea("");
      setCrop("");
      setOperations("");
      setTrDrM("");
      setAmM("");
      setAmW("");
      setHM("");
      setHW("");
      setDrclrM("");
      setDrclrW("");

      alert("Record added successfully!");
    } catch (error) {
      console.error("Error adding record", error);
      alert("Failed to add record. Check console for errors.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/programme/${id}`);
      setRecords(records.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Error deleting record", error);
      alert("Failed to delete record.");
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) {
      alert("No records available to export.");
      return;
    }

    let csv = "Date,Field Number,Area,Crop,Operations,Tr. Dr. M,AM M,AM W,H M,H W,DRCLR M,DRCLR W\n";
    records.forEach((record) => {
      csv += `${record.date},${record.fieldNumber},${record.area},${record.crop},${record.operations},${record.trDrM},${record.amM},${record.amW},${record.hM},${record.hW},${record.drclrM},${record.drclrW}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "programme_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="programme-container">
      
      <h3>Programme and Allocation</h3>

      {/* Form Section */}
      <h2>Add New Record</h2>
      <div className="form-container">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="text" placeholder="Field Number" value={fieldNumber} onChange={(e) => setFieldNumber(e.target.value)} />
        <input type="text" placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)} />
        <input type="text" placeholder="Crop" value={crop} onChange={(e) => setCrop(e.target.value)} />
        <input type="text" placeholder="Operations" value={operations} onChange={(e) => setOperations(e.target.value)} />
        <input type="number" placeholder="Tr. Dr. M @ Rs." value={trDrM} onChange={(e) => setTrDrM(e.target.value)} />
        <input type="number" placeholder="AM M @ Rs." value={amM} onChange={(e) => setAmM(e.target.value)} />
        <input type="number" placeholder="AM W @ Rs." value={amW} onChange={(e) => setAmW(e.target.value)} />
        <input type="number" placeholder="H M @ Rs." value={hM} onChange={(e) => setHM(e.target.value)} />
        <input type="number" placeholder="H W @ Rs." value={hW} onChange={(e) => setHW(e.target.value)} />
        <input type="number" placeholder="DRCLR M @ Rs." value={drclrM} onChange={(e) => setDrclrM(e.target.value)} />
        <input type="number" placeholder="DRCLR W @ Rs." value={drclrW} onChange={(e) => setDrclrW(e.target.value)} />
        <button onClick={handleAddRecord}>➕ Add Record</button>
      </div>

      {/* Filter Section */}
      <h2>Fetch Data</h2>
      <div className="filter-container">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={fetchRecords}>🔍 Fetch Data</button>
        <button onClick={handleExportCSV}>📤 Export CSV</button>
      </div>

      {/* Table Section */}
      <h2>Programme Data</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Field Number</th>
            <th>Area</th>
            <th>Crop</th>
            <th>Operations</th>
            <th>Tr. Dr. M</th>
            <th>AM M</th>
            <th>AM W</th>
            <th>H M</th>
            <th>H W</th>
            <th>DRCLR M</th>
            <th>DRCLR W</th>
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
              <td>{record.trDrM}</td>
              <td>{record.amM}</td>
              <td>{record.amW}</td>
              <td>{record.hM}</td>
              <td>{record.hW}</td>
              <td>{record.drclrM}</td>
              <td>{record.drclrW}</td>
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

export default Programme;