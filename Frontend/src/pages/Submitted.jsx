import { Link } from "react-router-dom";

const Submitted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
            <h1 className='text-3xl font-bold text-green-600 mb-4'>
                Exam Submitted
            </h1>
            <p className="text-gray-600">
                Your assessment has been submitted successfully.
            </p> 
                <p className="mt-4 text-sm text-gray-500 mb-4">
                    You may now close this window.
                </p>
                 <Link
          to="/dashboard"
          className="bg-cyan-600 text-white px-6 py-2 rounded-lg "
        >
          Back To Dashboard
        </Link>
            
        </div>
        
        
       </div>
  );
}

export default Submitted;