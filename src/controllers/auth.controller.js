const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
// User Registration
async function registerUser(req, res) {
  const {
    fullname: { firstname, lastname },
    email,
    password,
  } = req.body;
  try {
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullname: { firstname, lastname },
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);

    return res.status(201).json({
      message: "User registered successfully",
      email: user.email,
      fullname: user.fullname,
      id: user._id,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

//user Login

async function loginUser(req, res) {
    const{ email, password } = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
      const user = await userModel.findOne({ email: email });
      if(!user){
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      
      if(!isMatch){
        return res.status(400).json({ message: "Invalid credentials" });
      }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token );
    return res.status(200).json({
        message: "User logged in successfully",
        email: user.email,  
        fullname: user.fullname,
        id: user._id,
        token,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

//user Logout

module.exports = { registerUser, loginUser };
