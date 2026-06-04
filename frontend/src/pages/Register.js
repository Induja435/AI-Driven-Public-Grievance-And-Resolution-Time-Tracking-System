import { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ icon
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let err = {};

    if (!form.name) err.name = "Name is required";

    if (!form.email) {
      err.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      err.email = "Invalid email format";
    }

    if (!form.phone) err.phone = "Phone is required";

    if (!form.password) err.password = "Password is required";
    else if (form.password.length < 6)
      err.password = "Minimum 6 characters";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await API.post("/users", {
        ...form,
        role: "USER"
      });

      toast.success("Registration successful 🎉");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (error) {
      toast.error("Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="register-container" onKeyDown={handleKeyPress}>

      <ToastContainer position="top-right" />

      <motion.div 
        className="register-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >

        <h2 className="register-title">Register</h2>

        {/* NAME */}
        <input
          name="name"
          placeholder="Enter Name"
          className="register-input"
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        {/* EMAIL */}
        <input
          name="email"
          placeholder="Enter Email"
          className="register-input"
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        {/* PHONE */}
        <input
          name="phone"
          placeholder="Enter Phone"
          className="register-input"
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        {/* PASSWORD */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            className="register-input"
            onChange={handleChange}
          />

          {/* 👁️ ICON */}
          <span
            className="toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        {/* BUTTON */}
        <button
          className="register-btn"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? <div className="spinner"></div> : "Register"}
        </button>

        {/* LOGIN */}
        <p className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </motion.div>

    </div>
  );
}

export default Register;