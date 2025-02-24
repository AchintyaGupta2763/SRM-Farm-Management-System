// components/ApprovedCSVList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ApprovedCSVList = () => {
  const { user } = useAuth();
  const [csvFiles, setCsvFiles] = useState([]);

  const fetchCSVs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/csv");
      setCsvFiles(res.data);
    } catch (error) {
      console.error("Error fetching CSVs", error);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/csv/${id}/download`, {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `approved_${id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchCSVs();
  }, [user]);

  return (
    <div className="csv-list">
      <h2>Approved CSVs</h2>
      <table>
        <thead>
          <tr>
            <th>Field Number</th>
            <th>Date Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {csvFiles.map(csv => (
            <tr key={csv._id}>
              <td>{csv.request.fieldNumber}</td>
              <td>{new Date(csv.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDownload(csv._id)}>Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovedCSVList;