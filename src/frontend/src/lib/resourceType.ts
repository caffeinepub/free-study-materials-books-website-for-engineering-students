export function deriveResourceType(title: string, url: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerUrl = url.toLowerCase();

  // Check title keywords
  if (lowerTitle.includes('note') || lowerTitle.includes('lecture')) {
    return 'Notes';
  }
  if (lowerTitle.includes('book') || lowerTitle.includes('textbook') || lowerTitle.includes('ebook')) {
    return 'Book';
  }
  if (lowerTitle.includes('previous') || lowerTitle.includes('paper') || lowerTitle.includes('exam') || lowerTitle.includes('question')) {
    return 'Previous Papers';
  }
  if (lowerTitle.includes('slide') || lowerTitle.includes('presentation') || lowerTitle.includes('ppt')) {
    return 'Slides';
  }
  if (lowerTitle.includes('lab') || lowerTitle.includes('manual') || lowerTitle.includes('practical')) {
    return 'Lab Manual';
  }

  // Check URL patterns
  if (lowerUrl.includes('.ppt') || lowerUrl.includes('slides')) {
    return 'Slides';
  }
  if (lowerUrl.includes('book') || lowerUrl.includes('.epub')) {
    return 'Book';
  }

  return 'Other';
}
