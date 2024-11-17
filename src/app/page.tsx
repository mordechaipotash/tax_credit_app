import DashboardLayout from '@/components/layout/DashboardLayout';
import ProcessEmails from '@/components/email/ProcessEmails';
import EmailList from '@/components/email/EmailList';
import { createServerSupabase } from '@/lib/supabase';

async function getEmailStats() {
  const supabase = createServerSupabase();
  
  const { data: stats } = await supabase
    .from('emails')
    .select('processed', { count: 'exact' })
    .eq('processed', false);

  return {
    pendingCount: stats?.length ?? 0
  };
}

export default async function Home() {
  const stats = await getEmailStats();

  return (
    <DashboardLayout>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Email Processing Dashboard
          </h3>
          
          <div className="mt-5">
            <div className="rounded-md bg-gray-50 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">
                    Pending Emails
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      {stats.pendingCount}
                    </span>
                  </div>
                </div>
                
                <ProcessEmails />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Recent Emails
            </h3>
            <EmailList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
