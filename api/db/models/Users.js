const Sequelize = require("sequelize");
const sequelize = require("../Database");
const { DEFAULT_LANG } = require("../../config");

const User = sequelize.define("user", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  phoneNumber: {
    type: Sequelize.STRING,
  },
  language: {
    type: Sequelize.STRING,
    defaultValue: DEFAULT_LANG,
  },
});

module.exports = User;
