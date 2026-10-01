// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Result.css";

// function Result() {
//   const navigate = useNavigate();

//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/interview")
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         setResult(data);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   if (!result) {
//     return (
//       <h2 style={{ textAlign: "center", marginTop: "100px" }}>
//         Loading...
//       </h2>
//     );
//   }

//   return (
//     <div className="result">

//       <h1>🎯 AI Interview Result</h1>

//       <div className="score-card">

//         <h2>Overall Score</h2>

//         <h1>{result.overallScore}/100</h1>

//       </div>

//       <div className="analysis">

//         <h2>Performance Analysis</h2>

//         <p>✅ Communication : {result.communication}%</p>

//         <p>✅ Technical : {result.technical}%</p>

//         <p>✅ Confidence : {result.confidence}%</p>

//         <p>✅ Fluency : {result.fluency}%</p>

//         <br />

//         <h2>🤖 AI Feedback</h2>

//         <p>{result.feedback}</p>

//         <br />

//         <h2>💪 Strengths</h2>

//         <ul>
//           {result.strengths &&
//             result.strengths.map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//         </ul>

//         <br />

//         <h2>⚠️ Weaknesses</h2>

//         <ul>
//           {result.weaknesses &&
//             result.weaknesses.map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//         </ul>

//         <br />

//         <h2>📈 Suggestions</h2>

//         <ul>
//           {result.suggestions &&
//             result.suggestions.map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//         </ul>

//       </div>

//       <br />

//       <button onClick={() => navigate("/dashboard")}>
//         Go To Dashboard
//       </button>

//       <button onClick={() => navigate("/interview")}>
//         Try Again
//       </button>

//     </div>
//   );
// }

// export default Result;
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./Result.css";

function Result() {
  const navigate = useNavigate();
  const submittedRef = useRef(false);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    submitInterview();
     if (submittedRef.current) return;

  submittedRef.current = true;
  }, []);

  const submitInterview = async () => {
    try {
      setLoading(true);
      setError("");

      const name =
        localStorage.getItem("candidateName") || "Candidate";

      const email =
        localStorage.getItem("candidateEmail") || "";

      const role =
        localStorage.getItem("candidateRole") || "";

      const answers =
        JSON.parse(
          localStorage.getItem("interviewAnswers")
        ) || [];

      console.log("📝 Interview Answers:", answers);

      // ==========================================
      // CHECK ANSWERS
      // ==========================================

      const answeredQuestions = answers.filter(
        (item) =>
          item &&
          item.answer &&
          String(item.answer).trim().length > 0
      );

      console.log(
        "📝 Answered Questions:",
        answeredQuestions
      );

      // ==========================================
      // NO ANSWERS
      // ==========================================

      if (answeredQuestions.length === 0) {
        const emptyResult = {
          overallScore: 0,
          communication: 0,
          technical: 0,
          confidence: 0,
          fluency: null,

          feedback:
            "No answers were provided. Please complete the interview and answer the questions.",

          strengths: [],

          weaknesses: [
            "No interview answers were provided.",
          ],

          suggestions: [
            "Answer every interview question.",
            "Use the microphone or type your answer.",
            "Explain your answers clearly.",
          ],

          evaluationSource: "local",
        };

        setResult(emptyResult);
        setLoading(false);

        return;
      }

      // ==========================================
      // SEND ANSWERS TO BACKEND
      // ==========================================

      console.log("🚀 Sending interview to backend...");

      const response = await fetch(
        "http://localhost:5000/api/interview",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name,
            email: email,
            role: role,
            answers: answers,
          }),
        }
      );

      const data = await response.json();

      console.log(
  "📊 Backend Evaluation Response:",
  JSON.stringify(data, null, 2)
);

console.log(
  "🎯 FINAL SCORE:",
  data?.result?.overallScore
);

console.log(
  "📊 COMMUNICATION:",
  data?.result?.communication
);

console.log(
  "💻 TECHNICAL:",
  data?.result?.technical
);

