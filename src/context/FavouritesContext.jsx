import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Context Create karein
const FavouritesContext = createContext();

const STORAGE_KEY = '@movie_explorer_favourites';

export function FavouritesProvider({ children }) {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);

    // App start hote hi phone storage se saved favourites load honge
    useEffect(() => {
        loadFavouritesFromStorage();
    }, []);

    const loadFavouritesFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            if (jsonValue != null) {
                setFavourites(JSON.parse(jsonValue));
            }
        } catch (error) {
            console.error('Storage se favourites load nahi ho paye:', error);
        } finally {
            setLoading(false);
        }
    };

    // Movie favourite hai ya nahi check karein (by ID)
    const isFavourite = (movieId) => {
        return favourites.some((item) => item.id === movieId);
    };

    // Movie add ya remove (toggle) karne ka function
    const toggleFavourite = async (movie) => {
        try {
            let updatedFavourites;
            const alreadyFav = isFavourite(movie.id);

            if (alreadyFav) {
                // Remove: ID match karne wali movie ko filter out karein
                updatedFavourites = favourites.filter((item) => item.id !== movie.id);
            } else {
                // Add: Nayi movie ko array ke start mein jodein
                updatedFavourites = [movie, ...favourites];
            }

            // 1. State update karein (instant UI feedback)
            setFavourites(updatedFavourites);

            // 2. Phone ki permanent storage mein save karein (JSON stringify)
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavourites));
        } catch (error) {
            console.error('Storage mein favourite save nahi ho paya:', error);
        }
    };

    return (
        <FavouritesContext.Provider
            value={{
                favourites,
                isFavourite,
                toggleFavourite,
                loadingFavourites: loading,
            }}
        >
            {children}
        </FavouritesContext.Provider>
    );
}

// Custom Hook taaki components asani se use kar sakein
export function useFavourites() {
    const context = useContext(FavouritesContext);
    if (!context) {
        throw new Error('useFavourites must be used within a FavouritesProvider');
    }
    return context;
}
