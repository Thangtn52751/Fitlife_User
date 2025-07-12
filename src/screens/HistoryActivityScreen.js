import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../redux/config';

const HistoryActivityScreen = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.auth.user); 

    useEffect(() => {
        if (!user || !user._id) {
            console.warn('Chưa có user hoặc user._id, không gọi API');
            return;
        }

        const fetchHistory = async () => {
            try {
                const [runRes, stepRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/runs/${user._id}`),
                    axios.get(`${API_BASE_URL}/steps/${user._id}`),
                ]);

                const runs = runRes.data;
                const steps = stepRes.data;

                const combined = runs.map(run => {
                    const matchedStep = steps.find(s =>
                        new Date(s.recordDate).toDateString() === new Date(run.startTime).toDateString()
                    );

                    return {
                        date: new Date(run.startTime).toLocaleDateString(),
                        time: `${new Date(run.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(run.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                        steps: matchedStep?.steps || 0,
                        distance: matchedStep?.distanceKm || run.totalDistanceKm || 0,
                        calories: matchedStep?.calories || 0,
                    };
                });

                setHistory(combined);
            } catch (err) {
                console.error('Error fetching history:', err?.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]); // ❗ Chỉ theo dõi user, không phải user._id


    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Step History</Text>
            {history.map((item, index) => (
                <View key={index} style={styles.card}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: 13.06,
                            longitude: 80.24,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                    />
                    <View style={styles.info}>
                        <Text>{item.date}</Text>
                        <Text>{item.time}</Text>
                        <Text>{item.steps} steps</Text>
                        <Text>{item.distance} km</Text>
                        <Text>{item.calories} kcal</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: '#fff' },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    card: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 20,
        overflow: 'hidden',
    },
    map: { width: '100%', height: 150 },
    info: { padding: 10 },
});

export default HistoryActivityScreen;
