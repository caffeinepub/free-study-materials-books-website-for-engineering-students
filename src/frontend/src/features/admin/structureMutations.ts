import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';

export function useAddDepartment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDepartment(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useEditDepartment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editDepartment(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useRemoveDepartment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeDepartment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useAddSemester() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId, id, name }: { departmentId: string; id: string; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSemester(departmentId, id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useEditSemester() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId, semesterId, name }: { departmentId: string; semesterId: string; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editSemester(departmentId, semesterId, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useRemoveSemester() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId, semesterId }: { departmentId: string; semesterId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeSemester(departmentId, semesterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useAddSubject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId, semesterId, id, name }: { departmentId: string; semesterId: string; id: string; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSubject(departmentId, semesterId, id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useEditSubject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId, semesterId, subjectId, name }: { departmentId: string; semesterId: string; subjectId: string; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editSubject(departmentId, semesterId, subjectId, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useRemoveSubject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId, semesterId, subjectId }: { departmentId: string; semesterId: string; subjectId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeSubject(departmentId, semesterId, subjectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}
