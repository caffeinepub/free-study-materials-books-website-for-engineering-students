import { useState, useMemo } from 'react';
import { useGetAllDepartments } from '../features/catalog/useCatalog';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import ResourceFilters from '../components/resources/ResourceFilters';
import ResourceList from '../components/resources/ResourceList';
import EmptyState from '../components/resources/EmptyState';
import { filterResources } from '../features/catalog/catalogSearch';
import type { Resource } from '../backend';

interface ExtendedResource extends Resource {
  departmentId: string;
  departmentName: string;
  semesterId: string;
  semesterName: string;
  subjectId: string;
  subjectName: string;
}

export default function SearchPage() {
  const { data: departments, isLoading } = useGetAllDepartments();
  const [keyword, setKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Flatten all resources with context
  const allResources = useMemo<ExtendedResource[]>(() => {
    if (!departments) return [];
    
    const resources: ExtendedResource[] = [];
    departments.forEach((dept) => {
      dept.semesters.forEach((sem) => {
        sem.subjects.forEach((subj) => {
          subj.resources.forEach((res) => {
            resources.push({
              ...res,
              departmentId: dept.id,
              departmentName: dept.name,
              semesterId: sem.id,
              semesterName: sem.name,
              subjectId: subj.id,
              subjectName: subj.name,
            });
          });
        });
      });
    });
    return resources;
  }, [departments]);

  // Filter resources
  const filteredResources = useMemo(() => {
    return filterResources(allResources, {
      keyword: keyword.trim(),
      departmentId: selectedDepartment.trim(),
      semesterId: selectedSemester.trim(),
      subjectId: selectedSubject.trim(),
      resourceType: selectedType.trim(),
    });
  }, [allResources, keyword, selectedDepartment, selectedSemester, selectedSubject, selectedType]);

  if (isLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-32 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  const hasFilters = keyword || selectedDepartment || selectedSemester || selectedSubject || selectedType;

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Search Study Materials</h1>
        <p className="text-muted-foreground">
          Find resources by keyword or filter by department, semester, subject, and type
        </p>
      </div>

      <ResourceFilters
        departments={departments || []}
        keyword={keyword}
        selectedDepartment={selectedDepartment}
        selectedSemester={selectedSemester}
        selectedSubject={selectedSubject}
        selectedType={selectedType}
        onKeywordChange={setKeyword}
        onDepartmentChange={(value) => {
          setSelectedDepartment(value);
          setSelectedSemester('');
          setSelectedSubject('');
        }}
        onSemesterChange={(value) => {
          setSelectedSemester(value);
          setSelectedSubject('');
        }}
        onSubjectChange={setSelectedSubject}
        onTypeChange={setSelectedType}
      />

      <div className="mt-8">
        {!hasFilters ? (
          <EmptyState
            icon={Search}
            title="Start Searching"
            description="Enter a keyword or select filters above to find study materials."
          />
        ) : filteredResources.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No Results Found"
            description="Try adjusting your search criteria or filters to find what you're looking for."
          />
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Found {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
            </div>
            <ResourceList
              resources={filteredResources}
              showContext
            />
          </>
        )}
      </div>
    </div>
  );
}
