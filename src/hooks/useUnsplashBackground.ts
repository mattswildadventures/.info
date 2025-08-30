import { useState, useCallback } from 'react';

interface UnsplashPhoto {
  urls: {
    full: string;
    regular: string;
    small: string;
  };
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

interface UnsplashBackgroundState {
  imageUrl: string | null;
  attribution: {
    photographerName: string;
    photographerUrl: string;
  } | null;
  loading: boolean;
  error: string | null;
}

export function useUnsplashBackground() {
  const [state, setState] = useState<UnsplashBackgroundState>({
    imageUrl: null,
    attribution: null,
    loading: false,
    error: null,
  });

  const fetchRandomBackground = useCallback(async () => {
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      setState(prev => ({ ...prev, error: 'Unsplash API key not configured' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        'https://api.unsplash.com/photos/random?query=mountains,landscape&orientation=landscape',
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const photo: UnsplashPhoto = await response.json();

      setState({
        imageUrl: photo.urls.regular, // Use regular size for better performance
        attribution: {
          photographerName: photo.user.name,
          photographerUrl: `${photo.links.html}?utm_source=profile2&utm_medium=referral`,
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        imageUrl: null,
        attribution: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch background',
      });
    }
  }, []);

  const clearBackground = useCallback(() => {
    setState({
      imageUrl: null,
      attribution: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchRandomBackground,
    clearBackground,
  };
}