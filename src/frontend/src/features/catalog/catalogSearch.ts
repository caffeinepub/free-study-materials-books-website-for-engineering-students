import { deriveResourceType } from '../../lib/resourceType';

interface SearchableResource {
  id: bigint;
  title: string;
  url: string;
  departmentId?: string;
  semesterId?: string;
  subjectId?: string;
}

interface SearchFilters {
  keyword?: string;
  departmentId?: string;
  semesterId?: string;
  subjectId?: string;
  resourceType?: string;
}

export function filterResources<T extends SearchableResource>(
  resources: T[],
  filters: SearchFilters
): T[] {
  return resources.filter((resource) => {
    // Keyword search
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const titleMatch = resource.title.toLowerCase().includes(keyword);
      if (!titleMatch) return false;
    }

    // Department filter
    if (filters.departmentId && resource.departmentId !== filters.departmentId) {
      return false;
    }

    // Semester filter
    if (filters.semesterId && resource.semesterId !== filters.semesterId) {
      return false;
    }

    // Subject filter
    if (filters.subjectId && resource.subjectId !== filters.subjectId) {
      return false;
    }

    // Resource type filter
    if (filters.resourceType) {
      const derivedType = deriveResourceType(resource.title, resource.url);
      if (derivedType !== filters.resourceType) {
        return false;
      }
    }

    return true;
  });
}
