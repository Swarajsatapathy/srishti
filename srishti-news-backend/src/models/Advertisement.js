import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Advertisement title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
    },
    images: [
      {
        url: { type: String, required: true },
        key: { type: String },
      },
    ],
    videos: [
      {
        url: { type: String, required: true },
        key: { type: String },
      },
    ],
    link: {
      type: String,
      default: '',
      trim: true,
    },
    placement: {
      type: String,
      enum: ['homepage', 'sidebar', 'banner', 'footer', 'article', 'other'],
      default: 'homepage',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

export default Advertisement;
