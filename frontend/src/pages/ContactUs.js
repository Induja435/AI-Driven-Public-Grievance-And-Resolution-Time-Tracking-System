import { useState } from "react";
import { motion } from "framer-motion";
import "./ContactUs.css";

function ContactUs() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can connect backend API later
    console.log("Contact Form:", form);

    alert("Message sent successfully ✅");

    setForm({
      name: "",
      email: "",
      message: ""
    });
  };

  return (
    <div className="contact-container">

      <motion.h2 
        className="contact-title"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Contact Us
      </motion.h2>

      <div className="contact-layout">

        {/* LEFT COLUMN - FORM */}
        <motion.form 
          className="contact-form-box" 
          onSubmit={handleSubmit}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
        >

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message"
            required
          />

          <button type="submit" className="send-btn">
            📩 Send Message
          </button>

        </motion.form>

        {/* RIGHT COLUMN - INFO */}
        <motion.div 
          className="contact-info-box"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80, delay: 0.1 }}
        >

          <div className="info-card">
            <h3>Support Center</h3>
            <p>Our citizen helpline is open 24/7. Reach out for any technical difficulties or escalation requests.</p>
            <p>📞 +91 98765 43210</p>
          </div>

          <div className="info-card">
            <h3>Connect With Us</h3>
            <p>Stay updated on grievance resolutions and active infrastructure projects in your department area.</p>
            <div className="contact-social-icons">
              <span>🌐</span>
              <span>📘</span>
              <span>📸</span>
            </div>
          </div>

        </motion.div>

      </div>

    </div>
  );
}

export default ContactUs;