const express = require("express");
const router = express.Router();

const articleController = require("../controller/articleController");
const userController = require("../controller/userController");
const categoryController = require("../controller/categoryController");
const commentController = require("../controller/commentController");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/multer");
const isValid = require("../middleware/validation");

// Login routes
router.get("/", userController.loginPage);
router.post("/index", isValid.loginValidation, userController.adminLogin);
router.get("/logout", userController.logout);
router.get("/dashboard", isLoggedIn, userController.dashboard);
router.get("/settings", isLoggedIn, isAdmin, userController.settings);
router.post(
  "/save-settings",
  isLoggedIn,
  isAdmin,
  upload.single("website_logo"),
  userController.saveSettings,
);

// User CRUD route
router.get("/users", isLoggedIn, isAdmin, userController.allUser);
router.get(
  "/add-user",
  isLoggedIn,
  isAdmin,

  userController.addUserPage,
);
router.post(
  "/add-user",
  isLoggedIn,
  isAdmin,
  isValid.userValidation,
  userController.addUser,
);
router.get(
  "/update-user/:id",
  isLoggedIn,
  isAdmin,
  userController.updateUserPage,
);
router.post(
  "/update-user/:id",
  isLoggedIn,
  isAdmin,
  isValid.userUpdateValidation,
  userController.updateUser,
);
router.delete(
  "/delete-user/:id",
  isLoggedIn,
  isAdmin,
  userController.deleteUser,
);

// User Category route
router.get("/category", isLoggedIn, isAdmin, categoryController.allCategory);
router.get(
  "/add-category",
  isLoggedIn,
  isAdmin,

  categoryController.addCategoryPage,
);
router.post(
  "/add-category",
  isLoggedIn,
  isAdmin,
  isValid.categoryValidation,
  categoryController.addCategory,
);
router.get(
  "/update-category/:id",
  isLoggedIn,
  isAdmin,
  categoryController.updateCategoryPage,
);
router.post(
  "/update-category/:id",
  isLoggedIn,
  isAdmin,
  isValid.categoryValidation,
  categoryController.updateCategory,
);
router.delete(
  "/delete-category/:id",
  isLoggedIn,
  isAdmin,
  categoryController.deleteCategory,
);



// User Article route
router.get("/article", isLoggedIn, articleController.allArticle);
router.get("/add-article", isLoggedIn, articleController.addArticlePage);
router.post(
  "/add-article",
  isLoggedIn,

  upload.single("image"),
  isValid.articleValidation,
  articleController.addArticle,
);

router.get(
  "/update-article/:id",
  isLoggedIn,

  articleController.updateArticlePage,
);
router.post(
  "/update-article/:id",
  isLoggedIn,
  upload.single("image"),
  isValid.articleValidation,
  articleController.updateArticle,
);
router.delete(
  "/delete-article/:id",
  isLoggedIn,
  articleController.deleteArticle,
);

// Comment route
router.get("/comments", isLoggedIn, commentController.allComment);
router.patch(
  "/update-comment-status/:id",
  isLoggedIn,
  commentController.updateCommentStatus,
);
router.delete(
  "/delete-comment/:id",
  isLoggedIn,
  commentController.deleteComment,
);

// 404 Middleware
router.use((req, res, next) => {
  res.status(404).render("admin/404", {
    message: "Page not found",
    role: req.role,
  });
});

// 500 Error Handler
router.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  let view;
  switch (status) {
    case 401:
      view = "admin/401";
      break;
    case 404:
      view = "admin/404";
      break;
    case 500:
      view = "admin/500";
      break;
    default:
      view = "admin/500";
  }
  res.status(500).render(view, {
    message: err.message || "Something went wrong",
    role: req.role,
  });
});

module.exports = router;
