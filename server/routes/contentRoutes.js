const express = require("express");
const {
  listPosts,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/contentController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(protect);

router.get("/", listPosts);

// Editor and Admin can create/edit/delete content
router.post("/", authorizeRoles("admin", "editor"), createPost);
router.put("/:id", authorizeRoles("admin", "editor"), updatePost);
router.delete("/:id", authorizeRoles("admin", "editor"), deletePost);

module.exports = router;
