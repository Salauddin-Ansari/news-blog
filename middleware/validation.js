const { body } = require("express-validator");

const loginValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^\S+$/)
    .withMessage("Username must not contain spaces")
    .isLength({ min: 5, max: 15 })
    .withMessage("Username must be 5 to 10 characters long"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    // .isStrongPassword()
    .isLength({ min: 5, max: 12 })
    .withMessage("Password must be 5 to 12 characters long"),
];

const userValidation = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Fullname is required")
    .isLength({ min: 5, max: 15 })
    .withMessage("Fullname must be 5 to 25 characters long"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^\S+$/)
    .withMessage("Username must not contain spaces")
    .isLength({ min: 5, max: 15 })
    .withMessage("Username must be 5 to 10 characters long"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    // .isStrongPassword()
    .isLength({ min: 5, max: 12 })
    .withMessage("Password must be 5 to 12 characters long"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["author", "admin"])
    .withMessage("Role must be author or admin"),
];

const userUpdateValidation = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Fullname is required")
    .isLength({ min: 5, max: 15 })
    .withMessage("Fullname must be 5 to 25 characters long"),

  body("password")
    .optional({ checkFalsy: true })
    .isLength({ min: 5, max: 12 })
    .withMessage("Password must be 5 to 12 characters long"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["author", "admin"])
    .withMessage("Role must be author or admin"),
];

const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category Name is required")
    .isLength({ min: 3, max: 12 })
    .withMessage("Category Name must be 3 to 12 characters long"),

  body("name")
    .isLength({ max: 100 })
    .withMessage("Description must be atmost 100 characters long"),
];

const articleValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be 5 to 100 characters long"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 50 })
    .withMessage("Content must be 50 to 1500 characters long"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  // body("image").custom((value, { req }) => {
  //   if (!req.file) {
  //     throw new Error("Image is required");
  //   }
  //   const allowedExtensions = [".jpg", ".jpeg", ".png"];
  //   const fileExtension = path.extname(req.file.originalname).toLowerCase();
  //   if (!allowedExtensions.includes(fileExtension)) {
  //     throw new Error(
  //       "Invalid image format. Only jpg, jpeg, and png are allowed",
  //     );
  //   }
  //   return type;
  // }),
];

module.exports = {
  loginValidation,
  userValidation,
  userUpdateValidation,
  categoryValidation,
  articleValidation,
};
