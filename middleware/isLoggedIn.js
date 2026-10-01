const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect("/admin/");

    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    req.id = tokenData.id;
    req.role = tokenData.role;
    req.fullname = tokenData.fullname;
    // res.locals is available to both the page and its shared EJS layout.
    res.locals.role = tokenData.role;
    res.locals.fullname = tokenData.fullname;

    next();
  } catch (error) {
    res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = isLoggedIn;
