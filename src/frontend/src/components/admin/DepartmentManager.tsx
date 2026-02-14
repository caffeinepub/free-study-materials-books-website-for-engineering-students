import { useState } from 'react';
import { useGetAllDepartments } from '../../features/catalog/useCatalog';
import {
  useAddDepartment,
  useAddSubject,
  useEditDepartment,
  useEditSubject,
  useRemoveDepartment,
  useRemoveSubject,
} from '../../features/admin/structureMutations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import type { Department, Semester, Subject } from '../../backend';
import { sortSemesters } from '../../utils/semesterSort';

type DialogMode = 'add-department' | 'edit-department' | 'add-subject' | 'edit-subject' | null;

interface DialogState {
  mode: DialogMode;
  departmentId?: string;
  semesterId?: string;
  subjectId?: string;
  currentName?: string;
}

export default function DepartmentManager() {
  const { data: departments, isLoading } = useGetAllDepartments();
  const addDepartment = useAddDepartment();
  const editDepartment = useEditDepartment();
  const removeDepartment = useRemoveDepartment();
  const addSubject = useAddSubject();
  const editSubject = useEditSubject();
  const removeSubject = useRemoveSubject();

  const [dialogState, setDialogState] = useState<DialogState>({ mode: null });
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'department' | 'subject';
    departmentId: string;
    semesterId?: string;
    subjectId?: string;
    name: string;
  } | null>(null);
  const [formName, setFormName] = useState('');
  const [formId, setFormId] = useState('');

  const openDialog = (state: DialogState) => {
    setDialogState(state);
    setFormName(state.currentName || '');
    setFormId('');
  };

  const closeDialog = () => {
    setDialogState({ mode: null });
    setFormName('');
    setFormId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { mode, departmentId, semesterId, subjectId } = dialogState;

    try {
      if (mode === 'add-department') {
        await addDepartment.mutateAsync({ id: formId, name: formName });
      } else if (mode === 'edit-department' && departmentId) {
        await editDepartment.mutateAsync({ id: departmentId, name: formName });
      } else if (mode === 'add-subject' && departmentId && semesterId) {
        await addSubject.mutateAsync({
          departmentId,
          semesterId,
          id: formId,
          name: formName,
        });
      } else if (mode === 'edit-subject' && departmentId && semesterId && subjectId) {
        await editSubject.mutateAsync({
          departmentId,
          semesterId,
          subjectId,
          name: formName,
        });
      }
      closeDialog();
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'department') {
        await removeDepartment.mutateAsync(deleteTarget.departmentId);
      } else if (deleteTarget.type === 'subject' && deleteTarget.semesterId && deleteTarget.subjectId) {
        await removeSubject.mutateAsync({
          departmentId: deleteTarget.departmentId,
          semesterId: deleteTarget.semesterId,
          subjectId: deleteTarget.subjectId,
        });
      }
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

  const isSubmitting =
    addDepartment.isPending ||
    editDepartment.isPending ||
    addSubject.isPending ||
    editSubject.isPending;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Organizational Structure</CardTitle>
              <CardDescription>
                Manage departments, semesters, and subjects. Each department has 8 semesters by default.
              </CardDescription>
            </div>
            <Button onClick={() => openDialog({ mode: 'add-department' })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!departments || departments.length === 0 ? (
            <div className="py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">No Departments</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first department.
              </p>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {departments.map((dept: Department) => {
                const sortedSemesters = sortSemesters(dept.semesters);
                
                return (
                  <AccordionItem key={dept.id} value={dept.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-semibold">{dept.name}</span>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              openDialog({
                                mode: 'edit-department',
                                departmentId: dept.id,
                                currentName: dept.name,
                              })
                            }
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setDeleteTarget({
                                type: 'department',
                                departmentId: dept.id,
                                name: dept.name,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 space-y-4">
                        {sortedSemesters.map((semester: Semester) => (
                          <div key={semester.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">{semester.name}</h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openDialog({
                                    mode: 'add-subject',
                                    departmentId: dept.id,
                                    semesterId: semester.id,
                                  })
                                }
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Subject
                              </Button>
                            </div>
                            {semester.subjects.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No subjects yet</p>
                            ) : (
                              <div className="space-y-2">
                                {semester.subjects.map((subject: Subject) => (
                                  <div
                                    key={subject.id}
                                    className="flex items-center justify-between p-2 rounded bg-muted/50"
                                  >
                                    <span className="text-sm">{subject.name}</span>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() =>
                                          openDialog({
                                            mode: 'edit-subject',
                                            departmentId: dept.id,
                                            semesterId: semester.id,
                                            subjectId: subject.id,
                                            currentName: subject.name,
                                          })
                                        }
                                      >
                                        <Edit2 className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() =>
                                          setDeleteTarget({
                                            type: 'subject',
                                            departmentId: dept.id,
                                            semesterId: semester.id,
                                            subjectId: subject.id,
                                            name: subject.name,
                                          })
                                        }
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogState.mode !== null} onOpenChange={closeDialog}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {dialogState.mode === 'add-department' && 'Add Department'}
                {dialogState.mode === 'edit-department' && 'Edit Department'}
                {dialogState.mode === 'add-subject' && 'Add Subject'}
                {dialogState.mode === 'edit-subject' && 'Edit Subject'}
              </DialogTitle>
              <DialogDescription>
                {(dialogState.mode === 'add-department' || dialogState.mode === 'add-subject') &&
                  'Enter a unique ID and name.'}
                {(dialogState.mode === 'edit-department' || dialogState.mode === 'edit-subject') &&
                  'Update the name.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {(dialogState.mode === 'add-department' || dialogState.mode === 'add-subject') && (
                <div className="space-y-2">
                  <Label htmlFor="id">ID</Label>
                  <Input
                    id="id"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="e.g., cs, math, physics"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter name"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteTarget?.name}" and all its contents. This action
              cannot be undone.
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
