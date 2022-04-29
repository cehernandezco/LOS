import React, { useEffect, useState, useMemo, Component } from 'react'
import { StyleSheet, Text, View, Alert, Vibration } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView, ScrollView, Image } from 'react-native'
import {
    Button,
    IconButton,
    TextInput as TextInputCustom,
} from 'react-native-paper'
import Constants from 'expo-constants'
import {
    Accelerometer,
    Gyroscope,
    Barometer,
    Magnetometer,
    DeviceMotion,
} from 'expo-sensors'
import SensorView from '../components/SensorView'

const ElderlySensorsScreen = (props) => {
    const [email, setEmail] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [elderlyUsers, setElderlyUsers] = useState([])
    const navigation = useNavigation()

    const [subscription, setSubscription] = useState(null)

    const axis = ['x', 'y', 'z']
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    })
    
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
        setSubscription(
            Accelerometer.addListener((accelerometerData) => {
                //console.log(accelerometerData)
                setData(accelerometerData)
                //SensorView('Accelerometer', data)
            })
        )
        if (DeviceMotion.isAvailableAsync()) {
            DeviceMotion.addListener((gravityData) => {
                if (
                    Math.abs(gravityData.acceleration.x) > 15 ||
                    Math.abs(gravityData.acceleration.y) > 15 ||
                    Math.abs(gravityData.acceleration.z) > 15
                ) {
                    Vibration.vibrate(1000)
                    Alert.alert('We have detected a drop. Are you ok?')
                    console.log(gravityData)
                }
                //console.log(gravityData)
            })
        }
    }

    const _unsubscribe = () => {
        subscription && subscription.remove()
        setSubscription(null)
    }

    useEffect(() => {
        _subscribe()
        return () => _unsubscribe()
    }, [])

    useEffect(() => {
        if (!props.auth) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        } else {
            // console.log(props.user)
            if (!props.user.elderly && !props.user.guardian) {
                navigation.reset({ index: 0, routes: [{ name: 'SelectRole' }] })
                //navigation.navigate('SelectRole',{user: props.user})
            }
        }
    }, [props.auth])
    const { x, y, z } = data
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View>
                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={subscription ? _unsubscribe : _subscribe}
                            style={styles.button}
                        >
                            <Text>{subscription ? 'On' : 'Off'}</Text>
                        </Button>
                        <Button
                            onPress={_slow}
                            style={[styles.button, styles.middleButton]}
                        >
                            <Text>Slow</Text>
                        </Button>
                        <Button onPress={_fast} style={styles.button}>
                            <Text>Fast</Text>
                        </Button>
                    </View>
                </View>

                <View>
                    <Text style={styles.headline}>Accelerometer values</Text>
                    <Text style={styles.text}>
                        x: {x} y: {y} z: {z}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ElderlySensorsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        marginTop: Constants.statusBarHeight,

    },
    scrollView: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    logo: {
        width: 151,
        height: 75,
        marginBottom: '5%',
        marginTop: '5%',
    },
    emailArea: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    emailInput: {
        width: '85%',
        paddingLeft: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#ff6b15',
        marginBottom: 20,
    },
    buttonSearch: {
        backgroundColor: '#ff6b15',
        marginBottom: 20,
    },
    buttonSearchLabel: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 18,
    },
    elderlyList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
        overflow: 'hidden',
        marginBottom: 20,
        borderRadius: 6,
        borderColor: '#c1c1c1',
        borderWidth: 1,
    },
    elderlylistText: {
        padding: 10,
        fontSize: 18,
    },
    addButtonArea: {
        flexDirection: 'row',
        width: '85%',
        justifyContent: 'space-between',
    },
    buttonCancel: {
        backgroundColor: 'red',
    },
    buttonAdd: {
        backgroundColor: '#2D71B6',
    },
    buttonAddLabel: {
        paddingHorizontal: 30,
    },
})
