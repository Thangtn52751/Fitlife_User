import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const activities = [
  { name: 'Đọc Sách', icon: require('../img/book.png') },
  { name: 'Uống nước', icon: require('../img/image2.png'), highlight: true },
  { name: 'Thiền', icon: require('../img/image.png') },
  { name: 'BMI', icon: require('../img/bmi1.png'), target: 'Bmi' },
  { name: 'Nhật ký', icon: require('../img/bmi1.png'), target: 'DiaryListScreen' },
];

const MentalTrainingScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);

  const handlePress = (item) => {
    setSelected(item.name);
    if (item.target) {
      navigation.navigate(item.target);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn tập luyện tinh thần</Text>
      {activities.map((item, index) => {
        const isSelected = selected === item.name;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              isSelected ? styles.active : styles.default,
            ]}
            onPress={() => handlePress(item)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MentalTrainingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  default: {
    backgroundColor: '#FFE8DA',
  },
  active: {
    backgroundColor: '#BEEBFF',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

