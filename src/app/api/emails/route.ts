import { NextResponse } from 'next/server';
import { fetchEmails } from '@/lib/gmail';
import { createServerSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch emails from November 1, 2024
    const startDate = new Date('2024-11-01');
    const emails = await fetchEmails(startDate);
    
    // Store in Supabase
    const supabase = createServerSupabase();
    
    // Return response
    return NextResponse.json({ 
      success: true, 
      count: emails.length 
    });
  } catch (error) {
    console.error('Error processing emails:', error);
    return NextResponse.json(
      { error: 'Failed to process emails' },
      { status: 500 }
    );
  }
}
