import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Platform,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MovieCard from '../components/MovieCard';
import { useFavourites } from '../context/FavouritesContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function FavouritesScreen() {
    const insets = useSafeAreaInsets();
    const topSpacing = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0) + 16;

    const { favourites, loadingFavourites } = useFavourites();

    // 1. Loading Storage State
    if (loadingFavourites) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#38bdf8" />
            </View>
        );
    }

    // 2. Empty State (Jab koi movie favourite na ho)
    if (favourites.length === 0) {
        return (
            <View style={[styles.container, styles.center]}>
                <Ionicons name="heart-dislike-outline" size={72} color="#334155" />
                <Text style={styles.emptyTitle}>No Favourites Yet</Text>
                <Text style={styles.emptySubtitle}>
                    Explore movies and tap the heart icon to save your favorites here. They will stay available even offline!
                </Text>
            </View>
        );
    }

    // 3. Saved Favourites List
    return (
        <View style={[styles.container, { paddingTop: topSpacing }]}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Ionicons name="bookmark" size={22} color="#38bdf8" style={{ marginRight: 8 }} />
                    <Text style={styles.heading}>Saved Movies</Text>
                </View>
                <Text style={styles.countBadge}>
                    {favourites.length} {favourites.length === 1 ? 'movie' : 'movies'}
                </Text>
            </View>


            <FlatList
                data={favourites}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard movie={item} />}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        color: '#64748b',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 12,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    heading: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    countBadge: {
        color: '#38bdf8',
        backgroundColor: '#38bdf820',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 20,
    },
});
