const Roles = require("../db/models/Roles");
const RolePrivileges = require("../db/models/RolePrivileges");
const Response = require("../lib/Response");
const Enum = require("../config/Enum");
const rolePriv = require("../config/rolePrivileges");
const CustomError = require("../lib/Error");

exports.findAll = async (req, res, next) => {
  try {
    let roles = await Roles.findAll();
    res.json(Response.successResponse(roles));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);

    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.addRole = async (req, res, next) => {
  let body = req.body;
  try {
    if (!body.roleName)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "Role Name cannot be empty"
      );

    if (
      !body.permissions ||
      !Array.isArray(body.permissions) ||
      body.permissions.length == 0
    )
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "permissions field must be an Array"
      );

    const role = await Roles.create({
      roleName: body.roleName,
      isActive: true,
      createdBy: req.user?.id,
    });

    for (let i = 0; i < body.permissions.length; i++) {
      let priv = await RolePrivileges.create({
        roleId: role.id,
        permission: body.permissions[i],
        createdBy: req.user?.id,
      });
    }

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);

    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.updateRole = async (req, res, next) => {
  let body = req.body;
  let { _id } = req.params;
  try {
    if (!_id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "_id cannot be empty"
      );

    let updates = {};
    if (body.roleName) updates.roleName = body.roleName;
    if (typeof body.isActive === "boolean") updates.isActive = body.isActive;

    if (
      body.permissions &&
      Array.isArray(body.permissions) &&
      body.permissions.length > 0
    ) {
      let rolePrivs = await RolePrivileges.findOne({ where: { id: body._id } });

      let removedPermissions = permissions.filter(
        (x) => !body.permissions.includes(x.permission)
      );

      let newPermissions = body.permissions.filter(
        (x) => !permissions.map((p) => p.permission).includes(x)
      );

      if (removedPermissions.length > 0) {
        await RolePrivileges.destroy({
          where: { id: removedPermissions.map((x) => x.id) },
        });
      }

      if (newPermissions.length > 0) {
        for (let i = 0; i < newPermissions.length; i++) {
          let priv = await RolePrivileges.create({
            roleId: body._id,
            permission: newPermissions[i],
            createdBy: req.user?.id,
          });
        }
      }
    }

    await Roles.update(updates, { where: { id: _id } });
    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);

    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.deleteRole = async (req, res, next) => {
  let params = req.params;
  try {
    if (!params._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "id cannot be empty"
      );

    await Roles.destroy({ where: { id: params._id } });
    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);

    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.rolePrivileges = async (req, res, next) => {
  res.json(rolePriv);
};
