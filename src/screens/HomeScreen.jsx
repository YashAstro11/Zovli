import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    ActivityIndicator,
    Platform,
    StatusBar,
    TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import MovieCard from "../components/MovieCard";
import { getPopularMovies, IMAGE_BASE_URL } from "../services/movieApi";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFavourites } from "../context/FavouritesContext";


export default function HomeScreen() {
    const navigation = useNavigation();
    const { isFavourite, toggleFavourite } = useFavourites();
    const insets = useSafeAreaInsets();
    const topSpacing = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0) + 16;
    const isFetchingRef = useRef(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //pehli trending movie ko spotlight hero banner banayenge
    const featuredMovie = movies.length > 0 ? movies[0] : null;
    const isFav = featuredMovie?.id ? isFavourite(featuredMovie.id) : false;

    //baaki ki movie list mein aayengi taaki spotloght movie repeat na ho
    const listMovies = movies.length > 1 ? movies.slice(1) : [];
    const renderMovieCard = useCallback(({ item }) => (
        <MovieCard movie={item} />
    ), []);

    //nayi movies after every refresh
    const handleRefresh = async () => {
        try {
            console.log("Refresh");
            setRefreshing(true);
            setPage(1);
            const freshMovies = await getPopularMovies(1); // Page 1 dobara mangwayenge
            setMovies(freshMovies); // Purani list ko fresh list se replace karenge
            console.log("Refresh Done");
        } catch (err) {
            console.log("Refresh failed, keeping old movies:", err.message);
            // Notice: Humne movies ko [] khali nahi kiya, purani list safe rahegi!
        } finally {
            setRefreshing(false); // Spinner band karein
        }
    };

    //infine scrolling ke liye
    const loadNextPage = async () => {
        console.log("--> onEndReached triggered! Lock status:", isFetchingRef.current, "loadingMore:", loadingMore);
        // Agar pehle se fetching chal rahi hai to turant return ho jao
        if (isFetchingRef.current || loadingMore) return;

        try {
            isFetchingRef.current = true; // INSTANT LOCK (Synchronous)
            setLoadingMore(true);
            const nextPage = page + 1;
            console.log("Fetching Page:", nextPage);
            const nextMovies = await getPopularMovies(nextPage);

            if (nextMovies && nextMovies.length > 0) {
                // Purani list mein nayi movies jod dein
                setMovies((prev) => {
                    // Unique check: Duplicate IDs ko filter out karein
                    const existingIds = new Set(prev.map((m) => m.id));
                    const uniqueNew = nextMovies.filter((m) => !existingIds.has(m.id));
                    return [...prev, ...uniqueNew];
                });
                setPage(nextPage);
            }
        } catch (err) {
            console.log("Next page load failed:", err.message);
        } finally {
            setLoadingMore(false);
            isFetchingRef.current = false; // UNLOCK
        }
    };

    // API call function
    const loadMovies = async () => {
        try {
            console.log("API Call");
            setLoading(true);
            setError(null);
            console.log("Before API Call");
            const data = await getPopularMovies(1);
            setMovies(data);
            console.log("After API Call");
        } catch (err) {
            console.log("ERROR :API Call Failed");
            console.log(err);
            setError("Movies load nahi ho payi. Internet connection check karein.");
        } finally {
            setLoading(false);
        }
    };

    // Screen load hote hi pehli baar call hoga
    useEffect(() => {
        loadMovies();
    }, []);

    // 1. Loading State
    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#38bdf8" />
                <Text style={styles.loadingText}>Fetching trending movies...</Text>
            </View>
        );
    }

    // 2. Error State
    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadMovies}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderHeader = () => (
        <View>
            {/* Brand Header */}
            <View style={styles.brandHeader}>
                <View style={styles.brandTitleRow}>
                    <Image
                        source={require('../../assets/icon.png')}
                        style={styles.brandLogo}
                    />
                    <View>
                        <Text style={styles.brandTitle}>ZOVLI</Text>
                        <Text style={styles.brandTagline}>DISCOVER CINEMA</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.searchShortcut}
                    onPress={() => navigation.navigate('Search')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="search" size={20} color="#38bdf8" />
                </TouchableOpacity>
            </View>
            {/* Netflix-Style Hero Spotlight Banner */}
            {featuredMovie && (
                <TouchableOpacity
                    style={styles.heroBanner}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('MovieDetails', { movie: featuredMovie })}
                >
                    <Image
                        source={{
                            uri: featuredMovie.backdrop_path
                                ? `${IMAGE_BASE_URL}${featuredMovie.backdrop_path}`
                                : (featuredMovie.poster_path ? `${IMAGE_BASE_URL}${featuredMovie.poster_path}` : 'https://via.placeholder.com/500x280')
                        }}
                        style={styles.heroImage}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(15, 23, 42, 0.75)', '#0f172a']}
                        style={styles.heroGradient}
                    >
                        <View style={styles.heroBadgeRow}>
                            <View style={styles.spotlightBadge}>
                                <Ionicons name="sparkles" size={12} color="#f59e0b" style={{ marginRight: 4 }} />
                                <Text style={styles.spotlightText}>SPOTLIGHT</Text>
                            </View>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={12} color="#eab308" style={{ marginRight: 4 }} />
                                <Text style={styles.ratingText}>
                                    {typeof featuredMovie.vote_average === 'number'
                                        ? featuredMovie.vote_average.toFixed(1)
                                        : 'N/A'}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.heroTitle} numberOfLines={2}>
                            {featuredMovie.title}
                        </Text>
                        <View style={styles.heroActionRow}>
                            <View style={styles.heroExploreBtn}>
                                <Ionicons name="play" size={16} color="#0f172a" style={{ marginRight: 6 }} />
                                <Text style={styles.heroExploreText}>Explore Movie</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.heroFavBtn, isFav && styles.heroFavBtnActive]}
                                onPress={() => toggleFavourite(featuredMovie)}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={isFav ? 'heart' : 'heart-outline'}
                                    size={18}
                                    color={isFav ? '#ef4444' : '#ffffff'}
                                />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            )}
            {/* Trending Section Header */}
            <View style={styles.sectionHeader}>
                <Ionicons name="flame" size={20} color="#38bdf8" style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>Trending Movies</Text>
            </View>
        </View>
    );


    // 3. Success State: Movies FlatList
    return (
        <View style={[styles.container, { paddingTop: topSpacing }]}>
            <FlatList
                data={listMovies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMovieCard}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onEndReached={loadNextPage}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={
                    loadingMore ? (
                        <View style={styles.footerLoader}>
                            <ActivityIndicator size="small" color="#38bdf8" />
                            <Text style={styles.footerText}>Loading more...</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 24,
    },
    loadingText: {
        color: '#94a3b8',
        marginTop: 12,
        fontSize: 14,
    },
    errorText: {
        color: '#f87171',
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 24,
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#38bdf8',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: '#0f172a',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // 1. Zovli Brand Header Styles
    brandHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    brandTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandLogo: {
        width: 36,
        height: 36,
        borderRadius: 10,
        marginRight: 10,
    },
    brandTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 2,
    },
    brandTagline: {
        color: '#38bdf8',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    searchShortcut: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },

    // 2. Hero Spotlight Banner Styles
    heroBanner: {
        marginHorizontal: 16,
        borderRadius: 18,
        overflow: 'hidden',
        height: 240,
        marginBottom: 20,
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    heroGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        justifyContent: 'flex-end',
        padding: 16,
    },
    heroBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    spotlightBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.4)',
    },
    spotlightText: {
        color: '#f59e0b',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(234, 179, 8, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        color: '#eab308',
        fontSize: 11,
        fontWeight: 'bold',
    },
    heroTitle: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.9)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    heroActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroExploreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#38bdf8',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        marginRight: 10,
    },
    heroExploreText: {
        color: '#0f172a',
        fontWeight: 'bold',
        fontSize: 14,
    },
    heroFavBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#475569',
    },
    heroFavBtnActive: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#ef4444',
    },

    // 3. Section Header Styles
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    // 4. Footer Loader Styles
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 6,
    },
});
