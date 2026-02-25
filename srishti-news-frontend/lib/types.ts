export interface ArticleImage {
  url: string;
  key: string;
  caption: string;
}

export interface Article {
  _id: string;
  title: string;
  description: string;
  content: string;
  images: ArticleImage[];
  category: string;
  reporter: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  isFlash: boolean;
  isTrending: boolean;
  isEditorsPick: boolean;
  views: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
  reporter: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  views: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reporter {
  _id: string;
  name: string;
  designation: string;
  message: string;
  photo: { url: string; key: string };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
