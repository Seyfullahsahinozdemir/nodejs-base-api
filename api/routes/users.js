var express = require("express");
var router = express.Router();
const authLib = require("../lib/auth")();

const {
  findAll,
  addUser,
  updateUser,
  deleteUser,
  register,
  auth,
} = require("../controllers/users");

router.post("/register", register);
router.post("/auth", auth);

router.all("*", authLib.authenticate(), (req, res, next) => {
  next();
});

router.get("/", findAll);
router.post("/add", addUser);
router.put("/update/:_id", updateUser);
router.delete("/delete/:_id", deleteUser);

module.exports = router;
