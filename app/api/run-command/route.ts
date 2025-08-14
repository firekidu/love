import { NextRequest, NextResponse } from 'next/server';
import { Sandbox } from '@e2b/code-interpreter';

// Get active sandbox from global state (in production, use a proper state management solution)
declare global {
  var activeSandbox: any;
}


export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();

    if (!Array.isArray(command) || command.length === 0 || !command.every(arg => typeof arg === 'string')) {
      return NextResponse.json({
        success: false,
        error: 'Command must be an array of strings'
      }, { status: 400 });
    }

    const invalidArg = command.find((arg: string) => !/^[\w.@\/-]+$/.test(arg));
    if (invalidArg) {
      return NextResponse.json({
        success: false,
        error: `Unsupported characters in command argument: ${invalidArg}`
      }, { status: 400 });
    }
    
    if (!global.activeSandbox) {
      return NextResponse.json({ 
        success: false, 
        error: 'No active sandbox' 
      }, { status: 400 });
    }
    
    console.log(`[run-command] Executing: ${command.join(' ')}`);

    const result = await global.activeSandbox.runCode(`
import subprocess
import os

os.chdir('/home/user/app')
result = subprocess.run(${JSON.stringify(command)},
                       capture_output=True,
                       text=True,
                       shell=False)

print("STDOUT:")
print(result.stdout)
if result.stderr:
    print("\\nSTDERR:")
    print(result.stderr)
print(f"\\nReturn code: {result.returncode}")
    `);
    
    const output = result.logs.stdout.join('\n');
    
    return NextResponse.json({
      success: true,
      output,
      message: 'Command executed successfully'
    });
    
  } catch (error) {
    console.error('[run-command] Error:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 });
  }
}
