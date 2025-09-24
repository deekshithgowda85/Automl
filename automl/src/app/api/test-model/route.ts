import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();
    
    console.log('Test API called with:', description);
    
    // Test Python code generation
    const testCode = `print("Hello from test!")
print("Description: ${description}")
print("Test completed successfully!")`;
    
    console.log('Generated test code:', testCode);
    
    // Import E2B
    const { Sandbox } = await import('e2b');
    console.log('✅ E2B imported');
    
    // Create sandbox
    const sandbox = await Sandbox.create('automl-python-build');
    console.log('✅ Sandbox created');
    
    // Write test file
    await sandbox.files.write('/workspace/test.py', testCode);
    console.log('✅ Test file written');
    
    // Execute test
    const result = await sandbox.commands.run('cd /workspace && python3 test.py');
    console.log('Execution result:', result);
    
    // Clean up
    await sandbox.kill();
    console.log('✅ Cleanup complete');
    
    return NextResponse.json({
      success: true,
      message: 'Test completed successfully',
      output: result.stdout,
      error: result.stderr,
      exitCode: result.exitCode,
      code: testCode
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test API for debugging model creation issues'
  });
}