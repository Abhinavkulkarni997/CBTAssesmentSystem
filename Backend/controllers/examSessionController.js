const Exam=require("../models/Exam");
const Question=require("../models/Question");
const ExamSession=require("../models/ExamSession");

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
        let questions=await Question.find();

        // shuffle questions and pick required number
        questions.sort(()=>Math.random()-0.5);
        const assignedQuestions=questions.map(question=>question._id);
        const session=await ExamSession.create({
            userId,
            examId,
            assignedQuestions,
            status:"InProgress",
        });
        res.status(201).json({
            success:true,
            message:"Exam Session Started",
            session
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

const getCurrentSession=async(req,res)=>{
    try{

      const session =
 await ExamSession.findOne({
   userId:req.user._id,
   status:"InProgress"
 })
    .populate(
   "assignedQuestions",
   "-correctAnswer"
 )
 .populate(
   "examId"
 );

      if(!session){
        return res.status(404).json({
            success:false,
            message:"No active session found"
        });
      }

        res.status(200).json({
            success:true,
            session
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
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
module.exports={startExam,getCurrentSession,saveAnswer,submitExam,getResults};