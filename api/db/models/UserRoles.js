const Sequelize = require("sequelize");
const sequelize = require("../Database");
const Users = require("./Users");
const Roles = require("./Roles");

const UserRoles = sequelize.define("user_roles", {});

Roles.hasMany(UserRoles, { foreignKey: "roleId" });
Users.hasMany(UserRoles, { foreignKey: "userId" });

module.exports = UserRoles;
