import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabase();
    
    // Get URL parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const dateRange = url.searchParams.get('dateRange');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Build query
    let query = supabase
      .from('emails')
      .select('*')
      .order('received_at', { ascending: false });

    // Apply status filter
    if (status === 'processed') {
      query = query.eq('processed', true);
    } else if (status === 'pending') {
      query = query.eq('processed', false);
    }

    // Apply date filter
    const now = new Date();
    let filterStartDate: Date;
    let filterEndDate = new Date();

    if (dateRange === 'custom' && startDate && endDate) {
      filterStartDate = new Date(startDate);
      filterEndDate = new Date(endDate);
    } else {
      switch (dateRange) {
        case 'day':
          filterStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          filterStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          filterStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          filterStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
    }

    query = query
      .gte('received_at', filterStartDate.toISOString())
      .lte('received_at', filterEndDate.toISOString());

    // Execute query
    const { data: emails, error } = await query.limit(50);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // If no emails exist yet, return mock data
    if (!emails || emails.length === 0) {
      const mockEmails = [
        {
          id: crypto.randomUUID(),
          subject: 'WOTC Form Submission - John Doe',
          sender: 'john.doe@example.com',
          received_at: new Date().toISOString(),
          processed: false,
          form_type: '8850',
          confidence: 0.95
        },
        {
          id: crypto.randomUUID(),
          subject: 'New Employee Tax Credit Documentation',
          sender: 'hr@company.com',
          received_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          processed: true,
          form_type: '9061',
          confidence: 0.88
        },
        {
          id: crypto.randomUUID(),
          subject: 'WOTC Application Documents',
          sender: 'recruitment@business.com',
          received_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          processed: false,
          form_type: '8850',
          confidence: 0.92
        }
      ];

      try {
        const { error: insertError } = await supabase
          .from('emails')
          .insert(mockEmails);

        if (insertError) {
          console.error('Error inserting mock data:', insertError);
          // Return mock data even if insert fails
          return NextResponse.json({ emails: mockEmails });
        }

        return NextResponse.json({ emails: mockEmails });
      } catch (insertError) {
        console.error('Error inserting mock data:', insertError);
        // Return mock data even if insert fails
        return NextResponse.json({ emails: mockEmails });
      }
    }

    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Error handling emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabase();
    const { text } = await request.json();

    const mockEmail = {
      id: crypto.randomUUID(),
      subject: 'New WOTC Application',
      sender: 'applicant@example.com',
      received_at: new Date().toISOString(),
      processed: false,
      form_type: '8850',
      confidence: 0.95
    };

    const { data, error } = await supabase
      .from('emails')
      .insert([mockEmail])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, email: data[0] });
  } catch (error) {
    console.error('Error processing email:', error);
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    );
  }
}
