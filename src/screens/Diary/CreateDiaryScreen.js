import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../redux/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CreateDiaryScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const navigation = useNavigation();

    const onSubmit = async () => {
        if (!title.trim()) {
            return Alert.alert('⚠️ Vui lòng nhập tiêu đề.');
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('Không tìm thấy token');

            const res = await fetch(`${API_BASE_URL}/diaries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    frequency,
                    startDate,
                    endDate,
                }),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message || 'Lỗi tạo nhật ký');

            Alert.alert('✅ Thành công', 'Đã tạo nhật ký mới!');
            navigation.goBack();
        } catch (err) {
            console.error('❌ Diary create error:', err);
            Alert.alert('Lỗi', err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>📔 Tiêu đề *</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Nhập tiêu đề"
            />

            <Text style={styles.label}>📝 Mô tả</Text>
            <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                multiline
                value={description}
                onChangeText={setDescription}
                placeholder="Nội dung ngắn..."
            />

            <Text style={styles.label}>⏱️ Tần suất</Text>
            <View style={styles.freqRow}>
                {['daily', 'weekly', 'monthly'].map(opt => (
                    <TouchableOpacity
                        key={opt}
                        style={[
                            styles.freqBtn,
                            frequency === opt && styles.freqBtnSelected,
                        ]}
                        onPress={() => setFrequency(opt)}
                    >
                        <Text
                            style={[
                                styles.freqText,
                                frequency === opt && styles.freqTextSelected,
                            ]}
                        >
                            {opt === 'daily'
                                ? 'Hàng ngày'
                                : opt === 'weekly'
                                    ? 'Hàng tuần'
                                    : 'Hàng tháng'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>📅 Ngày bắt đầu</Text>
            <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowStartPicker(true)}
            >
                <Ionicons name="calendar-outline" size={18} color="#555" />
                <Text style={styles.dateText}>
                    {startDate.toLocaleDateString()}
                </Text>
            </TouchableOpacity>
            {showStartPicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                        setShowStartPicker(false);
                        if (date) setStartDate(date);
                    }}
                />
            )}

            <Text style={styles.label}>📅 Ngày kết thúc (tùy chọn)</Text>
            <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowEndPicker(true)}
            >
                <Ionicons name="calendar-outline" size={18} color="#555" />
                <Text style={styles.dateText}>
                    {endDate ? endDate.toLocaleDateString() : 'Chưa chọn'}
                </Text>
            </TouchableOpacity>
            {showEndPicker && (
                <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                        setShowEndPicker(false);
                        if (date) setEndDate(date);
                    }}
                />
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
                <Text style={styles.submitText}>📌 Tạo nhật ký</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff', flex: 1 },
    label: {
        marginTop: 16,
        marginBottom: 6,
        fontWeight: 'bold',
        color: '#333',
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 10,
        fontSize: 15,
    },
    freqRow: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 8,
    },
    freqBtn: {
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    freqBtnSelected: {
        backgroundColor: '#4DA6FF',
        borderColor: '#4DA6FF',
    },
    freqText: {
        color: '#333',
        fontSize: 13,
    },
    freqTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    dateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 15,
        color: '#333',
    },
    submitBtn: {
        marginTop: 30,
        backgroundColor: '#4DA6FF',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
