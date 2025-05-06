import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  
  try {
    // Using Udemy API (free public courses data)
    const response = await axios.get('https://www.udemy.com/api-2.0/courses/', {
      params: {
        search: query,
        page_size: 10,
        price: 'price-free'
      },
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching courses:', error);
    
    // Fallback to another free API if Udemy API fails
    try {
      const fallbackResponse = await axios.get(`https://www.coursedog.com/api/v1/courses?q=${query}`);
      return NextResponse.json(fallbackResponse.data);
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      );
    }
  }
} 