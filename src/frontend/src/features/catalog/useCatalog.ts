import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Department } from '../../backend';

export function useGetAllDepartments() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllDepartments();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    retryDelay: 1000,
  });

  // Return custom state that properly reflects actor dependency
  // isLoading: true while actor is initializing OR query is loading
  // isFetched: true only when actor is ready AND query has completed successfully
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !actorFetching && query.isFetched,
  };
}
