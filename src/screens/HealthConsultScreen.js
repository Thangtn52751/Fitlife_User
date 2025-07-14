import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_BASE_URL } from '../redux/config';

const HealthConsultScreen = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMsg = { sender: 'user', text: question };
    setConversation(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/consult`, {
        question,
      });

      const reply = res.data.reply || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.';
      const botMsg = { sender: 'bot', text: reply };
      setConversation(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = '⚠️ Lỗi kết nối. Vui lòng thử lại sau.';
      setConversation(prev => [...prev, { sender: 'bot', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {conversation.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}

        {loading && (
          <ActivityIndicator size="small" color="#4DB4E5" style={{ marginVertical: 10 }} />
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Nhập câu hỏi về sức khỏe..."
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default HealthConsultScreen;

const styles = StyleSheet.create({
  chatContainer: {
    padding: 16,
    paddingBottom: 80,
    marginTop: 70,
    

  },
  messageBubble: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#4DB4E5',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F1F1',
  },
  messageText: {
    color: '#000',
    fontSize: 14,
    marginBottom: 32
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    marginTop : 100
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4DB4E5',
    padding: 10,
    borderRadius: 50,
  },
});
