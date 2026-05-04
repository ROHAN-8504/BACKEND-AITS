const express = require('express')
const cors=require('cors')
const app = express()
const dotenv=require('dotenv')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
dotenv.config();
const port = 3000
//middlewares
const limiter=require('./src/Middlewares/ratelimit')
app.use(limiter)
app.use(cors())
app.use(express.json())
let db=require('./src/config/db')
let products= require('./src/models/product.model')
let users=require('./src/models/users.model')
let sendmails=require('./gmail')

//health check
app.get('/health',(req,res)=>{
res.json({"msg":"server is active"})
})

//API1-seller will send the products and we will
//store product details in our db

app.post('/products',async (req,res)=>{
 try {
  const {title,price,image}=req.body
   await products.create({title,price,image})
   res.status(201).json({"msg":"product are saved"})
 } catch (error) {
  res.json({msg:error.message})
 }
})
//API2-FTECH ALL THE PRODUCTS
app.get('/products',async (req,res)=>{
  try {
  let allproducts= await products.find()
  res.status(200).json(allproducts)
  } catch (error) {
    res.json({msg:error.message})
  }
})

app.post('/allproducts',async (req,res)=>{
  try {
    await products.insertMany(req.body)
    res.status(201).json({"msg":"products are uploaded"}) 
  } catch (error) {
    res.json({"MSG":error.message})
  }
})

app.get('/products/:id',async (req,res)=>{
  try {
    let productid=req.params.id
   let product= await products.findById(productid)
   res.status(200).json(product)

  } catch (error) {
    res.json({msg:error.message})
  }
})


app.delete('/products/:id',async (req,res)=>{
  try {
     await products.findByIdAndDelete(req.params.id)
     res.json({'msg':"product deleted"})
  } catch (error) {
    res.json({msg:error.message})
  }
})

app.put('/products/:id',async (req,res)=>{
  try {
   
  await products.findByIdAndUpdate(req.params.id,req.body)
  res.json({"msg":"product updated"})

  } catch (error) {
    res.json({msg:error.message})
  }
})

//registration
app.post('/register',async (req,res)=>{
  try {
    const {username,password,email,role}=req.body
    if(!username || !password || !email || !role) return res.json({msg:"missing fields"})
  //check whether user exist or not
     let checkuser=await users.findOne({username})
     if(checkuser) return res.json({"msg":"user already exists"})
      //hash
   let hashpassword= await bcrypt.hash(password,10)
  await  users.create({username,password:hashpassword,email,role})
  res.json({"msg":"Registration succesfull"})
  return await sendmails(email,username);
  } catch (error) {
    res.json({msg:error.message})
  }
})


//login
app.post('/login',async (req,res)=>{
try {
  const {username,password}=req.body
if(!username || !password) return res.json({"msg":"missing fields"})
  //checking username
  let checkusername=await users.findOne({username})
  if(!checkusername) return res.json({"msg":"user not found"})
  //checking password
  let hashedpassword=checkusername.password
  //cpmpare the password
 let match= await bcrypt.compare(password,hashedpassword)
  if(!match) return res.json({"msg":"username or password is wrong"})
    //generate a token and send that token to client
  //payload secretkey  expiry date
  let secretkey=process.env.SECRETKEY
  let token=await jwt.sign({username:username},secretkey,{expiresIn:'1hr'})
    res.json({"msg":"login succesfull",token})
} catch (error) {
  res.json({"msg":error.message})
}
})



app.listen(port,()=>{
    console.log(`the server is running on ${port}`)
    db();
    console.log('db is connected')
   
})
