import React, { useState, useRef, useEffect } from "react";
import "./css/Home.css";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [searchLocation, setsearchLocation] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchpropertyType, setsearchpropertyType] = useState("");
  const [searchtransactionType, setsearchtransactionType] = useState("Sale"); 
  const dropdownRef = useRef(null);

  const handleSearchLocation = async (e) => {
    const value = e.target.value;
    setsearchLocation(value);
  
    if (value.trim() === "") {
      setResults([]);
      return;
    }
  
    const fetchData = async (attempt = 1) => {
      try {
        const response = await fetch(`https://kiki56qweb.pythonanywhere.com/search?q=${value}`);
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error(`Attempt ${attempt} failed`, error);
        if (attempt < 2) {
          setTimeout(() => fetchData(attempt + 1), 1500); // Retry once after delay
        }
      }
    };
  
    fetchData();
  };
  
  const handleSelectCity = (cityName) => {
    setsearchLocation(cityName);
    setShowResults(false);
  };

  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleSearchResults = async () => {

    if (!searchLocation || !searchpropertyType || !searchtransactionType) {
      return;
    }

    try {
      const response = await fetch(
        `https://kiki56qweb.pythonanywhere.com/get_initial_page?l=${searchLocation}&pt=${searchpropertyType}&t=${searchtransactionType}`
      );
      const data = await response.json();

      navigate(`/displayResults/${generateRandomString()}`, {
        state: { searchResults: data, locationType: searchLocation, propertyType: searchpropertyType, transactionType: searchtransactionType }
      });
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="homepage-container">
      <nav className="homepage-nav">
        <div className="nav-logo">
          <a href="/">
            <img src="./logo.png" alt="Logo" className="logo-img" />
            BricksHurt
          </a>
        </div>
        <ul className="nav-links">
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      
      <main className="homepage-main">
        <motion.div className="hero-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <motion.h1 className="homepage-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            Helping You Discover
          </motion.h1>
          <motion.p className="homepage-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            Your Dream Property
          </motion.p>
          <motion.div className="search-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            
            <div className="custom-dropdown" ref={dropdownRef}>
              <input type="text" className="search-input" placeholder="Search for Cities or Neighborhoods..." value={searchLocation} onChange={handleSearchLocation} onFocus={() => results.length > 0 && setShowResults(true)} />
              {showResults && results.length > 0 && (
                <div className="dropdown-results">
                  {results.map((city) => (
                    <div key={city.name} className="dropdown-item" onClick={() => handleSelectCity(city.name)}>
                      {city.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <select className="property-type" value={searchpropertyType} onChange={(e) => setsearchpropertyType(e.target.value)}>
              <option value="" className="placeholder-option">Select Property Type</option>
              <option value="Flat">Flat</option>
              <option value="House_Villa">House / Villa</option>
              <option value="Agricultural Land">Agricultural Land</option>
              <option value="Commercial Land">Commercial Land</option>
              <option value="Industrial Building">Industrial Building</option>
              <option value="Industrial Shed">Industrial Shed</option>
              <option value="Warehouse_Godown">Warehouse / Godown</option>
              <option value="Shop_Showroom">Shop / Showroom</option>
              <option value="Farm House">Farm House</option>
              <option value="Office Space">Office Space</option>
              <option value="Plot_Land">Plot / Land</option>
            </select>

            <div className="toggle-container">
              <span className={searchtransactionType === "Rent" ? "toggle-label active" : "toggle-label"}>Rent</span>
              <label className="switch">
                <input type="checkbox" checked={searchtransactionType === "Sale"} onChange={() => setsearchtransactionType(searchtransactionType === "Rent" ? "Sale" : "Rent")} />
                <span className="slider round"></span>
              </label>
              <span className={searchtransactionType === "Sale" ? "toggle-label active" : "toggle-label"}>Sale</span>
            </div>

            <button className="search-btn" onClick={handleSearchResults}>
              Search
            </button>
          </motion.div>
        </motion.div>
      </main>

      <footer className="homepage-footer">
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

export default HomePage;
