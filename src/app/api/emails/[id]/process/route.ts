import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabase();
    const { id } = params;

    // First check if the email exists
    const { data: existingEmail, error: fetchError } = await supabase
      .from('emails')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching email:', fetchError);
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update email status
    const { data, error } = await supabase
      .from('emails')
      .update({
        processed: true,
        form_type: Math.random() > 0.5 ? '8850' : '9061',
        confidence: 0.85 + Math.random() * 0.15
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating email:', error);
      throw error;
    }

    return NextResponse.json({ success: true, email: data });
  } catch (error) {
    console.error('Error processing email:', error);
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    );
  }
}
