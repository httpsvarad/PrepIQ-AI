import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion } from "framer-motion";
import axios from "axios";
import { a } from "framer-motion/client";
import { useNavigate } from "react-router-dom";

const { VITE_GEMINI_AI_API_KEY } = import.meta.env;
const ai = new GoogleGenAI({ apiKey: VITE_GEMINI_AI_API_KEY });

const InterviewBot = () => {
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [jobRole, setJobRole] = useState("");
    const [background, setBackground] = useState("");
    const [skills, setSkills] = useState("");
    const [step, setStep] = useState(0);
    const [showReport, setShowReport] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [evaluation, setEvaluation] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (response) {
            speak(response);
            setConversation((prev) => [...prev, { candidate: transcript, interviewer: response }]);
        }
    }, [response]);

    const startListening = () => {
        const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        recognition.continuous = false;
        recognition.lang = "en-US";
        recognition.start();

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = async (event) => {
            const speechText = event.results[0][0].transcript;
            setTranscript(speechText);
            await handleInterviewFlow(speechText);
        };
        recognition.onend = () => setIsListening(false);
    };

    const handleInterviewFlow = async (speechText) => {
        if (step === 0) {
            setBackground(speechText);
            setResponse("That sounds great! What role are you applying for?");
            setStep(1);
        } else if (step === 1) {
            setJobRole(speechText);
            setResponse("Nice choice! Can you briefly describe your key skills?");
            setStep(2);
        } else if (step === 2) {
            setSkills(speechText);
            setResponse(`Thanks for sharing! Let's begin the interview. Say "OK, let's start" to begin.`);
            setStep(3);
        } else {
            await getAIResponse(`You are conducting a mock interview for ${jobRole} with skills in ${skills}. Candidate's response: "${speechText}". Ask the next relevant question according to candidate's response. Ask one question at a time and never use unnecessary special characters like asterisk (*) keep the interview professional and ask real-world challenging as well as basic technical questions and professional ethics questions.`);

            // await getBetterResponse(); // Get better response from AI
        }
    };

    const getAIResponse = async (prompt) => {
        try {
            const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt });
            setResponse(response.text);
        } catch (error) {
            setResponse("Sorry, I couldn't hear that. Please repeat.");
        }
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1;

        utterance.onstart = () => setIsSpeaking(true); // Start animation
        utterance.onend = () => setIsSpeaking(false);  // Stop animation when speech ends

        window.speechSynthesis.speak(utterance);
    };

    const getEvaluation = async () => {

        const evalPrompt = `You are an AI evaluator analyzing a mock interview. Your task is to evaluate the candidate's performance based on the following conversation.

Conversation: ${JSON.stringify(conversation)}

Evaluation Criteria (Rate each out of 5):
1. Understanding of Relevant Concepts  
2. Ability to Apply Technical Knowledge to Real-World Scenarios  
3. Depth of Understanding in the Subject  
4. Openness to Learning New Things  
5. Confidence and Preparedness for Placements  

Provide your evaluation in the following format using bullet points:

Understanding of Concepts: Rating - [X/5]  
Feedback: [Your short feedback here]  

Application of Knowledge: Rating - [X/5]  
Feedback: [Your short feedback here]  

Depth of Understanding: Rating - [X/5]  
Feedback: [Your short feedback here]  

Openness to Learning: Rating - [X/5]  
Feedback: [Your short feedback here]  

Confidence and Preparedness: Rating - [X/5]  
Feedback: [Your short feedback here]  

Overall Suggestions:  
[General improvement suggestions here (1-2 lines)]  

IMPORTANT INSTRUCTIONS:  
- Return the response EXACTLY in this format.  
- Do NOT include any JSON, code blocks, or Markdown formatting.  
- Do NOT add any extra explanations or notes.  
- Use clear bullet points and colons as shown above.  
`;



        try {
            const evalResp = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: evalPrompt,
            });
            // console.log(evalResp.text);
            setEvaluation(evalResp.text);
            setShowReport(true);
        } catch (error) {
            console.error("Error fetching evaluation:", error);
        }
    }

    const goToReport = () => {
        navigate("/report", {
            state: { evaluation: evaluation, }
        }) // Pass the evaluation data to the report page
    }

    const startInterview = () => {
        const resp = axios.post("http://127.0.0.1:5000/start_interview");
        setShowVideo(true);
    }

    const endInterview = () => {
        const resp = axios.post("http://127.0.0.1:5000/end_interview");
        setShowVideo(false);
        getEvaluation();
        // console.log(JSON.stringify(conversation, null, 2));
    }

    return (

        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
                <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl p-8 flex flex-col items-center">
                    <div className="flex gap-5">
                        <div className="flex flex-col h-[300px] items-center">
                            <h1 className="text-3xl font-bold mb-4 text-blue-400">1:1 Mock</h1>
                            <p className="text-gray-300 mb-6 text-center">Click "Start" to begin !</p>

                            {/* 🎤 Mic Animation - Only When AI is Speaking */}
                            <motion.div
                                className={`w-32 h-32 rounded-full bg-gray-700  flex items-center justify-center shadow-md ${isSpeaking ? "border-3 border-blue-600" : ""
                                    }`}
                                animate={isSpeaking ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                                transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
                            >
                                <span className="text-5xl">🤖</span>
                            </motion.div>

                            <div className="flex gap-4 mt-auto">
                                <button
                                    className="px-6 py-3 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-semibold rounded-lg transition shadow-md"
                                    onClick={startListening}
                                >
                                    {isListening ? "Listening..." : "Speak"}
                                </button>

                                <button
                                    className="px-6 py-3 bg-gradient-to-r hover:scale-105 bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold rounded-lg transition shadow-md"
                                    onClick={() => {
                                        setTranscript("");
                                        setResponse("Hello! I'm Alex, your AI interviewer. Let's start with a quick introduction about yourself.");
                                        setStep(0);
                                        startInterview();
                                    }}
                                >
                                    Start
                                </button>

                                <button
                                    className="px-6 py-3 bg-gradient-to-r bg-red-500 hover:scale-105 cursor-pointer hover:bg-red-600 text-white font-semibold rounded-lg transition shadow-md"
                                    onClick={() => {
                                        setTranscript("");
                                        setResponse("Thank you for the interview! I'm generating your report, please wait.");
                                        endInterview();

                                    }}
                                >
                                    End
                                </button>
                            </div>
                        </div>

                        {showVideo && (
                            <div>
                                <img
                                    className="rounded-lg w-full h-[300px]"
                                    src="http://127.0.0.1:5000/video_feed"
                                    alt="Live Video"
                                />
                            </div>
                        )}
                    </div>

                    {conversation.length > 0 && (
                        <div className="mt-6 w-full bg-gray-700 p-4 rounded-lg shadow-md text-left">
                            <p className="text-gray-400"><strong>You :</strong> {conversation[conversation.length - 1].candidate}</p>
                            <motion.p
                                className="mt-2 text-gray-100"
                                key={response} // Ensures animation triggers on every response update
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <strong>Alex :</strong> {conversation[conversation.length - 1].interviewer}
                            </motion.p>
                            {showReport && (<p onClick={goToReport} className="text-blue-300 cursor-pointer mt-2 font-bold block">View Analytics</p>)}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default InterviewBot;






//CONVO STORE MISMATCTED
// import React, { useState, useEffect } from "react";
// import { GoogleGenAI } from "@google/genai";
// import { motion } from "framer-motion";
// import axios from "axios";

// const { VITE_GEMINI_AI_API_KEY } = import.meta.env;
// const ai = new GoogleGenAI({ apiKey: VITE_GEMINI_AI_API_KEY });

// const InterviewBot = () => {
//     const [transcript, setTranscript] = useState("");
//     const [response, setResponse] = useState("");
//     const [isListening, setIsListening] = useState(false);
//     const [jobRole, setJobRole] = useState("");
//     const [background, setBackground] = useState("");
//     const [skills, setSkills] = useState("");
//     const [step, setStep] = useState(0);
//     const [showReport, setShowReport] = useState(false);
//     const [showVideo, setShowVideo] = useState(false);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [conversation, setConversation] = useState([]);

//     useEffect(() => {
//         if (response) {
//             speak(response);
//             setConversation((prev) => [...prev, { user: transcript, bot: response }]);
//         }
//     }, [response]);

//     const startListening = () => {
//         const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
//         recognition.continuous = false;
//         recognition.lang = "en-US";
//         recognition.start();

//         recognition.onstart = () => setIsListening(true);
//         recognition.onresult = async (event) => {
//             const speechText = event.results[0][0].transcript;
//             setTranscript(speechText);
//             await handleInterviewFlow(speechText);
//         };
//         recognition.onend = () => setIsListening(false);
//     };

//     const handleInterviewFlow = async (speechText) => {
//         if (step === 0) {
//             setBackground(speechText);
//             setResponse("That sounds great! What role are you applying for?");
//             setStep(1);
//         } else if (step === 1) {
//             setJobRole(speechText);
//             setResponse("Nice choice! Can you briefly describe your key skills?");
//             setStep(2);
//         } else if (step === 2) {
//             setSkills(speechText);
//             setResponse("Thanks for sharing! Let's begin the interview. Say 'OK, let's start' to begin.");
//             setStep(3);
//         } else {
//             await getAIResponse(`You are conducting a mock interview for ${jobRole} with skills in ${skills}. Candidate's response: "${speechText}". Ask the next relevant question.`);
//         }
//     };

//     const getAIResponse = async (prompt) => {
//         try {
//             const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt });
//             setResponse(response.text);
//         } catch (error) {
//             setResponse("Sorry, I couldn't hear that. Please repeat.");
//         }
//     };

//     const speak = (text) => {
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = "en-US";
//         utterance.rate = 1;

//         utterance.onstart = () => setIsSpeaking(true);
//         utterance.onend = () => setIsSpeaking(false);

//         window.speechSynthesis.speak(utterance);
//     };

//     const startInterview = () => {
//         axios.post("http://127.0.0.1:5000/start_interview");
//         setShowVideo(true);
//     };

//     const endInterview = () => {
//         axios.post("http://127.0.0.1:5000/end_interview");
//         setShowVideo(false);
//         console.log(JSON.stringify(conversation)); // Log the conversation to the console
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
//             <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl p-8 flex flex-col items-center">
//                 <h1 className="text-3xl font-bold mb-4 text-blue-400">1:1 Mock</h1>
//                 <p className="text-gray-300 mb-6 text-center">Click "Start" to begin!</p>

//                 <motion.div
//                     className={`w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center shadow-md ${isSpeaking ? "border-3 border-blue-600" : ""}`}
//                     animate={isSpeaking ? { scale: [1, 1.05, 1] } : { scale: 1 }}
//                     transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
//                 >
//                     <span className="text-5xl">🤖</span>
//                 </motion.div>

//                 <div className="flex gap-4 mt-6">
//                     <button
//                         className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
//                         onClick={startListening}
//                     >
//                         {isListening ? "Listening..." : "Speak"}
//                     </button>

//                     <button
//                         className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md"
//                         onClick={() => {
//                             setTranscript("");
//                             setResponse("Hello! I'm Alex, your AI interviewer. Let's start with a quick introduction about yourself.");
//                             setStep(0);
//                             setConversation([]);
//                             startInterview();
//                         }}
//                     >
//                         Start
//                     </button>

//                     <button
//                         className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md"
//                         onClick={() => {
//                             setResponse("Thank you for the interview! You can check the analytics for your performance.");
//                             endInterview();
//                             setShowReport(true);
//                         }}
//                     >
//                         End
//                     </button>
//                 </div>

//                 {showVideo && (
//                     <img className="rounded-lg w-full h-[300px] mt-4" src="http://127.0.0.1:5000/video_feed" alt="Live Video" />
//                 )}

//                 <div className="mt-6 w-full bg-gray-700 p-4 rounded-lg shadow-md text-left">
//                     {conversation.length > 0 && (
//                         <div>
//                             <p className="text-gray-400"><strong>You:</strong> {conversation[conversation.length - 1].user}</p>
//                             <motion.p className="mt-2 text-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
//                                 <strong>Alex:</strong> {conversation[conversation.length - 1].bot}
//                             </motion.p>
//                         </div>
//                     )}
//                     {showReport && (<a target="_blank" className="text-blue-300 mt-2 font-bold block" href="/report">View Analytics</a>)}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InterviewBot;