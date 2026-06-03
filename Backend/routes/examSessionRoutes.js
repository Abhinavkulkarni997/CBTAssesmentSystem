const express=require("express");
const router=express.Router();
const{startExam,getCurrentSession,saveAnswer,submitExam,getResults}=require("../controllers/examSessionController");
const {protect}=require("../middleware/authMiddleware");

router.post("/start",protect,startExam);
router.get("/current",protect,getCurrentSession);
router.post("/save-answer",protect,saveAnswer);
router.post("/submit",protect,submitExam);
router.get("/results",protect,getResults);
module.exports=router;