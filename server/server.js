// ======================================================
// AI MOCK INTERVIEW - BACKEND SERVER
// ======================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());


// ======================================================
// BASIC TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Mock Interview Backend is running 🚀"
  });
});


// ======================================================
// GEMINI CONFIGURATION
// ======================================================

console.log(
  "API KEY:",
  process.env.GEMINI_API_KEY
    ? "Loaded ✅"
    : "Not Found ❌"
);

let model = null;

if (process.env.GEMINI_API_KEY) {

  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

  model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite"
  });

}


// ======================================================
// GEMINI RETRY FUNCTION
// ======================================================

async function generateWithRetry(
  prompt,
  maxRetries = 1
) {

  if (!model) {
    throw new Error(
      "Gemini API key is not configured"
    );
  }

  for (
    let attempt = 1;
    attempt <= maxRetries;
    attempt++
  ) {

    try {

      console.log(
        `🤖 Gemini attempt ${attempt}/${maxRetries}`
      );

      const result =
        await model.generateContent(prompt);

      console.log(
        "✅ Gemini response received"
      );

      return result;

    } catch (error) {

      console.log(
        `❌ Gemini attempt ${attempt} failed:`,
        error.message
      );

      if (
        attempt === maxRetries
      ) {
        throw error;
      }

      await new Promise(
        resolve =>
          setTimeout(resolve, 3000)
      );

    }

  }

}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((error) => {
    console.log("❌ MongoDB Connection Error:", error.message);
  });
// ======================================================
// MULTER - RESUME UPLOAD
// ======================================================

const upload = multer({

  storage:
    multer.memoryStorage(),

  limits: {

    fileSize:
      10 * 1024 * 1024

  },

  fileFilter:
    (req, file, cb) => {

      if (
        file.mimetype ===
        "application/pdf"
      ) {

        cb(null, true);

      } else {

        cb(
          new Error(
            "Only PDF files are allowed"
          )
        );

      }

    }

});


// ======================================================
// USER SCHEMA
// ======================================================

const UserSchema =
  new mongoose.Schema({

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    }

  });

const User =
  mongoose.model(
    "User",
    UserSchema
  );


// ======================================================
// INTERVIEW SCHEMA
// ======================================================

const InterviewSchema =
  new mongoose.Schema({

    name: String,

    email: String,

    role: String,

    resumeName: String,

    answers: [

      {
        question: String,

        answer: String,

        answerType: String
      }

    ],

    overallScore: Number,

    communication: Number,

    technical: Number,

    confidence: Number,

    fluency: Number,

    feedback: String,

    strengths: [String],

    weaknesses: [String],

    suggestions: [String],

    evaluationSource: String,

    date: {
      type: Date,
      default: Date.now
    }

  });

const Interview =
  mongoose.model(
    "Interview",
    InterviewSchema
  );


// ======================================================
// EMAIL CONFIGURATION
// ======================================================

let transporter = null;

if (
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS
) {

  transporter =
    nodemailer.createTransport({

      service: "gmail",

      auth: {

        user:
          process.env.EMAIL_USER,

        pass:
          process.env.EMAIL_PASS

      }

    });

  console.log(
    "📧 Email transporter configured ✅"
  );

} else {

  console.log(
    "⚠️ Email credentials not configured"
  );

}


// ======================================================
// REGISTER
// ======================================================

app.post(
  "/api/register",
  async (req, res) => {

    try {

      const {
        name,
        email,
        password
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill all fields"

        });

      }

      const existingUser =
        await User.findOne({
          email
        });

      if (existingUser) {

        return res.status(400).json({

          success: false,

          message:
            "Email already registered"

        });

      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        new User({

          name,

          email,

          password:
            hashedPassword

        });

      await user.save();

      console.log(
        "✅ User Registered:",
        email
      );

      res.json({

        success: true,

        message:
          "Registration successful"

      });

    } catch (error) {

      console.log(
        "❌ Register Error:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Registration failed"

      });

    }

  }
);


// ======================================================
// LOGIN
// ======================================================

