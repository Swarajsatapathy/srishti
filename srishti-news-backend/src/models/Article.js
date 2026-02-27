import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
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
    images: [
      {
        url: { type: String, required: true },
        key: { type: String },           // S3 object key
        caption: { type: String, default: '' },
      },
    ],
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
    isFlash: {
      type: Boolean,
      default: false,
    },
    isTrending: {
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

// Indexes for common queries
articleSchema.index({ isPublished: 1, publishedAt: -1 });
articleSchema.index({ isFeatured: 1 });
articleSchema.index({ isTrending: 1 });
articleSchema.index({ isEditorsPick: 1 });
articleSchema.index({ tags: 1 });

const Article = mongoose.model('Article', articleSchema);

export default Article;
