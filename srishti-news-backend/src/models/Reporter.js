import mongoose from 'mongoose';

const reporterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Reporter name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
      maxlength: [200, 'Designation cannot exceed 200 characters'],
    },
    message: {
      type: String,
      default: '',
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    photo: {
      url: { type: String, default: '' },
      key: { type: String, default: '' }, // S3 object key
    },
  },
  {
    timestamps: true,
  }
);

const Reporter = mongoose.model('Reporter', reporterSchema);
export default Reporter;
