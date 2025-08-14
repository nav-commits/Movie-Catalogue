import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MovieListScreen from "../screens/MovieListScreen";
import MovieDetailScreen from "../screens/MovieDetailScreen";

export type RootStackParamList = {
  MovieList: undefined;
  MovieDetail: { movieId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MovieList"
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="MovieList" component={MovieListScreen} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
    </Stack.Navigator>
  );
}
