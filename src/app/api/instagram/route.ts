import { NextResponse } from 'next/server';

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface CacheEntry {
  data: InstagramPost[];
  timestamp: number;
}

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
let cache: CacheEntry | null = null;

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!token || !accountId) {
    return NextResponse.json({ posts: [], fallback: true });
  }

  // Return cached data if still fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ posts: cache.data, fallback: false });
  }

  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = `https://graph.instagram.com/${accountId}/media?fields=${fields}&limit=12&access_token=${token}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error('Instagram API error:', res.status, await res.text());
      return NextResponse.json({ posts: [], fallback: true });
    }

    const json = await res.json();
    const posts: InstagramPost[] = json.data || [];

    cache = { data: posts, timestamp: Date.now() };

    return NextResponse.json({ posts, fallback: false });
  } catch (error) {
    console.error('Instagram fetch error:', error);
    return NextResponse.json({ posts: [], fallback: true });
  }
}
