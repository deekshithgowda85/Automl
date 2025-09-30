// Quick test script to verify AutoML API is working
const testAutoML = async () => {
  try {
    console.log('🚀 Testing AutoML API...');
    
    const response = await fetch('http://localhost:3000/api/test-automl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a classification model for the Titanic dataset'
      })
    });

    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ AutoML API Success!');
      console.log(`🎯 Generated files: ${Object.keys(data.fileStructure || {}).length}`);
      console.log(`📈 Task type: ${data.configuration?.taskType}`);
      console.log(`🔧 Algorithms: ${data.configuration?.algorithms?.join(', ')}`);
      console.log(`📁 Files: ${Object.keys(data.fileStructure || {}).join(', ')}`);
    } else {
      const error = await response.text();
      console.log('❌ AutoML API Error:');
      console.log(error);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
};

testAutoML();