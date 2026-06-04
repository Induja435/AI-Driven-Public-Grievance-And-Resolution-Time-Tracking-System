import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import "./AdminDashboard.css";

import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, LabelList
} from "recharts";

function AdminDashboard() {

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [workload, setWorkload] = useState({});
  const [overdue, setOverdue] = useState([]);

  const [view, setView] = useState("complaints");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      let url = `/complaints/search?page=${page}&size=10`;

      if (statusFilter !== "ALL") url += `&status=${statusFilter}`;
      if (departmentFilter !== "ALL") url += `&department=${departmentFilter}`;

      const complaintsRes = await API.get(url);
      const statsRes = await API.get("/complaints/admin/dashboard");
      const workloadRes = await API.get("/complaints/admin/department-workload");
      const overdueRes = await API.get(`/complaints/admin/overdue-complaints?page=0&size=50`);

      const response = complaintsRes.data.data;

      setComplaints(response.content || []);
      setTotalPages(response.totalPages || 1);

      setStats(statsRes.data.data);
      setWorkload(workloadRes.data.data);
      setOverdue(overdueRes.data.data.content || []);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, departmentFilter, page]);

  const updateComplaint = async (id, status) => {
    await API.put(`/complaints/${id}/admin-update`, {
      status,
      priority: "MEDIUM"
    });
    fetchData();
  };

  /* ================= DATA ================= */

  const pieData = stats ? [
    { name: "Pending", value: stats.pendingComplaints },
    { name: "In Progress", value: stats.inProgressComplaints },
    { name: "Resolved", value: stats.resolvedComplaints },
    { name: "Closed", value: stats.closedComplaints }
  ] : [];

  // Updated colors to match beautiful theme tints
  const COLORS = ["#f43f5e", "#f59e0b", "#10b981", "#6b7280"];

  const barData = Object.keys(workload).map((key) => ({
    name: key.replace(" Department", ""), // shorten names for better display
    value: workload[key]
  }));

  const getStatusIcon = (status) => {
    if (status === "PENDING") return "🔴";
    if (status === "IN_PROGRESS") return "🟡";
    if (status === "RESOLVED") return "🟢";
    return "⚫";
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-container">

      <motion.h2 
        className="admin-header"
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Admin Dashboard 👑
      </motion.h2>

      {/* NAV WITH SLIDING ACTIVE CLASS */}
      <div className="admin-nav">
        <button 
          className={view === "complaints" ? "active-tab" : ""} 
          onClick={() => setView("complaints")}
        >
          Complaints
        </button>
        <button 
          className={view === "stats" ? "active-tab" : ""} 
          onClick={() => setView("stats")}
        >
          Stats
        </button>
        <button 
          className={view === "workload" ? "active-tab" : ""} 
          onClick={() => setView("workload")}
        >
          Workload
        </button>
        <button 
          className={view === "overdue" ? "active-tab" : ""} 
          onClick={() => setView("overdue")}
        >
          Overdue
        </button>
      </div>

      {/* ================= COMPLAINTS ================= */}
      <AnimatePresence mode="wait">
        {view === "complaints" && (
          <motion.div
            key="complaints-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            style={{ width: "100%" }}
          >
            <div className="filters">
              <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              <select onChange={(e) => setDepartmentFilter(e.target.value)} value={departmentFilter}>
                <option value="ALL">All Departments</option>
                <option value="Water Department">Water</option>
                <option value="Electricity Department">Electricity</option>
                <option value="Roads Department">Road</option>
                <option value="Sanitation Department">Sanitation</option>
                <option value="Public Department">Public</option>
              </select>
            </div>

            <div className="admin-content">
              {complaints.length === 0 ? (
                <p className="no-data">No complaints found</p>
              ) : (
                complaints.map((c, index) => (
                  <motion.div 
                    key={c.complaintId} 
                    className="admin-card"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <p className="complaint-text">{c.complaintText}</p>
                    <p className="admin-status-indicator">{getStatusIcon(c.status)} {c.status}</p>
                    <p>🏢 {c.predictedDepartment}</p>

                    <div className="admin-actions">
                      <button onClick={() => updateComplaint(c.complaintId, "IN_PROGRESS")}>In Progress</button>
                      <button onClick={() => updateComplaint(c.complaintId, "RESOLVED")}>Resolve</button>
                      <button onClick={() => updateComplaint(c.complaintId, "CLOSED")}>Close</button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="pagination">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
              <span>{page + 1} / {totalPages}</span>
              <button disabled={page + 1 === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </motion.div>
        )}

        {/* ================= PIE CHART ================= */}
        {view === "stats" && (
          <motion.div
            key="stats-view"
            className="chart-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={130}
                  paddingAngle={5}
                >
                  <LabelList
                    dataKey="name"
                    position="outside"
                    fill="#9ca3af"
                  />
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(17, 24, 39, 0.95)", 
                    borderColor: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    color: "#f9fafb" 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* ================= BAR CHART ================= */}
        {view === "workload" && (
          <motion.div
            key="workload-view"
            className="chart-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffd700" stopOpacity={0.85}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.35}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(17, 24, 39, 0.95)", 
                    borderColor: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    color: "#f9fafb" 
                  }}
                />
                <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="value" position="top" fill="#f9fafb" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* ================= OVERDUE ================= */}
        {view === "overdue" && (
          <motion.div
            key="overdue-view"
            className="overdue-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {overdue.length === 0 ? (
              <p className="no-data">No overdue complaints</p>
            ) : (
              overdue.map((c, index) => (
                <motion.div 
                  key={c.complaintId} 
                  className="overdue-item"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <p>{c.complaintText}</p>
                  <span>OVERDUE</span>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGOUT */}
      <div className="logout-section">
        <button onClick={logout}>Logout</button>
      </div>

    </div>
  );
}

export default AdminDashboard;