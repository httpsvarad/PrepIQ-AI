// import React, { useState, useEffect } from "react";
// import { GoogleGenAI } from "@google/genai";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { Route, Routes } from "react-router-dom";
// import InterviewReport from "./pages/Interview_Report";

// const { VITE_GEMINI_AI_API_KEY } = import.meta.env;
// const ai = new GoogleGenAI({ apiKey: VITE_GEMINI_AI_API_KEY });

// const InterviewBot = () => {
//   const [transcript, setTranscript] = useState("");
//   const [response, setResponse] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [jobRole, setJobRole] = useState("");
//   const [background, setBackground] = useState("");
//   const [skills, setSkills] = useState("");
//   const [step, setStep] = useState(0);
//   const [isSpeaking, setIsSpeaking] = useState(false); // State to control animation

//   useEffect(() => {
//     if (response) {
//       speak(response);
//     }
//   }, [response]);

//   const startListening = () => {
//     const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
//     recognition.continuous = false;
//     recognition.lang = "en-US";
//     recognition.start();

//     recognition.onstart = () => setIsListening(true);
//     recognition.onresult = async (event) => {
//       const speechText = event.results[0][0].transcript;
//       setTranscript(speechText);
//       await handleInterviewFlow(speechText);
//     };
//     recognition.onend = () => setIsListening(false);
//   };

//   const [reportData, setReportData] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState("");

//   const handleInterviewFlow = async (speechText) => {
//     if (step === 0) {
//       setBackground(speechText);
//       setResponse("That sounds great! What role are you applying for?");
//       setStep(1);
//     } else if (step === 1) {
//       setJobRole(speechText);
//       setResponse("Nice choice! Can you briefly describe your key skills?");
//       setStep(2);
//     } else if (step === 2) {
//       setSkills(speechText);
//       setResponse("Thanks for sharing! Let's begin the interview. Say OK to start.");
//       setStep(3);
//     } else {
//       await getAIResponse(`You are conducting a mock interview for ${jobRole} with skills in ${skills}. Candidate's response: "${speechText}". Ask the next relevant question. Ask one question at a time and don't use unnecessary special characters like (*) keep the interview professional and ask real-world challenging as well as basic technical questions and professional ethics questions.`);
//     }
//   };

//   const getAIResponse = async (prompt) => {
//     try {
//       const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt });
//       setResponse(response.text);
//     } catch (error) {
//       setResponse("Sorry, I couldn't hear that. Please repeat.");
//     }
//   };

//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US";
//     utterance.rate = 1;

//     utterance.onstart = () => setIsSpeaking(true); // Start animation
//     utterance.onend = () => setIsSpeaking(false);  // Stop animation when speech ends

//     window.speechSynthesis.speak(utterance);
//   };

//   const startInterview = () => {
//     const resp = axios.post("http://127.0.0.1:5000/start_interview");
//   }

//   const endInterview = () => {
//     const resp = axios.post("http://127.0.0.1:5000/end_interview");
//   }

//   return (

//     <>
     

//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
//         <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl p-8 flex flex-col items-center">
//           <div className="flex gap-5">
//             <div className="flex flex-col h-[300px] items-center">
//               <h1 className="text-3xl font-bold mb-4 text-blue-400">1:1 Mock</h1>
//               <p className="text-gray-300 mb-6 text-center">Click "Start" to begin !</p>

//               {/* 🎤 Mic Animation - Only When AI is Speaking */}
//               <motion.div
//                 className={`w-32 h-32 rounded-full bg-gray-700  flex items-center justify-center shadow-md ${isSpeaking ? "border-3 border-blue-600" : ""
//                   }`}
//                 animate={isSpeaking ? { scale: [1, 1.05, 1] } : { scale: 1 }}
//                 transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
//               >
//                 <span className="text-5xl">🤖</span>
//               </motion.div>

//               <div className="flex gap-4 mt-auto">
//                 <button
//                   className="px-6 py-3 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-semibold rounded-lg transition shadow-md"
//                   onClick={startListening}
//                 >
//                   {isListening ? "Listening..." : "Speak"}
//                 </button>

//                 <button
//                   className="px-6 py-3 bg-gradient-to-r hover:scale-105 bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold rounded-lg transition shadow-md"
//                   onClick={() => {
//                     setTranscript("");
//                     setResponse("Hello! I'm Alex, your AI interviewer. Let's start with a quick introduction about yourself.");
//                     setStep(0);
//                     startInterview();
//                   }}
//                 >
//                   Start
//                 </button>

//                 <button
//                   className="px-6 py-3 bg-gradient-to-r bg-red-500 hover:scale-105 cursor-pointer hover:bg-red-600 text-white font-semibold rounded-lg transition shadow-md"
//                   onClick={() => {
//                     setTranscript("");
//                     setResponse("Thank you for the interview! Have a great day!");
//                     endInterview();
//                   }}
//                 >
//                   End
//                 </button>
//               </div>
//             </div>

//             <div >
//               <img className="rounded-lg w-full h-[300px]" src="http://127.0.0.1:5000/video_feed" alt="" />
//             </div>
//           </div>

//           <div className="mt-6 w-full bg-gray-700 p-4 rounded-lg shadow-md text-left">
//             <p className="text-gray-400"><strong>You :</strong> {transcript}</p>
//             <motion.p
//               className="mt-2 text-gray-100"
//               key={response} // Ensures animation triggers on every response update
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.6 }}
//             >
//               <strong>Alex :</strong> {response}
//             </motion.p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default InterviewBot;
