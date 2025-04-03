// import { useEffect, useState } from "react";
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const API_URL = "http://127.0.0.1:5000/interview_report";

// export default function InterviewDashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(API_URL)
//       .then((res) => res.json())
//       .then((data) => {
//         setData(data);
//         setLoading(false);
//       })
//       .catch((err) => console.error("Error fetching data:", err));
//   }, []);

//   if (loading)
//     return <div className="h-64 w-full animate-pulse bg-gray-700 rounded-lg"></div>;

//   const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

//   return (
//     <div className="bg-gray-900 text-white min-h-screen p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Interview Analysis Dashboard</h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="p-5 bg-gray-800 rounded-lg shadow-md">
//           <p className="text-lg text-gray-300">Confidence Score</p>
//           <p className="text-3xl font-bold">{data.confidence_score}%</p>
//         </div>

//         <div className="p-5 bg-gray-800 rounded-lg shadow-md">
//           <p className="text-lg text-gray-300">Eye Contact %</p>
//           <p className="text-3xl font-bold">{data.eye_contact_percentage}%</p>
//         </div>

//         <div className="p-5 bg-gray-800 rounded-lg shadow-md">
//           <p className="text-lg text-gray-300">Dominant Expression</p>
//           <p className="text-3xl font-bold">{data.dominant_expression}</p>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//         <div className="p-5 bg-gray-800 rounded-lg shadow-md">
//           <h2 className="text-lg mb-2">Eye Contact Score</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={[{ name: "Eye Contact", score: data.eye_contact_score }]}>
//               <XAxis dataKey="name" stroke="#ccc" />
//               <YAxis stroke="#ccc" />
//               <Tooltip />
//               <Bar dataKey="score" fill="#82ca9d" barSize={50} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="p-5 bg-gray-800 rounded-lg shadow-md">
//           <h2 className="text-lg mb-2">Confidence Score</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie
//                 data={[{ name: "Confidence", value: data.confidence_score }]}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={50}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 label
//               >
//                 <Cell key={`cell-0`} fill="#8884d8" />
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="mt-6 p-5 bg-gray-800 rounded-lg shadow-md">
//         <h2 className="text-lg mb-2">Blink Count Over Time</h2>
//         <ResponsiveContainer width="100%" height={250}>
//           <LineChart data={[{ name: "Blinks", count: data.blink_count }]}>
//             <XAxis dataKey="name" stroke="#ccc" />
//             <YAxis stroke="#ccc" />
//             <Tooltip />
//             <Line type="monotone" dataKey="count" stroke="#ffc658" strokeWidth={2} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
