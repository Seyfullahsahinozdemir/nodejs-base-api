var express = require("express");
var router = express.Router();
const auth = require("../lib/auth")();

const {
  findAll,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});
router.get("/", findAll);
router.post("/add", addCategory);
router.put("/update", updateCategory);
router.delete("/delete/:_id", deleteCategory);
module.exports = router;
