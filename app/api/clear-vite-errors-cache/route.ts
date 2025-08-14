import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@/types/sandbox';

export async function POST(request: NextRequest) {
  try {
    const { sandboxId = 'default' } = await request.json().catch(() => ({}));
    const global = getSession(sandboxId);
    // Clear the cache
    global.viteErrorsCache = null;
    
    console.log('[clear-vite-errors-cache] Cache cleared');
    
    return NextResponse.json({
      success: true,
      message: 'Vite errors cache cleared'
    });
    
  } catch (error) {
    console.error('[clear-vite-errors-cache] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}