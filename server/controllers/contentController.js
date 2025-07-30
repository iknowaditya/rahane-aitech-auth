const Post = require("../models/Post");

exports.listPosts = async (req, res) => {
  const posts = await Post.find().populate("author", "username role");
  res.json(posts);
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
    author: req.user._id,
  });

  await post.save();
  res.status(201).json(post);
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const post = await Post.findById(id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  post.title = title || post.title;
  post.content = content || post.content;

  await post.save();
  res.json(post);
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await post.remove();
  res.json({ message: "Post deleted" });
};
