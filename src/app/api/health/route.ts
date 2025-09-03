import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    // Call backend API health check
    const response = await fetch(`${BACKEND_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      frontend: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      },
      backend: {
        status: data.status || 'unknown',
        timestamp: data.timestamp || 'unknown',
        version: data.version || 'unknown'
      }
    });
    
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        success: false,
        frontend: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        },
        backend: {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      },
      { status: 503 }
    );
  }
}
