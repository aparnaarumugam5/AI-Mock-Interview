// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./Dashboard.css";

// function Dashboard() {

//   const navigate = useNavigate();

//   const uploaded =
//     localStorage.getItem("resumeUploaded") === "true";

//   const resumeName =
//     localStorage.getItem("resumeName");

//   return (

//     <div className="dashboard">

//       <h1>📊 Dashboard</h1>

//       <h2>Welcome 👋</h2>

//       <div className="cards">

//         <div className="card">
//           <h3>Total Interviews</h3>
//           <h1>5</h1>
//         </div>

//         <div className="card">
//           <h3>Best Score</h3>
//           <h1>92%</h1>
//         </div>

//         <div className="card">
//           <h3>Average Score</h3>
//           <h1>85%</h1>
//         </div>

//         <div className="card">
//           <h3>Resume Status</h3>

//           {uploaded ? (
//             <>
//               <h2 style={{ color: "green" }}>
//                 Uploaded ✅
//               </h2>

//               <p>{resumeName}</p>
//             </>
//           ) : (
//             <>
//               <h2 style={{ color: "red" }}>
//                 Not Uploaded ❌
//               </h2>
//             </>
//           )}

//         </div>

//       </div>

//       <br />

//       {!uploaded && (

//         <button
//           onClick={() => navigate("/resume")}
//         >
//           📄 Upload Resume
//         </button>

//       )}

//       <br /><br />

//       <button
//         onClick={() => navigate("/interview")}
//       >
//         🎤 Start Interview
//       </button>

//     </div>

//   );

// }

// export default Dashboard;
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import "./Dashboard.css";

// function Dashboard() {
//   const navigate = useNavigate();

//   const [interviews, setInterviews] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const candidateName =
//     localStorage.getItem("candidateName") ||
//     "Candidate";

//   const resumeUploaded =
//     localStorage.getItem("resumeUploaded") === "true";

//   const resumeName =
//     localStorage.getItem("resumeName") ||
//     "No resume uploaded";


//   // ==========================================
//   // FETCH ALL INTERVIEWS
//   // ==========================================

//   useEffect(() => {
//     fetchInterviews();
//   }, []);


//   const fetchInterviews = async () => {
//     try {

//       const response = await fetch(
//         "http://localhost:5000/api/interviews"
//       );

//       if (!response.ok) {
//         throw new Error(
//           "Unable to fetch interviews"
//         );
//       }

//       const data = await response.json();

//       setInterviews(
//         Array.isArray(data)
//           ? data
//           : []
//       );

//     } catch (error) {

//       console.error(
//         "Dashboard Error:",
//         error
//       );

//       setInterviews([]);

//     } finally {

//       setLoading(false);

//     }
//   };


//   // ==========================================
//   // SCORE CALCULATIONS
//   // ==========================================

//   const scores = interviews.map(
//     (item) =>
//       Number(item.overallScore) || 0
//   );


//   const totalInterviews =
//     interviews.length;


//   const bestScore =
//     scores.length > 0
//       ? Math.max(...scores)
//       : 0;


//   const averageScore =
//     scores.length > 0
//       ? Math.round(
//           scores.reduce(
//             (total, score) =>
//               total + score,
//             0
//           ) / scores.length
//         )
//       : 0;


//   // Latest interview
//   const latestInterview =
//     interviews.length > 0
//       ? interviews[0]
//       : null;


//   const latestScore =
//     Number(
//       latestInterview?.overallScore || 0
//     );


//   const latestSelected =
//     latestScore >= 60;


//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading) {
//     return (
//       <div className="dashboard">

//         <h1>
//           📊 Dashboard
//         </h1>

//         <p>
//           Loading your interview data...
//         </p>

//       </div>
//     );
//   }


//   // ==========================================
//   // DASHBOARD
//   // ==========================================

//   return (
//     <div className="dashboard">

//       <h1>
//         📊 Dashboard
//       </h1>

//       <h2>
//         Welcome {candidateName} 👋
//       </h2>


//       {/* ======================================
//           TOP CARDS
//       ====================================== */}

//       <div className="dashboard-cards">

//         {/* Total Interviews */}

//         <div className="dashboard-card">

//           <h3>
//             Total Interviews
//           </h3>

//           <div className="dashboard-value">
//             {totalInterviews}
//           </div>

//         </div>


//         {/* Best Score */}

//         <div className="dashboard-card">

//           <h3>
//             Best Score
//           </h3>

