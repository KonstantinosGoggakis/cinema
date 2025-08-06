import React, { useState, useContext, useEffect } from "react";
import { View } from "react-native";
import {
  TextInput,
  Button,
  Text,
  HelperText,
  useTheme,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { api } from "../utils/api";

export default function ReservationFormScreen({ route, navigation }) {
  const { cinema } = route.params;
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showMoviePicker, setShowMoviePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [seatNumbers, setSeatNumbers] = useState("");
  const [error, setError] = useState("");

  const onDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onTimeChange = (_, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  const reserve = async () => {
    // validate seat num
    if (!seatNumbers.trim()) {
      setError("Please enter seat numbers");
      return;
    }

    // validate movie sel
    if (!selectedMovie) {
      setError("Please select a movie");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = time.toTimeString().split(" ")[0];

    try {
      await api.post(
        "/reservations",
        {
          cinema_id: cinema.cinema_id,
          date: formattedDate,
          time: formattedTime,
          movie_id: selectedMovie.movie_id, // show the movies +
          seat_numbers: seatNumbers.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigation.navigate("Profile");
    } catch (e) {
      console.error("Reservation error:", e);
      setError("Reservation failed. Try again.");
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get(`/cinema/${cinema.cinema_id}/movies`);
        setMovies(res.data); // Expecting array of movie objects
      } catch (err) {
        console.error("Failed to load movies:", err);
        setError("Unable to load available movies");
      }
    };

    fetchMovies();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Reserve at {cinema.name}
      </Text>

      <Button
        onPress={() => setShowDatePicker(true)}
        mode="outlined"
        style={{ marginBottom: 10 }}
      >
        Select Date: {date.toDateString()}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Button
        onPress={() => setShowTimePicker(true)}
        mode="outlined"
        style={{ marginBottom: 10 }}
      >
        Select Time: {time.toTimeString().slice(0, 5)}
      </Button>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}

      <Button
        onPress={() => setShowMoviePicker(true)}
        mode="outlined"
        style={{ marginBottom: 10 }}
      >
        {selectedMovie ? `Movie: ${selectedMovie.title}` : "Select a Movie"}
      </Button>

      {/* Movie Picker Modal */}
      {showMoviePicker && (
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
            elevation: 5,
            position: "absolute",
            top: "30%",
            left: "10%",
            right: "10%",
            zIndex: 999,
          }}
        >
          <Text variant="titleMedium" style={{ marginBottom: 10 }}>
            Choose a Movie
          </Text>
          {movies.map((movie) => (
            <Button
              key={movie.movie_id}
              onPress={() => {
                setSelectedMovie(movie);
                setShowMoviePicker(false);
                setError("");
              }}
              mode="text"
              style={{ alignItems: "flex-start" }}
            >
              {movie.title}
            </Button>
          ))}
          <Button
            onPress={() => setShowMoviePicker(false)}
            mode="outlined"
            style={{ marginTop: 10 }}
          >
            Cancel
          </Button>
        </View>
      )}

      <TextInput
        label="Seat Numbers (e.g. A1, A2, B3)"
        value={seatNumbers}
        onChangeText={(text) => {
          setSeatNumbers(text);
          setError("");
        }}
        style={{ marginTop: 10 }}
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button mode="contained" onPress={reserve} style={{ marginTop: 15 }}>
        Submit Reservation
      </Button>
    </View>
  );
}
