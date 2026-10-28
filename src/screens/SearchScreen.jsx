import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../services/movieApi";

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Debounced Search Effect
    useEffect(() => {
        const trimmed = searchQuery.trim();

        // 1. Agar input khali ho gaya hai
        if (!trimmed) {
            setResults([]);
            setLoading(false);
            setError(null);
            setHasSearched(false);
            return;
        }

        setLoading(true);
        setError(null);
        setHasSearched(true);

        // Stale response protection flag
        let isCurrent = true;

        // 400ms ka debounce timer
        const timer = setTimeout(async () => {
            try {
                console.log("Debounced API Call for:", trimmed);
                const data = await searchMovies(trimmed, 1);

                // Agar ye request abhi bhi latest hai tabhi state update karunga
                if (isCurrent) {
                    setResults(data);
                }
            } catch (err) {
                if (isCurrent) {
                    setError("Search fail ho gayi. Internet check karein.");
                }
            } finally {
                if (isCurrent) {
                    setLoading(false);
                }
            }
        }, 400);

        // Cleanup: Naya letter type hone par purana timer cancel!
        return () => {
            clearTimeout(timer);
            isCurrent = false;
        };
    }, [searchQuery]);

    const handleClear = () => {
        setSearchQuery("");
        setResults([]);
        setHasSearched(false);
    };

    return (
        <View style={styles.container}>
            {/* Search Input Bar */}
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />

                <TextInput
                    style={styles.input}
                    placeholder="Search movies by title..."
                    placeholderTextColor="#64748b"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                )}
            </View>

            {/* 1. Loading Indicator */}
            {loading && (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#38bdf8" />
                    <Text style={styles.helperText}>Searching for "{searchQuery}"...</Text>
                </View>
            )}

            {/* 2. Error State */}
            {!loading && error && (
                <View style={styles.center}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
            )}

            {/* 3. Empty Results State */}
            {!loading && !error && hasSearched && results.length === 0 && (
                <View style={styles.center}>
                    <Ionicons name="alert-circle-outline" size={56} color="#475569" />
                    <Text style={styles.emptyTitle}>No movies found</Text>
                    <Text style={styles.helperText}>
                        We couldn't find anything for "{searchQuery}". Try a different title!
                    </Text>
                </View>
            )}

            {/* 4. Initial Screen (Search shuru nahi hua) */}
            {!loading && !hasSearched && (
                <View style={styles.center}>
                    <Ionicons name="film-outline" size={64} color="#334155" />
                    <Text style={styles.helperText}>
                        Find your favorite movies, actors, or genres
                    </Text>
                </View>
            )}

            {/* 5. Search Results List */}
            {!loading && !error && results.length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <MovieCard movie={item} />}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
        paddingTop: 44,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1e293b",
        marginHorizontal: 16,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: "#334155",
        marginBottom: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: "#ffffff",
        fontSize: 16,
        height: "100%",
    },
    clearButton: {
        padding: 4,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    emptyTitle: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 12,
    },
    helperText: {
        color: "#64748b",
        fontSize: 14,
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20,
    },
    errorText: {
        color: "#f87171",
        fontSize: 15,
        textAlign: "center",
    },
    listContent: {
        paddingBottom: 20,
    },
});
