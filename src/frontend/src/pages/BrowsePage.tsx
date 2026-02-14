import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllDepartments } from '../features/catalog/useCatalog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, ChevronRight, FolderOpen } from 'lucide-react';
import type { Department, Semester, Subject } from '../backend';
import { sortSemesters } from '../utils/semesterSort';

export default function BrowsePage() {
  const navigate = useNavigate();
  const { data: departments, isLoading } = useGetAllDepartments();
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="py-16 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No Departments Available</h3>
            <p className="text-muted-foreground">
              Study materials will appear here once they are added by administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show subject list when both department and semester are selected
  if (selectedDepartment && selectedSemester) {
    return (
      <div className="container py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button
              onClick={() => {
                setSelectedDepartment(null);
                setSelectedSemester(null);
              }}
              className="hover:text-foreground transition-colors"
            >
              Departments
            </button>
            <ChevronRight className="h-4 w-4" />
            <button
              onClick={() => setSelectedSemester(null)}
              className="hover:text-foreground transition-colors"
            >
              {selectedDepartment.name}
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{selectedSemester.name}</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            {selectedSemester.name} Subjects
          </h1>
          <p className="text-muted-foreground">
            Select a subject to view available study materials
          </p>
        </div>

        {selectedSemester.subjects.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">No Subjects Available</h3>
              <p className="text-muted-foreground">
                Subjects for this semester will appear here once they are added.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedSemester.subjects.map((subject: Subject) => (
              <Card
                key={subject.id}
                className="hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() =>
                  navigate({
                    to: '/subject/$departmentId/$semesterId/$subjectId',
                    params: {
                      departmentId: selectedDepartment.id,
                      semesterId: selectedSemester.id,
                      subjectId: subject.id,
                    },
                  })
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {subject.resources.length} resource{subject.resources.length !== 1 ? 's' : ''} available
                      </CardDescription>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show semester list when department is selected
  if (selectedDepartment) {
    const sortedSemesters = sortSemesters(selectedDepartment.semesters);
    
    return (
      <div className="container py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button
              onClick={() => setSelectedDepartment(null)}
              className="hover:text-foreground transition-colors"
            >
              Departments
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{selectedDepartment.name}</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            {selectedDepartment.name}
          </h1>
          <p className="text-muted-foreground">Select a semester to view subjects</p>
        </div>

        {sortedSemesters.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">No Semesters Available</h3>
              <p className="text-muted-foreground">
                Semesters for this department will appear here once they are added.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedSemesters.map((semester: Semester) => (
              <Card
                key={semester.id}
                className="hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedSemester(semester)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{semester.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {semester.subjects.length} subject{semester.subjects.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show department list (default view)
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Browse by Department</h1>
        <p className="text-muted-foreground">
          Select your department to explore study materials organized by semester and subject
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department: Department) => (
          <Card
            key={department.id}
            className="hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setSelectedDepartment(department)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {department.semesters.length} semester{department.semesters.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
