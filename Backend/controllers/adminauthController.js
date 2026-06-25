const Admin=require('../models/Admin');
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

const adminLogin=async(req,res)=>{
    try{
        console.log("LOGIN BODY:",req.body);
        const {email,password}=req.body;
        const admin=await Admin.findOne({email});
        if(!admin){
            return res.status(401).json({message:"Invalid credentials"});
        }

        const isMatch=await admin.comparePassword(password,admin.password);

        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials"});
        }

        const token=jwt.sign(
            {id:amdin._id,role:"admin"},
            process.env.JWT_SECRET,
            
        )

    }catch(error){
        console.log("Admin login Error:",error);
        res.status(500).json({message:"Server Error"});
    }
}

module.exports = adminLogin;