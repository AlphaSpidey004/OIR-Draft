const User = require("../model/Users");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = "My Key"


const signup = async (req,res,next)=>{
    var {name,email,password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email:email})
    }catch(err){
        console.log(err);
    }
    if(existingUser){
        return res.status(400).json({message:"User already exists"})
    }
    const hashedPwd = bcrypt.hashSync(password)
    const user = new User({
        name,
        email,
        password:hashedPwd
    })
    try{
        user.save();
        return res.status(201).json({message:user})
    }catch(err){
        console.log(err);
    }
}

const login = async (req,res,next)=>{
    const {email,password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email:email})
    }catch(err){
        return new Error(err);
    }
    if(!existingUser){
        return res.status(400).json({message:"User not found...signup!!"})
    }
    const isPasswd = bcrypt.compareSync(password,existingUser.password);
    if(!isPasswd){
        return res.status(400).json({message:"Invalid Email/Password"})
    }
    const token = jwt.sign({id:existingUser.id},JWT_SECRET_KEY,{
        expiresIn:"30s"
    });
    res.cookie(String(existingUser.id),token,{
        path:'/',
        expires: new Date(Date.now() + 1000*30),
        httpOnly:true,
        sameSite:'lax'
    })
    
    return res.status(200).json({message:"Successfully logged in",existingUser,token})
}


const verifyToken = (req,res,next)=>{
    const cookies = req.headers.cookie;
    const token = cookies.split('=')[1];
    console.log(token);
    if(!token){
        res.status(404).json({message:"Token not found"});
    }
    jwt.verify(String(token),JWT_SECRET_KEY,(err,user)=>{
        if(err){
            res.status(400).json({message:"Invalid token"})
        }
    console.log(user.id)
    req.id = user.id
    })
    next();
}

const getUser = async (req,res,next)=>{
    const userId = req.id;
    let user;
    try{
        user = await User.findById(userId,"-password");
    }catch(err){
        return new Error(err)
    }
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    return res.status(200).json({user})
}

exports.signup = signup;
exports.login = login  ;
exports.verifyToken = verifyToken;
exports.getUser = getUser;