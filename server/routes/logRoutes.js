const express = require("express");
const { listLogs } = require("../controllers/logController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/", listLogs);

module.exports = router;
