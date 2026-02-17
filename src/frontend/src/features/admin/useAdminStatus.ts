import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export function useGetAdminStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['adminStatus', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      // Defensive check: if isCallerAdmin doesn't exist, treat as non-admin
      if (!actor.isCallerAdmin || typeof actor.isCallerAdmin !== 'function') {
        return false;
      }
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        // If the call fails, treat as non-admin rather than throwing
        console.error('Admin status check failed:', error);
        return false;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: 1,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Return custom state that properly reflects actor dependency
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !actorFetching && query.isFetched,
  };
}