app.post(
  "/api/auth/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;

      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please enter email and password"

        });

      }

      const user =
        await User.findOne({
          email
        });

      if (!user) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid email or password"

        });

      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid email or password"

        });

      }

      console.log(
        "✅ Login successful:",
        email
      );

      res.json({

        success: true,

        message:
          "Login successful",

        user: {
          id: user._id,
          name:
            user.name,

          email:
            user.email

        }

      });

    } catch (error) {

      console.log(
        "❌ Login Error:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Login failed"

      });

    }

  }
);
// ======================================================
// RESUME UPLOAD
// ======================================================

app.post(
  "/api/resume/upload",
  upload.single("resume"),

  async (req, res) => {

    console.log(
      "📄 RESUME UPLOAD API CALLED"
    );

    try {

      const {
        name,
        email,
        role
      } = req.body;

      if (
        !name ||
        !email ||
        !role
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Name, email and role are required"

        });

      }

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Please upload a PDF resume"

        });

      }

      console.log(
        "📄 File:",
        req.file.originalname
      );

      console.log(
        "📦 File Size:",
        req.file.size
      );

      // ----------------------------------------------
      // Extract PDF text
      // ----------------------------------------------

      const pdfData =
        await pdfParse(
          req.file.buffer
        );

      const resumeText =
        pdfData.text || "";

      console.log(
        "✅ Resume text extracted"
      );

      console.log(
        "📝 Text length:",
        resumeText.length
      );

      if (!resumeText.trim()) {

        return res.status(400).json({

          success: false,

          message:
            "Could not extract text from the PDF"

        });

      }

      res.json({

        success: true,

        message:
          "Resume uploaded and analyzed successfully",

        name,

        email,

        role,

        resumeName:
          req.file.originalname,

        resumeText

      });

    } catch (error) {

      console.log(
        "❌ Resume Upload Error:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Resume upload failed"

      });

    }

  }
);


// ======================================================
// INTERVIEW QUESTIONS
// ======================================================

app.post(
  "/api/questions",
  async (req, res) => {

    console.log(
      "🔥 QUESTIONS API CALLED"
    );

    try {

      const {
        role,
        resumeText
      } = req.body;

      if (!role) {

        return res.status(400).json({

          success: false,

          message:
            "Role is required"

        });

      }

      if (!resumeText) {

        return res.status(400).json({

          success: false,

          message:
            "Resume text is required"

        });

      }

      // =================================================
      // GEMINI QUESTIONS
      // =================================================

      if (model) {

        try {

          console.log(
            "🤖 Generating questions using Gemini..."
          );

          const prompt = `

You are an expert technical interviewer.

Candidate Role:
${role}

Candidate Resume:
${resumeText}

Generate 8 interview questions for this candidate.

Requirements:

1. Questions must be related to the selected role.
2. Use the candidate's resume when creating questions.
3. Include technical questions.
4. Include project-related questions.
5. Include basic HR/interview questions.
6. Questions should be suitable for a college student.
7. Do not provide answers.
8. Return ONLY a valid JSON array.
9. Do not use markdown code fences.

Example format:

[
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4",
  "Question 5",
  "Question 6",
  "Question 7",
  "Question 8"
]

`;

          const result =
            await generateWithRetry(
              prompt,
              1
            );

          const responseText =
            result.response.text();

          console.log(
            "🤖 Gemini Questions Response:",
            responseText
          );

          let cleanedText =
            responseText
              .replace(
                /```json/gi,
                ""
              )
              .replace(
                /```/g,
                ""
              )
              .trim();

          const questions =
            JSON.parse(
              cleanedText
            );

          if (
            Array.isArray(questions) &&
            questions.length > 0
          ) {

            console.log(
              "✅ Gemini Questions Generated:",
              questions.length
            );

            return res.json({

              success: true,

              role,

              questions,

              source:
                "gemini"

            });

          }

        } catch (geminiError) {

          console.log(
            "⚠️ Gemini Questions Error:",
            geminiError.message
          );

          console.log(
            "➡️ Using manual questions fallback..."
          );

        }

      }

      // =================================================
      // MANUAL FALLBACK QUESTIONS
      // =================================================

      const manualQuestions = [

        "Tell me about yourself and your technical skills.",

        "Explain the AI Powered Mock Interview project mentioned in your resume.",

        "What technologies did you use in your project?",

        "What is HTML and what is its purpose?",

        "What is the difference between HTML and CSS?",

        "What is JavaScript and why is it used in web development?",

        "What is React and why did you choose React?",

        "What are your strengths and weaknesses?"

      ];

      console.log(
        "✅ Manual Questions Ready"
      );

      return res.json({

        success: true,

        role,

        questions:
          manualQuestions,

        source:
          "manual"

      });

    } catch (error) {

      console.log(
        "❌ Questions Error:",
        error.message
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to generate interview questions"

      });

    }

  }
);
// ======================================================
// LOCAL FALLBACK EVALUATION
// ======================================================
//
// Used when Gemini is unavailable / quota exceeded.
// This is rule-based scoring, not AI semantic evaluation.
//

