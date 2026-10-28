import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import MovieCard from "../components/MovieCard";
import { getPopularMovies } from "../services/movieApi";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
    const isFetchingRef = useRef(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // 3. Success State: Movies FlatList
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Ionicons name="flame" size={22} color="#38bdf8" style={{ marginRight: 8 }} />
                <Text style={styles.heading}>Trending Movies</Text>
            </View>
            <FlatList
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard movie={item} />}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onEndReached={loadNextPage}
                onEndReachedThreshold={0.5}
                render={renderMovieCard}
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        paddingTop: 44,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    listContent: {
        paddingBottom: 20,
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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 8,
    },
    heading: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
    },

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
