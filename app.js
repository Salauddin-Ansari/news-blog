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

// Keep the web process available while MongoDB is connecting. Render can then
// detect the HTTP service, and database errors are reported without an
// unhandled promise rejection.
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set. Add it to the Render environment.");
} else {
  mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection failed:", error.message));
}

// Shared layout locals let the site render a useful page even before the
// database is available (or when it is temporarily unreachable).
app.locals.categories = [];
app.locals.latestNews = [];
app.locals.settings = {
  website_title: "News",
  website_logo: "",
  footer_description: "",
};

app.get("/healthz", (req, res) => res.status(200).send("ok"));

// Do not let Mongoose queue page requests for 10 seconds when the database is
// not connected. Keep /healthz available so Render can still probe the web
// process while its database configuration is being corrected.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();

  res
    .status(503)
    .send("Database unavailable. Check the MONGODB_URI setting and MongoDB Atlas network access.");
});

// Routes

app.use("/admin", (req, res, next) => {
  res.locals.layout = "admin/layout";
  next();
});
app.use("/admin", require("./routes/admin"));

app.use("/", require("./routes/frontend"));

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
