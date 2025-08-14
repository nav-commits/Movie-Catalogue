import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Import the new fetchUpcomingMovies function
import { fetchPopularMovies, fetchUpcomingMovies, Movie } from "../api/tmdb";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/appNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "MovieList">;

export default function MovieListScreen({ navigation }: Props) {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popularData, upcomingData] = await Promise.all([
          fetchPopularMovies(),
          fetchUpcomingMovies(),
        ]);
        setPopularMovies(popularData);
        setUpcomingMovies(upcomingData);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.screen}>
        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <View>
            <Text style={styles.welcomeText}>Welcome Khadafi 👋</Text>
            <Text style={styles.subtitleText}>Let’s relax and watch a movie.</Text>
          </View>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={styles.userImage}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movie, cinema, genre..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Now Playing Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Now Playing</Text>
          <TouchableOpacity onPress={() => console.log("See All tapped")}>
            <Text style={styles.viewAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={popularMovies}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })}
              style={styles.nowPlayingCard}
            >
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                }}
                style={styles.nowPlayingImage}
              />
              <View style={styles.nowPlayingTextOverlay}>
                <Text style={styles.nowPlayingTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.nowPlayingSubtitle}>
                  Genre info not available
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nowPlayingList}
        />

        {/* Coming Soon Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <TouchableOpacity onPress={() => console.log("See All tapped")}>
            <Text style={styles.viewAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={upcomingMovies} // Now using the data from the API call
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })}
              style={styles.comingSoonCard}
            >
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                }}
                style={styles.comingSoonImage}
              />
              <View style={styles.comingSoonDetails}>
                <Text style={styles.comingSoonTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.comingSoonSubtitle}>
                  Genre info not available
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.comingSoonList}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "#FFD700",
    fontSize: 16,
  },
  greetingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 50,
    marginBottom: 20,
  },
  welcomeText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
  subtitleText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  viewAll: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
  nowPlayingList: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  nowPlayingCard: {
    width: 250,
    height: 380,
    marginRight: 15,
    borderRadius: 20,
    overflow: "hidden",
  },
  nowPlayingImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  nowPlayingTextOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  nowPlayingTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  nowPlayingSubtitle: {
    color: "#ddd",
    fontSize: 14,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  comingSoonList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  comingSoonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 15,
    padding: 10,
    marginRight: 15,
  },
  comingSoonImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  comingSoonDetails: {
    flex: 1,
  },
  comingSoonTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  comingSoonSubtitle: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
  },
});