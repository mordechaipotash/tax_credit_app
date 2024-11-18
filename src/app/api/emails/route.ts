import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerSupabase();
    
    const { data: emails, error } = await supabase
      .from('emails')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const supabase = createServerSupabase();
    
    // Mock processing new emails
    const mockEmails = [
      {
        subject: 'New WOTC Application',
        sender: 'applicant@example.com',
        received_at: new Date().toISOString(),
        processed: false
      }
    ];

    const { data, error } = await supabase
      .from('emails')
      .insert(mockEmails)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, emails: data });
  } catch (error) {
    console.error('Error processing emails:', error);
    return NextResponse.json(
      { error: 'Failed to process emails' },
      { status: 500 }
    );
  }
}
