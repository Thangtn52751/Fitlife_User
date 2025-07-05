import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const AnalysisScreen = ({ navigation }) => {
  return (
    <View>
      <Text>AnalysisScreen</Text>
      <TouchableOpacity
        style={{ marginTop: 220, width: 40, height: 40, backgroundColor: '#3BB3FD', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
        onPress={() => navigation.navigate('WaterEntryScreen')}
      >
        <Text style={{ color: '#fff' }}>Go</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AnalysisScreen

const styles = StyleSheet.create({})