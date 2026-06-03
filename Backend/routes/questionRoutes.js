const express=require("express");
const router=express.Router();
const upload=require("../config/multer");

const {createQuestion,getQuestions,deleteQuestion}=require("../controllers/questionController");
const {protect}=require("../middleware/authMiddleware");
const {uploadQuestions}=require("../controllers/questionController");

router.post("/create",protect,createQuestion);
router.get("/",protect,getQuestions);
router.delete("/:id",protect,deleteQuestion);
router.post("/upload",protect,upload.single("file"),uploadQuestions);

module.exports = router;