function localEvaluateAnswers(
  answers,
  role
) {

  console.log(
    "🧠 Using local fallback evaluation"
  );

  let totalScore = 0;

  let answeredCount = 0;

  let totalWords = 0;

  let technicalKeywordCount = 0;

  const technicalKeywords = [

    "html",
    "css",
    "javascript",
    "react",
    "python",
    "java",
    "node",
    "express",
    "mongodb",
    "database",
    "api",
    "frontend",
    "backend",
    "project",
    "github",
    "git",
    "machine learning",
    "artificial intelligence"

  ];

  answers.forEach(
    (item) => {

      const answer =
        String(
          item.answer || ""
        ).trim();

      if (!answer) {
        return;
      }

      answeredCount++;

      const words =
        answer.split(/\s+/)
          .filter(Boolean);

      totalWords +=
        words.length;

      const lowerAnswer =
        answer.toLowerCase();

      let questionScore = 0;

      // --------------------------------------------
      // Answer length
      // --------------------------------------------

      if (words.length >= 40) {

        questionScore += 50;

      } else if (words.length >= 20) {

        questionScore += 40;

      } else if (words.length >= 10) {

        questionScore += 30;

      } else if (words.length >= 5) {

        questionScore += 20;

      } else {

        questionScore += 10;

      }

      // --------------------------------------------
      // Technical keywords
      // --------------------------------------------

      let keywordMatches = 0;

      technicalKeywords.forEach(
        (keyword) => {

          if (
            lowerAnswer.includes(
              keyword
            )
          ) {

            keywordMatches++;

            technicalKeywordCount++;

          }

        }
      );

      questionScore +=
        Math.min(
          keywordMatches * 8,
          30
        );

      // --------------------------------------------
      // Basic completeness
      // --------------------------------------------

      if (
        lowerAnswer.includes(
          "because"
        ) ||
        lowerAnswer.includes(
          "example"
        ) ||
        lowerAnswer.includes(
          "used"
        ) ||
        lowerAnswer.includes(
          "experience"
        )
      ) {

        questionScore += 10;

      }

      questionScore =
        Math.min(
          questionScore,
          100
        );

      totalScore +=
        questionScore;

    }
  );

  if (
    answeredCount === 0
  ) {

    return {

      overallScore: 0,

      communication: 0,

      technical: 0,

      confidence: 0,

      fluency: null,

      feedback:
        "No answers were provided.",

      strengths: [],

      weaknesses: [
        "No interview answers were provided."
      ],

      suggestions: [
        "Answer all interview questions."
      ],

      evaluationSource:
        "local"

    };

  }

  const average =
    Math.round(
      totalScore /
      answeredCount
    );

  // ----------------------------------------------
  // Communication
  // ----------------------------------------------

  let communication =
    Math.min(
      100,
      Math.round(
        30 +
        (totalWords /
          answeredCount) *
          1.2
      )
    );

  // ----------------------------------------------
  // Technical
  // ----------------------------------------------

  let technical =
    Math.min(
      100,
      Math.round(
        average +
        technicalKeywordCount * 2
      )
    );

  // ----------------------------------------------
  // Confidence
  // ----------------------------------------------

  let confidence =
    Math.min(
      100,
      Math.round(
        30 +
        average * 0.7
      )
    );

  // ----------------------------------------------
  // Fluency
  // ----------------------------------------------

  const voiceAnswers =
    answers.filter(
      item =>
        item.answerType ===
        "voice" &&
        item.answer &&
        String(
          item.answer
        ).trim()
    ).length;

  let fluency = null;

  if (
    voiceAnswers > 0
  ) {

    fluency =
      Math.min(
        100,
        Math.round(
          40 +
          (totalWords /
            answeredCount) *
            0.8
        )
      );

  }

  // ----------------------------------------------
  // Overall Score
  // ----------------------------------------------

  let overallScore;

  if (
    fluency !== null
  ) {

    overallScore =
      Math.round(
        (
          communication +
          technical +
          confidence +
          fluency
        ) / 4
      );

  } else {

    overallScore =
      Math.round(
        (
          communication +
          technical +
          confidence
        ) / 3
      );

  }

  overallScore =
    Math.min(
      100,
      overallScore
    );

  // ----------------------------------------------
  // Strengths
  // ----------------------------------------------

  const strengths = [];

  if (
    communication >= 70
  ) {

    strengths.push(
      "Good communication skills"
    );

  }

  if (
    technical >= 70
  ) {

    strengths.push(
      "Good technical knowledge"
    );

  }

  if (
    confidence >= 70
  ) {

    strengths.push(
      "Shows confidence in answers"
    );

  }

  if (
    answeredCount ===
    answers.length &&
    answers.length > 0
  ) {

    strengths.push(
      "Answered all interview questions"
    );

  }

  if (
    strengths.length === 0
  ) {

    strengths.push(
      "Shows willingness to participate in the interview"
    );

  }

  // ----------------------------------------------
  // Weaknesses
  // ----------------------------------------------

  const weaknesses = [];

  if (
    communication < 60
  ) {

    weaknesses.push(
      "Answers need more explanation and clarity"
    );

  }

  if (
    technical < 60
  ) {

    weaknesses.push(
      "Technical concepts need more practice"
    );

  }

  if (
    confidence < 60
  ) {

    weaknesses.push(
      "Confidence can be improved"
    );

  }

  if (
    answeredCount <
    answers.length
  ) {

    weaknesses.push(
      "Some questions were not answered"
    );

  }

  if (
    weaknesses.length === 0
  ) {

    weaknesses.push(
      "Continue practicing to improve further"
    );

  }

  // ----------------------------------------------
  // Suggestions
  // ----------------------------------------------

  const suggestions = [

    "Practice common interview questions regularly.",

    "Explain your project clearly with simple examples.",

    "Revise important technical concepts.",

    "Practice speaking your answers confidently.",

    "Keep answers clear, relevant and concise."

  ];

  // ----------------------------------------------
  // Feedback
  // ----------------------------------------------

  let feedback = "";

  if (
    overallScore >= 80
  ) {

    feedback =
      "Excellent interview performance. Keep practicing to maintain your skills.";

  } else if (
    overallScore >= 60
  ) {

    feedback =
      "Good interview performance. With more technical practice and confidence, you can improve further.";

  } else {

    feedback =
      "You need more interview practice. Focus on technical concepts, communication and confidence.";

  }

  return {

    overallScore,

    communication,

    technical,

    confidence,

    fluency,

    feedback,

    strengths,

    weaknesses,

    suggestions,

    evaluationSource:
      "local"

  };

}
// ======================================================
// INTERVIEW SUBMISSION + EVALUATION
// ======================================================

