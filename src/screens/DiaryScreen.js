import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const dummyData = [
  { id: '1', title: 'My Memory #1', date: '09/07/2025', desc: 'This is my first memory.' },
  { id: '2', title: 'My Memory #2', date: '08/07/2025', desc: 'This is my second memory.' },
  { id: '3', title: 'My Memory #3', date: '07/07/2025', desc: 'This is my third memory.' },
];

const DiaryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Diary</Text>

      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DiaryEntry', { mode: 'edit', entry: item })}
          >
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.memoryTitle}>{item.title}</Text>
            <Text style={styles.desc} numberOfLines={1}>{item.desc}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('DiaryEntry', { mode: 'create' })}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default DiaryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#1E90FF', marginBottom: 10 },
  card: {
    backgroundColor: '#fcecec',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  date: { fontSize: 12, color: '#555' },
  memoryTitle: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  desc: { fontSize: 13, color: '#666', marginTop: 4 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#1E90FF',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
