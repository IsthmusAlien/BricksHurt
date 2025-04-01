import React, { useState, useEffect, useMemo } from "react";
import "./css/Info.css";
import { Ruler, ArrowRightLeft, Sofa, Compass, Layers, Bath, Columns, Building, IndianRupeeIcon,
IdCard, Calendar, Stamp, House, SwatchBook, Footprints, AlarmClockCheck, TimerReset, Hammer, PencilRuler,
HandCoins, Scaling, LetterText, MapPlus,
MapPin} from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";

function Info() {
  const location = useLocation();
  const navigate = useNavigate();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
        console.log("Razorpay SDK loaded successfully");
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
      };
      document.body.appendChild(script);
    };

    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      setRazorpayLoaded(true);
    }

    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) {}
    };
  }, []);

  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK is still loading. Please try again in a moment.");
      return;
    }

    const options = {
      key: process.env.REACT_APP_API_KEY,
      amount: 19900, 
      currency: "INR",
      name: "test",
      description: "Company Registration",
      handler: async function (response) {
        console.log("Payment successful:", response);
        navigate(`/contactAgentDetails/${generateRandomString()}`);
      },
      prefill: {
        name: "test",
        email: "test@gmail.com",
        contact: "1234567890" || "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
          console.log("Payment dismissed");
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
      alert("Failed to initialize payment gateway. Please try again later.");
    }
  };

  const { displayResult: init_displayResult } = location.state || {};

  const propertyImageNew = useMemo(
    () => (init_displayResult?.propertyImageNew ? init_displayResult.propertyImageNew.split(",") : []),
    [init_displayResult?.propertyImageNew]
  );

  const [validImages, setValidImages] = useState([]);
  const [allRequestsSuccessful, setAllRequestsSuccessful] = useState(false);

  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 25);
  };

  useEffect(() => {
    if (propertyImageNew.length === 0) return;

    const checkImages = async () => {
      let successCount = 0;
      const validatedImages = await Promise.all(
        propertyImageNew.map((imgSrc) =>
          fetch(imgSrc, { method: "HEAD" }) 
            .then((res) => {
              if (res.ok) {
                successCount++;
                return imgSrc;
              }
              return null;
            })
            .catch(() => null)
        )
      );

      setValidImages(validatedImages.filter(Boolean)); 
      setAllRequestsSuccessful(successCount === propertyImageNew.length);
    };

    checkImages();
  }, [propertyImageNew]);

  return (
    <div className="infopage-container">
      <nav className="infopage-nav">
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

      <main className="infopage-main">

        {init_displayResult.image ? (
          <img 
            src={init_displayResult.image} 
            alt="Property Image" 
            className="info-image" 
            onError={(e) => { e.target.src = "./assets/img_not_found.jpg"; }} 
          />
        ) : (
          <img src="/assets/img_not_found.jpg" alt="Image Not Found" className="result-image" />
        )}

        {allRequestsSuccessful && validImages.length > 0 && (
          <>
            <h2 className="gallery-title">Gallery</h2>
            <div className="scrollable-gallery">
              {validImages.map((imgSrc, index) => (
                <img key={index} src={imgSrc} alt={`Gallery ${index + 1}`} className="gallery-img" />
              ))}
            </div>
          </>
        )}

        <div className="info-content_1">

        <button 
          className="info-details-button" 
          onClick={(e) => {
            e.stopPropagation();
            handlePayment();
          }}
        >
          Get Contact
        </button>

          <span>
            <p className="flex items-center gap-1">
              <Building className="text-indigo-500" size={18} />
              <strong>{init_displayResult.caCompNameD}</strong>
            </p>
            <p className="flex items-center gap-1">
              <IndianRupeeIcon className="text-green-500" size={18} />
              {init_displayResult.priceD}
            </p>
            </span>

          <h3>{init_displayResult.propertyTitle}...</h3>

          {init_displayResult.dtldesc && (
            <p>{init_displayResult.dtldesc}</p>
          )}

          {init_displayResult.bookingAmtExact && ( 
            <>
              <p>{`\n`}</p>      
              <h4 className="flex items-center gap-2">                     
                <HandCoins className="text-teal-500" size={20} />                     
                <strong>Booking Amount:</strong> ₹ {init_displayResult.bookingAmtExact}                   
              </h4>    
            </>                 
          )}

          {init_displayResult.seoDesc && (
            <>
              <p>{`\n`}</p>
              <h4 className="flex items-center gap-2">                     
                <LetterText className="text-teal-500" size={20} />                     
                <strong>Description:</strong>                
              </h4>     
              <p>{init_displayResult.seoDesc}</p>
            </>
          )}

          {init_displayResult.psmAdd && (
            <>
              <p>{`\n`}</p>
              <h4 className="flex items-center gap-2">                     
                <MapPin className="text-teal-500" size={20} />                     
                <strong>Address:</strong>                
              </h4>     
              <p>{init_displayResult.psmAdd}</p>
            </>
          )}

          {init_displayResult.landmarkDetails && init_displayResult.landmarkDetails.length > 0 && (
            <>
              <p>{`\n`}</p>
              <h4 className="flex items-center gap-2">                     
                <MapPlus className="text-teal-500" size={20} />                     
                <strong>Near To:</strong>                
              </h4>    
              <div style={{ marginBottom : '10px'}}>
                {init_displayResult.landmarkDetails.map((item) => {
                  const [id, details] = item.split("|");
                  return (
                    <p key={id} className="p-2 border rounded-lg shadow" style={{ marginBottom : '0'}}>
                      {details}
                    </p>
                  );
                })}
              </div>
            </>
          )}

          {init_displayResult.propTypeD && (                   
            <h4 className="flex items-center gap-2">                     
              <House className="text-teal-500" size={20} />                     
              <strong>Property:</strong> {init_displayResult.propTypeD}                   
            </h4>                 
          )}

          <h4 className="flex items-center gap-2">
            <IdCard className="text-blue-500" size={20} />
            <strong>ID:</strong> {parseInt(init_displayResult.id, 10) - 234}-{parseInt(init_displayResult.actualOwner, 10) - 344}
          </h4>
          <h4 className="flex items-center gap-2">
            <Calendar className="text-blue-500" size={20} />
            <strong>{init_displayResult.postedLabelD}</strong>
          </h4>

        </div>

        <div className="info-content_2 space-y-2">

          {init_displayResult.OwnershipTypeD && (                   
            <p className="flex items-center gap-2">                     
              <Stamp className="text-teal-500" size={20} />                     
              <strong>Ownership:</strong> {init_displayResult.OwnershipTypeD}                   
            </p>                 
          )}
                            
          <p className="flex items-center gap-2">
            <AlarmClockCheck className="text-teal-500" size={20} />
            <strong>Availability:</strong>  
            {init_displayResult.avlAfter?.trim() ? `After ${init_displayResult.avlAfter.split(" ")[0]}` : "Instant"}
          </p>

          {init_displayResult.acD && (
            <p className="flex items-center gap-2">
              <Hammer className="text-green-500" size={20} />
              <strong>Property Age:</strong> {init_displayResult.acD}
            </p>
          )}

          {init_displayResult.transactionTypeD && (
            <p className="flex items-center gap-2">
              <ArrowRightLeft className="text-green-500" size={20} />
              <strong>Transaction:</strong> {init_displayResult.transactionTypeD}
            </p>
          )}

          {init_displayResult.maintenanceD && (
            <p className="flex items-center gap-2">
              <TimerReset className="text-green-500" size={20} />
              <strong>Maintenance:</strong> {init_displayResult.maintenanceD}
            </p>
          )}

          {init_displayResult.sqFtPrD && (
            <p className="flex items-center gap-2">
              <Footprints className="text-green-500" size={20} />
              <strong>Price/Sqft:</strong> ₹ {init_displayResult.sqFtPrD}
            </p>
          )}

          {init_displayResult.carpetArea && (
            <p className="flex items-center gap-2">
              <PencilRuler className="text-blue-500" size={20} />
              <strong>Carpet Area:</strong> {init_displayResult.carpetArea} sqft
            </p>
          )}

          {init_displayResult.coveredArea && (
            <p className="flex items-center gap-2">
              <Ruler className="text-blue-500" size={20} />
              <strong>Covered Area:</strong> {(init_displayResult.coveredArea)} sqft
            </p>
          )}

          {init_displayResult.la && (
            <p className="flex items-center gap-2">
              <Scaling className="text-blue-500" size={20} />
              <strong>Total Area:</strong> {(init_displayResult.la)} sqft
            </p>
          )}

          {init_displayResult.furnishedD && (
            <p className="flex items-center gap-2">
              <Sofa className="text-purple-500" size={20} />
              <strong>Furnishing:</strong> {init_displayResult.furnishedD}
            </p>
          )}

          {init_displayResult.flooringTyD && (
            <p className="flex items-center gap-2">
              <SwatchBook className="text-purple-500" size={20} />
              <strong>Flooring:</strong> {init_displayResult.flooringTyD}
            </p>
          )}

          {init_displayResult.facingD && (
            <p className="flex items-center gap-2">
              <Compass className="text-red-500" size={20} />
              <strong>Facing:</strong> {init_displayResult.facingD}
            </p>
          )}

          {init_displayResult.floorD && (
            <p className="flex items-center gap-2">
              <Layers className="text-orange-500" size={20} />
              <strong>Floor:</strong> {init_displayResult.floorD}
            </p>
          )}

          {init_displayResult.bathD && (                   
            <p className="flex items-center gap-2">                     
              <Bath className="text-cyan-500" size={20} />                     
              <strong>Bathroom:</strong> {init_displayResult.bathD}                   
            </p>                 
          )}

          {init_displayResult.balconiesD && (                   
            <p className="flex items-center gap-2">                     
              <Columns className="text-teal-500" size={20} />                     
              <strong>Balcony:</strong> {init_displayResult.balconiesD}                   
            </p>                 
          )}
          
        </div>

        {init_displayResult.ltcoordGeo && (() => {
          const mapsrc = `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${init_displayResult.ltcoordGeo.split(',')[0]},${init_displayResult.ltcoordGeo.split(',')[1]}+(test)&t=&z=14&ie=UTF8&iwloc=B&output=embed`;
          
          return (
            <div style={{ width: "100%" }}>
              <iframe 
                width="100%" 
                height="600" 
                frameborder="0" 
                scrolling="no" 
                marginheight="0" 
                marginwidth="0" 
                src={mapsrc}
              >
              </iframe>
            </div>
          );
        })()}

      </main>

      <footer className="infopage-footer">
        <p>© {new Date().getFullYear()} BricksHurt. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/about" state={{ section: "terms" }}>Terms</Link>
          <Link to="/about" state={{ section: "privacy" }}>Privacy</Link>
          <a href="https://ojas-prashant-vishe.netlify.app/" target="_blank" rel="noopener noreferrer">Contact</a>
          <Link to="/about" state={{ section: "FAQ" }}>FAQ</Link>
        </div>
      </footer>
    </div>
  );
}

export default Info;
