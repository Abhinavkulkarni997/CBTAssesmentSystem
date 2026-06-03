const express=require("express");
const router=express.Router();
const {createExam,getExams}=require("../controllers/examController");
const {protect}=require("../middleware/authMiddleware");

router.post("/create",protect,createExam);
router.get("/",protect,getExams);

module.exports = router;