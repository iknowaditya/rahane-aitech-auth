const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: "1d" });
};

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // Check if username exists
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ message: "Username already exists" });

    // Check if email exists
    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "Email already registered" });

    // Create user
    const user = await User.create({ username, email, password, role });

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
