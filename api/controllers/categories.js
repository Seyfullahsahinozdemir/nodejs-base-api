const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const AuditLogs = require("../lib/AuditLogs");
const logger = require("../lib/logger/LoggerClass");

exports.findAll = async (req, res, next) => {
  try {
    let categories = await Categories.findAll();
    res.json(Response.successResponse(categories));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);

    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.addCategory = async (req, res, next) => {
  let body = req.body;
  try {
    if (!body.name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "name cannot be empty"
      );

    const category = await Categories.create({
      name: body.name,
      isActive: true,
      createdBy: req.user?.id,
    });

    AuditLogs.info(req.user?.email, "Categories", "Add", { category });
    logger.info(req.user?.email, "Categories", "Add", category);

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    logger.error(req.user?.email, "Categories", "Add", error);
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.updateCategory = async (req, res, next) => {
  let body = req.body;
  let { _id } = req.params;
  try {
    if (!_id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "id cannot be empty"
      );

    let updates = {};
    if (body.name) updates.name = body.name;
    if (typeof body.isActive === "boolean") updates.isActive = body.isActive;
    await Categories.update(updates, { where: { id: _id } });

    AuditLogs.info(req.user?.email, "Categories", "Update", {
      _id: body._id,
      ...updates,
    });

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);

    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.deleteCategory = async (req, res, next) => {
  let params = req.params;
  try {
    if (!params._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "id cannot be empty"
      );

    await Categories.destroy({ where: { id: params._id } });

    AuditLogs.info(req.user?.email, "Categories", "Delete", {
      _id: params._id,
    });

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);

    res.status(errorResponse.code).json(errorResponse);
  }
};
