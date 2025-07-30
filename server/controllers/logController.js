const Log = require("../models/Log");

exports.listLogs = async (req, res) => {
  const logs = await Log.find()
    .populate("user", "username")
    .sort({ timestamp: -1 })
    .limit(50);
  res.json(logs);
};
