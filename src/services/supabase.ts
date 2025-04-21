
import { createClient } from '@supabase/supabase-js';
import { Article } from '@/types/article';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Initializing Supabase client with:', { supabaseUrl });

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getArticles = async (category?: string) => {
  console.log('Fetching articles from Supabase...', { category });
  let query = supabase.from('articles').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
  
  console.log('Articles fetched successfully:', data);
  return data as Article[];
};

// Test function to verify table access
export const testTableAccess = async () => {
  console.log('Testing table access...');
  
  // Test articles table
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('*')
    .limit(1);
    
  console.log('Articles table test:', { data: articles, error: articlesError });
  
  // Test profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
    
  console.log('Profiles table test:', { data: profiles, error: profilesError });
  
  return {
    articles: { data: articles, error: articlesError },
    profiles: { data: profiles, error: profilesError }
  };
};

export const getArticleById = async (id: string) => {
  console.log('Fetching article by ID:', id);
  
  // Using a direct query to get the freshest data
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
  
  console.log('Article fetched successfully:', data);
  return data as Article;
};
