import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const HomeScreen = ({navigation}) => {
  return (
    <View>
      <Text>HomeScreen</Text>
       <TouchableOpacity
        style={{ marginTop: 220, width: 40, height: 40, backgroundColor: '#3BB3FD', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
        onPress={() => navigation.navigate('MusicListScreen')}
      >
        <Text style={{ color: '#fff' }}>Go</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})