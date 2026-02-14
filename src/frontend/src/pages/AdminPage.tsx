import AdminGuard from '../components/admin/AdminGuard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DepartmentManager from '../components/admin/DepartmentManager';
import ResourceManager from '../components/admin/ResourceManager';

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage departments, semesters, subjects, and study materials
          </p>
        </div>

        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-6">
            <ResourceManager />
          </TabsContent>

          <TabsContent value="structure" className="space-y-6">
            <DepartmentManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}
