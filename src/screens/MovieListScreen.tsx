import React, { useEffect, useState, useRef } from "react";
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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchPopularMovies, fetchUpcomingMovies, fetchGenres, Movie, Genre } from "../api/tmdb";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/appNavigator";
import MovieCard from "../components/MovieCard"; 

type Props = NativeStackScreenProps<RootStackParamList, "MovieList">;

const { width: screenWidth } = Dimensions.get('window');
const carouselItemWidth = screenWidth * 0.6;
const horizontalPadding = (screenWidth - carouselItemWidth) / 2;

export default function MovieListScreen({ navigation }: Props) {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [genreMap, setGenreMap] = useState<Map<number, string>>(new Map());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popularData, upcomingData, genreData] = await Promise.all([
          fetchPopularMovies(),
          fetchUpcomingMovies(),
          fetchGenres(),
        ]);
        setPopularMovies(popularData);
        setUpcomingMovies(upcomingData);
        const map = new Map<number, string>();
        genreData.forEach(genre => map.set(genre.id, genre.name));
        setGenreMap(map);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGenreString = (genreIds: number[]): string => {
    if (!genreIds || genreIds.length === 0) {
      return "Genre info not available";
    }
    const genres = genreIds.map(id => genreMap.get(id)).filter(Boolean);
    return genres.join(", ");
  };

  // Replaced onScroll with onViewableItemsChanged for more reliable active index tracking
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, 
  };

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

  const totalDots = 5;
  const popularMovieCount = popularMovies.length;
  let paginationStartIndex = 0;
  if (popularMovieCount > totalDots) {
    if (activeIndex > 2 && activeIndex < popularMovieCount - 2) {
      paginationStartIndex = activeIndex - 2;
    } else if (activeIndex >= popularMovieCount - 2) {
      paginationStartIndex = popularMovieCount - totalDots;
    }
  }
  const paginationDots = popularMovies.slice(paginationStartIndex, paginationStartIndex + totalDots);

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
          pagingEnabled
          data={popularMovies}
          renderItem={({ item, index }) => (
            // A container to hold both the movie card and its details
            <View style={styles.nowPlayingItemContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })}
                style={[
                  styles.nowPlayingCard,
                  {
                    // Apply a scale, rotate, and translateY transform
                    transform: [
                      { scale: index === activeIndex ? 1 : 0.85 },
                      { rotate: index < activeIndex ? '-10deg' : index > activeIndex ? '10deg' : '0deg' },
                      { translateY: index === activeIndex ? 0 : 50 }, 
                    ],
                  }
                ]}
              >
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  }}
                  style={styles.nowPlayingImage}
                />
              </TouchableOpacity>
              {index === activeIndex && (
                <View style={styles.nowPlayingDetails}>
                  <Text style={styles.nowPlayingTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.nowPlayingSubtitle} numberOfLines={1}>
                    {getGenreString(item.genre_ids)}
                  </Text>
                </View>
              )}
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.nowPlayingList,
            // Use horizontal padding to center the list items
            { paddingHorizontal: horizontalPadding }
          ]}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          snapToInterval={carouselItemWidth + 20}
          decelerationRate="fast"
        />
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {paginationDots.map((_, index) => (
            <View
              key={index + paginationStartIndex}
              style={[
                styles.paginationDot,
                index + paginationStartIndex === activeIndex && styles.activePaginationDot,
              ]}
            />
          ))}
        </View>

        {/* Coming Soon Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <TouchableOpacity onPress={() => console.log("See All tapped")}>
            <Text style={styles.viewAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={upcomingMovies}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })}
              horizontal={true}
            />
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
    marginTop: 60,
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
    borderRadius: 10.5,
    borderWidth: 2,
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
    // The paddingHorizontal is now dynamic and handled inline
  },
  nowPlayingItemContainer: {
    alignItems: 'center', 
    marginHorizontal: 10,
  },
  nowPlayingCard: {
    width: carouselItemWidth,
    height: 300, 
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  nowPlayingImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  nowPlayingDetails: {
    marginTop: 15, 
    alignItems: 'center', 
    width: carouselItemWidth,
  },
  nowPlayingTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    textAlign: 'center',
  },
  nowPlayingSubtitle: {
    color: "#999", 
    fontSize: 14,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30, 
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "#999",
  },
  activePaginationDot: {
    width: 16,
    backgroundColor: "#FFD700",
  },
  comingSoonList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});