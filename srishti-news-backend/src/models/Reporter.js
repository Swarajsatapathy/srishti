import mongoose from "mongoose";

const reporterSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: Number,
      default: 9999,
      min: [1, "Serial number must be at least 1"],
    },

    reporterId: {
      type: String,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Reporter name is required"],
      trim: true,
      maxlength: [150, "Name cannot exceed 150 characters"],
    },

    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      maxlength: [200, "Designation cannot exceed 200 characters"],
    },

    message: {
      type: String,
      default: "",
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },

    district: {
      type: String,
      trim: true,
      default: "",
    },

    validUpto: {
      type: String,
      trim: true,
    },

    photo: {
      url: { type: String, default: "" },
      key: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

reporterSchema.index({ serialNumber: 1 });

const Reporter = mongoose.model("Reporter", reporterSchema);

export default Reporter;
