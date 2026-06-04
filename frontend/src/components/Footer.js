import { motion } from "framer-motion";
import "./Footer.css";
import logo from "../assets/logo.png";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* TOP SECTION */}
      <div className="footer-top">
        {/* LEFT SIDE - LOGO + SOCIAL */}
        <div className="footer-left">
          <motion.img 
            src={logo} 
            alt="logo" 
            className="footer-logo-img" 
            whileHover={{ scale: 1.02 }}
          />

          <div className="social-icons">
            {[
              { icon: <FaFacebook />, href: "#" },
              { icon: <FaTwitter />, href: "#" },
              { icon: <FaInstagram />, href: "#" },
              { icon: <FaLinkedin />, href: "#" }
            ].map((soc, idx) => (
              <motion.a 
                key={idx}
                href={soc.href}
                whileHover={{ scale: 1.25, color: "#6366f1", y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {soc.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - LINKS */}
        <div className="footer-right">
          <div className="footer-links">
            {["Terms & Conditions", "Privacy Policy", "FAQs", "Contact"].map((link, idx) => (
              <motion.a 
                key={idx}
                href="#"
                whileHover={{ x: -5, color: "#6366f1" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {link}
              </motion.a>
            ))}
          </div>

          <p className="address">📍 Chennai, Tamil Nadu, India</p>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="footer-bottom">
        <p>© 2026 Grievance System. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}

export default Footer;