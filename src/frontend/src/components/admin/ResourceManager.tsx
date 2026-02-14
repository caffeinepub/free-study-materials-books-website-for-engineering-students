import { useState, useMemo } from 'react';
import { useGetAllDepartments } from '../../features/catalog/useCatalog';
import {
  useAddResource,
  useEditResource,
  useRemoveResource,
} from '../../features/admin/resourceMutations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit2, Trash2, FileText, Upload, Link as LinkIcon } from 'lucide-react';
import type { Resource, ResourceContent } from '../../backend';
import { ExternalBlob } from '../../backend';
import { deriveResourceType } from '../../lib/resourceType';
import { sortSemesters } from '../../utils/semesterSort';

interface ExtendedResource extends Resource {
  departmentId: string;
  departmentName: string;
  semesterId: string;
  semesterName: string;
  subjectId: string;
  subjectName: string;
}

type DialogMode = 'add' | 'edit' | null;
type ResourceSource = 'url' | 'file';

export default function ResourceManager() {
  const { data: departments, isLoading } = useGetAllDepartments();
  const addResource = useAddResource();
  const editResource = useEditResource();
  const removeResource = useRemoveResource();

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editingResource, setEditingResource] = useState<ExtendedResource | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExtendedResource | null>(null);

  const [formDepartment, setFormDepartment] = useState('');
  const [formSemester, setFormSemester] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSource, setFormSource] = useState<ResourceSource>('url');
  const [formUrl, setFormUrl] = useState('');
  const [formFile, setFormFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Flatten all resources
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

  const openAddDialog = () => {
    setDialogMode('add');
    setFormDepartment('');
    setFormSemester('');
    setFormSubject('');
    setFormTitle('');
    setFormSource('url');
    setFormUrl('');
    setFormFile(null);
    setUploadProgress(0);
  };

  const openEditDialog = (resource: ExtendedResource) => {
    setDialogMode('edit');
    setEditingResource(resource);
    setFormDepartment(resource.departmentId);
    setFormSemester(resource.semesterId);
    setFormSubject(resource.subjectId);
    setFormTitle(resource.title);
    
    // Determine source type from content
    if (resource.content.__kind__ === 'url') {
      setFormSource('url');
      setFormUrl(resource.content.url);
      setFormFile(null);
    } else {
      setFormSource('file');
      setFormUrl('');
      setFormFile(null);
    }
    setUploadProgress(0);
  };

  const closeDialog = () => {
    setDialogMode(null);
    setEditingResource(null);
    setFormDepartment('');
    setFormSemester('');
    setFormSubject('');
    setFormTitle('');
    setFormSource('url');
    setFormUrl('');
    setFormFile(null);
    setUploadProgress(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on source type
    if (formSource === 'url') {
      try {
        new URL(formUrl);
      } catch {
        alert('Please enter a valid URL (must start with http:// or https://)');
        return;
      }
    } else if (formSource === 'file' && !formFile && dialogMode === 'add') {
      alert('Please select a file to upload');
      return;
    }

    try {
      let content: ResourceContent;

      if (formSource === 'url') {
        content = {
          __kind__: 'url',
          url: formUrl,
        };
      } else {
        // For file upload
        if (formFile) {
          // Read file as bytes
          const arrayBuffer = await formFile.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          
          // Create ExternalBlob with upload progress tracking
          const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
            setUploadProgress(percentage);
          });

          content = {
            __kind__: 'externalBlob',
            externalBlob: blob,
          };
        } else if (dialogMode === 'edit' && editingResource?.content.__kind__ === 'externalBlob') {
          // Keep existing file if editing and no new file selected
          content = editingResource.content;
        } else {
          alert('Please select a file to upload');
          return;
        }
      }

      if (dialogMode === 'add') {
        await addResource.mutateAsync({
          departmentId: formDepartment,
          semesterId: formSemester,
          subjectId: formSubject,
          title: formTitle,
          content,
        });
      } else if (dialogMode === 'edit' && editingResource) {
        await editResource.mutateAsync({
          departmentId: formDepartment,
          semesterId: formSemester,
          subjectId: formSubject,
          resourceId: editingResource.id,
          title: formTitle,
          content,
        });
      }
      closeDialog();
    } catch (error) {
      console.error('Operation failed:', error);
      alert('Operation failed. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await removeResource.mutateAsync({
        departmentId: deleteTarget.departmentId,
        semesterId: deleteTarget.semesterId,
        subjectId: deleteTarget.subjectId,
        resourceId: deleteTarget.id,
      });
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    );
  }

  const selectedDepartment = departments?.find((d) => d.id === formDepartment);
  const sortedSemesters = selectedDepartment ? sortSemesters(selectedDepartment.semesters) : [];
  const selectedSemester = sortedSemesters.find((s) => s.id === formSemester);

  const isSubmitting = addResource.isPending || editResource.isPending;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Study Materials</CardTitle>
              <CardDescription>
                Add and manage resources for all subjects across departments
              </CardDescription>
            </div>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {allResources.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">No Resources</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding study materials for your subjects.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {allResources.map((resource) => {
                const resourceType = deriveResourceType(resource);
                const sourceType = resource.content.__kind__ === 'url' ? 'External Link' : 'Uploaded File';
                
                return (
                  <div
                    key={`${resource.departmentId}-${resource.semesterId}-${resource.subjectId}-${resource.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{resource.title}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                          {resourceType}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                          {sourceType}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {resource.departmentName} → {resource.semesterName} → {resource.subjectName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(resource)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(resource)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogMode !== null} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{dialogMode === 'add' ? 'Add Resource' : 'Edit Resource'}</DialogTitle>
              <DialogDescription>
                {dialogMode === 'add'
                  ? 'Add a new study material to a subject'
                  : 'Update the resource details'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formDepartment}
                    onValueChange={(value) => {
                      setFormDepartment(value);
                      setFormSemester('');
                      setFormSubject('');
                    }}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dept) => (
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
                    value={formSemester}
                    onValueChange={(value) => {
                      setFormSemester(value);
                      setFormSubject('');
                    }}
                    disabled={!formDepartment}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
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
                    value={formSubject}
                    onValueChange={setFormSubject}
                    disabled={!formSemester}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedSemester?.subjects.map((subj) => (
                        <SelectItem key={subj.id} value={subj.id}>
                          {subj.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Data Structures Notes, Algorithm Textbook"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Resource Source</Label>
                <RadioGroup value={formSource} onValueChange={(value) => setFormSource(value as ResourceSource)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="url" id="source-url" />
                    <Label htmlFor="source-url" className="font-normal cursor-pointer flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      External URL
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="source-file" />
                    <Label htmlFor="source-file" className="font-normal cursor-pointer flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload File
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formSource === 'url' ? (
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://example.com/resource.pdf"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be a valid URL starting with http:// or https://
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    required={dialogMode === 'add'}
                  />
                  {formFile && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {formFile.name} ({(formFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  {dialogMode === 'edit' && !formFile && editingResource?.content.__kind__ === 'externalBlob' && (
                    <p className="text-xs text-muted-foreground">
                      Current file will be kept if no new file is selected
                    </p>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteTarget?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
