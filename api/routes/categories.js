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
router.get("/", auth.checkRoles("category_view"), findAll);
router.post("/add", auth.checkRoles("category_add"), addCategory);
router.put("/update", auth.checkRoles("category_update"), updateCategory);
router.delete(
  "/delete/:_id",
  auth.checkRoles("category_delete"),
  deleteCategory
);
module.exports = router;
