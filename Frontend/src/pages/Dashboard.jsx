import {useState,useEffect} from "react";
import {useAuth} from "../context/AuthContext";
import api from "../services/api";
import {useNavigate} from "react-router-dom";
function Dashboard() {
    const {logout}=useAuth();
    const [exams,setExams]=useState([]);
    const [examStatus,setExamStatus]=useState({});
    const navigate=useNavigate();

    useEffect(()=>{
        fetchExams();
        fetchExamStatus();
    },[]);

    const fetchExams=async()=>{
        try{
            const res=await api.get("/exams");
            setExams(res.data.exams);
        }catch(error){
            console.log(error);
        }
    };

    const fetchExamStatus=async()=>{
        try{
            const res=await api.get("/exam-session/current");

            if(res.data.session){
                setExamStatus({
                    status:"InProgress"
                })
            }
        }catch(error){
            if(error.response?.status===404){
                setExamStatus({status:"NotStarted"});
            }
        }
    }
    const handleStartExam=
    async(examId)=>{
        try{
            await api.post("/exam-session/start",{examId});
            navigate("/exam");
        }catch(error){
            alert(error.response?.data?.message);
        }
    };

    const handleLogout=()=>{
        logout();
        window.location.href="/";
    };
  return (
    <div className="min-h-screen bg-slate-100">
        <header className="bg-white shadow">
             <div className="max-w-7xl mx-auto py-4 px-4 flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">CBT Assessment Dashboard</h1>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                    Logout
                </button>
            </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
               

                {
                    exams.map((exam)=>(
                     <div key={exam._id} className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{exam.title}</h2>
                    <p className="mt-3">Duration: {exam.duration} minutes</p>
                    <p>Questions: {exam.totalQuestions}</p>
                   {
    examStatus.status ===
    "InProgress" ? (

        <button
            onClick={() =>
                navigate("/exam")
            }
            className="mt-4 px-4 py-2 w-full bg-green-600 text-white rounded"
        >
            Continue Assessment
        </button>

    ) : (

        <button
            onClick={() =>
                handleStartExam(exam._id)
            }
            className="mt-4 px-4 py-2 w-full bg-cyan-600 text-white rounded"
        >
            Start Assessment
        </button>

    )
}
                </div>
                 ))
                }
               
            </div>
        </main>
       
    </div>
  );
}

export default Dashboard