import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [openId, setOpenId] = useState(null);

  const [historyData, setHistoryData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🎨 STATUS CLASS
  const getStatusClass = (status) => {
    if (status === "PENDING") return "pending";
    if (status === "IN_PROGRESS") return "progress";
    if (status === "RESOLVED") return "resolved";
    return "";
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // 📜 VIEW HISTORY
  const viewHistory = async (id) => {
    try {
      setLoadingHistory(true);

      const res = await API.get(`/complaints/${id}/history`);

      const history =
        res.data?.data ||
        res.data?.content ||
        res.data;

      setHistoryData(Array.isArray(history) ? history : []);
      setShowHistory(true);

    } catch (error) {
      console.log(error);
      setHistoryData([]);
      setShowHistory(true);
    } finally {
      setLoadingHistory(false);
    }
  };

  // 📦 FETCH
  useEffect(() => {
    if (!token) return;

    const fetchComplaints = async () => {
      try {
        const res = await API.get(`/complaints?page=0&size=10`);

        const data =
          res.data?.content ||
          res.data?.data?.content ||
          res.data?.data ||
          res.data;

        setComplaints(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComplaints();
  }, [token]);

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="dashboard">

      <motion.h2 
        className="dashboard-title"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        User Dashboard
      </motion.h2>

      {/* ✅ NEW SUBMIT BUTTON */}
      <motion.div 
        className="submit-section"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
      >
        <button
          className="submit-btn"
          onClick={() => navigate("/complaint")}
        >
          ➕ Submit Complaint
        </button>
      </motion.div>

      <motion.div 
        className="complaints"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >

        {complaints.length === 0 ? (
          <p className="no-data">No complaints found</p>
        ) : (
          complaints.map((c, index) => (
            <motion.div
              key={c.complaintId}
              className="complaint-card"
              onClick={() =>
                setOpenId(openId === c.complaintId ? null : c.complaintId)
              }
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <p className="complaint-text">{c.complaintText}</p>

              <AnimatePresence>
                {openId === c.complaintId && (
                  <motion.div 
                    className="complaint-details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    onClick={(e) => e.stopPropagation()} // Prevent card toggle on details click
                  >

                    <p>
                      <b>Status:</b>
                      <span className={`status ${getStatusClass(c.status)}`}>
                        {c.status}
                      </span>
                    </p>

                    <button
                      className="history-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewHistory(c.complaintId);
                      }}
                    >
                      Track Complaint
                    </button>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}

      </motion.div>

      {/* 🔥 TIMELINE MODAL */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            className="modal-overlay" 
            onClick={() => setShowHistory(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal" 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <h3>Complaint Progress</h3>

              {loadingHistory ? (
                <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
              ) : historyData.length > 0 ? (

                <div className="timeline">

                  {historyData.map((h, index) => (
                    <motion.div 
                      className="timeline-item" 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >

                      <div className="timeline-icon" />

                      <div className="timeline-content">
                        <p className="timeline-status">
                          {h.oldStatus || "START"} → {h.newStatus}
                        </p>

                        <p className="timeline-meta">
                          {h.changedBy} | {h.changedAt}
                        </p>
                      </div>

                    </motion.div>
                  ))}

                </div>

              ) : (
                <p style={{ textAlign: "center", padding: "20px" }}>No history found</p>
              )}

              <button className="close-btn" onClick={() => setShowHistory(false)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

export default Dashboard;