import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { API_BASE_URL } from '../../redux/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DiaryDetailScreen({ route }) {
    const { diaryId } = route.params;
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTracks = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('Không tìm thấy token');

            const res = await fetch(`${API_BASE_URL}/diaries/${diaryId}/tracks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            setTracks(json.data || []);
        } catch (err) {
            console.error('❌ fetchTracks error:', err);
            Alert.alert('Lỗi', 'Không thể tải lịch sử');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTracks();
    }, [diaryId]);

    const handleTrack = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('Không tìm thấy token');

            const res = await fetch(`${API_BASE_URL}/diaries/${diaryId}/tracks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ completed: true }),
            });

            if (!res.ok) throw new Error('Lỗi ghi track');
            Alert.alert('✅', 'Đã đánh dấu hoàn thành!');
            fetchTracks(); // Reload
        } catch (err) {
            console.error('❌ handleTrack error:', err);
            Alert.alert('❌ Lỗi', err.message);
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#4DA6FF" />;

    return (
        <View style={styles.container}>
            {/* Nút ✅ */}
            <TouchableOpacity style={styles.completeButton} onPress={handleTrack}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Đánh dấu hoàn thành hôm nay</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Lịch sử hoàn thành</Text>

            <FlatList
                data={tracks}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.trackItem}>
                        <Text style={styles.dateText}>
                            {new Date(item.trackDate).toLocaleDateString('vi-VN')}
                        </Text>
                        <Text style={styles.statusText}>
                            {item.completed ? '✅ Đã hoàn thành' : '❌'}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
                        📭 Chưa có bản ghi nào
                    </Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        flex: 1,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4DA6FF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignSelf: 'center',
        marginBottom: 20,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
        fontWeight: '600',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
        color: '#333',
    },
    trackItem: {
        padding: 14,
        marginBottom: 8,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateText: {
        fontSize: 15,
        color: '#333',
    },
    statusText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
