import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let err = {};

    if (!email) err.email = "Email is required";
    else if (!emailRegex.test(email)) err.email = "Invalid email format";

    if (!password) err.password = "Password is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });
      const token = res.data;

      if (!token) {
        toast.error("Token not received");
        return;
      }

      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);

      toast.success("Login successful 🎉");

      setTimeout(() => {
        window.location.href =
          decoded.role === "ADMIN" ? "/admin-dashboard" : "/dashboard";
      }, 1500);

    } catch {
      toast.error("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" />

      <motion.div 
        className="login-card glass"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <h2 className="login-title">Login</h2>

        {/* EMAIL */}
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <AnimatePresence>
          {errors.email && (
            <motion.p 
              className="error"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>

        {/* PASSWORD */}
        <div className="input-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.p 
              className="error"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {errors.password}
            </motion.p>
          )}
        </AnimatePresence>

        {/* OPTIONS */}
        <div className="login-options">
          <div className="remember">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember Me</label>
          </div>

          <Link to="/forgot-password" className="forgot">
            Forgot Password?
          </Link>
        </div>

        {/* BUTTON */}
        <motion.button 
          className="login-btn" 
          onClick={handleLogin} 
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? <div className="spinner"></div> : "Login"}
        </motion.button>

        {/* REGISTER */}
        <p className="register-text">
          New user? <Link to="/register">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;