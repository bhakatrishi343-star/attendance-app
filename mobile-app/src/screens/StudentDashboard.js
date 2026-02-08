import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://172.17.4.156:3000';

export default function StudentDashboard({ route }) {
    const { user } = route.params;
    const [history, setHistory] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/api/attendance/history/${user.id}`);
            const data = await response.json();
            if (response.ok) {
                setHistory(data.history);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome, {user.name}</Text>
            <Text style={styles.subHeader}>Class: {user.classSection || 'N/A'}</Text>

            <View style={styles.actionArea}>
                <Button
                    title="Mark Attendance (Camera)"
                    onPress={() => navigation.navigate('Camera', { user, subject: 'General' })}
                />
            </View>

            <Text style={styles.sectionTitle}>Attendance History</Text>
            <FlatList
                data={history}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
                        <Text>Subject: {item.subject}</Text>
                        <Text style={[styles.status, { color: item.status === 'present' ? 'green' : 'red' }]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 22, fontWeight: 'bold' },
    subHeader: { fontSize: 16, marginBottom: 20, color: 'gray' },
    actionArea: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    card: { padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8, elevation: 2 },
    date: { fontWeight: 'bold' },
    status: { fontWeight: 'bold', marginTop: 5 }
});
