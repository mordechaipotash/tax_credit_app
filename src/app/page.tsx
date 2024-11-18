import Link from 'next/link';
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">
              WOTC Processing Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Process and manage Work Opportunity Tax Credit forms efficiently.
            </p>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/test"
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Test Classification
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      Test form classification and extraction
                    </p>
                  </div>
                </Link>

                <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 hover:bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Pending Emails
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {stats.pendingCount} pending emails
                    </p>
                  </div>
                  <ProcessEmails />
                </div>

                <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 hover:bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Recent Emails
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      View recent emails
                    </p>
                  </div>
                  <Link href="/emails" className="text-sm text-gray-500 hover:text-gray-900">
                    View all
                  </Link>
                  <EmailList />
                </div>

                {/* Add more dashboard items here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
