const express = require("express");
const {
  listUsers,
  updateRole,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/", listUsers);
router.put("/:id/role", updateRole);
router.delete("/:id", deleteUser);

module.exports = router;
