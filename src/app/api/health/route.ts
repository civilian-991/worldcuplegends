import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Test database connection
  let dbStatus = 'unknown';
  let legendsCount = 0;

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('legends')
      .select('*', { count: 'exact', head: true });

    if (error) {
      dbStatus = `error: ${error.message}`;
    } else {
      dbStatus = 'connected';
      legendsCount = count || 0;
    }
  } catch (e) {
    dbStatus = `exception: ${e instanceof Error ? e.message : 'unknown'}`;
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    config: {
      supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET',
      hasAnonKey,
    },
    database: {
      status: dbStatus,
      legendsCount,
    },
  });
}
