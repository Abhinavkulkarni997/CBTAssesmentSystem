const Exam=require("../models/Exam");
const Question=require("../models/Question");
const ExamSession=require("../models/ExamSession");

function shuffleArray(array) {

    const shuffled = [...array];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [shuffled[i], shuffled[j]] =
        [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

const startExam=async(req,res)=>{
    try{
        const {examId}=req.body;
        const userId=req.user._id;

        const completedSession=await ExamSession.findOne({
            userId,
            examId,
            status:"Completed"
        });
        if(completedSession){
            return res.status(400).json({
                success:false,
                message:"Exam already Submitted"
            })
        }

        // check for existing session
        const existingSession=await ExamSession.findOne({
            userId,
            examId,
            status:"InProgress"
        });

        if(existingSession){
            return res.status(200).json({
                success:true,
                message:'Resume Existing Session',
                session:existingSession
            });
        }
        const exam=await Exam.findById(examId);
        if(!exam){
            return res.status(404).json({
                success:false,
                message:"Exam not found"
            });
        }
        // let questions=await Question.find();

        // // shuffle questions and pick required number
        // questions.sort(()=>Math.random()-0.5);
        // const assignedQuestions=questions.map(question=>question._id);
        let questions = await Question.find();

const shuffledQuestions =
    shuffleArray(questions);

const assignedQuestions =
    shuffledQuestions.map(
        question => question._id
    );
    // console.log("Server Time:", new Date());
    // Check Node's current time BEFORE creating session
console.log("========== BEFORE CREATE ==========");
console.log("Node Date:", new Date());
console.log("Node ISO :", new Date().toISOString());
console.log("Timestamp:", Date.now());

        const session=await ExamSession.create({
            userId,
            examId,
            assignedQuestions,
            status:"InProgress",
        });
        // console.log("StartedAt:", session.startedAt);
        // Check what Mongo saved
console.log("========== AFTER CREATE ==========");
console.log("StartedAt:", session.startedAt);
console.log("StartedAt ISO:", session.startedAt.toISOString());
console.log("CreatedAt:", session.createdAt);
console.log("UpdatedAt:", session.updatedAt);
        res.status(201).json({
            success:true,
            message:"Exam Session Started",
            session
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

// const getCurrentSession=async(req,res)=>{
//     try{

//       const session =
//  await ExamSession.findOne({
//    userId:req.user._id,
//    status:"InProgress"
//  })
//     .populate(
//    "assignedQuestions",
//    "-correctAnswer"
//  )
//  .populate(
//    "examId"
//  );

//       if(!session){
//         return res.status(404).json({
//             success:false,
//             message:"No active session found"
//         });
//       }

//         res.status(200).json({
//             success:true,
//             session
//         });
//     }catch(error){
//         res.status(500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }

const getCurrentSession = async (req, res) => {
  try {

    const session =
      await ExamSession.findOne({
        userId: req.user._id,
        status: "InProgress"
      })
      .populate("examId");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active session found"
      });
    }

    const questions =
      await Question.find({
        _id: {
          $in: session.assignedQuestions
        }
      }).select("-correctAnswer");

    const orderedQuestions =
      session.assignedQuestions.map(
        id =>
          questions.find(
            q =>
              q._id.toString() ===
              id.toString()
          )
      );

    session.assignedQuestions =
      orderedQuestions;

    res.status(200).json({
      success: true,
      session
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const saveAnswer=async(req,res)=>{
    try{
        const {questionId, answer}=req.body;
        const session=await ExamSession.findOne({
            userId:req.user._id,
            status:"InProgress"
        });
        if(!session){
            return res.status(404).json({
                success:false,
                message:"No active session found"
            });
        }
        session.answers.set(questionId, answer);
        await session.save();
        res.status(200).json({
            success:true,
            message:"Answer saved successfully"
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

const submitExam=async(req,res)=>{
    try{
        const session=await ExamSession.findOne({
            userId:req.user._id,
            status:"InProgress"
        });
        if(!session){
            return res.status(404).json({
                success:false,
                message:"No active session found"
            });
        }
        const questionIds=Array.from(session.answers.keys());
        const questions=await Question.find({_id:{$in:questionIds}});
        let score=0;
        questions.forEach(question=>{
            const userAnswer=session.answers.get(question._id.toString());
            if(userAnswer===question.correctAnswer){
                score+=question.marks;
            }
        });
        session.score=score;
        session.status="Completed";
        session.submittedAt=new Date();
        await session.save();
        res.status(200).json({
            success:true,
            message:"Exam submitted successfully",
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

const getResults=async(req,res)=>{
    try{
        const results=await ExamSession.find({
            status:"Completed"
        }).populate("userId","name employeeId")
        .populate("examId","title");

        res.status(200).json({
            success:true,
            count:results.length,
            results
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}



const getUserExamStatus = async(req,res)=>{
    try{

        const userId = req.user._id;

        const inProgress =
        await ExamSession.findOne({
            userId,
            status:"InProgress"
        });

        if(inProgress){
            return res.json({
                status:"InProgress"
            });
        }

        const completed =
        await ExamSession.findOne({
            userId,
            status:"Completed"
        });

        if(completed){
            return res.json({
                status:"Completed"
            });
        }

        res.json({
            status:"NotStarted"
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

module.exports={startExam,getCurrentSession,saveAnswer,submitExam,getResults,getUserExamStatus};