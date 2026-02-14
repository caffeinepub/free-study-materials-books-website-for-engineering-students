import type { Resource } from '../backend';

export type ResourceType = 'Notes' | 'Book' | 'Previous Papers' | 'Slides' | 'Lab Manual' | 'Other';

export function deriveResourceType(resource: Resource): ResourceType {
  const title = resource.title.toLowerCase();
  
  // Get URL if available for additional context
  let url = '';
  if (resource.content.__kind__ === 'url') {
    url = resource.content.url.toLowerCase();
  } else if (resource.content.__kind__ === 'externalBlob') {
    // For uploaded files, we can try to get the URL but it's optional
    try {
      url = resource.content.externalBlob.getDirectURL().toLowerCase();
    } catch {
      // If getDirectURL fails, just use empty string
      url = '';
    }
  }

  // Check title and URL for keywords
  if (title.includes('note') || title.includes('summary')) {
    return 'Notes';
  }
  if (title.includes('book') || title.includes('textbook') || title.includes('ebook')) {
    return 'Book';
  }
  if (
    title.includes('previous') ||
    title.includes('paper') ||
    title.includes('exam') ||
    title.includes('question')
  ) {
    return 'Previous Papers';
  }
  if (title.includes('slide') || title.includes('presentation') || title.includes('ppt')) {
    return 'Slides';
  }
  if (title.includes('lab') || title.includes('manual') || title.includes('practical')) {
    return 'Lab Manual';
  }

  // Check URL patterns if available
  if (url) {
    if (url.includes('slide') || url.includes('.ppt')) {
      return 'Slides';
    }
    if (url.includes('book') || url.includes('textbook')) {
      return 'Book';
    }
  }

  return 'Other';
}
