// import { Link } from "react-router-dom";
// import "./Navbar.css";

// function Navbar() {
//   return (
//     <nav className="navbar">

//       <h2 className="logo">
//         🤖 AI Mock Interview
//       </h2>

//       <ul className="menu">
//         <li><Link to="/home">Home</Link></li>
//         <li><Link to="/login">Login</Link></li>
//         <li><Link to="/resume">Resume</Link></li>
//         <li><Link to="/interview">Interview</Link></li>
//         <li><Link to="/result">Result</Link></li>
//         <li><Link to="/dashboard">Dashboard</Link></li>
//         <li><Link to="/contact">Contact</Link></li>
//       </ul>

//     </nav>
//   );
// }

// export default Navbar;
// import React from "react";
// import { Link } from "react-router-dom";
// import "./Navbar.css";

// function Navbar() {
//   return (
//     <nav className="navbar">

//       <div className="logo">
//         🤖 AI Mock Interview
//       </div>

//       <ul className="nav-links">

//         <li><Link to="/">Home</Link></li>

//         <li><Link to="/login">Login</Link></li>

//         <li><Link to="/resume">Resume</Link></li>

//         <li><Link to="/interview">Interview</Link></li>

//         <li><Link to="/result">Result</Link></li>

//         <li><Link to="/dashboard">Dashboard</Link></li>

//         <li><Link to="/contact">Contact</Link></li>

//       </ul>

//     </nav>
//   );
// }

// export default Navbar;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  useEffect(() => {
    const checkLogin = () => {
      setLoggedIn(
        localStorage.getItem("loggedIn") === "true"
      );
    };

    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    localStorage.removeItem("candidateName");
    localStorage.removeItem("candidateEmail");
    localStorage.removeItem("candidateRole");
    localStorage.removeItem("resumeUploaded");
    localStorage.removeItem("resumeName");
    localStorage.removeItem("resumeText");
    localStorage.removeItem("interviewAnswers");

    setLoggedIn(false);

    alert("Logged out successfully 👋");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="logo">
        🤖 AI Mock Interview
      </div>

      <div className="nav-links">

  <Link to="/">
    Home
  </Link>

  {!loggedIn ? (
    <Link to="/login">
      Login
    </Link>
  ) : (
    <button
      className="logout-btn"
      onClick={handleLogout}
    >
      Logout
    </button>
  )}

  <Link to="/contact">
    Contact
  </Link>

</div>
    </nav>
  );
}

export default Navbar;