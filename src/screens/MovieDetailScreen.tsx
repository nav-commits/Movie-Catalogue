import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { fetchMovieDetails, Movie } from "../api/tmdb";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/appNavigator";
import MovieCard from "../components/MovieCard";

type Props = NativeStackScreenProps<RootStackParamList, "MovieDetail">;


export default function MovieDetailScreen({ route }: Props) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovieDetails(movieId)
      .then(setMovie)
      .catch(() => setError("Failed to load movie details."))
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.center}>
        <Text>{error || "Movie not found."}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MovieCard
        movie={movie}
      />
      <View style={styles.details}>
        <Text style={styles.header}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
        <Text style={styles.header}>Release Date</Text>
        <Text>{movie.release_date}</Text>
        <Text style={styles.header}>Rating</Text>
        <Text>⭐ {movie.vote_average.toFixed(1)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  details: {
    width: "100%",
    marginTop: 20,
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 15,
  },
  overview: {
    fontSize: 16,
    textAlign: "justify",
    marginTop: 6,
  },
});
