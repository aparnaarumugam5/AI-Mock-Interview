// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./ResumeUpload.css";

// function ResumeUpload() {

//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("");
//   const [file, setFile] = useState(null);

//   const uploadResume = () => {

//     if (!name || !email || !role || !file) {
//       alert("Please fill all details and upload your resume.");
//       return;
//     }

//     localStorage.setItem("candidateName", name);
//     localStorage.setItem("candidateEmail", email);
//     localStorage.setItem("candidateRole", role);
//     localStorage.setItem("resumeUploaded", "true");
//     localStorage.setItem("resumeName", file.name);

//     alert("Resume Uploaded Successfully ✅");

//     navigate("/interview");

//   };

//   return (

//     <div className="resume">

//       <h1>📄 Resume Upload</h1>

//       <input
//         type="text"
//         placeholder="Enter Your Name"
//         value={name}
//         onChange={(e)=>setName(e.target.value)}
//       />

//       <input
//         type="email"
//         placeholder="Enter Your Email"
//         value={email}
//         onChange={(e)=>setEmail(e.target.value)}
//       />

//       <select
//         value={role}
//         onChange={(e)=>setRole(e.target.value)}
//       >
//         <option value="">Select Role</option>
//         <option>Frontend Developer</option>
//         <option>Backend Developer</option>
//         <option>Full Stack Developer</option>
//         <option>Java Developer</option>
//         <option>Python Developer</option>
//         <option>React Developer</option>
//       </select>

//       <input
//         type="file"
//         accept=".pdf,.doc,.docx"
//         onChange={(e)=>setFile(e.target.files[0])}
//       />

//       {file && (
//         <p>
//           📄 {file.name}
//         </p>
//       )}

//       <button onClick={uploadResume}>
//         Upload Resume
//       </button>

//     </div>

//   );

// }

// export default ResumeUpload;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./ResumeUpload.css";

// function ResumeUpload() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const uploadResume = async () => {
//     // Check all fields
//     if (!name || !email || !role || !file) {
//       alert("Please fill all details and upload your resume.");
//       return;
//     }

//     // PDF only
//     if (file.type !== "application/pdf") {
//       alert("Please upload a PDF resume only.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Create FormData
//       const formData = new FormData();

//       formData.append("name", name);
//       formData.append("email", email);
//       formData.append("role", role);
//       formData.append("resume", file);

//       // Send resume to backend
//       const response = await fetch(
//         "http://localhost:5000/api/resume/upload",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Resume upload failed");
//       }

//       console.log("Resume Analysis:", data);

//       // Save candidate details
//       localStorage.setItem("candidateName", name);
//       localStorage.setItem("candidateEmail", email);
//       localStorage.setItem("candidateRole", role);
//       localStorage.setItem("resumeUploaded", "true");
//       localStorage.setItem("resumeName", file.name);

//       // Save extracted resume text
//       localStorage.setItem("resumeText", data.resumeText || "");

//       // Clear previous interview answers
//       localStorage.removeItem("interviewAnswers");

//       alert("Resume Uploaded & Analyzed Successfully ✅");

//       // Go to interview
//       navigate("/interview");

//     } catch (error) {
//       console.error("Resume Upload Error:", error);

//       alert(
//         "Resume upload failed ❌\n\n" +
//         (error.message || "Please check whether the backend server is running.")
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="resume">

//       <h1>📄 Resume Upload</h1>

//       <input
//         type="text"
//         placeholder="Enter Your Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         type="email"
//         placeholder="Enter Your Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <select
//         value={role}
//         onChange={(e) => setRole(e.target.value)}
//       >
//         <option value="">Select Role</option>
//         <option value="Frontend Developer">
//           Frontend Developer
//         </option>
//         <option value="Backend Developer">
//           Backend Developer
//         </option>
//         <option value="Full Stack Developer">
//           Full Stack Developer
//         </option>
//         <option value="Java Developer">
//           Java Developer
//         </option>
//         <option value="Python Developer">
//           Python Developer
//         </option>
//         <option value="React Developer">
//           React Developer
//         </option>
//       </select>

//       <input
//         type="file"
//         accept=".pdf"
//         onChange={(e) => setFile(e.target.files[0])}
//       />

//       {file && (
//         <p>
//           📄 {file.name}
//         </p>
//       )}

//       <button
//         onClick={uploadResume}
//         disabled={loading}
//       >
//         {loading ? "Analyzing Resume..." : "Upload Resume"}
//       </button>

//     </div>
//   );
// }

// export default ResumeUpload;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResumeUpload.css";

function ResumeUpload() {
  const navigate = useNavigate();

  // Get logged-in user details
  const userName = localStorage.getItem("userName") || "";
  const userEmail = localStorage.getItem("userEmail") || "";

  const [name] = useState(userName);
  const [email] = useState(userEmail);
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    // Check all fields
    if (!name || !email || !role || !file) {
      alert("Please select a role and upload your resume.");
      return;
    }

    // PDF only
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF resume only.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("role", role);
      formData.append("resume", file);

      const response = await fetch(
        "http://localhost:5000/api/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Resume upload failed");
      }

      console.log("Resume Analysis:", data);

      // Save candidate details
      localStorage.setItem("candidateName", name);
      localStorage.setItem("candidateEmail", email);
      localStorage.setItem("candidateRole", role);
      localStorage.setItem("resumeUploaded", "true");
      localStorage.setItem("resumeName", file.name);

      // Save extracted resume text
      localStorage.setItem("resumeText", data.resumeText || "");

      // Clear previous interview answers
      localStorage.removeItem("interviewAnswers");

      alert("Resume Uploaded & Analyzed Successfully ✅");

      navigate("/interview");

    } catch (error) {
      console.error("Resume Upload Error:", error);

      alert(
        "Resume upload failed ❌\n\n" +
        (error.message ||
          "Please check whether the backend server is running.")
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume">

      <h1>📄 Resume Upload</h1>

      {/* Logged-in user's name */}
      <input
        type="text"
        value={name}
        readOnly
        placeholder="Your Name"
      />

      {/* Logged-in user's email */}
      <input
        type="email"
        value={email}
        readOnly
        placeholder="Your Email"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Select Role</option>

        <option value="Frontend Developer">
          Frontend Developer
        </option>

        <option value="Backend Developer">
          Backend Developer
        </option>

        <option value="Full Stack Developer">
          Full Stack Developer
        </option>

        <option value="Java Developer">
          Java Developer
        </option>

        <option value="Python Developer">
          Python Developer
        </option>

        <option value="React Developer">
          React Developer
        </option>
      </select>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {file && (
        <p>
          📄 {file.name}
        </p>
      )}

      <button
        onClick={uploadResume}
        disabled={loading}
      >
        {loading
          ? "Analyzing Resume..."
          : "Upload Resume"}
      </button>

    </div>
  );
}

export default ResumeUpload;