export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      emails: {
        Row: {
          id: string
          message_id: string
          thread_id: string | null
          subject: string | null
          sender: string | null
          received_at: string
          processed: boolean
          processing_error: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          message_id: string
          thread_id?: string | null
          subject?: string | null
          sender?: string | null
          received_at: string
          processed?: boolean
          processing_error?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          message_id?: string
          thread_id?: string | null
          subject?: string | null
          sender?: string | null
          received_at?: string
          processed?: boolean
          processing_error?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      attachments: {
        Row: {
          id: string
          email_id: string
          filename: string
          storage_path: string
          mime_type: string | null
          file_size: number | null
          processed: boolean
          processing_error: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          email_id: string
          filename: string
          storage_path: string
          mime_type?: string | null
          file_size?: number | null
          processed?: boolean
          processing_error?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email_id?: string
          filename?: string
          storage_path?: string
          mime_type?: string | null
          file_size?: number | null
          processed?: boolean
          processing_error?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