//           <div className="dashboard-value">
//             {bestScore}%
//           </div>

//         </div>


//         {/* Average Score */}

//         <div className="dashboard-card">

//           <h3>
//             Average Score
//           </h3>

//           <div className="dashboard-value">
//             {averageScore}%
//           </div>

//         </div>


//         {/* Resume */}

//         <div className="dashboard-card">

//           <h3>
//             Resume Status
//           </h3>

//           {resumeUploaded ? (

//             <>
//               <div className="uploaded">
//                 Uploaded ✅
//               </div>

//               <p className="resume-name">
//                 {resumeName}
//               </p>
//             </>

//           ) : (

//             <>
//               <div className="not-uploaded">
//                 Not Uploaded ❌
//               </div>

//               <button
//                 onClick={() =>
//                   navigate("/resume")
//                 }
//               >
//                 Upload Resume
//               </button>
//             </>

//           )}

//         </div>

//       </div>


//       {/* ======================================
//           LATEST INTERVIEW
//       ====================================== */}

//       {latestInterview && (

//         <div className="latest-interview">

//           <h2>
//             🎯 Latest Interview
//           </h2>


//           <div className="latest-details">

//             <p>
//               <strong>
//                 Role:
//               </strong>{" "}
//               {latestInterview.role}
//             </p>


//             <p>
//               <strong>
//                 Overall Score:
//               </strong>{" "}
//               {latestScore}/100
//             </p>


//             <p>
//               <strong>
//                 Communication:
//               </strong>{" "}
//               {latestInterview.communication || 0}%
//             </p>


//             <p>
//               <strong>
//                 Technical:
//               </strong>{" "}
//               {latestInterview.technical || 0}%
//             </p>


//             <p>
//               <strong>
//                 Confidence:
//               </strong>{" "}
//               {latestInterview.confidence || 0}%
//             </p>


//             <p>
//               <strong>
//                 Fluency:
//               </strong>{" "}
//               {latestInterview.fluency || 0}%
//             </p>

//           </div>


//           {/* Selection Status */}

//           <div
//             className={
//               latestSelected
//                 ? "dashboard-status selected"
//                 : "dashboard-status not-selected"
//             }
//           >

//             {latestSelected
//               ? "✅ SELECTED"
//               : "❌ NOT SELECTED"}

//           </div>


//           <br />


//           <button
//             className="view-result-btn"
//             onClick={() =>
//               navigate("/result")
//             }
//           >
//             📄 View Full Result
//           </button>

//         </div>

//       )}


//       {/* ======================================
//           NO INTERVIEW
//       ====================================== */}

//       {!latestInterview && (

//         <div className="no-interview">

//           <h2>
//             🎤 No Interview Completed
//           </h2>

//           <p>
//             Complete an AI mock interview
//             to see your performance here.
//           </p>

//         </div>

//       )}


//       {/* ======================================
//           START NEW INTERVIEW
//       ====================================== */}

//       <button
//         className="new-interview-btn"
//         onClick={() =>
//           navigate("/resume")
//         }
//       >
//         🎤 Start New Interview
//       </button>

//     </div>
//   );
// }

