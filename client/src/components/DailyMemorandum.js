import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DailyMemorandum.css";

const DailyMemorandum = () => {
  // State Management
  const [date, setDate] = useState("");
  const [memorandums, setMemorandums] = useState([]);
  const [memoCount, setMemoCount] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredMemos, setFilteredMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch memorandums when date changes
  useEffect(() => {
    if (date) fetchMemorandums();
  }, [date]);

  // Fetch memorandums for selected date
  const fetchMemorandums = async () => {
    try {
      console.log(`📥 Fetching memorandums for date: ${date}`);
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/daily-memorandum`, {
        params: { date },
      });

      console.log("✅ Received Data:", res.data);
      setMemorandums(res.data?.memorandums || []);

      const highestMemoNumber = res.data?.memorandums?.length || 0;
      setMemoCount(highestMemoNumber + 1);
      console.log(`🔢 Next Memo Count: ${highestMemoNumber + 1}`);
    } catch (error) {
      console.error("❌ Error fetching memorandums:", error);
    }
  };

  // Add a new memorandum
  const addMemorandum = () => {
    const newMemoId = `MEMO-${memoCount} of ${date}`;

    if (memorandums.some((memo) => memo.memoId === newMemoId)) {
      alert(`A memorandum with ID ${newMemoId} already exists.`);
      return;
    }

    setMemorandums([
      ...memorandums,
      {
        memoId: newMemoId,
        entries: [],
      },
    ]);

    setMemoCount(memoCount + 1);
    console.log(`➕ Added Memorandum: ${newMemoId}`);
  };

  // Add a new row to a memo
  const addRow = (memoIndex) => {
    console.log(`➕ Adding row to ${memorandums[memoIndex].memoId}`);

    const updatedMemos = [...memorandums];
    updatedMemos[memoIndex].entries.push({
      fieldNumber: "",
      area: "",
      crop: "",
      weather: "",
      workDone: "",
      trDrRs: "",
      amCmRs: "",
      amCwRs: "",
      clrCmRs: "",
      clrCwRs: "",
      salCmRs: "",
      salCwRs: "",
      amountRs: "",
      remarks: "",
    });

    setMemorandums(updatedMemos);
    console.log("✅ Updated Memorandums:", updatedMemos);
  };

  // Handle input changes
  const handleChange = (memoIndex, rowIndex, field, value) => {
    const updatedMemos = [...memorandums];
    updatedMemos[memoIndex].entries[rowIndex][field] = value;
    setMemorandums(updatedMemos);
  };

  // Delete row from memo
  const deleteRow = (memoIndex, rowIndex) => {
    console.log(`🗑 Deleting row from ${memorandums[memoIndex].memoId}`);

    const updatedMemos = [...memorandums];
    updatedMemos[memoIndex].entries.splice(rowIndex, 1);
    setMemorandums(updatedMemos);
  };

  // Delete a memorandum
  const deleteMemorandum = (memoIndex) => {
    console.log(`🗑 Deleting ${memorandums[memoIndex].memoId}`);

    const updatedMemos = [...memorandums];
    updatedMemos.splice(memoIndex, 1);

    updatedMemos.forEach((memo, index) => {
      memo.memoId = `MEMO-${index + 1} of ${date}`;
    });

    setMemorandums(updatedMemos);
    setMemoCount(updatedMemos.length + 1);
  };

  // Submit all memorandums
  const submitMemorandums = async () => {
    if (memorandums.length === 0) {
      alert("No memorandums to submit!");
      return;
    }

    console.log("📤 Submitting Memorandums:", memorandums);

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/daily-memorandum/add`, {
        date,
        memorandums,
      });

      alert("Memorandums submitted successfully!");
      setMemorandums([]);
      setMemoCount(1);
    } catch (error) {
      console.error("❌ Error submitting memorandums:", error);
      alert("Failed to submit memorandums.");
    }
  };

  // Fetch filtered memorandums
  const fetchFilteredMemos = async () => {
    if (!startDate || !endDate) {
      alert("Please select both Start Date and End Date.");
      return;
    }

    console.log(`📥 Filtering memorandums from ${startDate} to ${endDate}`);

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/daily-memorandum/filter`, {
        params: { startDate, endDate },
      });

      console.log("✅ Filtered Data:", res.data);
      setFilteredMemos(res.data);
    } catch (error) {
      console.error("❌ Error fetching filtered memorandums:", error);
      alert("Failed to fetch filtered data.");
    }
  };

  // Generate CSV for export
  const generateCSV = (memo) => {
    const headers = [
      "Field No.", "Area", "Crop", "Weather", "Work Done",
      "Tr. Dr. @ Rs.", "AM CM @ Rs.", "AM CW @ Rs.", "CLR CM @ Rs.",
      "CLR CW @ Rs.", "SAL CM @ Rs.", "SAL CW @ Rs.", "Amount Rs.", "Remarks"
    ];

    const csvRows = [headers.join(",")];

    memo.entries.forEach(entry => {
      const row = [
        entry.fieldNumber, entry.area, entry.crop, entry.weather,
        entry.workDone, entry.trDrRs, entry.amCmRs, entry.amCwRs,
        entry.clrCmRs, entry.clrCwRs, entry.salCmRs, entry.salCwRs,
        entry.amountRs, entry.remarks
      ].map(field => `"${field || ""}"`);
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${memo.memoId.replace(/ /g, "_")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Preview Modal Component
  const PreviewModal = ({ memo, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{memo.memoId}</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Field No.</th>
                <th>Area</th>
                <th>Crop</th>
                <th>Weather</th>
                <th>Work Done</th>
                <th>Tr. Dr. @ Rs.</th>
                <th>AM CM @ Rs.</th>
                <th>AM CW @ Rs.</th>
                <th>CLR CM @ Rs.</th>
                <th>CLR CW @ Rs.</th>
                <th>SAL CM @ Rs.</th>
                <th>SAL CW @ Rs.</th>
                <th>Amount Rs.</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {memo.entries.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.fieldNumber}</td>
                  <td>{entry.area}</td>
                  <td>{entry.crop}</td>
                  <td>{entry.weather}</td>
                  <td>{entry.workDone}</td>
                  <td>{entry.trDrRs}</td>
                  <td>{entry.amCmRs}</td>
                  <td>{entry.amCwRs}</td>
                  <td>{entry.clrCmRs}</td>
                  <td>{entry.clrCwRs}</td>
                  <td>{entry.salCmRs}</td>
                  <td>{entry.salCwRs}</td>
                  <td>{entry.amountRs}</td>
                  <td>{entry.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );

  return (
    <div className="daily-container">
      <h1>Daily Memorandum Sheet</h1>
      
      {/* Date Input Section */}
      <div className="date-input">
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          className="date-picker"
        />
      </div>

      {/* Memorandums Section */}
      <div className="scroll-container">
        {memorandums.map((memo, memoIndex) => (
          <div key={memo.memoId} className="memo-section">
            <h2>{memo.memoId}</h2>
            <button className="delete-memo" onClick={() => deleteMemorandum(memoIndex)}>
              🗑 Delete Memo
            </button>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Field No.</th>
                    <th>Area</th>
                    <th>Crop</th>
                    <th>Weather</th>
                    <th>Work Done</th>
                    <th>Tr. Dr. @ Rs.</th>
                    <th>AM CM @ Rs.</th>
                    <th>AM CW @ Rs.</th>
                    <th>CLR CM @ Rs.</th>
                    <th>CLR CW @ Rs.</th>
                    <th>SAL CM @ Rs.</th>
                    <th>SAL CW @ Rs.</th>
                    <th>Amount Rs.</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memo.entries.map((entry, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(entry).map((field) => (
                        <td key={field}>
                          <input
                            type="text"
                            value={entry[field]}
                            onChange={(e) => handleChange(memoIndex, rowIndex, field, e.target.value)}
                          />
                        </td>
                      ))}
                      <td>
                        <button className="delete-row" onClick={() => deleteRow(memoIndex, rowIndex)}>
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="add-row" onClick={() => addRow(memoIndex)}>
              ➕ Add Row
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="add-memo" onClick={addMemorandum}>➕ Add Memorandum</button>
        <button className="submit" onClick={submitMemorandums}>✔ Submit</button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <h2>Filter Memorandums</h2>
        <div className="filter-inputs">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-picker"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-picker"
            placeholder="End Date"
          />
          <button className="filter-button" onClick={fetchFilteredMemos}>
            🔍 Apply Filter
          </button>
        </div>

        {/* Filtered Results Table */}
        {filteredMemos.length > 0 && (
          <div className="filtered-results">
            <h3>Filtered Results</h3>
            <table className="filtered-table">
              <thead>
                <tr>
                  <th>Memo ID</th>
                  <th>Preview</th>
                  <th>Export</th>
                </tr>
              </thead>
              <tbody>
                {filteredMemos.flatMap(dateMemo =>
                  dateMemo.memorandums.map(memo => (
                    <tr key={memo.memoId}>
                      <td>{memo.memoId}</td>
                      <td>
                        <button 
                          className="preview-button"
                          onClick={() => {
                            setSelectedMemo(memo);
                            setShowPreview(true);
                          }}
                        >
                          Preview
                        </button>
                      </td>
                      <td>
                        <button 
                          className="export-button"
                          onClick={() => generateCSV(memo)}
                        >
                          Export CSV
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && selectedMemo && (
          <PreviewModal
            memo={selectedMemo}
            onClose={() => {
              setShowPreview(false);
              setSelectedMemo(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DailyMemorandum;