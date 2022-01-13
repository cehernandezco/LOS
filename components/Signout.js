import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Signout = (props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => props.handler()}>
      <Text style={styles.text}>Sign Out</Text>
    </TouchableOpacity>
  )
}

export default Signout

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f44336',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    margin: 10,
    width: 150,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
