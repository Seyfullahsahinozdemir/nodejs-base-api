const Users = require("../db/models/Users");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const bcrypt = require("bcrypt");
const is = require("is_js");
const UserRoles = require("../db/models/UserRoles");
const Roles = require("../db/models/Roles");
const config = require("../config");

const jwt = require("jwt-simple");

exports.findAll = async (req, res, next) => {
  try {
    let users = await Users.findAll();
    res.json(Response.successResponse(users));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.addUser = async (req, res, next) => {
  let body = req.body;
  try {
    if (!body.email)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "email field must be filled"
      );

    if (is.not.email(body.email))
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "wrong email format"
      );

    if (!body.password)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "password field must be filled"
      );

    if (body.password.length < Enum.PASS_LENGTH) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "password length must be greater than " + Enum.PASS_LENGTH
      );
    }

    if (!body.roles || !Array.isArray(body.roles) || body.roles.length == 0) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "roles must be an array"
      );
    }

    let roles = await Roles.findAll({ where: { id: body.roles } });

    console.log(roles);

    if (roles.length == 0) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "roles must be an array"
      );
    }

    let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);

    let user = await Users.create({
      email: body.email,
      password: password,
      isActive: true,
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber,
    });

    for (let i = 0; i < roles.length; i++) {
      await UserRoles.create({
        roleId: roles[i].id,
        userId: user.id,
      });
    }

    res
      .status(Enum.HTTP_CODES.CREATED)
      .json(
        Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED)
      );
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let body = req.body;
    let id = req.params._id;
    let updates = {};

    if (!id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "_id fields must be filled"
      );

    if (body.password && body.password.length < Enum.PASS_LENGTH) {
      updates.password = bcrypt.hashSync(
        body.password,
        bcrypt.genSaltSync(8),
        null
      );
    }

    if (typeof body.isActive === "boolean") updates.isActive = body.isActive;
    if (body.firstName) updates.firstName = body.firstName;
    if (body.lastName) updates.lastName = body.lastName;
    if (body.phoneNumber) updates.phoneNumber = body.phoneNumber;

    if (Array.isArray(body.roles) || body.roles.length > 0) {
      let userRoles = await UserRoles.findAll({ where: { userId: id } });

      let removeRoles = userRoles.filter((x) => !body.roles.includes(x.roleId));
      let newRoles = body.roles.filter(
        (x) => !userRoles.map((r) => r.roleId).includes(x)
      );

      console.log(removeRoles);

      if (removeRoles.length > 0) {
        await UserRoles.destroy({
          where: { id: removeRoles.map((x) => x.id) },
        });
      }

      if (newRoles.length > 0) {
        for (let i = 0; i < newRoles.length; i++) {
          await UserRoles.create({
            roleId: newRoles[i],
            userId: id,
          });
        }
      }
    }

    await Users.update(updates, { where: { id: id } });
    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.deleteUser = async (req, res, next) => {
  let params = req.params;
  try {
    if (!params._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "id cannot be empty"
      );

    await Users.destroy({ where: { id: params._id } });
    await UserRoles.destroy({ where: { userId: params._id } });
    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);

    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.register = async (req, res, next) => {
  let body = req.body;
  try {
    let user = await Users.findOne({});
    if (user) {
      return res.sendStatus(Enum.HTTP_CODES.NOT_FOUND);
    }

    if (!body.email)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "email field must be filled"
      );

    if (is.not.email(body.email))
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "wrong email format"
      );

    if (!body.password)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "password field must be filled"
      );

    if (body.password.length < Enum.PASS_LENGTH) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "password length must be greater than " + Enum.PASS_LENGTH
      );
    }

    let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);

    let createdUser = await Users.create({
      email: body.email,
      password: password,
      isActive: true,
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber,
    });

    let role = await Roles.create({
      roleName: Enum.USER_ROLES.SUPER_USER,
      isActive: true,
      createBy: createdUser.id,
    });

    await UserRoles.create({
      roleId: role.id,
      userId: createdUser.id,
    });

    res
      .status(Enum.HTTP_CODES.CREATED)
      .json(
        Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED)
      );
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.auth = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (
      typeof password !== "string" ||
      password.length < Enum.PASS_LENGTH ||
      is.not.email(email)
    )
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        "Validation Error",
        "email or password wrong"
      );

    let user = await Users.findOne({ where: { email: email } });
    if (!user)
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        "Validation Error",
        "email or password wrong"
      );

    if (!bcrypt.compareSync(password, user.password))
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        "Validation error",
        "Email or password Wrong"
      );

    let payload = {
      id: user.id,
      exp: parseInt(Date.now() / 1000) * config.JWT.EXPIRE_TIME,
    };

    let userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    let token = jwt.encode(payload, config.JWT.SECRET);
    res.json(Response.successResponse({ token, user: { userData } }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};
