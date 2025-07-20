const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model, additionalProps) =>
  catchAsync(async (req, res, next) => {
    if (additionalProps) {
      req.body = { ...req.body, ...additionalProps };
    }
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, popOptions, filterFn) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    //  Run custom access check if provided
    if (filterFn && !filterFn(doc, req)) {
      return next(
        new AppError("You do not have permission to access this document", 403)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model, populateOptions = null, defaultFilter = {}) =>
  catchAsync(async (req, res) => {
    let query = Model.find(defaultFilter);

    // Apply population if specified
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //  Get the filtered count BEFORE pagination
    const filteredQuery = new APIFeatures(Model.find(defaultFilter), req.query)
      .filter()
      .filter()
      .sort()
      .limitFields();
    const total = await filteredQuery.query.countDocuments();

    //  apply pagination after counting

    const doc = await features.query;
    res.status(200).json({
      status: "success",
      total,
      results: doc.length,
      data: {
        doc,
      },
    });
  });
