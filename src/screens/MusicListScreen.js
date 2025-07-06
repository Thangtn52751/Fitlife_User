import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function MusicListScreen() {
  const [songs, setSongs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('http://192.168.1.138:3000/songs/song')
      .then(res => {
        setSongs(res.data.data);
        setFiltered(res.data.data);
      });
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    setFiltered(
      songs.filter(song => song.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('PlayerScreen', { song: item })}>
      <Image source={{ uri: item.image }} style={styles.thumb} />
      <View style={styles.metaContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.artist}>{item.singer}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MUSIC</Text>
      <TextInput
        style={styles.search}
        placeholder="Search"
        placeholderTextColor="#999"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 40, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  search: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 10,
  },
  thumb: {
    width: 55,
    height: 55,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  metaContainer: {
    marginLeft: 14,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
  },
  artist: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});