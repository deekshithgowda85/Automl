import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Python code is required' },
        { status: 400 }
      );
    }

    // Import E2B
    const { Sandbox } = await import('e2b');
    
    // Create sandbox
    const sandbox = await Sandbox.create('automl-python-build');
    
    // Execute the code to recreate the model
    await sandbox.files.write('/workspace/recreate_model.py', code);
    await sandbox.commands.run('cd /workspace && python recreate_model.py');
    
    // Read the model file
    const modelFile = await sandbox.files.read('/workspace/model.pkl');
    
    // Clean up
    await sandbox.kill();
    
    // Return the file as a download
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', 'attachment; filename="model.pkl"');
    
    return new NextResponse(modelFile, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error downloading model:', error);
    return NextResponse.json({
      error: 'Failed to download model'
    }, { status: 500 });
  }
}