import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const DiaryEntryScreen = ({ route, navigation }) => {
  const { mode, entry } = route.params || {};
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (mode === 'edit' && entry) {
      setTitle(entry.title);
      setDate(entry.date);
      setContent(entry.desc);
    } else {
      const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      setDate(today);
    }
  }, []);

  const handleSave = () => {
    console.log('Saved:', { title, date, content });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>
          {mode === 'edit' ? 'Edit Diary Entry' : 'New Diary Entry'}
        </Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter a title..."
          style={styles.input}
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          value={date}
          editable={false}
          style={[styles.input, styles.disabled]}
        />

        <Text style={styles.label}>Your Thoughts</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Write your thoughts here..."
          multiline
          style={[styles.input, styles.textarea]}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DiaryEntryScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E90FF',
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#f0f4f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  disabled: {
    color: '#777',
  },
  textarea: {
    height: 180,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
