var express = require("express");
var router = express.Router();

const {
  findAll,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

/* GET users listing. */
router.get("/", findAll);
router.post("/add", addCategory);
router.put("/update", updateCategory);
router.delete("/delete/:_id", deleteCategory);
module.exports = router;
