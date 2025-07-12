// ActivityScreen.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, PermissionsAndroid, Platform, StyleSheet, Alert, TouchableOpacity
} from 'react-native';
import MapView, { UrlTile, Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import { startTracking, stopTracking, updateLocation, resetTracking } from '../redux/actions/stepActions';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRACKING_KEY = 'FITLIFE_TRACKING';

const ActivityScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isTracking, locations, distance, steps, calories } = useSelector(state => state.step);

  const locationWatcher = useRef(null);
  const mapRef = useRef(null);
  const timerRef = useRef(null);

  const [seconds, setSeconds] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isLocationReady, setIsLocationReady] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      return (
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      Alert.alert('Permission denied', 'Cannot access location');
      return;
    }

    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const loc = { latitude, longitude };
        setCurrentPosition(loc);
        setIsLocationReady(true);
        dispatch(updateLocation(loc));
      },
      err => console.warn('[getCurrentLocation] Error:', err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const checkSavedTracking = async () => {
        const saved = await AsyncStorage.getItem(TRACKING_KEY);
        console.log('[useFocusEffect] tracking key:', saved);

        if (saved === 'true') {
          if (!isTracking) start(true);
        } else {
          await getCurrentLocation();
        }

        // ✅ Zoom lại map khi quay lại nếu đã có vị trí
        if (mapRef.current && currentPosition) {
          mapRef.current.animateToRegion({
            ...currentPosition,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      };

      checkSavedTracking();
      return () => { };
    }, [isTracking, currentPosition])
  );

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);
      AsyncStorage.setItem(TRACKING_KEY, 'true');
    } else {
      clearInterval(timerRef.current);
      AsyncStorage.removeItem(TRACKING_KEY);
      getCurrentLocation();
    }
    return () => clearInterval(timerRef.current);
  }, [isTracking]);

  const start = async (resumed = false) => {
    const granted = await requestLocationPermission();
    if (!granted) return;

    if (locationWatcher.current !== null) {
      Geolocation.clearWatch(locationWatcher.current);
    }

    dispatch(startTracking(resumed));
    locationWatcher.current = Geolocation.watchPosition(
      position => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        dispatch(updateLocation(loc));
        setCurrentPosition(loc);
      },
      error => console.log('[watchPosition] Error:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 1,
        interval: 1000,
        fastestInterval: 500,
      }
    );
  };

  const stop = async () => {
    Alert.alert(
      'Dừng chạy',
      'Bạn có muốn tiếp tục sau không?',
      [
        {
          text: 'Tiếp tục sau',
          onPress: () => {
            if (locationWatcher.current !== null) {
              Geolocation.clearWatch(locationWatcher.current);
              locationWatcher.current = null;
            }
            AsyncStorage.setItem(TRACKING_KEY, 'true');
            dispatch(stopTracking());
          },
        },
        {
          text: 'Lưu và kết thúc',
          style: 'destructive',
          onPress: async () => {
            if (locationWatcher.current !== null) {
              Geolocation.clearWatch(locationWatcher.current);
              locationWatcher.current = null;
            }
            Geolocation.getCurrentPosition(
              pos => {
                const loc = {
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                };
                setCurrentPosition(loc);
                dispatch(updateLocation(loc));
                if (mapRef.current) {
                  mapRef.current.animateToRegion({
                    ...loc,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  });
                }
              },
              err => console.warn('[getCurrentPosition after stop] Error:', err),
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
            );
            await AsyncStorage.removeItem(TRACKING_KEY);
            dispatch(resetTracking());
            setSeconds(0);
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    let idleWatcher = null;
    const startIdleWatch = async () => {
      const granted = await requestLocationPermission();
      if (!granted) return;
      idleWatcher = Geolocation.watchPosition(
        pos => {
          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setCurrentPosition(loc);
        },
        err => console.warn('[idle watchPosition] Error:', err),
        {
          enableHighAccuracy: true,
          distanceFilter: 5,
          interval: 5000,
          fastestInterval: 3000,
        }
      );
    };

    if (!isTracking) {
      startIdleWatch();
    }

    return () => {
      if (idleWatcher !== null) {
        Geolocation.clearWatch(idleWatcher);
      }
    };
  }, [isTracking]);

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = secs => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.container}>
      {mapReady && isLocationReady && currentPosition && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            ...currentPosition,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <UrlTile urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.length > 0 && (
            <>
              <Marker coordinate={locations[0]} title="Bắt đầu" />
              <Polyline coordinates={locations} strokeColor="#00BFFF" strokeWidth={4} />
            </>
          )}
          <Marker coordinate={currentPosition} title="Vị trí hiện tại" pinColor="green" />
        </MapView>
      )}

      <View style={styles.stats}>
        <View style={styles.row}>
          <View style={styles.statBox}>
            <Text style={styles.label}>⏱ Thời gian</Text>
            <Text style={styles.value}>{formatTime(seconds)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.label}>🚶 Bước</Text>
            <Text style={styles.value}>{steps}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.label}>📏 Quãng đường</Text>
            <Text style={styles.value}>{(distance / 1000).toFixed(2)} km</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.label}>🔥 Calories</Text>
            <Text style={styles.value}>{calories} kcal</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={isTracking ? stop : () => start(false)}>
          <Text style={styles.buttonText}>{isTracking ? '⏹ Dừng' : '▶️ Bắt đầu'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#888' }]}
          onPress={() => navigation.navigate('HistoryActivityScreen')}
        >
          <Text style={styles.buttonText}>📜 Lịch sử hoạt động</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 100 },
  map: { flex: 1 },
  stats: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: { width: '48%', marginBottom: 12 },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  button: {
    backgroundColor: '#00BFFF',
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ActivityScreen;
