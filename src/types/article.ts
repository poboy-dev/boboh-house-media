export type ArticleCategory = 'portfolio' | 'bobohgeek' | 'bh-association';

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: ArticleCategory;
  image: string;
  date: string;
  author: string;
  created_at: string;
  updated_at: string;
}