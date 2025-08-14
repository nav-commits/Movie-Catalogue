import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import type { Movie } from "../api/tmdb";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 20;

interface MovieCardProps {
  movie: Movie;
  onPress?: () => void;
}

export default function MovieCard({ movie, onPress }: MovieCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      {movie.poster_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}` }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.noImage]}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.subtitle}>⭐ {movie.vote_average.toFixed(1)}</Text>
        <Text style={styles.subtitle}>{movie.release_date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a", // dark card background
    borderRadius: 10,
    margin: 5,
    width: CARD_WIDTH,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  poster: {
    width: "100%",
    height: 200,
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333", 
  },
  noImageText: {
    color: "#ccc",
  },
  info: {
    padding: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff", 
  },
  subtitle: {
    fontSize: 12,
    color: "#aaa", 
    marginTop: 4,
  },
});
