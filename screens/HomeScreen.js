import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = (props) => {
  const navigation = useNavigation()
  useEffect(() => {
    if (!props.auth) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
    }
  }, [props.auth])
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})