console.log(
  "💪 CONFIDENCE:",
  data?.result?.confidence
);

      // ==========================================
      // CHECK RESPONSE
      // ==========================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to evaluate interview"
        );
      }

      // ==========================================
      // IMPORTANT
      // BACKEND RESULT IS INSIDE data.result
      // ==========================================

      if (!data.result) {
        throw new Error(
          "Evaluation result was not received from backend."
        );
      }

      console.log(
  "✅ Final Evaluation Result:",
  JSON.stringify(data.result, null, 2)
);

      // ==========================================
      // SET ONLY ACTUAL RESULT
      // ==========================================

      setResult(data.result);

    } catch (err) {
      console.error(
        "❌ Result Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load interview result."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="result-container">

        <h1>
          🎯 Interview Result
        </h1>

        <div className="loading-box">

          <h2>
            📝 Evaluating your answers...
          </h2>

          <p>
            Please wait while your interview
            performance is being calculated.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="result-container">

        <h1>
          🎯 Interview Result
        </h1>

        <div className="error-box">

          <h2>
            ❌ Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/interview")
            }
          >
            🔄 Try Interview Again
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // RESULT
  // ==========================================

  return (
    <div className="result-container">

      <h1>
        🎯 Interview Result
      </h1>

      {/* ========================================
          OVERALL SCORE
      ======================================== */}

      <div className="overall-card">

        <h2>
          Overall Score
        </h2>

        <div className="score">

          {result?.overallScore ?? 0}/100

        </div>

      </div>

      {/* ========================================
          PERFORMANCE ANALYSIS
      ======================================== */}

      <div className="performance-card">

        <h2>
          📊 Performance Analysis
        </h2>

        <p>
          ✅ Communication:{" "}
          <strong>
            {result?.communication ?? 0}%
          </strong>
        </p>

        <p>
          ✅ Technical Knowledge:{" "}
          <strong>
            {result?.technical ?? 0}%
          </strong>
        </p>

        <p>
          ✅ Confidence:{" "}
          <strong>
            {result?.confidence ?? 0}%
          </strong>
        </p>

        {result?.fluency !== null &&
          result?.fluency !== undefined && (
            <p>
              🎤 Fluency:{" "}
              <strong>
                {result.fluency}%
              </strong>
            </p>
          )}

      </div>

      {/* ========================================
          EVALUATION SOURCE
      ======================================== */}

      <div className="feedback-card">

        <h2>
          📝 Evaluation
        </h2>

        <p>
          Evaluation Method:{" "}
          <strong>
            Local Interview Evaluation
          </strong>
        </p>

      </div>

      {/* ========================================
          FEEDBACK
      ======================================== */}

      <div className="feedback-card">

        <h2>
          💡 Feedback
        </h2>

        <p>
          {result?.feedback ||
            "No feedback available."}
        </p>

      </div>

      {/* ========================================
          STRENGTHS
      ======================================== */}

      <div className="feedback-card">

        <h2>
          💪 Strengths
        </h2>

        {result?.strengths &&
        result.strengths.length > 0 ? (

          <ul>

            {result.strengths.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}

          </ul>

        ) : (

          <p>
            No strengths available.
          </p>

        )}

      </div>

      {/* ========================================
          WEAKNESSES
      ======================================== */}

      <div className="feedback-card">

        <h2>
          ⚠️ Areas to Improve
        </h2>

        {result?.weaknesses &&
        result.weaknesses.length > 0 ? (

          <ul>

            {result.weaknesses.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}

          </ul>

        ) : (

          <p>
            No major weaknesses identified.
          </p>

        )}

      </div>

      {/* ========================================
          SUGGESTIONS
      ======================================== */}

      <div className="feedback-card">

        <h2>
          🚀 Suggestions
        </h2>

        {result?.suggestions &&
        result.suggestions.length > 0 ? (

          <ul>

            {result.suggestions.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}

          </ul>

        ) : (

          <p>
            Keep practicing your interview skills.
          </p>

        )}

      </div>

      {/* ========================================
          BUTTONS
      ======================================== */}

      <div className="result-buttons">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          📊 Go to Dashboard
        </button>

        <button
          onClick={() =>
            navigate("/interview")
          }
        >
          🔄 Take Interview Again
        </button>

      </div>

    </div>
  );
}

export default Result;