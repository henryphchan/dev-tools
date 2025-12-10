import { useState, useEffect } from 'react';
import { ToolId } from '../lib/tools';

export function useFavorites() {
    const [favorites, setFavorites] = useState<ToolId[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('favorites');
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse favorites', e);
            }
        }
        setIsLoaded(true);
    }, []);

    const saveFavorites = (newFavorites: ToolId[]) => {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setFavorites(newFavorites);
        window.dispatchEvent(new Event('favorites-updated'));
    };

    const toggleFavorite = (id: ToolId, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (favorites.includes(id)) {
            saveFavorites(favorites.filter((fid) => fid !== id));
        } else {
            saveFavorites([...favorites, id]);
        }
    };

    const isFavorite = (id: ToolId) => favorites.includes(id);

    useEffect(() => {
        const handleStorageChange = () => {
            const stored = localStorage.getItem('favorites');
            if (stored) {
                try {
                    setFavorites(JSON.parse(stored));
                } catch (e) {
                    // ignore
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('favorites-updated', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('favorites-updated', handleStorageChange);
        };
    }, []);

    return { favorites, toggleFavorite, isFavorite, isLoaded };
}
