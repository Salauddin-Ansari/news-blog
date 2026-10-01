const commentModel = require("../models/Comment");
const newsModel = require("../models/News");
const createError = require("../utils/error-message");

const allComment = async (req, res, next) => {
  try {
    let comments;
    if (req.role === "admin") {
      comments = await commentModel
        .find()
        .populate("article", "title")
        .sort({ createdAt: -1 });
    } else {
      const news = await newsModel.find({ author: req.id });
      const newsIds = news.map((news) => news._id);
      comments = await commentModel
        .find({ article: { $in: newsIds } })
        .populate("article", "title")
        .sort({ createdAt: -1 });
    }

    // res.json(comments);
    res.render("admin/comments", { role: req.role, comments });
  } catch (error) {
    next(createError("Error fetching comments", 500));
  }
};

const updateCommentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid comment status" });
    }
    const comment = await commentModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    res.json({ success: true, comment });
  } catch (error) {
    next(createError("Error updating comment status", 500));
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await commentModel.findByIdAndDelete(req.params.id);
    if (!comment) return next(createError("Comment not found", 404));
    res.json({ success: true });
  } catch (error) {
    next(createError("Error deleting comment", 500));
  }
};
module.exports = {
  allComment,
  updateCommentStatus,
  deleteComment,
};
