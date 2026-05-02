const dotenv=require('dotenv')
dotenv.config()
const mongoose=require('mongoose')
async function connection(){
try {
   await  mongoose.connect(process.env.MONGODBURL) 
} catch (error) {
    console.log(error)
}
}
module.exports=connection;