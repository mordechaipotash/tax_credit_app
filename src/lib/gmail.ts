import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_id: process.env.GOOGLE_CLIENT_ID,
  },
  scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
});

const gmail = google.gmail({ version: 'v1', auth });

export interface EmailAttachment {
  filename: string;
  mimeType: string;
  data: Buffer;
}

export interface ProcessedEmail {
  messageId: string;
  threadId: string;
  subject: string;
  from: string;
  date: string;
  attachments: EmailAttachment[];
}

async function downloadAttachment(messageId: string, attachmentId: string): Promise<Buffer> {
  const response = await gmail.users.messages.attachments.get({
    userId: 'me',
    messageId,
    id: attachmentId,
  });

  const data = response.data.data;
  if (!data) throw new Error('No attachment data');

  return Buffer.from(data, 'base64');
}

export async function fetchEmails(afterDate: Date) {
  try {
    const query = `after:${afterDate.toISOString().split('T')[0]} has:attachment`;
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 50,
    });

    const messages = response.data.messages || [];
    const processedEmails: ProcessedEmail[] = [];

    for (const message of messages) {
      const details = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'full',
      });

      // Process email details here
      // This is a placeholder for the full implementation
      console.log('Processing email:', details.data.snippet);
    }

    return processedEmails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}
