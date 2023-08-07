var express = require("express");
var router = express.Router();

const {
  findAll,
  addUser,
  updateUser,
  deleteUser,
  register,
} = require("../controllers/users");

router.get("/", findAll);
router.post("/add", addUser);
router.put("/update/:_id", updateUser);
router.delete("/delete/:_id", deleteUser);

router.post("/register", register);

module.exports = router;
