import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Department } from '../../backend';

export function useGetAllDepartments() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDepartments();
    },
    enabled: !!actor && !actorFetching,
  });

  // Return custom state that properly reflects actor dependency
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !actorFetching && query.isFetched,
  };
}
