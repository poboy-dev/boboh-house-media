export type ArticleCategory = string;

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: ArticleCategory;
  image: string;
  date: string;
  author: string;
  author_name?: string;
  created_at: string;
  updated_at: string;
  views: number | null;
  likes: number | null;
}
