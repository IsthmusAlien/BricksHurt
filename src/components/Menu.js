import React, { useState, useEffect, useRef } from "react";
import "./css/Menu.css";
import { Ruler, ArrowRightLeft, Sofa, Compass, Layers, Bath, Columns, Building, IndianRupeeIcon, ArrowLeftCircle, 
ArrowRightCircle, IdCard, Calendar, Stamp, House, SwatchBook, Footprints, AlarmClockCheck, TimerReset, 
Hammer, PencilRuler, Scaling} from 'lucide-react';
import { useLocation, Link, useNavigate, useNavigationType  } from "react-router-dom";

function Menu() {
  const navigationType = useNavigationType();
  const location = useLocation();
  const navigate = useNavigate();


  let { searchResults: init_searchResults, locationType: init_searchLocation, propertyType: init_propertyType, transactionType: init_transactionType } = location.state || {};
  
  const initialSearchResults =
  navigationType === "PUSH"
    ? init_searchResults
    : JSON.parse(sessionStorage.getItem("searchResults")) || init_searchResults;

  const initialPage =
    navigationType === "PUSH"
      ? 1
      : Number(sessionStorage.getItem("currentPage")) || 1;

  const initialSearchLocation =
    navigationType === "PUSH"
      ? init_searchLocation
      : sessionStorage.getItem("searchLocation") || init_searchLocation;

  const initialPropertyType =
    navigationType === "PUSH"
      ? init_propertyType
      : sessionStorage.getItem("propertyType") || init_propertyType;

  const initialTransactionType =
    navigationType === "PUSH"
      ? init_transactionType
      : sessionStorage.getItem("transactionType") || init_transactionType;

  const [searchlocation, setSearchLocation] = useState(() => {
    sessionStorage.setItem("searchLocation", initialSearchLocation);
    return initialSearchLocation;
  });

  const [propertytype, setPropertyType] = useState(() => {
    sessionStorage.setItem("propertyType", initialPropertyType);
    return initialPropertyType;
  });

  const [transactionType, settransactionType] = useState(() => {
    sessionStorage.setItem("transactionType", initialTransactionType);
    return initialTransactionType;
  });

  const [searchResults, setSearchResults] = useState(() => {
    sessionStorage.setItem("searchResults", JSON.stringify(initialSearchResults));  
    return initialSearchResults;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    sessionStorage.setItem("currentPage", 1);
    return initialPage;
  });

  const [totalPages, setTotalPages] = useState(init_searchResults?.pages || 0);
  const pagesPerView = 3; 

  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef(null);

  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleSearchLocation = async (e) => {
    const value = e.target.value;
    setSearchLocation(value)
    
    if (value.trim() === "") {
      setResults([]);
      return;
    }
    
    try {
      const response = await fetch(`https://kiki56qweb.pythonanywhere.com/search?q=${value}`);
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };
  
  const handleSelectCity = (cityName) => {
    setSearchLocation(cityName)
    setShowResults(false);
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

  useEffect(() => {
    if (searchResults) {
      setTotalPages(searchResults.pages || 0);
    }
  }, [searchResults]);

  if (!searchResults || !searchResults.data) {
    return <p>No results found.</p>;
  }

  const handleSearchResults = async (page) => {

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });

    try {
      let response;

      if (page === -1) {

        response = await fetch(
          `https://kiki56qweb.pythonanywhere.com/get_initial_page?l=${searchlocation}&pt=${propertytype}&t=${transactionType}`
        );
      } else {

        response = await fetch(
          `https://kiki56qweb.pythonanywhere.com/get_page?l=${searchlocation}&pt=${propertytype}&t=${transactionType}&k=${page}`
        );
      }
      const data = await response.json();

      setSearchResults(data);

      sessionStorage.setItem("searchResults", JSON.stringify(data));  
      sessionStorage.setItem("searchLocation", searchlocation);
      sessionStorage.setItem("propertyType", propertytype);
      sessionStorage.setItem("transactionType", transactionType);

      sessionStorage.getItem("propertyType")

      setTotalPages(data.pages || 0);

      sessionStorage.setItem("currentPage", page);

    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const startPage = Math.max(1, currentPage - Math.floor(pagesPerView / 2));
  const endPage = Math.min(totalPages, startPage + pagesPerView - 1);
  const visiblePages = [...Array(endPage - startPage + 1)].map((_, i) => startPage + i);

  return (
    <>
      <nav className="homepage-nav">
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
      <div className="filter-container filter-container-menu">
        <select 
          className="filter-dropdown filter-dropdown-menu"
          value={propertytype}
          onChange={(e) => setPropertyType(e.target.value)}
        >
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

        <select 
          className="filter-dropdown filter-dropdown-menu"
          value={transactionType}
          onChange={(e) => settransactionType(e.target.value)}
        >
          <option value="Sale">Sale</option>
          <option value="Rent">Rent</option>
        </select>

        <div className="custom-dropdown custom-dropdown-menu" ref={dropdownRef}>
          <input type="text" className="search-input" placeholder="Search for Cities or Neighborhoods..." value={searchlocation} onChange={handleSearchLocation} onFocus={() => results.length > 0 && setShowResults(true)} />
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

        <button className="filter-button" onClick={() => handleSearchResults(-1)}>Apply Filters</button>
      </div>

      <div className="results-container">
        <ul className="results-list">
          {searchResults?.data?.length > 0 
          ? searchResults.data.map((result, index) => (
            <li key={index} className="result-item">
              {result.image ? (
                <img 
                  src={result.image} 
                  alt="Property Image" 
                  className="result-image" 
                  onError={(e) => { e.target.src = "./assets/img_not_found.jpg"; }} 
                />
              ) : (
                <img src="/assets/img_not_found.jpg" alt="Image Not Found" className="result-image" />
              )}

              <div className="result-content_1">
                <span>
                  <p className="flex items-center gap-1">
                    <Building className="text-indigo-500" size={18} />
                    <strong>{result.caCompNameD}</strong>
                  </p>
                  <p className="flex items-center gap-1">
                    <IndianRupeeIcon className="text-green-500" size={18} />
                    {result.priceD}
                  </p>
                  </span>

                <h3>{result.propertyTitle}...</h3>
                <p>{result.auto_desc}...</p>

                {result.propTypeD && (                   
                  <h4 className="flex items-center gap-2">                     
                    <House className="text-teal-500" size={20} />                     
                    <strong>Property:</strong> {result.propTypeD}                   
                  </h4>                 
                )}

                <h4 className="flex items-center gap-2">
                  <IdCard className="text-blue-500" size={20} />
                  <strong>ID:</strong> {parseInt(result.id, 10) - 234}-{parseInt(result.actualOwner, 10) - 344}
                </h4>
                <h4 className="flex items-center gap-2">
                  <Calendar className="text-blue-500" size={20} />
                  <strong>{result.postedLabelD}</strong>
                </h4>

                <button 
                  className="view-details-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/propertyDetails/${generateRandomString()}`, { state: { displayResult: result } });
                  }}
                >
                  View Details
                </button>
              </div>
              <div className="result-content_2 space-y-2">

                {result.OwnershipTypeD && (                   
                  <p className="flex items-center gap-2">                     
                    <Stamp className="text-teal-500" size={20} />                     
                    <strong>Ownership:</strong> {result.OwnershipTypeD}                   
                  </p>                 
                )}
                                  
                <p className="flex items-center gap-2">
                  <AlarmClockCheck className="text-teal-500" size={20} />
                  <strong>Availability:</strong>  
                  {result.avlAfter?.trim() ? `After ${result.avlAfter.split(" ")[0]}` : "Instant"}
                </p>

                {result.acD && (
                  <p className="flex items-center gap-2">
                    <Hammer className="text-green-500" size={20} />
                    <strong>Property Age:</strong> {result.acD}
                  </p>
                )}

                {result.transactionTypeD && (
                  <p className="flex items-center gap-2">
                    <ArrowRightLeft className="text-green-500" size={20} />
                    <strong>Transaction:</strong> {result.transactionTypeD}
                  </p>
                )}

                {result.maintenanceD && (
                  <p className="flex items-center gap-2">
                    <TimerReset className="text-green-500" size={20} />
                    <strong>Maintenance:</strong> {result.maintenanceD}
                  </p>
                )}

                {result.sqFtPrD && (
                  <p className="flex items-center gap-2">
                    <Footprints className="text-green-500" size={20} />
                    <strong>Price/Sqft:</strong> ₹ {result.sqFtPrD}
                  </p>
                )}

                {result.carpetArea && (
                  <p className="flex items-center gap-2">
                    <PencilRuler className="text-blue-500" size={20} />
                    <strong>Carpet Area:</strong> {result.carpetArea} sqft
                  </p>
                )}

                {result.coveredArea && (
                  <p className="flex items-center gap-2">
                    <Ruler className="text-blue-500" size={20} />
                    <strong>Covered Area:</strong> {(result.coveredArea)} sqft
                  </p>
                )}

                {result.la && (
                  <p className="flex items-center gap-2">
                    <Scaling className="text-blue-500" size={20} />
                    <strong>Total Area:</strong> {(result.la)} sqft
                  </p>
                )}

                {result.furnishedD && (
                  <p className="flex items-center gap-2">
                    <Sofa className="text-purple-500" size={20} />
                    <strong>Furnishing:</strong> {result.furnishedD}
                  </p>
                )}

                {result.flooringTyD && (
                  <p className="flex items-center gap-2">
                    <SwatchBook className="text-purple-500" size={20} />
                    <strong>Flooring:</strong> {result.flooringTyD}
                  </p>
                )}

                {result.facingD && (
                  <p className="flex items-center gap-2">
                    <Compass className="text-red-500" size={20} />
                    <strong>Facing:</strong> {result.facingD}
                  </p>
                )}

                {result.floorD && (
                  <p className="flex items-center gap-2">
                    <Layers className="text-orange-500" size={20} />
                    <strong>Floor:</strong> {result.floorD}
                  </p>
                )}

                {result.bathD && (                   
                  <p className="flex items-center gap-2">                     
                    <Bath className="text-cyan-500" size={20} />                     
                    <strong>Bathroom:</strong> {result.bathD}                   
                  </p>                 
                )}

                {result.balconiesD && (                   
                  <p className="flex items-center gap-2">                     
                    <Columns className="text-teal-500" size={20} />                     
                    <strong>Balcony:</strong> {result.balconiesD}                   
                  </p>                 
                )}
                
              </div>
            </li>
          )) :
          
          <div className="no-results">No results found</div>

          }
        </ul>

      </div>

      {searchResults?.pages !== 1 && (
        <div className="pages-container">
          {currentPage > 1 && (
            <button className="page-box" onClick={() => handleSearchResults(currentPage - 1)}>
              <ArrowLeftCircle />
            </button>
          )}

          {startPage > 1 && (
            <>
              <button className="page-box" onClick={() => handleSearchResults(1)}>1</button>
              {startPage > 2 && <span className="dots">...</span>}
            </>
          )}

          {visiblePages.map((page) => (
            <button
              key={page}
              className={`page-box ${currentPage === page ? "active" : ""}`}
              onClick={() => handleSearchResults(page)}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="dots">...</span>}
              <button className="page-box" onClick={() => handleSearchResults(totalPages)}>
                {totalPages}
              </button>
            </>
          )}

          {currentPage < totalPages && (
            <button className="page-box" onClick={() => handleSearchResults(currentPage + 1)}>
              <ArrowRightCircle />
            </button>
          )}
        </div>
      )}

      
    </>
  );
}

export default Menu;
