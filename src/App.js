// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import ResumeUpload from "./pages/ResumeUpload";
// import Interview from "./pages/Interview";
// import Result from "./pages/Result";
// import Dashboard from "./pages/Dashboard";
// import Contact from "./pages/Contact";

// import "./App.css";

// function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />

//       <Routes>
//         <Route path="/home" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/resume" element={<ResumeUpload />} />
//         <Route path="/interview" element={<Interview />} />
//         <Route path="/result" element={<Result />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>

//       <Footer />
//     </BrowserRouter>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResumeUpload from "./pages/ResumeUpload";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Starting Page */}
        <Route path="/" element={<Home />} />

        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/resume" element={<ResumeUpload />} />

        <Route path="/interview" element={<Interview />} />

        <Route path="/result" element={<Result />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/contact" element={<Contact />} />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;
