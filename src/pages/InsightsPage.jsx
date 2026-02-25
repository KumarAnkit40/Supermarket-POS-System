import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF4444", "#AA66CC"];

const InsightsPage = () => {
  const [summary, setSummary] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [byCashier, setByCashier] = useState([]);
  const [range, setRange] = useState(7); // default 7 days

  useEffect(() => {
    fetch("http://localhost:5000/sales/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data));

    fetch("http://localhost:5000/sales/daily")
      .then((res) => res.json())
      .then((data) => setDailyData(data));

    fetch("http://localhost:5000/sales/top-products")
      .then((res) => res.json())
      .then((data) => setTopProducts(data));

    fetch("http://localhost:5000/sales/category-stats")
      .then((res) => res.json())
      .then((data) => setCategoryStats(data));

    fetch("http://localhost:5000/sales/by-cashier")
      .then((res) => res.json())
      .then((data) => setByCashier(data));
  }, []);

  if (!summary) return <p>Loading Insights...</p>;

  const dailyFiltered = dailyData.slice(-range);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Business Insights Dashboard</h1>
      <p>Real-time analytics from your sales</p>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{
          background: "#e8f5e9",
          padding: 20,
          borderRadius: 12,
          width: 220,
          textAlign: "center",
        }}>
          <h3>Total Revenue</h3>
          <h2>₹{summary.revenue.toFixed(2)}</h2>
        </div>

        <div style={{
          background: "#e3f2fd",
          padding: 20,
          borderRadius: 12,
          width: 220,
          textAlign: "center",
        }}>
          <h3>Total Bills</h3>
          <h2>{summary.bills}</h2>
        </div>

        <div style={{
          background: "#fff3e0",
          padding: 20,
          borderRadius: 12,
          width: 220,
          textAlign: "center",
        }}>
          <h3>Items Sold</h3>
          <h2>{summary.itemsSold}</h2>
        </div>
      </div>

      {/* Toggle 7 / 30 */}
      <div style={{ marginTop: 30, textAlign: "right" }}>
        <button
          onClick={() => setRange(range === 7 ? 30 : 7)}
          style={{
            padding: "6px 15px",
            borderRadius: "10px",
            border: "none",
            background: "#1976d2",
            color: "white",
            cursor: "pointer",
          }}>
          View {range === 7 ? "30 Days" : "7 Days"}
        </button>
      </div>

      {/* Line Chart */}
      <h2 style={{ marginTop: 10 }}>Daily Sales Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={dailyFiltered}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>

      {/* Top Products (Bar Chart) */}
      <h2 style={{ marginTop: 30 }}>Top Selling Products</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={topProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sold">
            {topProducts.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Category Split (Pie Chart) */}
      <h2 style={{ marginTop: 30 }}>Category Sales Distribution</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={categoryStats}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {categoryStats.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Sales by Cashier */}
      <h2 style={{ marginTop: 30 }}>Sales by Cashier</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {byCashier.length === 0 ? (
          <div style={{ padding: 12, background: "#f3f4f6", borderRadius: 8 }}>No cashier sales data yet.</div>
        ) : (
          byCashier.map((c, idx) => (
            <div key={idx} style={{ padding: 12, borderRadius: 10, background: "#ffffff", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {c.cashierName || "Unknown"}{c.cashierUsername ? ` (@${c.cashierUsername})` : ""}
              </div>
              <div style={{ marginTop: 8, fontSize: 13 }}>
                Revenue: <strong>₹{(c.totalRevenue || 0).toFixed(2)}</strong>
                <br />
                Bills: <strong>{c.bills || 0}</strong>
                <br />
                Items Sold: <strong>{c.itemsSold || 0}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InsightsPage;
