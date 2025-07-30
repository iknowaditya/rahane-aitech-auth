const User = require("../models/User");

exports.listUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["admin", "editor", "viewer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  await user.save();

  res.json({ message: "Role updated" });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted" });
};
