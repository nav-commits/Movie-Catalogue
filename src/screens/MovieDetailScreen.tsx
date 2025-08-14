import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  Movie,
  CastMember,
} from "../api/tmdb";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/appNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "MovieDetail">;

export default function MovieDetailScreen({ route, navigation }: Props) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder data for the Cinema section, as the TMDB API does not provide this information.
  // This would need to be replaced with a call to a dedicated cinema or ticketing API.
  const cinemas = [
    { id: 1, name: "HARTONO MALL CGV", distance: "4.53 KM", address: "1 Jl. Ring Road Utara Jl. Kaliwaru", logo: "https://via.placeholder.com/30" },
    { id: 2, name: "LIPPO PLAZJA JOGJA CINEPOLIS", distance: "5.1 KM", address: "Jl. Laksda Adisucipto", logo: "https://via.placeholder.com/30" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieDetails, movieCredits] = await Promise.all([
          fetchMovieDetails(movieId),
          fetchMovieCredits(movieId),
        ]);
        setMovie(movieDetails);
        setCast(movieCredits.cast);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>{error || "Movie not found."}</Text>
      </View>
    );
  }

  const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="bookmark-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailsCard}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.movieInfo}>{`${movieYear} • Adventure • 2h 28m`}</Text>
            <View style={styles.directorContainer}>
              <View>
                <Text style={styles.directorTitle}>Sutradara</Text>
                <Text style={styles.directorName}>Jon Watts</Text>
              </View>
              <TouchableOpacity style={styles.trailerButton}>
                <Ionicons name="play-circle" size={16} color="white" />
                <Text style={styles.trailerButtonText}>Watch trailer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.mainContent}>
          {/* Synopsis Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.synopsisText}>{movie.overview} <Text style={styles.readMore}>Read More</Text></Text>
          </View>

          {/* Cast Section - Now using dynamic API data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <FlatList
              horizontal
              data={cast}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.castCardHorizontal}>
                  <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.profile_path}` }} style={styles.castImageHorizontal} />
                  <View style={styles.castInfoHorizontal}>
                    <Text style={styles.castNameHorizontal}>{item.name}</Text>
                    <Text style={styles.castCharacterHorizontal}>{item.character}</Text>
                  </View>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castListHorizontal}
            />
          </View>

          {/* Cinema Section - Now with active state for the first card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cinema</Text>
            <FlatList
              data={cinemas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <View style={[styles.cinemaCard, index === 0 && styles.activeCinemaCard]}>
                  <View style={styles.cinemaDetails}>
                    <Text style={[styles.cinemaName, index === 0 && styles.activeCinemaName]}>{item.name}</Text>
                    <Text style={styles.cinemaAddress}>{`${item.distance} ${item.address}`}</Text>
                  </View>
                  <Image source={{ uri: item.logo }} style={styles.cinemaLogo} />
                </View>
              )}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
  },
  heroImage: {
    height: 250,
    justifyContent: "space-between",
    paddingTop: 10,
  },
  heroImageStyle: {
    opacity: 0.6,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsCard: {
    backgroundColor: '#1a1a1a', 
    padding: 30,
    marginHorizontal: 20,
    borderRadius: 20,
    bottom: -50,
    position: 'absolute',
    width: '90%',
  },
  movieTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  movieInfo: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 5,
  },
  directorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  directorTitle: {
    color: "#aaa",
    fontSize: 12,
  },
  directorName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  trailerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#1a1a1a', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  trailerButtonText: {
    color: "white", 
    marginLeft: 5,
    fontWeight: "bold",
  },
  mainContent: {
    marginTop: 60,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  synopsisText: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 20,
  },
  readMore: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  castListHorizontal: {
    paddingRight: 20,
  },
  castCardHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  castImageHorizontal: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  castInfoHorizontal: {
    width: 100,
  },
  castNameHorizontal: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  castCharacterHorizontal: {
    color: "#aaa",
    fontSize: 12,
  },
  cinemaCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  activeCinemaCard: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  cinemaDetails: {
    flex: 1,
  },
  cinemaName: {
    color: "#fff", 
    fontSize: 16,
    fontWeight: "bold",
  },
  activeCinemaName: {
    color: "#FFD700",
  },
  cinemaAddress: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
  },
  cinemaLogo: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
});