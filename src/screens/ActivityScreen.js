import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Button, PermissionsAndroid, Platform,
  StyleSheet, Alert
} from 'react-native';
import MapView, { UrlTile, Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import { startTracking, stopTracking, updateLocation } from '../redux/actions/stepActions';
import HistoryActivityScreen from './HistoryActivityScreen';

const ActivityScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isTracking, locations, distance, steps, calories } = useSelector(state => state.step);
  const locationWatcher = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 500); // đảm bảo mount xong
    return () => clearTimeout(timer);
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const start = async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      Alert.alert('Permission denied', 'Cannot access location');
      return;
    }

    dispatch(startTracking());

    locationWatcher.current = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        dispatch(updateLocation({ latitude, longitude }));
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

  const stop = () => {
    if (locationWatcher.current !== null) {
      Geolocation.clearWatch(locationWatcher.current);
    }
    dispatch(stopTracking());
  };

  const initialRegion = {
    latitude: locations[0]?.latitude || 21.0285,
    longitude: locations[0]?.longitude || 105.8542,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      {mapReady && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          region={
            locations.length > 0
              ? {
                ...locations[locations.length - 1],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
              : initialRegion
          }
        >
          <UrlTile
            urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />


          {locations.length > 0 && (
            <>
              <Marker coordinate={locations[0]} title="Start" />
              <Polyline coordinates={locations} strokeColor="#00BFFF" strokeWidth={4} />
            </>
          )}
        </MapView>
      )}

      <View style={styles.stats}>
        <Text>Steps: {steps}</Text>
        <Text>Distance: {(distance / 1000).toFixed(2)} km</Text>
        <Text>Calories: {calories} kcal</Text>
        <Button title={isTracking ? 'Stop' : 'Start'} onPress={isTracking ? stop : start} />
        <Button
          title="HistoryActivityScreen"
          onPress={() => navigation.navigate('HistoryActivityScreen')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  stats: {
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    marginBottom: 80,
  },
});

export default ActivityScreen;