app.post(
  "/api/interview",
  async (req, res) => {

    console.log(
      "🎯 INTERVIEW SUBMISSION API CALLED"
    );

    try {

      const {
        name,
        email,
        role,
        answers
      } = req.body;

      if (!name) {

        return res.status(400).json({

          success: false,

          message:
            "Name is required"

        });

      }

      if (!email) {

        return res.status(400).json({

          success: false,

          message:
            "Email is required"

        });

      }

      if (!role) {

        return res.status(400).json({

          success: false,

          message:
            "Role is required"

        });

      }

      if (
        !Array.isArray(answers)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Answers must be an array"

        });

      }

      // ----------------------------------------------
      // Remove empty answers for evaluation
      // ----------------------------------------------

      const validAnswers =
        answers.filter(
          item =>
            item &&
            item.answer &&
            String(
              item.answer
            ).trim().length > 0
        );

      console.log(
        "📝 Total answers:",
        answers.length
      );

      console.log(
        "📝 Answered questions:",
        validAnswers.length
      );


      // ==================================================
      // DEFAULT EVALUATION
      // ==================================================

      let evaluation =
        localEvaluateAnswers(
          validAnswers,
          role
        );


      // ==================================================
      // TRY GEMINI EVALUATION
      // ==================================================

      if (
        model &&
        validAnswers.length > 0
      ) {

        try {

          const answerText =
            validAnswers
              .map(
                (item, index) =>
                  `${index + 1}. Question: ${item.question}\nAnswer: ${item.answer}`
              )
              .join("\n\n");

          const prompt = `

You are an interview evaluator.

Candidate Role:
${role}

Evaluate the candidate's interview answers.

Answers:
${answerText}

Return ONLY valid JSON.

Use this exact structure:

{
  "overallScore": 0,
  "communication": 0,
  "technical": 0,
  "confidence": 0,
  "fluency": null,
  "feedback": "",
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

Rules:

- All scores must be between 0 and 100.
- overallScore should represent the overall interview performance.
- communication evaluates clarity and explanation.
- technical evaluates technical correctness.
- confidence evaluates confidence shown through the answer.
- fluency should be a number if voice answers exist.
- fluency can be null if all answers are typed.
- Do not invent information that is not present in the answers.

`;

          const result =
            await generateWithRetry(
              prompt,
              1
            );

          const text =
            result.response.text();

          console.log(
            "🤖 Gemini Evaluation Received"
          );

          const cleanedText =
            text
              .replace(
                /```json/g,
                ""
              )
              .replace(
                /```/g,
                ""
              )
              .trim();

          const aiEvaluation =
            JSON.parse(
              cleanedText
            );

          evaluation = {

            overallScore:
              Number(
                aiEvaluation.overallScore || 0
              ),

            communication:
              Number(
                aiEvaluation.communication || 0
              ),

            technical:
              Number(
                aiEvaluation.technical || 0
              ),

            confidence:
              Number(
                aiEvaluation.confidence || 0
              ),

            fluency:
              aiEvaluation.fluency === null
                ? null
                : Number(
                    aiEvaluation.fluency || 0
                  ),

            feedback:
              aiEvaluation.feedback ||
              "",

            strengths:
              Array.isArray(
                aiEvaluation.strengths
              )
                ? aiEvaluation.strengths
                : [],

            weaknesses:
              Array.isArray(
                aiEvaluation.weaknesses
              )
                ? aiEvaluation.weaknesses
                : [],

            suggestions:
              Array.isArray(
                aiEvaluation.suggestions
              )
                ? aiEvaluation.suggestions
                : [],

            evaluationSource:
              "gemini"

          };

          console.log(
            "🤖 Evaluation Source: Gemini"
          );

        } catch (geminiError) {

          console.log(
            "⚠️ Gemini evaluation unavailable."
          );

          console.log(
            "Reason:",
            geminiError.message
          );

          console.log(
            "➡️ Using local evaluation instead."
          );

          evaluation =
            localEvaluateAnswers(
              validAnswers,
              role
            );

        }

      }


      // ==================================================
      // SAVE INTERVIEW RESULT
      // ==================================================

      const interview =
        new Interview({

          name,

          email,

          role,

          resumeName:
            "Uploaded Resume",

          answers:
            answers.map(
              item => ({

                question:
                  item.question || "",

                answer:
                  item.answer || "",

                answerType:
                  item.answerType || "typed"

              })
            ),

          overallScore:
            evaluation.overallScore,

          communication:
            evaluation.communication,

          technical:
            evaluation.technical,

          confidence:
            evaluation.confidence,

          fluency:
            evaluation.fluency,

          feedback:
            evaluation.feedback,

          strengths:
            evaluation.strengths,

          weaknesses:
            evaluation.weaknesses,

          suggestions:
            evaluation.suggestions,

          evaluationSource:
            evaluation.evaluationSource

        });

      await interview.save();

      console.log(
        "✅ Interview result saved"
      );


      // ==================================================
      // RESPONSE
      // ==================================================

      res.json({

        success: true,

        message:
          "Interview evaluated successfully",

        result: {

          id:
            interview._id,

          name,

          email,

          role,

          overallScore:
            evaluation.overallScore,

          communication:
            evaluation.communication,

          technical:
            evaluation.technical,

          confidence:
            evaluation.confidence,

          fluency:
            evaluation.fluency,

          feedback:
            evaluation.feedback,

          strengths:
            evaluation.strengths,

          weaknesses:
            evaluation.weaknesses,

          suggestions:
            evaluation.suggestions,

          evaluationSource:
            evaluation.evaluationSource,

          selected:
            evaluation.overallScore >= 60

        }

      });

    } catch (error) {

      console.log(
        "❌ Interview Evaluation Error:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to evaluate interview"

      });

    }

  }
);


