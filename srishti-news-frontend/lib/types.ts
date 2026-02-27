export interface ArticleImage {
  url: string;
  key: string;
  caption: string;
}

export interface Article {
  _id: string;
  title: string;
  description?: string;
  content: string;
  images: ArticleImage[];
  district?: string;
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
  description?: string;
  content: string;
  youtubeUrl: string;
  district?: string;
  reporter: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isFlash: boolean;
  isEditorsPick: boolean;
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
  district?: string;
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

export interface Advertisement {
  _id: string;
  title: string;
  description: string;
  images: { url: string; key?: string }[];
  videos: { url: string; key?: string }[];
  link: string;
  placement: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  views: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}
