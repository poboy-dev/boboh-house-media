import { createClient } from '@supabase/supabase-js';
import { Article } from '@/types/article';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getArticles = async (category?: string) => {
  console.log('Fetching articles from Supabase...');
  let query = supabase.from('articles').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
  
  return data as Article[];
};

export const getArticleById = async (id: string) => {
  console.log('Fetching article by ID:', id);
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
  
  return data as Article;
};