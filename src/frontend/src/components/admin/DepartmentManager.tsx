import { useState } from 'react';
import { useGetAllDepartments } from '../../features/catalog/useCatalog';
import {
  useAddDepartment,
  useAddSemester,
  useAddSubject,
  useEditDepartment,
  useEditSemester,
  useEditSubject,
  useRemoveDepartment,
  useRemoveSemester,
  useRemoveSubject,
} from '../../features/admin/structureMutations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function DepartmentManager() {
  const { data: departments, isLoading } = useGetAllDepartments();
  const addDepartment = useAddDepartment();
  const addSemester = useAddSemester();
  const addSubject = useAddSubject();
  const editDepartment = useEditDepartment();
  const editSemester = useEditSemester();
  const editSubject = useEditSubject();
  const removeDepartment = useRemoveDepartment();
  const removeSemester = useRemoveSemester();
  const removeSubject = useRemoveSubject();

  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptId, setDeptId] = useState('');
  const [editingDept, setEditingDept] = useState<string | null>(null);

  const [semDialogOpen, setSemDialogOpen] = useState(false);
  const [semName, setSemName] = useState('');
  const [semId, setSemId] = useState('');
  const [semDeptId, setSemDeptId] = useState('');
  const [editingSem, setEditingSem] = useState<{ deptId: string; semId: string } | null>(null);

  const [subjDialogOpen, setSubjDialogOpen] = useState(false);
  const [subjName, setSubjName] = useState('');
  const [subjId, setSubjId] = useState('');
  const [subjDeptId, setSubjDeptId] = useState('');
  const [subjSemId, setSubjSemId] = useState('');
  const [editingSubj, setEditingSubj] = useState<{ deptId: string; semId: string; subjId: string } | null>(null);

  const handleAddDepartment = async () => {
    if (!deptName.trim() || !deptId.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await addDepartment.mutateAsync({ id: deptId, name: deptName });
      toast.success('Department added successfully');
      setDeptDialogOpen(false);
      setDeptName('');
      setDeptId('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add department');
    }
  };

  const handleEditDepartment = async () => {
    if (!editingDept || !deptName.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await editDepartment.mutateAsync({ id: editingDept, name: deptName });
      toast.success('Department updated successfully');
      setDeptDialogOpen(false);
      setDeptName('');
      setEditingDept(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update department');
    }
  };

  const handleAddSemester = async () => {
    if (!semName.trim() || !semId.trim() || !semDeptId) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await addSemester.mutateAsync({ departmentId: semDeptId, id: semId, name: semName });
      toast.success('Semester added successfully');
      setSemDialogOpen(false);
      setSemName('');
      setSemId('');
      setSemDeptId('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add semester');
    }
  };

  const handleEditSemester = async () => {
    if (!editingSem || !semName.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await editSemester.mutateAsync({
        departmentId: editingSem.deptId,
        semesterId: editingSem.semId,
        name: semName,
      });
      toast.success('Semester updated successfully');
      setSemDialogOpen(false);
      setSemName('');
      setEditingSem(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update semester');
    }
  };

  const handleAddSubject = async () => {
    if (!subjName.trim() || !subjId.trim() || !subjDeptId || !subjSemId) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await addSubject.mutateAsync({
        departmentId: subjDeptId,
        semesterId: subjSemId,
        id: subjId,
        name: subjName,
      });
      toast.success('Subject added successfully');
      setSubjDialogOpen(false);
      setSubjName('');
      setSubjId('');
      setSubjDeptId('');
      setSubjSemId('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add subject');
    }
  };

  const handleEditSubject = async () => {
    if (!editingSubj || !subjName.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await editSubject.mutateAsync({
        departmentId: editingSubj.deptId,
        semesterId: editingSubj.semId,
        subjectId: editingSubj.subjId,
        name: subjName,
      });
      toast.success('Subject updated successfully');
      setSubjDialogOpen(false);
      setSubjName('');
      setEditingSubj(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update subject');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Structure</CardTitle>
              <CardDescription>Add and organize departments, semesters, and subjects</CardDescription>
            </div>
            <Dialog open={deptDialogOpen} onOpenChange={setDeptDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingDept(null);
                    setDeptName('');
                    setDeptId('');
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingDept ? 'Edit Department' : 'Add Department'}</DialogTitle>
                  <DialogDescription>
                    {editingDept ? 'Update the department name' : 'Create a new department'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {!editingDept && (
                    <div className="space-y-2">
                      <Label htmlFor="dept-id">Department ID</Label>
                      <Input
                        id="dept-id"
                        placeholder="e.g., cse"
                        value={deptId}
                        onChange={(e) => setDeptId(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="dept-name">Department Name</Label>
                    <Input
                      id="dept-name"
                      placeholder="e.g., Computer Science Engineering"
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={editingDept ? handleEditDepartment : handleAddDepartment}
                    disabled={addDepartment.isPending || editDepartment.isPending}
                  >
                    {editingDept ? 'Update' : 'Add'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {!departments || departments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No departments yet. Add your first department to get started.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {departments.map((dept) => (
                <AccordionItem key={dept.id} value={dept.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-medium">{dept.name}</span>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingDept(dept.id);
                            setDeptName(dept.name);
                            setDeptDialogOpen(true);
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
                              <AlertDialogTitle>Delete Department</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {dept.name} and all its semesters, subjects, and resources.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  try {
                                    await removeDepartment.mutateAsync(dept.id);
                                    toast.success('Department deleted');
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSemDeptId(dept.id);
                            setSemName('');
                            setSemId('');
                            setEditingSem(null);
                            setSemDialogOpen(true);
                          }}
                        >
                          <FolderPlus className="h-4 w-4 mr-1" />
                          Add Semester
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 space-y-2">
                      {dept.semesters.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-2">No semesters yet</div>
                      ) : (
                        dept.semesters.map((sem) => (
                          <div key={sem.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{sem.name}</span>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingSem({ deptId: dept.id, semId: sem.id });
                                    setSemName(sem.name);
                                    setSemDialogOpen(true);
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
                                      <AlertDialogTitle>Delete Semester</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will delete {sem.name} and all its subjects and resources.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={async () => {
                                          try {
                                            await removeSemester.mutateAsync({ departmentId: dept.id, semesterId: sem.id });
                                            toast.success('Semester deleted');
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
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSubjDeptId(dept.id);
                                    setSubjSemId(sem.id);
                                    setSubjName('');
                                    setSubjId('');
                                    setEditingSubj(null);
                                    setSubjDialogOpen(true);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Subject
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {sem.subjects.length === 0 ? (
                                <div className="text-sm text-muted-foreground">No subjects yet</div>
                              ) : (
                                sem.subjects.map((subj) => (
                                  <div key={subj.id} className="flex items-center justify-between text-sm bg-muted/50 rounded p-2">
                                    <span>{subj.name}</span>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          setEditingSubj({ deptId: dept.id, semId: sem.id, subjId: subj.id });
                                          setSubjName(subj.name);
                                          setSubjDialogOpen(true);
                                        }}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button size="sm" variant="ghost">
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This will delete {subj.name} and all its resources.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={async () => {
                                                try {
                                                  await removeSubject.mutateAsync({
                                                    departmentId: dept.id,
                                                    semesterId: sem.id,
                                                    subjectId: subj.id,
                                                  });
                                                  toast.success('Subject deleted');
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
                                ))
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Dialog open={semDialogOpen} onOpenChange={setSemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSem ? 'Edit Semester' : 'Add Semester'}</DialogTitle>
            <DialogDescription>
              {editingSem ? 'Update the semester name' : 'Create a new semester'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!editingSem && (
              <div className="space-y-2">
                <Label htmlFor="sem-id">Semester ID</Label>
                <Input
                  id="sem-id"
                  placeholder="e.g., sem1"
                  value={semId}
                  onChange={(e) => setSemId(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="sem-name">Semester Name</Label>
              <Input
                id="sem-name"
                placeholder="e.g., Semester 1"
                value={semName}
                onChange={(e) => setSemName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={editingSem ? handleEditSemester : handleAddSemester}
              disabled={addSemester.isPending || editSemester.isPending}
            >
              {editingSem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={subjDialogOpen} onOpenChange={setSubjDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubj ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
            <DialogDescription>
              {editingSubj ? 'Update the subject name' : 'Create a new subject'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!editingSubj && (
              <div className="space-y-2">
                <Label htmlFor="subj-id">Subject ID</Label>
                <Input
                  id="subj-id"
                  placeholder="e.g., math101"
                  value={subjId}
                  onChange={(e) => setSubjId(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="subj-name">Subject Name</Label>
              <Input
                id="subj-name"
                placeholder="e.g., Engineering Mathematics I"
                value={subjName}
                onChange={(e) => setSubjName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={editingSubj ? handleEditSubject : handleAddSubject}
              disabled={addSubject.isPending || editSubject.isPending}
            >
              {editingSubj ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
