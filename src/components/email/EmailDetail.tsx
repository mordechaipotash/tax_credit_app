'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import AttachmentViewer from '../attachments/AttachmentViewer';
import { EnvelopeIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

type Email = Database['public']['Tables']['emails']['Row'];
type Attachment = Database['public']['Tables']['attachments']['Row'];

interface EmailDetailProps {
  emailId: string;
}

export default function EmailDetail({ emailId }: EmailDetailProps) {
  const [email, setEmail] = useState<Email | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (emailId) {
      fetchEmailDetails();
    }
  }, [emailId]);

  const fetchEmailDetails = async () => {
    try {
      // Fetch email details
      const { data: emailData, error: emailError } = await supabase
        .from('emails')
        .select('*')
        .eq('id', emailId)
        .single();

      if (emailError) throw emailError;
      setEmail(emailData);

      // Fetch attachments
      const { data: attachmentData, error: attachmentError } = await supabase
        .from('attachments')
        .select('*')
        .eq('email_id', emailId);

      if (attachmentError) throw attachmentError;
      setAttachments(attachmentData || []);
    } catch (error) {
      console.error('Error fetching email details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">Email not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Header */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <EnvelopeIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-medium text-gray-900">
                {email.subject || 'No Subject'}
              </h2>
              
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <UserIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  {email.sender}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  {new Date(email.received_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Attachments
          </h3>
          <AttachmentViewer 
            attachments={attachments}
            onSelect={(attachment) => {
              console.log('Selected attachment:', attachment);
              // Handle attachment selection
            }}
          />
        </div>
      </div>
    </div>
  );
}
