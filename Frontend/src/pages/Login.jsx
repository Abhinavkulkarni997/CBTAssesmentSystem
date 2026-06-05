import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../services/api";
import {useAuth} from "../context/AuthContext";

function Login(){
    const [employeeId,setEmployeeId]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
    const {login} = useAuth();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            setLoading(true);
            const res=await api.post("/auth/login",
                {
                    employeeId,
                    password,
                }
            );
            login(res.data.token);
            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message);
        }finally{
            setLoading(false);
        }
    };
    return(
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6">Assessment Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Employee ID" value={employeeId} onChange={(e)=>setEmployeeId(e.target.value)} required className="w-full border hover:border-cyan-400 p-3 rounded"/>
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full border hover:border-cyan-300 p-3 rounded"/>
            
            <button type="submit" disabled={loading} className="w-full bg-cyan-600 text-white p-3 rounded hover:bg-cyan-600 transition">
                {loading ? "Logging in..." : "Login"}
            </button>
            </form>
            </div>
        </div>
    )
}

export default Login;