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
      required: [true, 'Video description is required'],
    },
    youtubeUrl: {
      type: String,
      required: [true, 'YouTube URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'রାଜ୍ୟ',
        'ଜାତୀୟ',
        'ଆନ୍ତର୍ଜାତୀୟ',
        'ବାଣିଜ୍ୟ',
        'ସମ୍ପାଦକୀୟ',
        'ଅପରାଧ',
        'ଖେଳ',
        'ମନୋରଞ୍ଜନ',
        'ଜୀବନଶୈଳୀ',
        'ଧର୍ମ',
        'editorial',
        'state',
        'national',
        'international',
        'business',
        'crime',
        'sports',
        'entertainment',
        'lifestyle',
        'religion',
        'other',
      ],
      default: 'other',
    },
    reporter: {
      type: String,
      required: [true, 'Reporter name is required'],
      trim: true,
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

const Video = mongoose.model('Video', videoSchema);

export default Video;
