import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Profile API called');
    
    // Test database connection first
    await prisma.$connect();
    console.log('Database connected successfully');
    
    const { userId } = await auth();
    
    console.log('User ID from auth:', userId);
    
    if (!userId) {
      console.log('No user ID found - user not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data with related records
    console.log('Looking for user with clerkId:', userId);
    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        datasets: {
          orderBy: { createdAt: 'desc' },
        },
        mlModels: {
          orderBy: { updatedAt: 'desc' },
          include: {
            dataset: true,
          },
        },
        _count: {
          select: {
            datasets: true,
            mlModels: true,
          },
        },
      },
    });

    console.log('User query result:', user ? `Found user with ID: ${user.id}` : 'No user found');
    
    if (!user) {
      // If user doesn't exist, create one
      console.log('Creating new user for clerkId:', userId);
      const clerkUser = await currentUser();
      
      if (!clerkUser || !clerkUser.emailAddresses?.[0]) {
        return NextResponse.json({ error: 'Unable to get user email' }, { status: 400 });
      }
      
      const newUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.firstName || clerkUser.username || 'AutoML User',
          avatar: clerkUser.imageUrl || null,
        },
        include: {
          datasets: true,
          mlModels: true,
          _count: {
            select: {
              datasets: true,
              mlModels: true,
            },
          },
        },
      });
      
      console.log('New user created:', newUser.id);
      
      // Return empty profile for new user
      const profileData = {
        user: {
          id: newUser.id,
          clerkId: newUser.clerkId,
          name: newUser.name || 'AutoML User',
          email: newUser.email,
          avatar: newUser.avatar,
          joinDate: newUser.createdAt.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
          }),
        },
        stats: {
          totalProjects: 0,
          totalDatasets: 0,
          deployedModels: 0,
          avgAccuracy: 0,
        },
        datasets: [],
        projects: [],
      };

      return NextResponse.json(profileData);
    }

    // Calculate additional stats
    const deployedModels = user.mlModels.filter(model => model.accuracy && model.accuracy > 80).length;
    const avgAccuracy = user.mlModels.length > 0 
      ? user.mlModels
          .filter(model => model.accuracy && model.accuracy > 0)
          .reduce((sum, model) => sum + (model.accuracy || 0), 0) / 
        user.mlModels.filter(model => model.accuracy && model.accuracy > 0).length
      : 0;

    // Format datasets for UI
    const formattedDatasets = user.datasets.map(dataset => ({
      id: dataset.id,
      name: dataset.fileName,
      size: `${(dataset.fileSize / (1024 * 1024)).toFixed(1)} MB`,
      rows: dataset.rowCount || 0,
      columns: Array.isArray(dataset.columns) ? (dataset.columns as unknown[]).length : 0,
      uploadDate: dataset.createdAt.toISOString().split('T')[0],
      type: dataset.fileType.toUpperCase() + ' Data',
      status: 'ready',
      usedIn: user.mlModels.filter(model => model.datasetId === dataset.id).length,
      description: dataset.description || 'Dataset uploaded by user',
      quality: 'good',
      lastUsed: user.mlModels
        .filter(model => model.datasetId === dataset.id)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]?.updatedAt.toISOString().split('T')[0] || null
    }));

    // Format ML models as projects for UI
    const formattedProjects = user.mlModels.map(model => ({
      id: model.id,
      name: model.name,
      type: model.modelType.charAt(0).toUpperCase() + model.modelType.slice(1),
      status: model.accuracy && model.accuracy > 0 
        ? (model.accuracy > 80 ? 'deployed' : 'completed')
        : 'training',
      accuracy: model.accuracy || 0,
      dataset: model.dataset?.fileName || 'Unknown Dataset',
      createdAt: model.createdAt.toISOString().split('T')[0],
      lastTrained: model.updatedAt.toISOString().split('T')[0],
      model: model.algorithm,
      features: Array.isArray(model.dataset?.columns) ? (model.dataset?.columns as unknown[]).length : 0,
      samples: model.dataset?.rowCount || 0,
      description: model.description || 'ML model created by user',
      favorite: model.downloadCount > 0,
      notes: model.accuracy && model.accuracy > 90 
        ? 'Excellent performance!' 
        : model.accuracy && model.accuracy > 80
        ? 'Good performance'
        : model.accuracy && model.accuracy > 70
        ? 'Fair performance, could be improved'
        : model.accuracy
        ? 'Needs improvement'
        : 'Still training'
    }));

    const profileData = {
      user: {
        id: user.id,
        clerkId: user.clerkId,
        name: user.name || 'AutoML User',
        email: user.email,
        avatar: user.avatar,
        joinDate: user.createdAt.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        }),
      },
      stats: {
        totalProjects: user._count.mlModels,
        totalDatasets: user._count.datasets,
        deployedModels: deployedModels,
        avgAccuracy: Math.round(avgAccuracy),
      },
      datasets: formattedDatasets,
      projects: formattedProjects,
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching user profile:');
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    
    // Check if it's a Prisma-specific error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Prisma error code:', (error as { code: string }).code);
      console.error('Prisma error meta:', (error as { meta?: unknown }).meta);
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}