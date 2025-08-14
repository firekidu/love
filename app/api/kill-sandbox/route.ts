import { NextResponse, NextRequest } from 'next/server';
import { getSession, deleteSession } from '@/types/sandbox';

export async function POST(request: NextRequest) {
  try {
    const { sandboxId = 'default' } = await request.json().catch(() => ({}));
    const global = getSession(sandboxId);
    console.log('[kill-sandbox] Killing active sandbox...');
    
    let sandboxKilled = false;
    
    // Kill existing sandbox if any
    if (global.activeSandbox) {
      try {
        await global.activeSandbox.close();
        sandboxKilled = true;
        console.log('[kill-sandbox] Sandbox closed successfully');
      } catch (e) {
        console.error('[kill-sandbox] Failed to close sandbox:', e);
      }
      global.activeSandbox = null;
      global.sandboxData = null;
    }
    
    // Clear existing files tracking
    if (global.existingFiles) {
      global.existingFiles.clear();
    }
    
    deleteSession(sandboxId);

    return NextResponse.json({
      success: true,
      sandboxKilled,
      message: 'Sandbox cleaned up successfully'
    });
    
  } catch (error) {
    console.error('[kill-sandbox] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message 
      }, 
      { status: 500 }
    );
  }
}