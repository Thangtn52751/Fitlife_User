import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '../../redux/config';

export default function DiaryListScreen() {
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    // ✅ Đưa ra ngoài để dùng chung
    const fetchDiaries = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log('📦 Token:', token);

            if (!token) {
                console.warn('⚠️ Không tìm thấy token');
                return;
            }

            const res = await fetch(`${API_BASE_URL}/diaries`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const json = await res.json();
            console.log('📥 API response:', json);

            if (res.ok && json.success) {
                setDiaries(json.data || []);
            } else {
                console.error('❌ Server error:', json.message || json);
            }
        } catch (err) {
            console.error('❌ Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDiaries();
    }, [fetchDiaries]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchDiaries();
        }, [fetchDiaries])
    );

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;
    }

    return (
        <View style={styles.container}>
            {diaries.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>📭 Không có nhật ký</Text>
            ) : (
                <FlatList
                    data={diaries}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate('DiaryDetailScreen', { diaryId: item._id })
                            }
                        >
                            <Text style={styles.title}>{item.title}</Text>
                            <Text>{item.description}</Text>
                            <Text style={styles.frequency}>Tần suất: {item.frequency}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* ✅ FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateDiaryScreen')}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: 'white', flex: 1 },
    card: {
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f2f2f2',
    },
    title: { fontWeight: 'bold', fontSize: 16 },
    frequency: { fontStyle: 'italic', marginTop: 4 },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#4DA6FF',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});
