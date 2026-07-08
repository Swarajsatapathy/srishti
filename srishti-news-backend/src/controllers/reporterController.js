import Reporter from "../models/Reporter.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";

// ─── CREATE REPORTER ────────────────────────────────────────────
export const createReporter = asyncHandler(async (req, res) => {
  const { serialNumber, name, designation, message, district } = req.body;

  if (!serialNumber || !name || !designation) {
    throw new ApiError(400, "Serial number, name and designation are required");
  }

  const serial = Number(serialNumber);

  if (Number.isNaN(serial) || serial < 1) {
    throw new ApiError(400, "Serial number must be a valid number");
  }

  const existingSerial = await Reporter.findOne({ serialNumber: serial });

  if (existingSerial) {
    throw new ApiError(409, "Serial number already exists");
  }

  // Upload photo to S3 if present
  let photo = { url: "", key: "" };

  if (req.file) {
    const { url, key } = await uploadToS3(
      req.file.buffer,
      req.file.mimetype,
      "reporters"
    );
    photo = { url, key };
  }

  const reporter = await Reporter.create({
    serialNumber: serial,
    name,
    designation,
    message: message || "",
    district: district || "",
    photo,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, reporter, "Reporter created successfully"));
});

// ─── GET ALL REPORTERS (with pagination) ────────────────────────
export const getReporters = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    sortBy = "serialNumber",
    order = "asc",
  } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
      { district: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const pageSize = Math.min(100000, Math.max(1, parseInt(limit, 10)));
  const sortOrder = order === "desc" ? -1 : 1;

  const allowedSortFields = ["serialNumber", "createdAt", "name", "designation"];
  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "serialNumber";

  const [reporters, total] = await Promise.all([
  Reporter.aggregate([
    { $match: filter },
    {
      $addFields: {
        serialSort: {
          $ifNull: ["$serialNumber", 999999],
        },
      },
    },
    {
      $sort: {
        serialSort: 1,
        createdAt: -1,
      },
    },
    {
      $skip: (pageNum - 1) * pageSize,
    },
    {
      $limit: pageSize,
    },
    {
      $project: {
        serialSort: 0,
      },
    },
  ]),

  Reporter.countDocuments(filter),
]);

  return res.status(200).json(
    new ApiResponse(200, {
      reporters,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  );
});

// ─── GET SINGLE REPORTER ────────────────────────────────────────
export const getReporterById = asyncHandler(async (req, res) => {
  const reporter = await Reporter.findById(req.params.id).lean();

  if (!reporter) {
    throw new ApiError(404, "Reporter not found");
  }

  return res.status(200).json(new ApiResponse(200, reporter));
});

// ─── UPDATE REPORTER ────────────────────────────────────────────
export const updateReporter = asyncHandler(async (req, res) => {
  const reporter = await Reporter.findById(req.params.id);

  if (!reporter) {
    throw new ApiError(404, "Reporter not found");
  }

  const { serialNumber, name, designation, message, district } = req.body;

  if (serialNumber !== undefined && serialNumber !== "") {
    const serial = Number(serialNumber);

    if (Number.isNaN(serial) || serial < 1) {
      throw new ApiError(400, "Serial number must be a valid number");
    }

    const existingSerial = await Reporter.findOne({
      serialNumber: serial,
      _id: { $ne: req.params.id },
    });

    if (existingSerial) {
      throw new ApiError(409, "Serial number already exists");
    }

    reporter.serialNumber = serial;
  }

  if (name !== undefined) reporter.name = name;
  if (designation !== undefined) reporter.designation = designation;
  if (message !== undefined) reporter.message = message;
  if (district !== undefined) reporter.district = district;

  // Replace photo if a new one is uploaded
  if (req.file) {
    if (reporter.photo?.key) {
      await deleteFromS3(reporter.photo.key);
    }

    const { url, key } = await uploadToS3(
      req.file.buffer,
      req.file.mimetype,
      "reporters"
    );

    reporter.photo = { url, key };
  }

  await reporter.save();

  return res
    .status(200)
    .json(new ApiResponse(200, reporter, "Reporter updated successfully"));
});

// ─── DELETE REPORTER ────────────────────────────────────────────
export const deleteReporter = asyncHandler(async (req, res) => {
  const reporter = await Reporter.findById(req.params.id);

  if (!reporter) {
    throw new ApiError(404, "Reporter not found");
  }

  if (reporter.photo?.key) {
    await deleteFromS3(reporter.photo.key);
  }

  await reporter.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Reporter deleted successfully"));
});