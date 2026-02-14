import { useState } from 'react';
import { useGetAllDepartments } from '../../features/catalog/useCatalog';
import { useAddResource, useEditResource, useRemoveResource } from '../../features/admin/resourceMutations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { deriveResourceType } from '../../lib/resourceType';
import type { Resource } from '../../backend';

interface ExtendedResource extends Resource {
  departmentId: string;
  departmentName: string;
  semesterId: string;
  semesterName: string;
  subjectId: string;
  subjectName: string;
}

export default function ResourceManager() {
  const { data: departments, isLoading } = useGetAllDepartments();
  const addResource = useAddResource();
  const editResource = useEditResource();
  const removeResource = useRemoveResource();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [selectedSubj, setSelectedSubj] = useState('');
  const [editingResource, setEditingResource] = useState<ExtendedResource | null>(null);

  const allResources: ExtendedResource[] = [];
  departments?.forEach((dept) => {
    dept.semesters.forEach((sem) => {
      sem.subjects.forEach((subj) => {
        subj.resources.forEach((res) => {
          allResources.push({
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

  const department = departments?.find((d) => d.id === selectedDept);
  const semester = department?.semesters.find((s) => s.id === selectedSem);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddResource = async () => {
    if (!title.trim() || !url.trim() || !selectedDept || !selectedSem || !selectedSubj) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!validateUrl(url)) {
      toast.error('Please enter a valid URL');
      return;
    }
    try {
      await addResource.mutateAsync({
        departmentId: selectedDept,
        semesterId: selectedSem,
        subjectId: selectedSubj,
        title,
        url,
      });
      toast.success('Resource added successfully');
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add resource');
    }
  };

  const handleEditResource = async () => {
    if (!editingResource || !title.trim() || !url.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!validateUrl(url)) {
      toast.error('Please enter a valid URL');
      return;
    }
    try {
      await editResource.mutateAsync({
        departmentId: editingResource.departmentId,
        semesterId: editingResource.semesterId,
        subjectId: editingResource.subjectId,
        resourceId: editingResource.id,
        title,
        url,
      });
      toast.success('Resource updated successfully');
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update resource');
    }
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setSelectedDept('');
    setSelectedSem('');
    setSelectedSubj('');
    setEditingResource(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Manage Resources</CardTitle>
            <CardDescription>Add, edit, and remove study materials</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingResource ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
                <DialogDescription>
                  {editingResource ? 'Update the resource details' : 'Add a new study material'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={selectedDept}
                      onValueChange={(value) => {
                        setSelectedDept(value);
                        setSelectedSem('');
                        setSelectedSubj('');
                      }}
                      disabled={!!editingResource}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
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
                      value={selectedSem}
                      onValueChange={(value) => {
                        setSelectedSem(value);
                        setSelectedSubj('');
                      }}
                      disabled={!selectedDept || !!editingResource}
                    >
                      <SelectTrigger id="semester">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {department?.semesters.map((sem) => (
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
                      value={selectedSubj}
                      onValueChange={setSelectedSubj}
                      disabled={!selectedSem || !!editingResource}
                    >
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {semester?.subjects.map((subj) => (
                          <SelectItem key={subj.id} value={subj.id}>
                            {subj.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Resource Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Data Structures Lecture Notes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Resource URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/resource.pdf"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a valid URL to the study material (e.g., Google Drive, Dropbox, or any public link)
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={editingResource ? handleEditResource : handleAddResource}
                  disabled={addResource.isPending || editResource.isPending}
                >
                  {editingResource ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {allResources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No resources yet. Add your first resource to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {allResources.map((resource) => (
              <div key={`${resource.departmentId}-${resource.semesterId}-${resource.subjectId}-${resource.id}`} className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{resource.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {resource.departmentName} • {resource.semesterName} • {resource.subjectName}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Type: {deriveResourceType(resource.title, resource.url)}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                  >
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingResource(resource);
                      setTitle(resource.title);
                      setUrl(resource.url);
                      setSelectedDept(resource.departmentId);
                      setSelectedSem(resource.semesterId);
                      setSelectedSubj(resource.subjectId);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{resource.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            try {
                              await removeResource.mutateAsync({
                                departmentId: resource.departmentId,
                                semesterId: resource.semesterId,
                                subjectId: resource.subjectId,
                                resourceId: resource.id,
                              });
                              toast.success('Resource deleted');
                            } catch (error: any) {
                              toast.error(error.message || 'Failed to delete');
                            }
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
