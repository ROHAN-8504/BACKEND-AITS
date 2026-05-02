const express = require('express')
const cors=require('cors')
const app = express()
const dotenv=require('dotenv')
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
  } catch (error) {
    res.json({msg:error.message})
  }
})






app.listen(port,()=>{
    console.log(`the server is running on ${port}`)
    db();
    console.log('db is connected')
   
})
