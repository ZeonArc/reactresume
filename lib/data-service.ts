import { supabase } from "./supabase";

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
}

export interface Keyword {
  id: string;
  word: string;
  domain_id: string;
  relevance_score: number;
}

export interface Course {
  id: string;
  name: string;
  provider: string;
  link: string;
  duration: string;
  rating: number;
  description: string;
  domain_id: string;
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching skills:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getSkills:", error);
    return [];
  }
}

export async function getDomains(): Promise<Domain[]> {
  try {
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching domains:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getDomains:", error);
    return [];
  }
}

export async function getKeywords(domainId?: string): Promise<Keyword[]> {
  try {
    let query = supabase
      .from('keywords')
      .select('*')
      .order('word');
    
    if (domainId) {
      query = query.eq('domain_id', domainId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching keywords:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getKeywords:", error);
    return [];
  }
}

export async function getCourses(domainId?: string): Promise<Course[]> {
  try {
    let query = supabase
      .from('courses')
      .select('*')
      .order('name');
    
    if (domainId) {
      query = query.eq('domain_id', domainId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getCourses:", error);
    return [];
  }
}

export async function searchByKeyword(keyword: string) {
  try {
    const { data, error } = await supabase
      .from('keywords')
      .select('*, domains(*)')
      .ilike('word', `%${keyword}%`)
      .limit(10);
    
    if (error) {
      console.error("Error searching keywords:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in searchByKeyword:", error);
    return [];
  }
} 