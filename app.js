const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const minifyHTML = require("express-minify-html-terser");
const compression = require("compression");
require("dotenv").config();

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  express.static(path.join(__dirname, "public"), {
    // Avoid serving stale CSS/JS while developing; keep the existing cache in production.
    maxAge: process.env.NODE_ENV === "production" ? "30m" : 0,
  }),
);
app.use(expressLayouts);
app.set("layout", "layout");
app.use(
  compression({
    level: 9,
    threshold: 10 * 1024,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

app.use(
  minifyHTML({
    override: true,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  }),
);

// View Engine
app.set("view engine", "ejs");

//Database Connection
mongoose.connect(process.env.MONGODB_URI);

// Routes

app.use("/admin", (req, res, next) => {
  res.locals.layout = "admin/layout";
  next();
});
app.use("/admin", require("./routes/admin"));

app.use("/", require("./routes/frontend"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
