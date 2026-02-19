const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER
exports.registerUser = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    // check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// LOGIN
exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// GET PROFILE (Protected)
exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
