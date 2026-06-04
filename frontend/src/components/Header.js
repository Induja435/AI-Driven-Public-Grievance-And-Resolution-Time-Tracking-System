import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Header.css";
import logo from "../assets/logo.png";

function Header() {
  return (
    <motion.nav 
      className="header glass"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* LEFT SIDE - LOGO */}
      <motion.div 
        className="logo"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src={logo} alt="Public Grievance System" className="logo-img" />
      </motion.div>

      {/* RIGHT SIDE */}
      <div className="nav-right">
        {/* Search Bar */}
        <motion.input
          type="text"
          placeholder="Search FAQs..."
          className="search-bar"
          whileFocus={{ width: 260, boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)" }}
          transition={{ duration: 0.3 }}
        />

        {/* Navigation Buttons */}
        <div className="nav-links">
          {[
            { to: "/", label: "Home" },
            { to: "/login", label: "Login" },
            { to: "/register", label: "Register" },
            { to: "/contact", label: "Contact Us" }
          ].map((link, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ y: 0, scale: 0.97 }}
            >
              <Link to={link.to} className="nav-btn">
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

export default Header;