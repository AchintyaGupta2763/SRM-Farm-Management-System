import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FarmToolsMovement.css";

const FarmToolsMovement = () => {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [toolName, setToolName] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [sign, setSign] = useState("");

  // ✅ Filter states
  const [filterStudentName, setFilterStudentName] = useState("");
  const [filterToolName, setFilterToolName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterReturnDate, setFilterReturnDate] = useState("");
  const [filteredEntries, setFilteredEntries] = useState([]);

  // ✅ Fetch existing data from backend on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  // ✅ Fetch all entries
  const fetchEntries = async () => {
    try {
      console.log("📥 Fetching farm tools movement records...");
      const res = await axios.get("http://localhost:5000/api/farm-tools");
      console.log("✅ Records received:", res.data);
      setEntries(res.data);
      setFilteredEntries(res.data); // Initialize filtered entries with all entries
    } catch (error) {
      console.error("❌ Error fetching records:", error);
    }
  };

  // ✅ Add new entry
  const handleAddEntry = async () => {
    if (!date || !studentName || !toolName || !returnDate || !returnTime || !sign) {
      alert("Please fill all fields before adding an entry.");
      return;
    }

    const newEntry = { date, studentName, toolName, returnDate, returnTime, sign };

    try {
      console.log("📤 Sending new entry:", newEntry);
      const res = await axios.post("http://localhost:5000/api/farm-tools/add", newEntry);
      console.log("✅ Entry added successfully:", res.data);
      setEntries([...entries, res.data]);
      setFilteredEntries([...filteredEntries, res.data]); // Add new entry to filtered list

      // Clear input fields
      setDate("");
      setStudentName("");
      setToolName("");
      setReturnDate("");
      setReturnTime("");
      setSign("");

      alert("✅ Entry added successfully!");
    } catch (error) {
      console.error("❌ Error adding entry:", error);
      alert("Failed to add entry.");
    }
  };

  // ✅ Delete entry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      console.log(`🗑 Deleting entry ID: ${id}`);
      await axios.delete(`http://localhost:5000/api/farm-tools/${id}`);
      setEntries(entries.filter((entry) => entry._id !== id));
      setFilteredEntries(filteredEntries.filter((entry) => entry._id !== id)); // Remove from filtered list
      alert("✅ Entry deleted successfully.");
    } catch (error) {
      console.error("❌ Error deleting entry:", error);
      alert("Failed to delete entry.");
    }
  };

  // ✅ Export data to CSV
  const handleExportCSV = () => {
    if (filteredEntries.length === 0) {
      alert("No records available to export.");
      return;
    }

    let csv = "Date,Student Name,Tool Name,Return Date,Return Time,Sign\n";
    filteredEntries.forEach((entry) => {
      csv += `${entry.date},${entry.studentName},${entry.toolName},${entry.returnDate},${entry.returnTime},${entry.sign}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "farm_tools_movement.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Apply filters
  const applyFilters = () => {
    let filtered = entries;

    if (filterStudentName) {
      filtered = filtered.filter((entry) =>
        entry.studentName.toLowerCase().includes(filterStudentName.toLowerCase())
      );
    }

    if (filterToolName) {
      filtered = filtered.filter((entry) =>
        entry.toolName.toLowerCase().includes(filterToolName.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter((entry) => entry.date === filterDate);
    }

    if (filterReturnDate) {
      filtered = filtered.filter((entry) => entry.returnDate === filterReturnDate);
    }

    setFilteredEntries(filtered);
  };

  // ✅ Reset filters
  const resetFilters = () => {
    setFilterStudentName("");
    setFilterToolName("");
    setFilterDate("");
    setFilterReturnDate("");
    setFilteredEntries(entries); // Reset to show all entries
  };

  return (
    <div className="farm-tools-container">
      <h1>Farm Tools Movement Register</h1>

      {/* ✅ Form Section */}
      <div className="form-container">
        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Tool Name:</label>
          <input type="text" value={toolName} onChange={(e) => setToolName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Return Date:</label>
          <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Return Time:</label>
          <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Sign:</label>
          <input type="text" value={sign} onChange={(e) => setSign(e.target.value)} />
        </div>

        <button onClick={handleAddEntry}>➕ Add Entry</button>
      </div>

      {/* ✅ Filter Section */}
      <h2>Filter Entries</h2>
      <div className="filter-container">
        <div className="filter-group">
          <label>Name:</label>
          <input
            type="text"
            value={filterStudentName}
            onChange={(e) => setFilterStudentName(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Tool Name:</label>
          <input
            type="text"
            value={filterToolName}
            onChange={(e) => setFilterToolName(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Return Date:</label>
          <input
            type="date"
            value={filterReturnDate}
            onChange={(e) => setFilterReturnDate(e.target.value)}
          />
        </div>

        <button onClick={applyFilters}>🔍 Apply Filters</button>
        <button onClick={resetFilters}>🔄 Reset Filters</button>
      </div>

      {/* ✅ Table to Display Entries */}
      <h2>Registered Entries</h2>
      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Date</th>
            <th>Name</th>
            <th>Tool Name</th>
            <th>Return Date</th>
            <th>Return Time</th>
            <th>Sign</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map((entry, index) => (
            <tr key={entry._id}>
              <td>{index + 1}</td>
              <td>{entry.date}</td>
              <td>{entry.studentName}</td>
              <td>{entry.toolName}</td>
              <td>{entry.returnDate}</td>
              <td>{entry.returnTime}</td>
              <td>{entry.sign}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(entry._id)}>
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Export CSV Button */}
      <button onClick={handleExportCSV}>📤 Export CSV</button>
    </div>
  );
};

export default FarmToolsMovement;