import React, { useEffect, useState } from "react";
import "./css/Contact.css";
import { Link } from "react-router-dom";

function Contact() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const randomId = Math.floor(Math.random() * 10) + 1;
    setUserId(randomId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="contact-container">
      <nav className="contact-nav">
        <div className="nav-logo">
          <a href="/">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            BricksHurt
          </a>
        </div>
        <ul className="nav-links">
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>

      <main className="contact-main">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {user && (
          <div>
            <h2>{user.name}</h2>
            <p>{`\n`}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p>{`\n`}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p>{`\n`}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p>{`\n`}</p>
            <p><strong>Website:</strong> <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer">{user.website}</a></p>
            <p>{`\n`}</p>
            <p><strong>Address:</strong> {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}</p>
            <p>{`\n`}</p>
            <p><strong>Company:</strong> {user.company.name}</p>

            <h3>Sorry, but this is a dummy site:(</h3>
          </div>
        )}
      </main>

      <footer className="contact-footer">
        <p>© {new Date().getFullYear()} BricksHurt. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/about" state={{ section: "terms" }}>Terms</Link>
          <Link to="/about" state={{ section: "privacy" }}>Privacy</Link>
          <a href="https://ojas-prashant-vishe.netlify.app/" target="_blank">Contact</a>
          <Link to="/about" state={{ section: "FAQ" }}>FAQ</Link>
        </div>
      </footer>
    </div>
  );
}

export default Contact;
