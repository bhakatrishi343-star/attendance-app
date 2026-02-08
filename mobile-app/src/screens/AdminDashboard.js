import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';

const API_URL = 'http://172.17.4.156:3000';

export default function AdminDashboard({ navigation }) {
    const [attendanceList, setAttendanceList] = useState([]);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/attendance`);
            const data = await response.json();
            if (response.ok) {
                setAttendanceList(data);
            }
        } catch (error) {
            Alert.alert("Error", "Could not fetch records");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Admin Dashboard</Text>
            <Button title="Refresh" onPress={fetchAttendance} />

            <FlatList
                data={attendanceList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.text}>Name: {item.name}</Text>
                        <Text style={styles.text}>Roll No: {item.rollNo}</Text>
                        <Text style={styles.text}>Date: {item.date}</Text>
                        <Text style={styles.text}>Status: {item.status}</Text>
                        <Text style={{ fontSize: 12, color: 'gray' }}>Verified: {item.photoProof ? 'Yes (AI)' : 'No'}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: { padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8, elevation: 2 },
    text: { fontSize: 16 }
});