// export default Dashboard;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CURRENT LOGGED-IN USER
  // ==========================================

  const loggedInEmail =
    localStorage.getItem("userEmail") || "";

  const candidateName =
    localStorage.getItem("userName") ||
    localStorage.getItem("candidateName") ||
    "Candidate";

  const resumeUploaded =
    localStorage.getItem("resumeUploaded") === "true";

  const resumeName =
    localStorage.getItem("resumeName") ||
    "No resume uploaded";


  // ==========================================
  // FETCH CURRENT USER INTERVIEWS ONLY
  // ==========================================

  useEffect(() => {
    fetchInterviews();
  }, []);


  const fetchInterviews = async () => {
    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/interviews"
      );

      if (!response.ok) {
        throw new Error(
          "Unable to fetch interviews"
        );
      }

      const data = await response.json();

      console.log(
        "📊 All Interviews:",
        data
      );

      // ==========================================
      // FILTER BY LOGGED-IN USER EMAIL
      // ==========================================

      const userInterviews =
        Array.isArray(data)
          ? data.filter(
              (item) =>
                String(item.email || "")
                  .toLowerCase()
                  .trim() ===
                String(loggedInEmail)
                  .toLowerCase()
                  .trim()
            )
          : [];

      console.log(
        "👤 Current User Email:",
        loggedInEmail
      );

      console.log(
        "🎯 Current User Interviews:",
        userInterviews
      );

      setInterviews(
        userInterviews
      );

    } catch (error) {

      console.error(
        "Dashboard Error:",
        error
      );

      setInterviews([]);

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // SCORE CALCULATIONS
  // ==========================================

  const scores =
    interviews.map(
      (item) =>
        Number(item.overallScore) || 0
    );


  const totalInterviews =
    interviews.length;


  const bestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;


  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, score) =>
              total + score,
            0
          ) / scores.length
        )
      : 0;


  // ==========================================
  // LATEST INTERVIEW
  // ==========================================

  const latestInterview =
    interviews.length > 0
      ? interviews[0]
      : null;


  const latestScore =
    Number(
      latestInterview?.overallScore || 0
    );


  // Only an actual interview result
  // can have selection status
  const latestSelected =
    latestInterview
      ? latestScore >= 60
      : false;


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="dashboard">

        <h1>
          📊 Dashboard
        </h1>

        <p>
          Loading your interview data...
        </p>

      </div>
    );

  }


  // ==========================================
  // DASHBOARD
  // ==========================================

  return (

    <div className="dashboard">

      <h1>
        📊 Dashboard
      </h1>


      <h2>
        Welcome {candidateName} 👋
      </h2>


      {/* ======================================
          TOP CARDS
      ====================================== */}

      <div className="dashboard-cards">


        {/* TOTAL INTERVIEWS */}

        <div className="dashboard-card">

          <h3>
            Total Interviews
          </h3>

          <div className="dashboard-value">
            {totalInterviews}
          </div>

        </div>


        {/* BEST SCORE */}

        <div className="dashboard-card">

          <h3>
            Best Score
          </h3>

          <div className="dashboard-value">
            {bestScore}%
          </div>

        </div>


        {/* AVERAGE SCORE */}

        <div className="dashboard-card">

          <h3>
            Average Score
          </h3>

          <div className="dashboard-value">
            {averageScore}%
          </div>

        </div>


        {/* RESUME */}

        <div className="dashboard-card">

          <h3>
            Resume Status
          </h3>


          {resumeUploaded ? (

            <>
              <div className="uploaded">
                Uploaded ✅
              </div>

              <p className="resume-name">
                {resumeName}
              </p>
            </>

          ) : (

            <>
              <div className="not-uploaded">
                Not Uploaded ❌
              </div>

              <button
                onClick={() =>
                  navigate("/resume")
                }
              >
                Upload Resume
              </button>
            </>

          )}

        </div>

      </div>


      {/* ======================================
          LATEST INTERVIEW
      ====================================== */}

      {latestInterview && (

        <div className="latest-interview">

          <h2>
            🎯 Latest Interview
          </h2>


          <div className="latest-details">

            <p>
              <strong>
                Role:
              </strong>{" "}
              {latestInterview.role}
            </p>


            <p>
              <strong>
                Overall Score:
              </strong>{" "}
              {latestScore}/100
            </p>


            <p>
              <strong>
                Communication:
              </strong>{" "}
              {latestInterview.communication || 0}%
            </p>


            <p>
              <strong>
                Technical:
              </strong>{" "}
              {latestInterview.technical || 0}%
            </p>


            <p>
              <strong>
                Confidence:
              </strong>{" "}
              {latestInterview.confidence || 0}%
            </p>


            <p>
              <strong>
                Fluency:
              </strong>{" "}
              {latestInterview.fluency || 0}%
            </p>

          </div>


          {/* ======================================
              SELECTION STATUS
          ====================================== */}

          <div
            className={
              latestSelected
                ? "dashboard-status selected"
                : "dashboard-status not-selected"
            }
          >

            {latestSelected
              ? "✅ SELECTED"
              : "❌ NOT SELECTED"}

          </div>


          <br />


          <button
            className="view-result-btn"
            onClick={() =>
              navigate("/result")
            }
          >
            📄 View Full Result
          </button>

        </div>

      )}


      {/* ======================================
          NO INTERVIEW
      ====================================== */}

      {!latestInterview && (

        <div className="no-interview">

          <h2>
            🎤 No Interview Completed
          </h2>

          <p>
            Complete an AI mock interview
            to see your performance here.
          </p>

        </div>

      )}


      {/* ======================================
          START NEW INTERVIEW
      ====================================== */}

      <button
        className="new-interview-btn"
        onClick={() =>
          navigate("/resume")
        }
      >
        🎤 Start New Interview
      </button>

    </div>

  );

}

export default Dashboard;