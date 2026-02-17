import { deriveResourceType } from '../../lib/resourceType';
import type { Resource } from '../../backend';

interface SearchableResource extends Resource {
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
    if (filters.keyword && filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase().trim();
      const titleMatch = resource.title.toLowerCase().includes(keyword);
      if (!titleMatch) return false;
    }

    // Department filter - normalize both sides for comparison
    if (filters.departmentId && filters.departmentId.trim()) {
      const filterDeptId = filters.departmentId.trim();
      const resourceDeptId = resource.departmentId?.trim() || '';
      if (resourceDeptId !== filterDeptId) {
        return false;
      }
    }

    // Semester filter - normalize both sides for comparison
    if (filters.semesterId && filters.semesterId.trim()) {
      const filterSemId = filters.semesterId.trim();
      const resourceSemId = resource.semesterId?.trim() || '';
      if (resourceSemId !== filterSemId) {
        return false;
      }
    }

    // Subject filter - normalize both sides for comparison
    if (filters.subjectId && filters.subjectId.trim()) {
      const filterSubjId = filters.subjectId.trim();
      const resourceSubjId = resource.subjectId?.trim() || '';
      if (resourceSubjId !== filterSubjId) {
        return false;
      }
    }

    // Resource type filter
    if (filters.resourceType && filters.resourceType.trim()) {
      const derivedType = deriveResourceType(resource);
      if (derivedType !== filters.resourceType.trim()) {
        return false;
      }
    }

    return true;
  });
}
