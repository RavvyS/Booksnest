const Comment = require("../models/Comment");


// CREATE COMMENT
exports.createComment = async (req, res) => {
  try {

    const { content, materialId } = req.body;

    const comment = new Comment({
      content,
      materialId,
      user: req.user.id,
    });

    await comment.save();

    res.status(201).json(comment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET ALL COMMENTS (Public)
exports.getComments = async (req, res) => {
  try {

    const comments = await Comment.find()
      .populate("user", "name role");

    res.status(200).json(comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// UPDATE COMMENT
exports.updateComment = async (req, res) => {
  try {

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Only owner can update
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    comment.content = req.body.content;
    comment.updatedAt = Date.now();

    await comment.save();

    res.status(200).json(comment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  try {

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Owner OR librarian can delete
    if (
      comment.user.toString() !== req.user.id &&
      req.user.role !== "librarian"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comment deleted",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
