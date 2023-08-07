const Sequelize = require("sequelize");
const sequelize = require("../Database");
const RolePrivileges = require("./RolePrivileges");

const Roles = sequelize.define("role", {
  roleName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  createdBy: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Roles.hasMany(RolePrivileges, { foreignKey: "roleId", onDelete: "CASCADE" });

module.exports = Roles;
