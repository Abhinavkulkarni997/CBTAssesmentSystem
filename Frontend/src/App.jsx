import {BrowserRouter , Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ExamPage from "./pages/ExamPage";
import Submitted from "./pages/Submitted";

function App() {
 

  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        } />
        <Route path="/exam" element={<ProtectedRoute><ExamPage/></ProtectedRoute>}/>
        <Route path="submitted" element={<Submitted/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
