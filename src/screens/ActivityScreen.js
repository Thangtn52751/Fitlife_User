import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MapView, { UrlTile, Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import { startTracking, stopTracking, updateLocation } from '../redux/actions/stepActions';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRACKING_KEY = 'FITLIFE_TRACKING';

const ActivityScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isTracking, locations, distance, steps, calories } = useSelector(state => state.step);

  const locationWatcher = useRef(null);
  const mapRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);
  const [isLocationReady, setIsLocationReady] = useState(false);

  // Yêu cầu permission location (Android)
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
    // iOS mặc định được hỏi permission native
    return true;
  };

  // Lấy vị trí hiện tại 1 lần, dùng khi chưa tracking
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
        if (mapRef.current && mapReady) {
          mapRef.current.animateToRegion({
            ...loc,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      },
      err => {
        console.warn('Error getting location:', err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  // Chờ MapView mount
  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      if (!isTracking) {
        getCurrentLocation(); // Lấy vị trí nếu chưa tracking
      }
      resumeIfTracking(); // Resume nếu có tracking lưu trên AsyncStorage

      // Không clear watcher khi mất focus để giữ tracking liên tục
      return () => { };
    }, [isTracking])
  );

  // Đồng bộ bộ đếm thời gian chạy khi tracking
  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
      AsyncStorage.setItem(TRACKING_KEY, 'true');
    } else {
      clearInterval(timerRef.current);
      setSeconds(0);
      AsyncStorage.removeItem(TRACKING_KEY);
    }
    return () => clearInterval(timerRef.current);
  }, [isTracking]);

  // Resume tracking nếu lưu trên AsyncStorage
  const resumeIfTracking = async () => {
    const saved = await AsyncStorage.getItem(TRACKING_KEY);
    if (saved === 'true' && !isTracking) {
      start(true);
    }
  };

  // Bắt đầu tracking, clear watcher cũ nếu có
  const start = async (resumed = false) => {
    const granted = await requestLocationPermission();
    if (!granted) {
      Alert.alert('Permission denied', 'Cannot access location');
      return;
    }

    if (locationWatcher.current !== null) {
      Geolocation.clearWatch(locationWatcher.current);
      locationWatcher.current = null;
    }

    dispatch(startTracking());

    locationWatcher.current = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const loc = { latitude, longitude };
        dispatch(updateLocation(loc));
        setCurrentPosition(loc);
      },
      error => console.log('Location Error:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 1,
        interval: 1000,
        fastestInterval: 500,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  // Dừng tracking, clear watcher
  const stop = () => {
    if (locationWatcher.current !== null) {
      Geolocation.clearWatch(locationWatcher.current);
      locationWatcher.current = null;
    }
    dispatch(stopTracking());
  };

  // Zoom về vị trí hiện tại
  const zoomToCurrentLocation = () => {
    if (mapRef.current && currentPosition) {
      mapRef.current.animateToRegion({
        ...currentPosition,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  // Tự động zoom map khi vị trí mới cập nhật và map sẵn sàng
  useEffect(() => {
    if (mapReady && currentPosition && mapRef.current) {
      mapRef.current.animateToRegion({
        ...currentPosition,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [currentPosition, mapReady]);

  // Format hiển thị thời gian
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
        // LƯU Ý: KHÔNG set prop `region` để tránh khoá map
        >
          <UrlTile urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} flipY={false} />

          {locations.length > 0 && (
            <>
              <Marker coordinate={locations[0]} title="Bắt đầu" />
              <Polyline coordinates={locations} strokeColor="#00BFFF" strokeWidth={4} />
            </>
          )}

          <Marker coordinate={currentPosition} title="Vị trí hiện tại" pinColor="green" />
        </MapView>
      )}

      <TouchableOpacity style={styles.zoomButton} onPress={zoomToCurrentLocation}>
        <Text style={styles.zoomText}>🧭</Text>
      </TouchableOpacity>

      <View style={styles.stats}>
        <View style={styles.row}>
          <View style={styles.statBox}>
            <Text style={styles.label}>⏱ Thời gian</Text>
            <Text style={styles.value}>{formatTime(seconds)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.label}>🚶‍♂️ Bước</Text>
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
  zoomButton: {
    position: 'absolute',
    right: 16,
    bottom: 220,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 30,
    elevation: 4,
  },
  zoomText: { fontSize: 24 },
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
