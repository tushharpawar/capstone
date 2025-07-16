import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

  const GOOGLE_API_KEY = 'AIzaSyDB7RnROVzvuFPSA9xRYRLh4EHXT71ePmc'
  const GOOGLE_CX = '03a61e6133af34346'

  export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url); // Get query parameters from the URL
    const query = searchParams.get('query'); // Get 'query' parameter
  
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required.' }, { status: 400 });
    }
  
    try {
      const customSearch = google.customsearch('v1');
      const response = await customSearch.cse.list({
        q: query,
        cx: GOOGLE_CX,
        auth: GOOGLE_API_KEY,
      });
  
      // Return the search results
      return NextResponse.json(response.data.items || []);
    } catch (error) {
      console.error('Error fetching Google search results:', error);
      return NextResponse.json({ error: 'Failed to fetch results from Google.' }, { status: 500 });
    }
  }
