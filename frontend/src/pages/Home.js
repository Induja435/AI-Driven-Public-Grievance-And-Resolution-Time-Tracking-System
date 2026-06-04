import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";
import heroImg from "../assets/hero.jpeg";
import img1 from "../assets/img1.png";
import img2 from "../assets/img02.png";
import flow from "../assets/flowchart.png";
import login1 from "../assets/login1.png";
import track from "../assets/track.png";
import phone from "../assets/phone.png";

function Home() {
  const navigate = useNavigate();
  const [loadingBtn, setLoadingBtn] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* HERO SECTION */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="overlay"></div>

        <div className="hero-content">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-title"
          >
            PUBLIC GRIEVANCE SYSTEM
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hero-subtitle"
          >
            Your Voice. Heard
          </motion.p>

          <div className="hero-buttons">
            <motion.button
              className="btn primary"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(79, 70, 229, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setLoadingBtn("complaint");
                setTimeout(() => navigate("/login"), 1000);
              }}
            >
              {loadingBtn === "complaint" ? (
                <span className="spinner"></span>
              ) : (
                "File a Complaint"
              )}
            </motion.button>

            <motion.button
              className="btn secondary"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255, 255, 255, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setLoadingBtn("trackHero");
                setTimeout(() => navigate("/login"), 1000);
              }}
            >
              {loadingBtn === "trackHero" ? (
                <span className="spinner dark"></span>
              ) : (
                "Track My Complaint"
              )}
            </motion.button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <motion.section 
        className="about"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="about-left">
          <h2>
            Your Voice Counts:
            <br />
            <span>Making Every Opinion Matter</span>
          </h2>

          <p>
            Public Grievance System is built on the principle of empowering citizens.
            Our platform provides a simple, direct channel for you to submit complaints,
            track their progress in real-time, and ensure full transparency throughout
            the resolution process.
          </p>
        </div>

        <motion.div 
          className="about-right"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <img src={img1} alt="about" />
        </motion.div>
      </motion.section>

      {/* HOW SYSTEM WORKS */}
      <motion.section 
        className="how"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2>How This System Works</h2>

        <motion.div 
          className="flowchart glass"
          whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)" }}
        >
          <img src={flow} alt="flowchart" />
        </motion.div>
      </motion.section>

      {/* CARDS */}
      <motion.section 
        className="cards"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {/* REGISTER CARD */}
        <motion.div 
          className="card glass"
          variants={cardVariants}
          whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(0,0,0,0.4)", borderColor: "rgba(99, 102, 241, 0.3)" }}
        >
          <div className="card-img-container">
            <img src={login1} alt="" />
          </div>
          <h3>Login / Register</h3>
          <p>Access your dashboard and manage complaints.</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setLoadingBtn("register");
              setTimeout(() => navigate("/register"), 1000);
            }}
          >
            {loadingBtn === "register" ? (
              <span className="spinner"></span>
            ) : (
              "Go"
            )}
          </motion.button>
        </motion.div>

        {/* TRACK CARD */}
        <motion.div 
          className="card glass"
          variants={cardVariants}
          whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(0,0,0,0.4)", borderColor: "rgba(99, 102, 241, 0.3)" }}
        >
          <div className="card-img-container">
            <img src={track} alt="" />
          </div>
          <h3>Track Status</h3>
          <p>Check complaint progress in real-time.</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setLoadingBtn("trackCard");
              setTimeout(() => navigate("/login"), 1000);
            }}
          >
            {loadingBtn === "trackCard" ? (
              <span className="spinner"></span>
            ) : (
              "Track"
            )}
          </motion.button>
        </motion.div>

        {/* CONTACT CARD */}
        <motion.div 
          className="card glass"
          variants={cardVariants}
          whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(0,0,0,0.4)", borderColor: "rgba(99, 102, 241, 0.3)" }}
        >
          <div className="card-img-container">
            <img src={phone} alt="" />
          </div>
          <h3>Contact Us</h3>
          <p>Reach out for support and urgent issues.</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setLoadingBtn("contact");
              setTimeout(() => navigate("/contact"), 1000);
            }}
          >
            {loadingBtn === "contact" ? (
              <span className="spinner"></span>
            ) : (
              "Contact"
            )}
          </motion.button>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}

export default Home;