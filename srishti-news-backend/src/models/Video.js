import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    youtubeUrl: {
      type: String,
      required: [true, 'YouTube URL is required'],
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    reporter: {
      type: String,
      required: [true, 'Reporter name is required'],
      trim: true,
    },
    district: {
      type: String,
      trim: true,
      default: '',
    },
    tags: [{ type: String, trim: true }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isFlash: {
      type: Boolean,
      default: false,
    },
    isEditorsPick: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.index({ category: 1, publishedAt: -1 });
videoSchema.index({ isPublished: 1, publishedAt: -1 });
videoSchema.index({ isFeatured: 1 });
videoSchema.index({ isTrending: 1 });
videoSchema.index({ isFlash: 1 });
videoSchema.index({ isEditorsPick: 1 });

const Video = mongoose.model('Video', videoSchema);

export default Video;
