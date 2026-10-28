import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { FavouritesProvider } from './src/context/FavouritesContext';

export default function App() {
  return (
    <View style={styles.root}>
      <FavouritesProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </FavouritesProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
