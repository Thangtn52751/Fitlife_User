import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        'http://10.0.2.2:3000/api/notifications/user/665f1234abcde6789abcde12'
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = (item, index) => {
    const isToday = new Date(item.sentAt).toDateString() === new Date().toDateString();
    const time = new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View key={index} style={styles.card}>
        <View style={[styles.bar, { backgroundColor: getColor(item.category) }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </View>
        <Text style={styles.time}>{time}</Text>
      </View>
    );
  };

  const getColor = (type) => {
    switch (type) {
      case 'reminder':
        return '#FFA500';
      case 'health':
        return '#888';
      case 'exercise':
        return '#4DB4E5';
      default:
        return '#CCC';
    }
  };

  const todayNotifications = notifications.filter(n =>
    new Date(n.sentAt).toDateString() === new Date().toDateString()
  );

  const yesterdayNotifications = notifications.filter(n =>
    new Date(n.sentAt).toDateString() ===
    new Date(Date.now() - 86400000).toDateString()
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back-outline" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thông báo</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4DB4E5" />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {yesterdayNotifications.length > 0 && (
            <>
              <Text style={styles.dateLabel}>Hôm Qua</Text>
              {yesterdayNotifications.map(renderItem)}
            </>
          )}

          {todayNotifications.length > 0 && (
            <>
              <Text style={styles.dateLabel}>Hôm Nay</Text>
              {todayNotifications.map(renderItem)}
            </>
          )}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Tùy chỉnh thông báo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: { fontSize: 18, fontWeight: 'bold' },

  content: { padding: 16 },
  dateLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#F1F4F9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    width: 4,
    height: '100%',
    marginRight: 10,
    borderRadius: 2,
  },
  title: { fontWeight: 'bold', fontSize: 14 },
  body: { fontSize: 12, color: '#555' },
  time: { fontSize: 12, color: '#888', marginLeft: 10 },

  button: {
    margin: 16,
    backgroundColor: '#4DB4E5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#4DB4E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default NotificationScreen;
