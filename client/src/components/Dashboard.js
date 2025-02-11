import React, { useEffect, useRef } from "react";
import "./Dashboard.css"; 
import Chart from "chart.js/auto";

const Dashboard = () => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    if (lineChartRef.current) lineChartRef.current.destroy();
    if (barChartRef.current) barChartRef.current.destroy();

    // Line Chart
    const ctxLine = document.getElementById("lineChart").getContext("2d");
    lineChartRef.current = new Chart(ctxLine, {
      type: "line",
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "Work Hours (hrs)",
            data: [150, 180, 220, 200, 170, 160, 190],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    });

    // Bar Chart
    const ctxBar = document.getElementById("barChart").getContext("2d");
    barChartRef.current = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: ["Field A", "Field B", "Field C", "Field D", "Field E"],
        datasets: [
          {
            label: "Work Hours (hrs)",
            data: [120, 150, 90, 100, 80],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
    });

    return () => {
      if (lineChartRef.current) lineChartRef.current.destroy();
      if (barChartRef.current) barChartRef.current.destroy();
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="text-center my-4">Farm Labour Dashboard</h1>

      {/* Responsive Chart Container */}
      <div className="chart-container">
        <div className="chart-box">
          <h3>Monthly Work Hours</h3>
          <canvas id="lineChart"></canvas>
        </div>
        <div className="chart-box">
          <h3>Work Hours by Field</h3>
          <canvas id="barChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
