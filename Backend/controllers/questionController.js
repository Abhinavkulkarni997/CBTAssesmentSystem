const Question =require("../models/Question");
const XLSX = require("xlsx");
const fs=require("fs");
const createQuestion = async (req, res) => {
    try{
        const question=await Question.create(req.body);
    
        res.status(201).json({
            success:true,
            question,
            
        });
    }catch(error){
        res.status(500).json({
        success: false,
        message: error.message
    });
    }

}

const getQuestions=async(req,res)=>{
    try{
        const questions=await Question.find();
        res.status(200).json({
            success:true,
            count:questions.length,
            questions
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        });
        
    }
};

const deleteQuestion=async(req,res)=>{
    try{
        const question=await Question.findByIdAndDelete(req.params.id);
         if(!question){
            return res.status(404).json({
                success:false,
                message:"Question not found"
            });
        }
        res.status(200).json({
            success:true,
            message:"Question deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
};

const uploadQuestions=async(req,res)=>{
    try{
        const workbook=XLSX.readFile(req.file.path);
        const sheetName=workbook.SheetNames[0];
        const worksheet=workbook.Sheets[sheetName];
        const data=XLSX.utils.sheet_to_json(worksheet);
        const questions=data.map(
            row=>({
                question:row.Question,
                options:[
                    row.OptionA,
                    row.OptionB,
                    row.OptionC,
                    row.OptionD,
                ],
                correctAnswer:row.Answer,
                marks:1
            })
        );
        await Question.insertMany(questions);
        fs.unlinkSync(req.file.path);
        res.status(201).json({
            success:true,
            count:questions.length,
            message:"Questions uploaded successfully"
        });
    
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
module.exports = { createQuestion, getQuestions, deleteQuestion, uploadQuestions };