import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, HelperText, useTheme, Chip } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../context/AuthContext';
import { api } from '../utils/api';

const seatRows = ['A', 'B', 'C', 'D'];
const seatNumbers = [1, 2, 3, 4, 5]; // Example 5 seats per row

export default function EditReservationScreen({ route, navigation }) {
    const { reservation } = route.params;
    const { token } = useContext(AuthContext);
    const theme = useTheme();

    const [date, setDate] = useState(new Date(reservation.date));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date(`1970-01-01T${reservation.time}`));
    const [showTimePicker, setShowTimePicker] = useState(false);
    
    // Convert seat_numbers string to array on init
    const initialSeats = reservation.seat_numbers ? reservation.seat_numbers.split(',') : [];
    const [selectedSeats, setSelectedSeats] = useState(initialSeats);
    
    const [error, setError] = useState('');

    const onDateChange = (_, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

    const onTimeChange = (_, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) setTime(selectedTime);
    };

    const toggleSeat = (seat) => {
        setError('');
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const update = async () => {
        if (selectedSeats.length === 0) {
            setError('Please select at least one seat');
            return;
        }

        const formattedDate = date.toISOString().split('T')[0];
        const formattedTime = time.toTimeString().split(' ')[0];
        const seatNumbersStr = selectedSeats.join(',');

        try {
            await api.put(`/reservations/${reservation.reservation_id}`, {
                date: formattedDate,
                time: formattedTime,
                seat_numbers: seatNumbersStr
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigation.navigate('Profile');
        } catch (err) {
            console.error('Update error:', err);
            setError('Update failed. Try again.');
        }
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
                Edit Reservation
            </Text>

            <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={{ marginBottom: 10 }}>
                Date: {date.toDateString()}
            </Button>
            {showDatePicker && (
                <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
            )}

            <Button onPress={() => setShowTimePicker(true)} mode="outlined" style={{ marginBottom: 10 }}>
                Time: {time.toTimeString().slice(0, 5)}
            </Button>
            {showTimePicker && (
                <DateTimePicker value={time} mode="time" is24Hour={true} display="default" onChange={onTimeChange} />
            )}

            <Text style={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold' }}>
                Select Seats:
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {seatRows.map(row =>
                    seatNumbers.map(num => {
                        const seatId = `${row}${num}`;
                        const selected = selectedSeats.includes(seatId);
                        return (
                            <Chip
                                key={seatId}
                                mode={selected ? 'flat' : 'outlined'}
                                selected={selected}
                                onPress={() => toggleSeat(seatId)}
                                style={{ marginBottom: 8 }}
                                textStyle={{ color: selected ? 'white' : undefined }}
                                selectedColor={theme.colors.primary}
                            >
                                {seatId}
                            </Chip>
                        );
                    })
                )}
            </View>

            <HelperText type="error" visible={!!error}>
                {error}
            </HelperText>

            <Button
                mode="contained"
                onPress={update}
                style={{ marginTop: 15 }}
                disabled={selectedSeats.length === 0}
            >
                Save Changes
            </Button>
        </ScrollView>
    );
}
