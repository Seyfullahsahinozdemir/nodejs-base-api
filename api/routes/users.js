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

router.get("/", authLib.checkRoles("user_view"), findAll);
router.post("/add", authLib.checkRoles("user_add"), addUser);
router.put("/update/:_id", authLib.checkRoles("user_update"), updateUser);
router.delete("/delete/:_id", authLib.checkRoles("user_delete"), deleteUser);

module.exports = router;
