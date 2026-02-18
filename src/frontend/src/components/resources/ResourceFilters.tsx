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

// Collision-proof sentinel values for "All" options - using special prefix that won't conflict with real IDs
const ALL_DEPARTMENTS_VALUE = '__sentinel_all_departments__';
const ALL_SEMESTERS_VALUE = '__sentinel_all_semesters__';
const ALL_SUBJECTS_VALUE = '__sentinel_all_subjects__';
const ALL_TYPES_VALUE = '__sentinel_all_types__';

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
  // Find selected department and derive available semesters/subjects
  const department = departments.find((d) => d.id === selectedDepartment);
  const sortedSemesters = department ? sortSemesters(department.semesters) : [];
  const semester = sortedSemesters.find((s) => s.id === selectedSemester);
  const subjects = semester?.subjects || [];

  // Convert empty string to sentinel value for controlled Select
  const departmentValue = selectedDepartment || ALL_DEPARTMENTS_VALUE;
  const semesterValue = selectedSemester || ALL_SEMESTERS_VALUE;
  const subjectValue = selectedSubject || ALL_SUBJECTS_VALUE;
  const typeValue = selectedType || ALL_TYPES_VALUE;

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
              value={departmentValue} 
              onValueChange={(value) => onDepartmentChange(value === ALL_DEPARTMENTS_VALUE ? '' : value)}
            >
              <SelectTrigger id="department">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_DEPARTMENTS_VALUE}>All Departments</SelectItem>
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
              value={semesterValue}
              onValueChange={(value) => onSemesterChange(value === ALL_SEMESTERS_VALUE ? '' : value)}
              disabled={!selectedDepartment}
            >
              <SelectTrigger id="semester">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_SEMESTERS_VALUE}>All Semesters</SelectItem>
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
              value={subjectValue}
              onValueChange={(value) => onSubjectChange(value === ALL_SUBJECTS_VALUE ? '' : value)}
              disabled={!selectedSemester}
            >
              <SelectTrigger id="subject">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_SUBJECTS_VALUE}>All Subjects</SelectItem>
                {subjects.map((subj) => (
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
              value={typeValue} 
              onValueChange={(value) => onTypeChange(value === ALL_TYPES_VALUE ? '' : value)}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TYPES_VALUE}>All Types</SelectItem>
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
