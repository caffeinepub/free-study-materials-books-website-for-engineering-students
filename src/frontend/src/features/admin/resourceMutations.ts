import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';

export function useAddResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      departmentId,
      semesterId,
      subjectId,
      title,
      url,
    }: {
      departmentId: string;
      semesterId: string;
      subjectId: string;
      title: string;
      url: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addResource(departmentId, semesterId, subjectId, title, url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useEditResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      departmentId,
      semesterId,
      subjectId,
      resourceId,
      title,
      url,
    }: {
      departmentId: string;
      semesterId: string;
      subjectId: string;
      resourceId: bigint;
      title: string;
      url: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editResource(departmentId, semesterId, subjectId, resourceId, title, url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useRemoveResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      departmentId,
      semesterId,
      subjectId,
      resourceId,
    }: {
      departmentId: string;
      semesterId: string;
      subjectId: string;
      resourceId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeResource(departmentId, semesterId, subjectId, resourceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}
