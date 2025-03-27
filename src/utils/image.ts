export const getValidImageUrl = (url: string | null | undefined, type: 'room' | 'location' | 'avatar' = 'room'): string => {
  // Define local fallbacks that won't go through Next.js image optimization
  const fallbacks = {
    room: '/images/fallback-room.jpg',
    location: '/images/fallback-location.jpg',
    avatar: '/images/fallback-avatar.jpg'
  };

  // No URL provided
  if (!url) {
    return fallbacks[type];
  }

  // Special case for alicdn.com - convert http to https
  if (url.startsWith('http://sc04.alicdn.com')) {
    url = url.replace('http://', 'https://');
  }

  // Check if URL is valid and from safe domains
  try {
    const urlObj = new URL(url);
    
    // Allow certain domains that we know work with Next.js Image optimization
    const allowedDomains = [
      'airbnbnew.cybersoft.edu.vn',
      'a0.muscache.com', 
      'picsum.photos',
      'ui-avatars.com',
      'example.com',
      'sc04.alicdn.com'
    ];
    
    // If domain is in our allowed list, return the URL
    if (allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
      return url;
    }
    
    // For other domains, return fallback
    return fallbacks[type];
  } catch {
    // Invalid URL format
    return fallbacks[type];
  }
}; 