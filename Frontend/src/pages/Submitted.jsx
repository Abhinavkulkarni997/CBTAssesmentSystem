

const Submitted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow text-center">
            <h1 className='text-3xl font-bold text-green-600 mb-4'>
                Exam Submitted
            </h1>
            <p className="text-gray-600">
                Your assessment has been submitted successfully.
            </p> 
                <p className="mt-4 text-sm text-gray-500">
                    You may now close this window.
                </p>
            
        </div>
        
        
       </div>
  );
}

export default Submitted;