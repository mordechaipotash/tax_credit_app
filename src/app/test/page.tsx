import DashboardLayout from '@/components/layout/DashboardLayout';
import ClassificationTest from '@/components/classification/ClassificationTest';

export default function TestPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <ClassificationTest />
      </div>
    </DashboardLayout>
  );
}
