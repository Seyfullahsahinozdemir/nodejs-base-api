const Sequelize = require("sequelize");
const sequelize = require("../Database");
const Users = require("./Users");
const Roles = require("./Roles");

const UserRoles = sequelize.define("user_roles", {});

Users.belongsToMany(Roles, {
  through: UserRoles,
});
Roles.belongsToMany(Users, {
  through: UserRoles,
});

module.exports = UserRoles;
