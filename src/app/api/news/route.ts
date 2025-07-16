// src/app/api/newsdata/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is missing. Please check your environment variables.' },
      { status: 500 }
    );
  }

  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=scam%20fraud&country=in&language=en&category=top`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.results) {
      return NextResponse.json(
        { error: 'No news results found.' },
        { status: 500 }
      );
    }

    return NextResponse.json(data); // returns { results: [...] }
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news.' },
      { status: 500 }
    );
  }
}
