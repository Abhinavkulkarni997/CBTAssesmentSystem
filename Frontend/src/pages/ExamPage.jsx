import {useState,useEffect} from "react";
import api from '../services/api';
import { useNavigate } from "react-router-dom";


const ExamPage = () => {
     const [session,setSession]=useState(null);
     const [currentQuestion,setCurrentQuestion]=useState(0);
     const [selectedAnswers,setSelectedAnswers]=useState({});
     const [timeLeft,setTimeLeft]=useState(null);
     const [showSubmitModal,setShowSubmitModal]=useState(false);
     const [timerInitialized, setTimerInitialized] = useState(false);
     const navigate=useNavigate();

     


     useEffect(()=>{
        fetchSession();

     },[]);

    //  The below useEffect is working but as the timer is starting from 29:29 it is updated with new useEffect 
    //  useEffect(()=>{
    //     if(!session) return;
    //     const duration=session.examId.duration;
    //     const startTime=new Date(session.startedAt).getTime();
    //     const timer=setInterval(()=>{
    //         const now =Date.now();
    //         const elapsed=Math.floor((now-startTime)/1000);
    //         const remaining=duration*60-elapsed;
    //         setTimeLeft(remaining>0?remaining:0);
    //         setTimerInitialized(true);
    //     },1000);
    //     return ()=>clearInterval(timer);
    //  },[session]);

    useEffect(() => {

    if (!session) return;

    const duration =
        session.examId.duration;

    const startTime =
        new Date(
            session.startedAt
        ).getTime();

    const updateTimer = () => {

        const now = Date.now();

        const elapsed =Math.max(0,
            Math.floor(
                (now - startTime) / 1000
            ));

        const remaining =Math.max(0,
            duration * 60 - elapsed);

        setTimeLeft(
            remaining > 0
                ? remaining
                : 0
        );

        setTimerInitialized(true);
        console.log("Duration:", duration);
console.log("Started At:", session.startedAt);
console.log("Now:", new Date().toISOString());
console.log("Elapsed:", elapsed);
console.log("Remaining:", remaining);



    };

    updateTimer(); // Run immediately

    const timer =
        setInterval(
            updateTimer,
            1000
        );

    return () =>
        clearInterval(timer);

}, [session]);

    

  useEffect(() => {

  const handleBeforeUnload = (e) => {

    e.preventDefault();

    e.returnValue = "";

  };

  window.addEventListener(
    "beforeunload",
    handleBeforeUnload
  );

  return () => {

    window.removeEventListener(
      "beforeunload",
      handleBeforeUnload
    );

  };

}, []);
const handleSubmitExam=async ()=>{
    try{
        await api.post("/exam-session/submit");
        setShowSubmitModal(false);
        navigate("/submitted")
    }catch(error){
        console.log(error);
    }
}

useEffect(() => {

    if (
        timerInitialized &&
        timeLeft <= 0 &&
        session?.status === "InProgress"
    ) {

        handleSubmitExam();

    }

}, [
    timeLeft,
    timerInitialized,
    session
]);
     const fetchSession=async()=>{
        try{
            const res=await api.get("/exam-session/current");
        //      console.log(
        //     "Questions Received:",
        //     res.data.session.assignedQuestions
        // );
            setSession(res.data.session);
            setSelectedAnswers(res.data.session.answers || {});

        }catch(error){
            console.log(error);
        }
     };

     if(!session){
        return(
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
     }

     const question=session.assignedQuestions[currentQuestion];

     const handleAnswerSelect =async (
        questionId,
        answer
    ) => {

  try {

    await api.post(
      "/exam-session/save-answer",
      {
        questionId,
        answer
      }
    );

    setSelectedAnswers(
      prev => ({
        ...prev,
        [questionId]:
        answer
      })
    );

  } catch (error) {

    console.log(error);

  }

};



  return (
    <div className=' min-h-screen bg-slate-100 '>
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="sticky top-0 z-50 bg-slate-100 pb-4">

           
            {/* timer */}
            <div className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between items-center">

  <div>
    <h2 className="font-semibold text-lg">
       Assessment
    </h2>

    <p className="text-sm text-gray-500">
      Online Examination
    </p>
  </div>

  <div
    className={`
      px-6 py-3 rounded-xl font-bold text-xl

      ${
        timeLeft <= 300
          ? "bg-red-100 text-red-700 animate-pulse"
          : timeLeft <= 600
          ? "bg-yellow-100 text-yellow-700"
          : "bg-cyan-100 text-cyan-700"
      }
    `}
  >
    ⏱ {
    timeLeft !== null
        ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`
        : "--:--"
}
    
  </div>

</div>

 {/* Progress bar */}

<div className="mt-3">
  <div className="flex justify-between text-sm mb-1">
    <span>Progress</span>
    <span>
      {
        Object.keys(selectedAnswers).length
      }
      /
      {
        session.assignedQuestions.length
      }
      {" "}Answered
    </span>
    <button onClick={()=>setShowSubmitModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium">Submit Exam</button>
  </div>

 

  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-cyan-500 h-2 rounded-full"
      style={{
        width: `${
          (
            Object.keys(selectedAnswers).length /
            session.assignedQuestions.length
          ) * 100
        }%`,
      }}
    />
  </div>
</div>
{/* End of Progress Bar */}


            {/* answers  block and  blue color for current question and green for answered and gray for unanswered  */}
            <div className="bg-white rounded-xl shadow p-4 mb-4">
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    
                    {
      session.assignedQuestions.map(
        (q, index) => (

          <button
            key={q._id}
            onClick={() =>
              setCurrentQuestion(index)
            }
            className={`
              h-10
              w-10
              rounded

              ${
                currentQuestion === index
                  ? "bg-blue-600 text-white"   
                  : selectedAnswers[q._id]
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }
            `}
          >
            {index + 1}
          </button>

        )
      )
    }
                </div>
            </div>
            {/* End of Answers block */}

            </div>
            {/* Questions Block */}
             <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Question{" "}{currentQuestion+1}{" "}of{" "}{session.assignedQuestions.length}</h2>
                <p className="text-lg mb-6">{question.question}</p>
                <div className="space-y-3">
                    {
                        question.options.map(
                            (option)=>(
                                <button key={option}
                                onClick={()=>handleAnswerSelect(question._id,option)}
                                className={`w-full text-left border rounded p-3  
                                    ${selectedAnswers[question._id]===option ? "bg-cyan-700 text-white":"hover:bg-slate-100"}`}
                                >
                                    {option}

                                </button>
                            )
                        )
                    }
                    <div className="flex justify-between mt-6">
                        <button disabled={
                            currentQuestion===0
                        }
                        onClick={()=>setCurrentQuestion(currentQuestion-1)} className="bg-[#1A1A1A] text-white px-4 py-2 rounded">
                            Previous
                        </button>
                        <button disabled={currentQuestion===session.assignedQuestions.length-1} onClick={()=>setCurrentQuestion(currentQuestion+1)}
                        className="bg-cyan-700 text-white px-4 py-2 rounded">
                            Next
                        </button>

                        

                    </div>
                </div>
             </div>
             {/* End of Questions Block */}

             {
  showSubmitModal && (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">

      <div className="bg-white p-6 rounded-xl shadow-lg w-96">

        <h2 className="text-xl font-bold mb-4">
          Confirm Submission
        </h2>

        <p className="mb-2">
          Answered:
          {" "}
          {Object.keys(selectedAnswers).length}
        </p>

        <p className="mb-6">
          Not Answered:
          {" "}
          {
            session.assignedQuestions.length -
            Object.keys(selectedAnswers).length
          }
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={() =>
              setShowSubmitModal(false)
            }
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmitExam}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>

        </div>

      </div>

    </div>

  )
}


        </div>
       </div>
  );
}

export default ExamPage;