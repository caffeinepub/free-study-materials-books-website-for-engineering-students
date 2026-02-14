import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Department } from '../../backend';

export function useGetAllDepartments() {
  const { actor, isFetching } = useActor();

  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDepartments();
    },
    enabled: !!actor && !isFetching,
  });
}
