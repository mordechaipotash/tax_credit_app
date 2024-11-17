import { NextRequest, NextResponse } from 'next/server';
import { classifyDocument } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    const classification = await classifyDocument(text);
    return NextResponse.json(classification);
  } catch (error) {
    console.error('Classification error:', error);
    return NextResponse.json(
      { error: 'Failed to classify document' },
      { status: 500 }
    );
  }
}
