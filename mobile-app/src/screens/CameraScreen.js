import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

const API_URL = 'http://172.17.4.156:3000';

export default function CameraScreen({ route, navigation }) {
    const { user, subject } = route.params;
    const [hasPermission, setHasPermission] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            uploadAttendance(photo);
        }
    };

    const uploadAttendance = async (photo) => {
        const formData = new FormData();
        formData.append('userId', user.id);
        formData.append('subject', subject);
        formData.append('date', new Date().toISOString().split('T')[0]);
        formData.append('photo', {
            uri: photo.uri,
            type: 'image/jpeg',
            name: 'attendance.jpg',
        });

        try {
            const response = await fetch(`${API_URL}/api/attendance/mark`, {
                method: 'POST',
                body: formData,
                headers: {
                    // Content-Type header must NOT be set manually for FormData
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Attendance failed');
            }

            let msg = 'Attendance Marked!';
            if (data.verification) {
                msg += `\nVerification Confidence: ${data.verification.confidence}%`;
            }
            Alert.alert("Success", msg);
            navigation.goBack();
        } catch (error) {
            console.log(error);
            Alert.alert("Error", error.message);
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.text}> SNAP </Text>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    buttonContainer: { flex: 1, backgroundColor: 'transparent', flexDirection: 'row', margin: 20, justifyContent: 'center' },
    button: { alignSelf: 'flex-end', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 50 },
    text: { fontSize: 18, marginBottom: 10, color: 'black' },
});
