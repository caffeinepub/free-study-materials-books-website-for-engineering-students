import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllDepartments } from '../features/catalog/useCatalog';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, FileText } from 'lucide-react';
import ResourceList from '../components/resources/ResourceList';
import EmptyState from '../components/resources/EmptyState';

export default function SubjectPage() {
  const { departmentId, semesterId, subjectId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: departments, isLoading } = useGetAllDepartments();

  if (isLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-8 w-96 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  const department = departments?.find((d) => d.id === departmentId);
  const semester = department?.semesters.find((s) => s.id === semesterId);
  const subject = semester?.subjects.find((s) => s.id === subjectId);

  if (!department || !semester || !subject) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">Subject Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested subject could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <button
            onClick={() => navigate({ to: '/browse' })}
            className="hover:text-foreground transition-colors"
          >
            Departments
          </button>
          <ChevronRight className="h-4 w-4" />
          <button
            onClick={() => navigate({ to: '/browse' })}
            className="hover:text-foreground transition-colors"
          >
            {department.name}
          </button>
          <ChevronRight className="h-4 w-4" />
          <button
            onClick={() => navigate({ to: '/browse' })}
            className="hover:text-foreground transition-colors"
          >
            {semester.name}
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{subject.name}</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{subject.name}</h1>
        <p className="text-muted-foreground">
          {department.name} • {semester.name}
        </p>
      </div>

      {subject.resources.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Resources Available"
          description="Study materials for this subject will appear here once they are added."
        />
      ) : (
        <ResourceList
          resources={subject.resources}
          departmentId={departmentId!}
          semesterId={semesterId!}
          subjectId={subjectId!}
        />
      )}
    </div>
  );
}
