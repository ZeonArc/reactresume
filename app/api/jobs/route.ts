import { NextResponse } from 'next/server';
import axios from 'axios';

// Function to get jobs from a free API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const location = searchParams.get('location') || '';
  
  try {
    // Using JSearch API from RapidAPI (free tier available)
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: `${query} in ${location}`,
        page: '1',
        num_pages: '1'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
} 