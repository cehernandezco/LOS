import React, { useState, useEffect, Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Sensors from 'expo-sensors'
import { Button, TextInput as TextInputCustom } from 'react-native-paper'

export default (sensorName, values) => {
    const { x, y, z } = values
    return (
        <View style={styles.container}>
            <Text style={styles.headline}>{sensorName} values</Text>
            <Text style={styles.text}>
                x: {x} y: {y} z: {z}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginTop: 50,
    },
    headline: {
        fontSize: 30,
        textAlign: 'left',
        margin: 10,
    },
    valueContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    valueValue: {
        width: 200,
        fontSize: 20,
    },
    valueName: {
        width: 50,
        fontSize: 20,
        fontWeight: 'bold',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
})
