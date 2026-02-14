/**
 * Sorts semesters in numeric order (Semester 1 → Semester 8).
 * Extracts numeric values from semester names and sorts accordingly.
 * Falls back to string comparison for non-standard formats.
 */
export function sortSemesters<T extends { id: string; name: string }>(semesters: T[]): T[] {
  return [...semesters].sort((a, b) => {
    // Try to extract numeric values from semester names
    const aMatch = a.name.match(/\d+/);
    const bMatch = b.name.match(/\d+/);
    
    if (aMatch && bMatch) {
      const aNum = parseInt(aMatch[0], 10);
      const bNum = parseInt(bMatch[0], 10);
      return aNum - bNum;
    }
    
    // Fallback to string comparison
    return a.name.localeCompare(b.name);
  });
}
