import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the CSV file from the API folder
    const csvPath = path.join(process.cwd(), 'src/app/api/reconcile_v1.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    
    // Return the raw CSV data
    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json({ error: 'Failed to read CSV data' }, { status: 500 });
  }
}
