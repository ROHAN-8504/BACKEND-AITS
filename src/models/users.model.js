const mongoose=require('mongoose')
let userschema=new mongoose.Schema({
    username:{type:String,required:true ,unique:true},
    password:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    role:{type:String,required:true ,enum:["seller","buyer"]}
},{timestamps:true})

let usermodel=mongoose.model('users',userschema)

module.exports=usermodel