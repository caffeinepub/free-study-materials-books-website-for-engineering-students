import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import type { Department } from '../../backend';
import { sortSemesters } from '../../utils/semesterSort';

interface ResourceFiltersProps {
  departments: Department[];
  keyword: string;
  selectedDepartment: string;
  selectedSemester: string;
  selectedSubject: string;
  selectedType: string;
  onKeywordChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

const RESOURCE_TYPES = ['Notes', 'Book', 'Previous Papers', 'Slides', 'Lab Manual', 'Other'];

export default function ResourceFilters({
  departments,
  keyword,
  selectedDepartment,
  selectedSemester,
  selectedSubject,
  selectedType,
  onKeywordChange,
  onDepartmentChange,
  onSemesterChange,
  onSubjectChange,
  onTypeChange,
}: ResourceFiltersProps) {
  const department = departments.find((d) => d.id === selectedDepartment);
  const sortedSemesters = department ? sortSemesters(department.semesters) : [];
  const semester = sortedSemesters.find((s) => s.id === selectedSemester);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-3">
            <Label htmlFor="keyword">Search by Keyword</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="keyword"
                placeholder="Enter title or keywords..."
                value={keyword}
                onChange={(e) => onKeywordChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={selectedDepartment || 'all'} 
              onValueChange={(value) => onDepartmentChange(value === 'all' ? '' : value)}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Select
              value={selectedSemester || 'all'}
              onValueChange={(value) => onSemesterChange(value === 'all' ? '' : value)}
              disabled={!selectedDepartment}
            >
              <SelectTrigger id="semester">
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {sortedSemesters.map((sem) => (
                  <SelectItem key={sem.id} value={sem.id}>
                    {sem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={selectedSubject || 'all'}
              onValueChange={(value) => onSubjectChange(value === 'all' ? '' : value)}
              disabled={!selectedSemester}
            >
              <SelectTrigger id="subject">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {semester?.subjects.map((subj) => (
                  <SelectItem key={subj.id} value={subj.id}>
                    {subj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Label htmlFor="type">Resource Type</Label>
            <Select 
              value={selectedType || 'all'} 
              onValueChange={(value) => onTypeChange(value === 'all' ? '' : value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {RESOURCE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
