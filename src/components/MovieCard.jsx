import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IMAGE_BASE_URL } from '../services/movieApi';
import { Ionicons } from '@expo/vector-icons';
import { useFavourites } from '../context/FavouritesContext';


function MovieCard({ movie }) {
    const navigation = useNavigation();
    const { isFavourite } = useFavourites();
    const isFav = isFavourite(movie.id);
    //poster url construct kar raha hoon fallback ke saath
    const imageUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : (movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster');
    //release year extract karne ke liye
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : (movie.release_year || 'No Release Date');
    //rating handle karne ke liye
    const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : (movie.rating || 'N/A');
    const handlePress = () => {
        navigation.navigate('MovieDetails', { movie });
    };
    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
            <Image
                source={{ uri: imageUrl }}
                style={styles.poster}
            />
            <View style={styles.info}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>
                        {movie.title}
                    </Text>
                    {/* Agar Favourite hai to Heart dikhega */}
                    {isFav && (
                        <Ionicons name="heart" size={18} color="#ef4444" style={styles.heartIcon} />
                    )}
                </View>

                <Text style={styles.year}>{releaseYear}</Text>

                <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {rating}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
export default React.memo(MovieCard);
//purane cards ka unnecessary re-rendering band karne ke liye
const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        overflow: 'hidden',
        alignItems: 'center',
        padding: 10,
    },
    poster: {
        width: 80,
        height: 120,
        borderRadius: 8,
        backgroundColor: '#334155', // Image load hone se pehle placeholder color
    },
    info: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 6,
    },
    heartIcon: {
        marginLeft: 4,
    },
    year: {
        color: '#94a3b8',
        fontSize: 14,
        marginBottom: 8,
    },
    ratingBadge: {
        backgroundColor: '#38bdf820', // light transparent blue
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    ratingText: {
        color: '#38bdf8',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

