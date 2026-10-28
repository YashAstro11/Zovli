import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMovieDetails, IMAGE_BASE_URL } from '../services/movieApi';
import { useFavourites } from '../context/FavouritesContext';

export default function MovieDetailsScreen({ route }) {
    const { isFavourite, toggleFavourite } = useFavourites();
    // Navigation se initial movie data milta hai
    const { movie: initialMovie } = route.params || {};

    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    // Runtime ko "2h 25m" format mein badalne ka helper
    const formatRuntime = (minutes) => {
        if (!minutes) return 'N/A';
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

    useEffect(() => {
        let isMounted = true;

        async function fetchFullDetails() {
            if (!initialMovie?.id) return;
            try {
                setLoading(true);
                const data = await getMovieDetails(initialMovie.id);
                if (isMounted) {
                    setDetails(data);
                }
            } catch (err) {
                console.log('Could not load full details:', err.message);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchFullDetails();

        return () => {
            isMounted = false;
        };
    }, [initialMovie?.id]);

    // Combined data: Details endpoint se ya initial params se fallback
    const movie = details || initialMovie || {};
    const isFav = isFavourite(movie.id);

    const backdropUrl = movie.backdrop_path
        ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
        : (movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null);

    const posterUrl = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : null;

    const releaseYear = movie.release_date
        ? movie.release_date.split('-')[0]
        : 'N/A';

    const rating = typeof movie.vote_average === 'number'
        ? movie.vote_average.toFixed(1)
        : 'N/A';

    return (
        <ScrollView style={styles.container} bounces={false}>
            {/* 1. Backdrop Wallpaper Banner */}
            <View style={styles.backdropContainer}>
                {backdropUrl ? (
                    <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
                ) : (
                    <View style={[styles.backdrop, styles.placeholderBackdrop]}>
                        <Ionicons name="film-outline" size={48} color="#475569" />
                    </View>
                )}
            </View>

            <View style={styles.content}>
                {/* 2. Header Info: Poster Thumbnail + Title + Metadata */}
                <View style={styles.headerRow}>
                    {posterUrl && (
                        <Image source={{ uri: posterUrl }} style={styles.posterThumbnail} />
                    )}
                    <View style={styles.headerInfo}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>{movie.title}</Text>

                            {/* Heart Toggle Button */}
                            <TouchableOpacity
                                style={[styles.favButton, isFav && styles.favButtonActive]}
                                onPress={() => toggleFavourite(movie)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={isFav ? 'heart' : 'heart-outline'}
                                    size={22}
                                    color={isFav ? '#ef4444' : '#ffffff'}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Meta Row: Rating, Year, Runtime */}
                        <View style={styles.metaRow}>
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingText}>⭐ {rating}</Text>
                            </View>
                            <Text style={styles.metaText}>{releaseYear}</Text>
                            {details?.runtime ? (
                                <Text style={styles.metaText}>⏱️ {formatRuntime(details.runtime)}</Text>
                            ) : null}
                        </View>
                    </View>
                </View>

                {/* 3. Genres Chips */}
                {details?.genres && details.genres.length > 0 && (
                    <View style={styles.genresContainer}>
                        {details.genres.map((g) => (
                            <View key={g.id} style={styles.genreChip}>
                                <Text style={styles.genreText}>{g.name}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* 4. Overview Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Storyline</Text>
                    <Text style={styles.overviewText}>
                        {movie.overview || 'No storyline synopsis available for this movie.'}
                    </Text>
                </View>

                {loading && (
                    <ActivityIndicator size="small" color="#38bdf8" style={{ marginTop: 16 }} />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    backdropContainer: {
        width: '100%',
        height: 220,
        backgroundColor: '#1e293b',
    },
    backdrop: {
        width: '100%',
        height: '100%',
    },
    placeholderBackdrop: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        marginTop: -40, // Poster backdrop ke upar thoda overlap karega
        marginBottom: 16,
    },
    posterThumbnail: {
        width: 90,
        height: 135,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#0f172a',
        backgroundColor: '#334155',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'flex-end',
        paddingBottom: 4,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        flex: 1,
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 8, // Heart button ke beech thoda gap
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    ratingBadge: {
        backgroundColor: '#38bdf820',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    ratingText: {
        color: '#38bdf8',
        fontSize: 12,
        fontWeight: 'bold',
    },
    metaText: {
        color: '#94a3b8',
        fontSize: 13,
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginVertical: 12,
    },
    genreChip: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    genreText: {
        color: '#e2e8f0',
        fontSize: 12,
        fontWeight: '500',
    },
    section: {
        marginTop: 12,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    overviewText: {
        color: '#94a3b8',
        fontSize: 14,
        lineHeight: 22,
    },
    favButton: {
        backgroundColor: '#1e293b',
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    favButtonActive: {
        backgroundColor: '#ef444420', // subtle transparent red background
        borderColor: '#ef444450',
    },
});
