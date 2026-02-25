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
      required: [true, 'Article description is required'],
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
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'রାଜ୍ୟ',        // State
        'ଜାତୀୟ',       // National
        'ଆନ୍ତର୍ଜାତୀୟ', // International
        'ବାଣିଜ୍ୟ',     // Business
        'ସମ୍ପାଦକୀୟ',   // Editorial
        'ଅପରାଧ',       // Crime
        'ଖେଳ',         // Sports
        'ମନୋରଞ୍ଜନ',    // Entertainment
        'ଜୀବନଶୈଳୀ',    // Lifestyle
        'ଧର୍ମ',        // Religion
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
articleSchema.index({ category: 1, publishedAt: -1 });
articleSchema.index({ isPublished: 1, publishedAt: -1 });
articleSchema.index({ isFeatured: 1 });
articleSchema.index({ isTrending: 1 });
articleSchema.index({ isEditorsPick: 1 });
articleSchema.index({ tags: 1 });

const Article = mongoose.model('Article', articleSchema);

export default Article;
