import { NextResponse } from "next/server";

// Mock data for testing
const mockDataset = {
  id: "mosapabdelghany/medical-insurance-cost-dataset",
  title: "Medical Insurance Cost Dataset",
  description: "A comprehensive dataset containing medical insurance costs with various features like age, BMI, smoking status, region, and charges.",
  owner: "mosapabdelghany",
  downloadCount: 15000,
  totalBytes: 5242880,
  tags: ["healthcare", "insurance", "medical", "regression"],
  difficulty: "beginner",
  taskType: "regression"
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    // Await the params first
    const { slug } = await params;
    const ref = slug.join("/");
    
    console.log('Fetching dataset for:', ref);

    // For now, return mock data since Kaggle API has connection issues
    // You can uncomment the real API call later when Kaggle API works
    
    return NextResponse.json({
      ...mockDataset,
      id: ref,
      title: `${ref.split('/')[1]?.replace(/-/g, ' ') || 'Dataset'}`, // Generate title from slug
      description: `Dataset: ${ref} - This is a sample dataset description.`,
    });
    
  } catch (e) {
    console.error('Error in dataset API route:', e);
    return NextResponse.json(
      { error: "Failed to fetch dataset" },
      { status: 500 }
    );
  }
}