import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { api } from '../utils/api';
import { Card, Button, Text, Snackbar, useTheme } from 'react-native-paper';

export default function ProfileScreen() {
    const { token, logout } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const navigation = useNavigation();
    const theme = useTheme();

    const load = () => {
        api
            .get('/user/reservations', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setReservations(res.data))
            .catch(err => {
                console.error('Failed to fetch reservations', err);
                setSnackbarMsg('Could not load reservations');
            });
    };

    useEffect(() => {
        load();
    }, []);

    const confirmDelete = (id) => {
        Alert.alert(
            'Cancel Reservation',
            'Are you sure you want to cancel this reservation?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: () => deleteReservation(id)
                }
            ]
        );
    };

    const deleteReservation = (id) => {
        api
            .delete(`/reservations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                setSnackbarMsg('Reservation cancelled');
                load();
            })
            .catch(() => setSnackbarMsg('Cancel failed'));
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
    const formatTime = (timeStr) => timeStr.slice(0, 5);

    return (
        <View style={{ padding: 10, flex: 1 }}>
            <Text variant="headlineMedium" style={{ marginBottom: 10, textAlign: 'center' }}>
                My Reservations
            </Text>
            <FlatList
                data={reservations}
                keyExtractor={(r) => r.reservation_id.toString()}
                renderItem={({ item }) => (
                    <Card mode="outlined" style={{ marginVertical: 8 }}>
                        <Card.Title
                            title={item.cinema_name}
                            subtitle={`Date: ${formatDate(item.date)} at ${formatTime(item.time)}`}
                        />
                        <Card.Content>
                            <Text>Seats: {item.seat_number}</Text>
                        </Card.Content>
                        <Card.Actions style={{ justifyContent: 'flex-end' }}>
                            <Button onPress={() => navigation.navigate('EditReservation', { reservation: item })}>
                                Edit
                            </Button>
                            <Button onPress={() => confirmDelete(item.reservation_id)} textColor={theme.colors.error}>
                                Cancel
                            </Button>
                        </Card.Actions>
                    </Card>
                )}
            />

            <Button onPress={logout} style={{ marginTop: 20 }} mode="contained" buttonColor={theme.colors.secondary}>
                Logout
            </Button>

            <Snackbar
                visible={!!snackbarMsg}
                onDismiss={() => setSnackbarMsg('')}
                duration={3000}
                style={{ backgroundColor: theme.colors.secondary }}
            >
                {snackbarMsg}
            </Snackbar>
        </View>
    );
}