// ======================================================
// GET ALL INTERVIEW RESULTS
// ======================================================

app.get(
  "/api/interviews",
  async (req, res) => {

    try {

      const interviews =
        await Interview
          .find()
          .sort({
            date: -1
          });

      console.log(
        "📊 Total Interviews:",
        interviews.length
      );

      res.json(
        interviews
      );

    } catch (error) {

      console.log(
        "❌ Get Interviews Error:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to fetch interview results"

      });

    }

  }
);


// ======================================================
// GET SINGLE INTERVIEW
// ======================================================

app.get(
  "/api/interviews/:id",
  async (req, res) => {

    try {

      const interview =
        await Interview.findById(
          req.params.id
        );

      if (!interview) {

        return res.status(404).json({

          success: false,

          message:
            "Interview result not found"

        });

      }

      res.json({

        success: true,

        interview

      });

    } catch (error) {

      console.log(
        "❌ Get Single Interview Error:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to fetch interview"

      });

    }

  }
);
//// ======================================================
// CONTACT API
// ======================================================

app.post("/api/contact", async (req, res) => {
  console.log("📩 CONTACT API CALLED");

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Email service is not configured on the server",
      });
    }

    console.log("👤 Name:", name);
    console.log("📧 User Email:", email);
    console.log("💬 Message:", message);

    const { data, error } = await resend.emails.send({
      from: "AI Mock Interview <onboarding@resend.dev>",
      to: process.env.EMAIL_USER,
      reply_to: email,
      subject: `Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("✅ Email sent successfully");
    console.log("📨 Message ID:", data.id);

    res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log("❌ Email Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});
// ======================================================
// TEST RESUME ENDPOINT
// ======================================================

app.get(
  "/test",
  (req, res) => {

    res.json({

      success: true,

      message:
        "Backend test successful 🚀",

      gemini:
        model
          ? "Configured"
          : "Not configured",

      mongodb:
        mongoose.connection.readyState === 1
          ? "Connected"
          : "Not connected"

    });

  }
);


// ======================================================
// ERROR HANDLER FOR MULTER
// ======================================================

app.use(
  (error, req, res, next) => {

    if (
      error instanceof multer.MulterError
    ) {

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "File is too large. Maximum size is 10 MB."

        });

      }

    }

    if (
      error &&
      error.message ===
      "Only PDF files are allowed"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Only PDF files are allowed"

      });

    }

    next(error);

  }
);


// ======================================================
// START SERVER
// ======================================================

const PORT = 5000;

app.listen(
  PORT,
  () => {

    console.log(
      "======================================"
    );

    console.log(
      "🚀 AI MOCK INTERVIEW SERVER"
    );

    console.log(
      `🚀 Server Running on Port ${PORT}`
    );

    console.log(
      "======================================"
    );

  }
);