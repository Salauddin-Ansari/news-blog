const categoryModel = require("../models/Category");
const userModel = require("../models/User");
const newsModel = require("../models/News");
const settingModel = require("../models/Settings");
const NodeCache = require("node-cache");

const cache = new NodeCache();

const loadCommonData = async (req, res, next) => {
  try {
    var latestNews = cache.get("latestNewsCache");
    var categories = cache.get("categoriesCache");
    var settings = cache.get("settingCache");

    if (!latestNews && !categories && !settings) {
      settings = await settingModel.findOne().lean();

      latestNews = await newsModel
        .find()
        .populate("category", { name: 1, slug: 1 })
        .populate("author", "fullname")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      const catergoriesInUse = await newsModel.distinct("category");
      categories = await categoryModel
        .find({
          _id: { $in: catergoriesInUse },
        })
        .lean();

      cache.set("latestNewsCache", latestNews, 60 * 60);
      cache.set("categoriesCache", categories, 60 * 60);
      cache.set("settingCache", settings, 60 * 60);
    }

    res.locals.settings = settings;
    res.locals.latestNews = latestNews;
    res.locals.categories = categories;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = loadCommonData;
