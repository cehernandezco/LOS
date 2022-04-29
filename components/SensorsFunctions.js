import React, { useEffect, useState, useMemo } from 'react'
import { StyleSheet, Text, View, Alert, Vibration } from 'react-native'
import {
    Accelerometer,
    Gyroscope,
    Barometer,
    Magnetometer,
    DeviceMotion,
} from 'expo-sensors'

const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
})
const setIntervalDrop = (index) => {
    if (DeviceMotion.isAvailableAsync()) {
        DeviceMotion.setUpdateInterval(index)
    }
}

const _slow = () => {
    Accelerometer.setUpdateInterval(1000)
    if (DeviceMotion.isAvailableAsync()) {
        DeviceMotion.setUpdateInterval(1000)
    }
}

const _fast = () => {
    Accelerometer.setUpdateInterval(16)
    if (DeviceMotion.isAvailableAsync()) {
        DeviceMotion.setUpdateInterval(16)
    }
}

const _subscribe = () => {
    if (DeviceMotion.isAvailableAsync()) {
        DeviceMotion.addListener((gravityData) => {
            if (
                Math.abs(gravityData.acceleration.x) > 15 ||
                Math.abs(gravityData.acceleration.y) > 15 ||
                Math.abs(gravityData.acceleration.z) > 15
            ) {
                Vibration.vibrate(1000)
            }
        })
    }
}

const _unsubscribe = () => {
    subscription && subscription.remove()
    setSubscription(null)
}

export { setIntervalDrop, _subscribe, _unsubscribe }
