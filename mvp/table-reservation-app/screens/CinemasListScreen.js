import React, { useEffect, useState, useContext } from 'react';
import { FlatList, View } from 'react-native';
import { TextInput, Card, Button, Text, useTheme } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { api } from '../utils/api';

export default function CinemaListScreen({ navigation }) {
    const [cinemas, setCinema] = useState([]);
    const [query, setQuery] = useState('');
    const { token, logout } = useContext(AuthContext);
    const theme = useTheme();

    useEffect(() => {
        api.get('/cinema', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setCinema(res.data))
            .catch(console.error);
    }, [token]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Button onPress={() => navigation.navigate('Profile')}>Profile</Button>
                    <Button onPress={logout} textColor={theme.colors.error}>Logout</Button>
                </View>
            )
        });
    }, [navigation, logout, theme.colors.error]);

    const filtered = cinemas.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.location.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <View style={{ padding: 10, flex: 1 }}>
            <Text variant="headlineMedium" style={{ marginBottom: 10, textAlign: 'center' }}>Cinemas & Movies</Text>
            <TextInput
                label="Search by name or location"
                value={query}
                onChangeText={setQuery}
                style={{ marginBottom: 12 }}
            />
            <FlatList
                data={filtered}
                keyExtractor={item => item.cinema_id.toString()}
                renderItem={({ item }) => (
                    <Card mode="outlined" style={{ marginBottom: 10 }}>
                        <Card.Title title={item.name} subtitle={item.location} />
                        <Card.Content>
                            <Text style={{ marginBottom: 8 }}>{item.description}</Text>
                            <Button onPress={() => navigation.navigate('Reservation', { cinema: item })}>
                                Make Reservation
                            </Button>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
}
