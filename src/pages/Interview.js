
// 
import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

import "./Interview.css";


function Interview() {

  const navigate = useNavigate();


  // ==================================================
  // STATES
  // ==================================================

  const [questions, setQuestions] =
    useState([]);

  const [interviewStarted, setInterviewStarted] =
    useState(false);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [answer, setAnswer] =
    useState("");

  const [answerType, setAnswerType] =
    useState("typed");

  const [questionSource, setQuestionSource] =
    useState("");
 
  const [error, setError] =
    useState("");


  // ==================================================
  // SPEECH RECOGNITION
  // ==================================================

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  // ==================================================
  // GET VOICE TRANSCRIPT
  // ==================================================

  useEffect(() => {

    if (listening) {

      setAnswer(transcript);

      setAnswerType("voice");

    }

  }, [transcript, listening]);


  // ==================================================
  // SPEAK QUESTION
  // ==================================================

  const speakQuestion = (question) => {

    if (!question) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        question
      );

    speech.lang = "en-US";

    speech.rate = 0.9;

    speech.pitch = 1;

    window.speechSynthesis.speak(
      speech
    );

  };


  // ==================================================
  // START INTERVIEW
  // ==================================================

  const startInterview = async () => {

    const role =
      localStorage.getItem(
        "candidateRole"
      );

    const resume =
      localStorage.getItem(
        "resumeText"
      );


    // ==================================================
    // CHECK RESUME
    // ==================================================

    if (!role || !resume) {

      alert(
        "Please upload your resume first."
      );

      navigate("/resume");

      return;

    }


    try {

      setLoading(true);

      setError("");


      // ==================================================
      // CLEAR OLD ANSWERS
      // ==================================================

      localStorage.removeItem(
        "interviewAnswers"
      );


      // ==================================================
      // STOP OLD SPEECH
      // ==================================================

      SpeechRecognition.stopListening();

      window.speechSynthesis.cancel();

      resetTranscript();


      // ==================================================
      // DEBUG
      // ==================================================

      console.log(
        "🔥 Calling Questions API"
      );

      console.log(
        "API URL:",
        "https://ai-mock-interview-backend-yekh.onrender.com/api/questions"
      );


      // ==================================================
      // CALL BACKEND
      // ==================================================

      const response =
        await fetch(
          "https://ai-mock-interview-backend-yekh.onrender.com/api/questions",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              role: role,
              resumeText: resume
            })
          }
        );


      // ==================================================
      // READ RESPONSE
      // ==================================================

      const data =
        await response.json();


      console.log(
        "Questions Response:",
        data
      );


      // ==================================================
      // CHECK RESPONSE
      // ==================================================

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Question loading failed"
        );

      }


      // ==================================================
      // CHECK QUESTIONS
      // ==================================================

      if (
        !data.questions ||
        !Array.isArray(
          data.questions
        ) ||
        data.questions.length === 0
      ) {

        throw new Error(
          "No interview questions received."
        );

      }


      // ==================================================
      // CLEAN QUESTIONS
      // ==================================================

      const cleanedQuestions =
        data.questions
          .map((item) => {

            if (
              typeof item === "string"
            ) {

              return item;

            }


            if (
              item &&
              typeof item.question ===
                "string"
            ) {

              return item.question;

            }


            return null;

          })
          .filter(Boolean);


      // ==================================================
      // CHECK CLEAN QUESTIONS
      // ==================================================

      if (
        cleanedQuestions.length === 0
      ) {

        throw new Error(
          "No valid questions received."
        );

      }


      // ==================================================
      // SAVE QUESTIONS
      // ==================================================

      console.log(
        "✅ Final Questions:",
        cleanedQuestions
      );


      setQuestions(
        cleanedQuestions
      );


      // ==================================================
      // SAVE SOURCE
      // ==================================================

      setQuestionSource(
        data.source || "manual"
      );


      // ==================================================
      // FIRST QUESTION
      // ==================================================

      setCurrentQuestion(0);


      setAnswer("");


      setAnswerType("typed");


      resetTranscript();


      // ==================================================
      // START INTERVIEW
      // ==================================================

      setInterviewStarted(true);


      // ==================================================
      // SPEAK FIRST QUESTION
      // ==================================================

      setTimeout(() => {

        speakQuestion(
          cleanedQuestions[0]
        );

      }, 500);


    } catch (error) {

      console.error(
        "❌ Question Loading Error:",
        error
      );


      setError(
        error.message ||
        "Unable to load interview questions."
      );


      alert(
        "Interview Questions Loading Failed ❌\n\n" +
        (
          error.message ||
          "Please check backend server."
        )
      );


    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // START RECORDING
  // ==================================================

  const startRecording = async () => {

    if (
      !browserSupportsSpeechRecognition
    ) {

      alert(
        "Your browser does not support speech recognition."
      );

      return;

    }


    try {

      setAnswer("");

      resetTranscript();

      setAnswerType("voice");


      await SpeechRecognition
        .startListening({
          continuous: true,
          language: "en-US"
        });


      console.log(
        "🎤 Voice recording started"
      );


    } catch (error) {

      console.error(
        "Voice Start Error:",
        error
      );


      alert(
        "Unable to start microphone. Please check microphone permission."
      );

    }

  };


  // ==================================================
  // STOP RECORDING
  // ==================================================

  const stopRecording = () => {

    SpeechRecognition.stopListening();

    console.log(
      "🛑 Voice recording stopped"
    );

  };


  // ==================================================
  // SAVE ANSWER
  // ==================================================

  const saveAnswer = () => {

    if (
      !questions[currentQuestion]
    ) {

      return;

    }


    const answers =
      JSON.parse(
        localStorage.getItem(
          "interviewAnswers"
        )
      ) || [];


    const answerData = {

      question:
        questions[currentQuestion],

      answer:
        answer.trim(),

      answerType:
        answerType,

      questionNumber:
        currentQuestion + 1

    };


    answers.push(
      answerData
    );


    localStorage.setItem(
      "interviewAnswers",
      JSON.stringify(answers)
    );


    console.log(
      "✅ Answer Saved:",
      answerData
    );

  };


  // ==================================================
  // NEXT QUESTION
  // ==================================================

  const nextQuestion = () => {

    // Stop microphone
    SpeechRecognition.stopListening();


    // Stop question voice
    window.speechSynthesis.cancel();


    // Save current answer
    saveAnswer();


    // ==================================================
    // MORE QUESTIONS
    // ==================================================

    if (
      currentQuestion <
      questions.length - 1
    ) {

      const nextIndex =
        currentQuestion + 1;


      setAnswer("");


      setAnswerType(
        "typed"
      );


      resetTranscript();


      setCurrentQuestion(
        nextIndex
      );


      console.log(
        "➡️ Moving to question:",
        nextIndex + 1
      );


      // Speak next question
      setTimeout(() => {

        speakQuestion(
          questions[nextIndex]
        );

      }, 500);


    } else {

      // ==================================================
      // INTERVIEW COMPLETED
      // ==================================================

      window.speechSynthesis.cancel();


      console.log(
        "🎉 Interview Completed"
      );


      alert(
        "Interview Completed Successfully! 🎉"
      );


      navigate(
        "/result"
      );

    }

  };


  // ==================================================
  // REPEAT QUESTION
  // ==================================================

  const repeatQuestion = () => {

    if (
      !questions[currentQuestion]
    ) {

      return;

    }


    speakQuestion(
      questions[currentQuestion]
    );

  };


  // ==================================================
  // CLEANUP
  // ==================================================

  useEffect(() => {

    return () => {

      SpeechRecognition.stopListening();

      window.speechSynthesis.cancel();

    };

  }, []);


  // ==================================================
  // BROWSER SUPPORT
  // ==================================================

  if (
    !browserSupportsSpeechRecognition
  ) {

    return (

      <div className="interview-container">

        <h2>
          Speech Recognition is not
          supported in this browser.
        </h2>

        <p>
          Please use Google Chrome.
        </p>

      </div>

    );

  }


  // ==================================================
  // INTRO SCREEN
  // ==================================================

  if (!interviewStarted) {

    return (

      <div className="interview-container">

        <h1>
          🤖 AI Mock Interview
        </h1>


        <div className="interview-intro">

          <h2>
            Welcome to Your Interview
          </h2>


          <p>
            Your resume and selected role
            will be used to prepare your
            interview questions.
          </p>


          <p>
            🤖 Gemini available →
            AI-generated questions
          </p>


          <p>
            📝 Gemini unavailable →
            Manual backup questions
          </p>


          <p>
            🎤 You can answer using your
            microphone.
          </p>


          <p>
            ⌨️ You can also type your answer.
          </p>


          <p>
            🔊 Questions will be spoken aloud.
          </p>


          <button
            className="start-interview-btn"
            onClick={startInterview}
            disabled={loading}
          >

            {loading
              ? "⏳ Loading Questions..."
              : "🚀 Start Interview"}

          </button>

        </div>

      </div>

    );

  }


  // ==================================================
  // INTERVIEW SCREEN
  // ==================================================

  return (

    <div className="interview-container">

      <h1>
        🤖 AI Mock Interview
      </h1>


      {/* QUESTION SOURCE */}

      <div className="question-source">

        {questionSource === "gemini"
          ? "🤖 Questions Source: Gemini AI"
          : "📝 Questions Source: Manual Backup"}

      </div>


      {/* ROLE */}

      <h3>

        Role:{" "}

        {localStorage.getItem(
          "candidateRole"
        )}

      </h3>


      {/* PROGRESS */}

      <p>

        Question{" "}

        {currentQuestion + 1}

        {" / "}

        {questions.length}

      </p>


      {/* QUESTION */}

      <div className="question-box">

        <h2>

          Question{" "}

          {currentQuestion + 1}

        </h2>


        <p className="question-text">

          {questions[currentQuestion]}

        </p>


        <button
          onClick={repeatQuestion}
        >

          🔊 Repeat Question

        </button>

      </div>


      {/* VOICE STATUS */}

      {listening && (

        <div className="voice-status">

          🎤 Listening...

        </div>

      )}


      {/* ANSWER */}

      <div className="answer-section">

        <label>
          Your Answer
        </label>


        <textarea

          rows="8"

          value={answer}

          onChange={(e) => {

            setAnswer(
              e.target.value
            );

            setAnswerType(
              "typed"
            );

          }}

          placeholder="Type your answer here or use the microphone..."

        />

      </div>


      {/* VOICE BUTTON */}

      <div className="voice-buttons">

        {!listening ? (

          <button
            onClick={startRecording}
          >

            🎤 Start Speaking

          </button>

        ) : (

          <button
            onClick={stopRecording}
          >

            🛑 Stop Speaking

          </button>

        )}

      </div>


      {/* ANSWER TYPE */}

      <p>

        Answer Type:{" "}

        <strong>

          {answerType === "voice"
            ? "🎤 Voice"
            : "⌨️ Typed"}

        </strong>

      </p>


      {/* NEXT */}

      <button
        className="next-button"
        onClick={nextQuestion}
      >

        {currentQuestion <
        questions.length - 1

          ? "Save & Next Question ➡️"

          : "Finish Interview ✅"}

      </button>

    </div>

  );

}


export default Interview;