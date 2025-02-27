import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Attendance.css";

const Attendance = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState("");
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", type: "" });

  // ✅ State for Filters
  const [filterName, setFilterName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
    fetchMembers();
  }, []);

  const fetchRecords = async () => {
    try {
      const isCleared = localStorage.getItem("attendanceCleared");
  
      // ✅ If attendance was cleared, DO NOT fetch records
      if (isCleared === "true") {
        setRecords([]); // ✅ Keep UI cleared after reload
        return;
      }
  
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/attendance`);
  
      // ✅ Get yesterday's date in YYYY-MM-DD format
      const today = new Date();
      today.setDate(today.getDate() - 1); // Move back one day
      const yesterday = today.toISOString().split("T")[0];
  
      // ✅ Filter only records from yesterday & later (hide older records)
      const filteredRecords = res.data.filter((record) => record.date >= yesterday);
  
      setRecords(filteredRecords);
    } catch (error) {
      console.error("Error fetching attendance records", error);
    }
  };
  
  

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/members`);
      setMembers(res.data);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  // ✅ Add New Attendance Record
  const handleAddAttendance = async () => {
    if (!name || !date || !attendance) {
      alert("Please fill all fields.");
      return;
    }
  
    // ✅ Check if the person already has an attendance record for the same date
    const existingRecord = records.find(
      (record) => record.name === name && record.date === date
    );
  
    if (existingRecord) {
      alert("Attendance for this person has already been recorded for this date.");
      return; // 🛑 Stop submission
    }
  
    // ✅ Find the selected member's type
    const selectedMember = members.find((member) => member.name === name);
    if (!selectedMember) {
      alert("Invalid member selected.");
      return;
    }
  
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/attendance/add`, {
        name,
        type: selectedMember.type,
        date,
        attendance,
      });
  
      setRecords([...records, res.data]); // ✅ Update records state
      setName(""); // ✅ Clear form fields
      setDate("");
      setAttendance("");
    } catch (error) {
      console.error("Error adding attendance", error);
    }
  };

  // Delete Attendance
  const handleDeleteAttendance = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) {
      return;
    }
  
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/attendance/${id}`);
      
      // ✅ Remove from UI instantly
      setRecords(records.filter((record) => record._id !== id));
      
      alert("Attendance record deleted successfully.");
    } catch (error) {
      console.error("Error deleting attendance record", error);
      alert("Failed to delete record. Try again.");
    }
  };
  
  
  // ✅ Add New Member
  const handleAddMember = async () => {
    if (!newMember.name || !newMember.type) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/members/add`, newMember);
      setMembers([...members, res.data]);
      setNewMember({ name: "", type: "" });
      alert("Member added successfully!");
    } catch (error) {
      console.error("Error adding member", error);
    }
  };

  // ✅ Fetch Filtered Attendance Records
  const fetchFilteredRecords = async () => {
    try {
      const queryParams = {};
  
      if (filterName) queryParams.name = filterName;
      if (filterStartDate) queryParams.startDate = filterStartDate;
      if (filterEndDate) queryParams.endDate = filterEndDate;
      if (filterMonth) queryParams.month = filterMonth;
      if (filterYear) queryParams.year = filterYear;
  
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/attendance/filter`, {
        params: queryParams,
      });
  
      console.log("Filtered Data:", res.data); // ✅ Debugging Backend Response
  
      setFilteredRecords(res.data);
    } catch (error) {
      console.error("Error fetching filtered attendance records", error);
    }
  };

  
  // ✅ Export Filtered Records as CSV
  const exportFilteredCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No records available to export.");
      return;
    }

    let csv = "Name,Labour Type,Date,Attendance\n";
    filteredRecords.forEach((record) => {
      csv += `${record.name},${record.type},${record.date},${record.attendance}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "filtered_attendance.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Function to export today's attendance as CSV
  const exportTodaysAttendance = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Filter attendance records for today
    const todaysRecords = records.filter((record) => record.date === today);

    if (todaysRecords.length === 0) {
      alert("No attendance records found for today.");
      return;
    }

    // Create CSV content
    let csv = "Name,Labour Type,Date,Attendance\n";
    todaysRecords.forEach((record) => {
      csv += `${record.name},${record.type},${record.date},${record.attendance}\n`;
    });

    // Generate and download the CSV file
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `attendance_${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Function to clear the display (hides attendance records from view)
  const clearDisplay = () => {
    setRecords([]); // ✅ Clears only the UI, does NOT delete data from the database
    localStorage.setItem("attendanceCleared", "true"); // ✅ Save cleared state
    alert("Attendance display cleared! (Data is still saved in the database)");
  };

  const closeTodaysAttendance = async () => {
    const today = new Date().toISOString().split("T")[0]; // ✅ Get today's date
  
    // ✅ Find members who haven't been marked yet
    const markedNames = records.filter((record) => record.date === today).map((record) => record.name);
    const unmarkedMembers = members.filter((member) => !markedNames.includes(member.name));
  
    if (unmarkedMembers.length === 0) {
      alert("All members have already been marked.");
      return;
    }
  
    try {
      const newAbsentees = unmarkedMembers.map((member) => ({
        name: member.name,
        type: member.type,
        date: today,
        attendance: "Absent",
      }));
  
      // ✅ Send all absentees to the backend
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/attendance/bulk-add`, newAbsentees);
  
      // ✅ Update UI by adding absentees to the records list
      setRecords([...records, ...newAbsentees]);
  
      alert(`Marked ${newAbsentees.length} members as Absent.`);
    } catch (error) {
      console.error("Error closing today's attendance", error);
      alert("Failed to close attendance. Try again.");
    }
  };
  


  return (
    <div className="attendance-container">
      <h1>Attendance Register</h1>

      {/* ✅ Add New Member Section */}
      <h2>Add New Member</h2>
      <div className="form-container">
        <input
          type="text"
          placeholder="Enter Member Name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
        />
        <select
          value={newMember.type}
          onChange={(e) => setNewMember({ ...newMember, type: e.target.value })}
        >
          <option value="" disabled>Select Labour Type</option>
          <option value="Permanent">Permanent</option>
          <option value="Temporary">Temporary</option>
        </select>
        <button onClick={handleAddMember}>➕ Add Member</button>
      </div>

      {/* ✅ Attendance Form */}
      <h2>Mark Attendance</h2>
      <div className="form-container">
        <select value={name} onChange={(e) => setName(e.target.value)}>
          <option value="" disabled>Select Member</option>
          {members.map((member) => (
            <option key={member._id} value={member.name}>
              {member.name} ({member.type})
            </option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={attendance} onChange={(e) => setAttendance(e.target.value)}>
          <option value="" disabled>Select Attendance</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <button onClick={handleAddAttendance}>✅ Mark Attendance</button>
        <button onClick={closeTodaysAttendance} className="close-attendance-btn">
          ⏳ Close Today's Attendance
        </button>

      </div>

      {/* ✅ Attendance Table */}
      <h2>Attendance Records</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Labour Type</th>
            <th>Date</th>
            <th>Attendance</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.name}</td>
              <td>{record.type}</td>
              <td>{record.date}</td>
              <td>{record.attendance}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDeleteAttendance(record._id)}>
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
      {/* ✅ Action Buttons Below Attendance Table */}
      <div className="attendance-actions">
        <button onClick={exportTodaysAttendance}>📤 Export Today's Attendance</button>
        <button onClick={clearDisplay}>🧹 Clear Display</button>
      </div>

      {/* ✅ Show Restore Button Only When Data is Cleared */}
      {records.length === 0 && localStorage.getItem("attendanceCleared") === "true" && (
        <button onClick={() => { 
          localStorage.removeItem("attendanceCleared"); 
          fetchRecords(); // ✅ Restore records only from yesterday onwards
        }}>
          🔄 Restore Recent Attendance (Up to Yesterday)
        </button>
      )}




      {/* ✅ Filtering Section */}
      <h2>Filter Attendance Records</h2>
      <div className="filter-container">
        <select value={filterName} onChange={(e) => setFilterName(e.target.value)}>
          <option value="">Select Employee</option>
          {members.map((member) => (
            <option key={member._id} value={member.name}>
              {member.name}
            </option>
          ))}
        </select>
        <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
        <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">Select Month</option>
          {[...Array(12).keys()].map((m) => (
            <option key={m + 1} value={m + 1}>
              {new Date(0, m).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <button onClick={fetchFilteredRecords}>🔍 Fetch Data</button>
        <button onClick={exportFilteredCSV}>📤 Export CSV</button>
      </div>

      {/* ✅ Display Filtered Attendance Records */}
      {filteredRecords.length > 0 ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Labour Type</th>
                <th>Date</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.name}</td>
                  <td>{record.type}</td>
                  <td>{record.date}</td>
                  <td>{record.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No records found. Try different filters.</p>
      )}

    </div>
  );
};

export default Attendance;
