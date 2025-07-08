import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Alert,
    TouchableOpacity
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const TestGPSScreen = () => {
    const [currentPosition, setCurrentPosition] = useState(null);
    const mapRef = useRef(null);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                ]);

                return (
                    granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                );
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const getCurrentLocation = async () => {
        const granted = await requestLocationPermission();
        if (!granted) {
            Alert.alert('Permission Denied', 'Cannot access location');
            return;
        }

        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const loc = { latitude, longitude };
                setCurrentPosition(loc);
                console.log('✅ Current location:', loc);

                if (mapRef.current) {
                    mapRef.current.animateToRegion({
                        ...loc,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }
            },
            error => {
                console.warn('❌ GPS Error:', error);
                Alert.alert('GPS Error', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000,
                forceRequestLocation: true,
            }
        );
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: currentPosition?.latitude || 21.0285,
                    longitude: currentPosition?.longitude || 105.8542,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                region={
                    currentPosition
                        ? {
                            ...currentPosition,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }
                        : undefined
                }
            >
                {currentPosition && (
                    <Marker coordinate={currentPosition} title="Vị trí hiện tại" />
                )}
            </MapView>

            <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
                <Text style={styles.buttonText}>📍 Lấy lại vị trí</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 , marginBottom: 60},
    map: { flex: 1 },
    button: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: '#00BFFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default TestGPSScreen;
