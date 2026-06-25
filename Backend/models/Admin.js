const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");

const adminSchema=mongoose.createSchema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,unique:true,},
    role:{type:String,default:"ADMIN"}
},{timestamps:true})

// below function is used for hashing of the password
adminSchema.pre("save",async function(){
    if(!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password,10);
});

adminSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

module.exports=mongoose.model("Admin", adminSchema);