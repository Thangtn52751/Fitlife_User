import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchExerciseHistory } from './service/historyService';
import { useSelector } from 'react-redux';

const ExerciseHistoryScreen = ({ navigation }) => {
    const [history, setHistory] = useState([]);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user._id) {
                console.warn('⚠️ Không có user._id, không thể tải lịch sử.');
                return;
            }

            try {
                const res = await fetchExerciseHistory(user._id);
                setHistory(res);
            } catch (error) {
                console.error('❌ Lỗi khi tải lịch sử:', error);
            }
        };

        fetchData();
    }, [user]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => {
                // Có thể điều hướng tới chi tiết video nếu muốn
            }}
        >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.subtitle}>
                    🕒 {item.duration} phút {'   '}
                    📅 {new Date(item.timestamp).toLocaleDateString('vi-VN')} - {new Date(item.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={26} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🧾 Lịch sử tập luyện</Text>
                <View style={{ width: 26 }} />
            </View>

            <FlatList
                data={history}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>🤷‍♂️ Bạn chưa có bài tập nào trong lịch sử</Text>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb'
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#e5e7eb'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827'
    },
    listContainer: {
        padding: 16
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 3 // Android shadow
    },
    thumbnail: {
        width: 90,
        height: 64,
        borderRadius: 10,
        backgroundColor: '#e5e7eb'
    },
    info: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center'
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937'
    },
    subtitle: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 6
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 14,
        color: '#9ca3af'
    }
});

export default ExerciseHistoryScreen;
