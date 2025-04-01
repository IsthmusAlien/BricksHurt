import React, { useState } from "react";
import "./css/About.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const About = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.state?.section || "about");

  const renderContent = () => {

    switch(activeSection) {
      case 'about':
        return (
          <motion.div
            className="aboutpage-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>
              Welcome to our platform! We are dedicated to providing the best
              services to help you achieve your real estate goals. Our team is
              passionate about innovation, excellence, and customer satisfaction.
            </p>
            <h2>Our Mission</h2>
            <p>
              Our mission is to create impactful solutions that improve lives and
              businesses through technology and expertise in the real estate sector.
            </p>
            <h2>Why Choose Us?</h2>
            <ul>
              <li>Expert Team</li>
              <li>Reliable Solutions</li>
              <li>Customer-Centric Approach</li>
              <li>Continuous Innovation</li>
            </ul>
          </motion.div>
        );
      case 'privacy':
        return (
          <motion.div
            className="aboutpage-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>Privacy Policy</h2>
            <p>At BricksHurt, we are committed to protecting your personal information and ensuring your privacy.</p>
            
            <h3>Information We Collect</h3>
            <ul>
              <li>Personal identification information</li>
              <li>Contact details</li>
              <li>Property search preferences</li>
              <li>Device and browsing information</li>
            </ul>

            <h3>How We Use Your Information</h3>
            <ul>
              <li>Provide personalized property recommendations</li>
              <li>Improve our services</li>
              <li>Communicate with you about real estate opportunities</li>
              <li>Ensure platform security</li>
            </ul>

            <p>We do not sell or share your personal information with third parties without your consent.</p>
          </motion.div>
        );
      case 'terms':
        return (
          <motion.div
            className="aboutpage-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>Terms and Conditions</h2>
            <p>By using BricksHurt, you agree to the following terms:</p>

            <h3>User Responsibilities</h3>
            <ul>
              <li>Provide accurate and current information</li>
              <li>Maintain account confidentiality</li>
              <li>Use platform for legitimate purposes</li>
              <li>Respect intellectual property rights</li>
            </ul>

            <h3>Service Limitations</h3>
            <ul>
              <li>We do not guarantee property availability</li>
              <li>Property information is subject to change</li>
              <li>Users are responsible for due diligence</li>
              <li>Platform is provided "as is"</li>
            </ul>

            <p>Continued use of our platform constitutes acceptance of these terms.</p>
          </motion.div>
        );
      case 'FAQ':
        return (
          <motion.div
            className="aboutpage-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>Frequently Asked Questions</h2>

            <h3>What is this site about?</h3>
            <p>This is a dummy site created as a E-Commerce Project.</p>

            <h3>Are the listed properties real?</h3>
            <p>Yes, the data of listed properties was scrapped fromn MagicBricks on 24/01/2025.</p>

            <h3>Does this site contain any sensitive information?</h3>
            <p>No :).</p>

            <h3>Do you charge for using the platform?</h3>
            <p>Yes, Now give me your soul!</p>

          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="aboutpage-container">
      <nav className="aboutpage-nav">
        <div className="nav-logo">
          <a href="/">
            <img src="./logo.png" alt="Logo" className="logo-img" />
            BricksHurt
          </a>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
        </ul>
      </nav>
      
      <motion.h1
        className="aboutpage-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Us
      </motion.h1>
      
      <motion.p
        className="aboutpage-subtitle"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Helping You Discover Your Dream Property
      </motion.p>

      <div className="section-navigation">
        {['about', 'privacy', 'terms', 'FAQ'].map(section => (
          <button
            key={section}
            className={`section-nav-btn ${activeSection === section ? 'active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default About;