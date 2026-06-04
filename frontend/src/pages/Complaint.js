import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import "./Complaint.css";

function Complaint() {

  const [text, setText] = useState("");
  const [department, setDepartment] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // 🎯 VALIDATION
  const isValid = text.trim().length >= 10 && department !== "";

  // ✨ AUTO RESIZE TEXTAREA
  const handleTextChange = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  // 📡 SUBMIT
  const handleSubmit = async () => {
    if (!isValid) {
      setError("Please fill all fields properly");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const res = await API.post("/complaints", {
        complaintText: text,
        categoryId: 1,
        department: department
      });

      setResult(res.data.data);

      setSuccess(true);

      // 🔥 CLEAR FORM
      setText("");
      setDepartment("");

    } catch (err) {
      console.log(err);
      setError("Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-container">

      <motion.h2 
        className="title"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Submit Complaint
      </motion.h2>

      {/* SUCCESS */}
      <AnimatePresence>
        {success && (
          <motion.div 
            className="success-banner"
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
          >
            ✅ Complaint Submitted Successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="error-banner"
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
          >
            ⚠ {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="form-box"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 90 }}
      >

        {/* DEPARTMENT */}
        <label className="label">Select Department</label>
        <select
          className="dropdown"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">-- Choose Department --</option>
          <option value="Water Department">💧 Water Department</option>
          <option value="Electricity Department">⚡ Electricity Department</option>
          <option value="Roads Department">🛣 Roads Department</option>
          <option value="Sanitation Department">🧹 Sanitation Department</option>
          <option value="Public Department">🏛 Public Department</option>
        </select>

        {/* TEXTAREA */}
        <label className="label">Enter Complaint</label>
        <textarea
          className="textarea"
          placeholder="Describe your issue..."
          value={text}
          onChange={handleTextChange}
        />

        {/* 🔢 CHARACTER COUNT */}
        <p className="char-count">{text.length} / 300</p>

        {/* SUBMIT */}
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!isValid || loading}
        >
          {loading ? <span className="spinner"></span> : "🚀 Submit Complaint"}
        </button>

      </motion.div>

      {/* 🤖 RESULT */}
      <AnimatePresence>
        {result && (
          <motion.div 
            className="result-card"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.5, type: "spring" }}
          >

            <h3>🤖 AI Prediction</h3>

            <p>🏢 <b>Department:</b> <span>{result.predictedDepartment}</span></p>

            <p>
              ⚡ <b>Priority:</b>
              <span className={`priority priority-${result.predictedPriority.toLowerCase()}`}>
                {result.predictedPriority}
              </span>
            </p>

            <p>⏱ <b>Resolution Time:</b> <span>{result.predictedResolutionTime} days</span></p>

          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGOUT */}
      <div className="logout-section">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

    </div>
  );
}

export default Complaint;