import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./PurchaseRegister.css";

const PurchaseRegister = () => {
  const [date, setDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [unit, setUnit] = useState("");
  const [coe, setCoe] = useState("");
  const [payno, setPayno] = useState("");
  const [building, setBuilding] = useState("");
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Fetch records based on date filters
  const fetchRecords = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purchase-register", {
        params: { startDate, endDate }
      });
      setRecords(res.data);
    } catch (error) {
      console.error("❌ Error fetching records", error);
      alert("Failed to fetch records.");
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // ✅ Handle adding a new record
  const handleAddRecord = async () => {
    if (!date || !supplier || !description || !quantity || !rate || !unit || !coe || !payno || !building) {
      alert("Please fill all fields before adding the record.");
      return;
    }

    try {
      const newRecord = {
        date,
        supplier,
        description,
        quantity: Number(quantity),
        rate: Number(rate),
        unit,
        amount: Number(quantity) * Number(rate),
        coe,
        payno,
        building
      };

      const res = await axios.post("http://localhost:5000/api/purchase-register/add", newRecord);
      setRecords([res.data, ...records]);

      // Clear form fields
      setDate("");
      setSupplier("");
      setDescription("");
      setQuantity("");
      setRate("");
      setUnit("");
      setCoe("");
      setPayno("");
      setBuilding("");

      alert("Record added successfully!");
    } catch (error) {
      console.error("❌ Error adding record", error);
      alert("Failed to add record.");
    }
  };

  // ✅ Handle deleting a record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/purchase-register/${id}`);
      setRecords(records.filter((record) => record._id !== id));
    } catch (error) {
      console.error("❌ Error deleting record", error);
      alert("Failed to delete record.");
    }
  };

  // ✅ Export Records as CSV
  const handleExportCSV = () => {
    if (records.length === 0) {
      alert("No records available to export.");
      return;
    }

    let csv = "Date,Supplier,Description,Quantity,Rate,Unit,Amount,COE,PAY NO,Building\n";
    records.forEach((record) => {
      csv += `${record.date},${record.supplier},${record.description},${record.quantity},${record.rate},${record.unit},${record.amount},${record.coe},${record.payno},${record.building}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "purchase_register.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="purchase-register-container">
      <h1>Purchase Register</h1>

      {/* Form Section */}
      <h2>Add New Record</h2>
      <div className="form-container">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="text" placeholder="Supplier Name" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
        <input type="text" placeholder="Material Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input type="number" placeholder="Rate" value={rate} onChange={(e) => setRate(e.target.value)} />
        <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
        <input type="text" placeholder="COE" value={coe} onChange={(e) => setCoe(e.target.value)} />
        <input type="text" placeholder="PAY NO" value={payno} onChange={(e) => setPayno(e.target.value)} />
        <input type="text" placeholder="Building" value={building} onChange={(e) => setBuilding(e.target.value)} />
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
      <h2>Purchase Register Data</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Supplier Name</th>
            <th>Material Description</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Unit</th>
            <th>Amount</th>
            <th>COE</th>
            <th>PAY NO</th>
            <th>Building</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.date}</td>
              <td>{record.supplier}</td>
              <td>{record.description}</td>
              <td>{record.quantity}</td>
              <td>{record.rate}</td>
              <td>{record.unit}</td>
              <td>{record.amount}</td>
              <td>{record.coe}</td>
              <td>{record.payno}</td>
              <td>{record.building}</td>
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

export default PurchaseRegister;
