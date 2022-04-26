import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    Linking,
    Platform,
    Vibration,
} from 'react-native'
import { Button, TextInput as TextInputCustom } from 'react-native-paper'
import Constants from 'expo-constants'
import { useNavigation } from '@react-navigation/native'
import { AuthError } from 'expo-auth-session'
import Communications from 'react-native-communications'
import * as SMS from 'expo-sms'
import {
    Accelerometer,
    Gyroscope,
    Barometer,
    Magnetometer,
    DeviceMotion,
} from 'expo-sensors'

const ElderlyHomeScreen = (props) => {
    const navigation = useNavigation()
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(false)
    const [subscription, setSubscription] = useState(null)
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    })

    useEffect(() => {
        if (!props.auth) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        } else {
            _subscribe()
            _fast()
        }
    }, [props.auth])

    useEffect(() => {
        props.error ? Alert.alert('Error selecting a role ', props.error) : null
    }, [props.error])

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
        // console.log(props.user)
        setRole(props.user.elderly)
        if (role.length > 0)
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
    }, [role])

    const ButtonTitleText = (props) => {
        return (
            <View style={styles.viewButtonTitleContainer}>
                <Text style={styles.buttonLabelTitle}>{props.title}</Text>
                <Text style={styles.buttonLabelText}>{props.text}</Text>
            </View>
        )
    }
    const text = (phone) => {
        const isAvailable = SMS.isAvailableAsync()
        let now = new Date()
        const message = 'User: ' + props.user.firstname + ' '
        props.user.lastname +
            ' is requesting help at ' +
            now +
            ".\n\n This text has been sent from Loved One's Safety (LOS)"
        console.log('expo-sms')
        /*if(isAvailable){
            const { result } = await SMS.sendSMSAsync(
                [phone],
                message
            )
            console.log(result)
        }*/

        Communications.textWithoutEncoding(
            phone,
            'User: ' +
                props.user.firstname +
                ' is requesting help at ' +
                now +
                ".\n\n This text has been sent from Loved One's Safety (LOS)"
        )
    }
    const sendEmail = (email) => {
        let now = new Date()
        let elderName = props.user.firstname
        Communications.email(
            [
                'cehernandezco@gmail.com',
                'spike.ganush@gmail.com',
                'mazzavillanif@gmail.com',
            ],
            null,
            null,
            'URGENT! ' + elderName + ' is requesting help',
            'User: ' +
                elderName +
                ' is requesting help at ' +
                now +
                ".\n\n This email has been sent from Loved One's Safety (LOS)"
        )
    }
    const call = (phone) => {
        console.log('calling to :' + phone)
        Communications.phonecall(phone, false)

        /*
        let phoneNumber = phone
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${phone}`
        } else {
            phoneNumber = `tel:${phone}`
        }
        Linking.canOpenURL(phoneNumber)
            .then((supported) => {
                if (!supported) {
                    Alert.alert('Phone number is not available')
                } else {
                    return Linking.openURL(phoneNumber)
                }
            })
            .catch((err) => console.log(err))
        */
    }
    const helpAction = (action, to) => {
        switch (action) {
            case 'call':
                call(to)
                break
            case 'email':
                sendEmail(to)
                break
            case 'text':
                text(to)
                break
        }
    }
    const listOfGuardians = () => {
        Alert.alert('Not yet implemented ', 'Wait for it')
    }
    const goToSettings = () => {
        navigation.navigate('ElderlySensors', { user: props.user })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.signinArea}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/los_logo.png')}
                    />
                </View>

                <View style={styles.resetButtonArea}>
                    <Button
                        mode="contained"
                        labelStyle={[styles.helpButtonLabel]}
                        color="#000"
                        uppercase={false}
                        style={[styles.buttons, styles.helpButton]}
                        onPress={() => helpAction('call', '0406406567')}
                    >
                        HELP
                    </Button>
                    <Button
                        mode="contained"
                        labelStyle={[styles.buttonLabel]}
                        color="#000"
                        uppercase={false}
                        style={[styles.buttons]}
                        onPress={() => helpAction('text', '0406406567')}
                    >
                        TEXT 000
                    </Button>
                    <Button
                        mode="contained"
                        labelStyle={[styles.buttonLabel]}
                        color="#000"
                        uppercase={false}
                        style={[styles.buttons]}
                        onPress={() => helpAction('email', '0406406567')}
                    >
                        EMAIL GUARDIAN
                    </Button>
                    <Button
                        mode="contained"
                        labelStyle={[styles.buttonLabel]}
                        color="#000"
                        uppercase={false}
                        style={[styles.buttons]}
                        onPress={() => listOfGuardians()}
                    >
                        My LIST OF GUARDIANS
                    </Button>
                    <Button
                        mode="contained"
                        labelStyle={[styles.buttonLabel]}
                        color="#000"
                        uppercase={false}
                        style={[styles.buttons]}
                        onPress={() => goToSettings()}
                    >
                        SETTINGS
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ElderlyHomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',

        // marginTop: Constants.statusBarHeight,
    },
    scrollView: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 70,
    },
    signinArea: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    logo: {
        width: 120,
        height: 55,
        marginBottom: '15%',
        marginTop: '5%',
    },

    title: {
        color: '#000',
        fontSize: 24,
        paddingBottom: 20,
    },

    resetButtonArea: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginBottom: 20,
    },
    buttons: {
        width: '100%',
        height: 70,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#2D71B6',
        fontSize: 24,
    },
    viewButtonTitleContainer: {
        width: '85%',
        alignItems: 'flex-start',
        flexDirection: 'column',
    },
    buttonTitleContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    helpButtonLabel: {
        color: '#FFF',
        fontSize: 80,
    },
    helpButton: {
        backgroundColor: '#FF0000',
        height: 150,
        fontSize: 80,
    },
    iconButton: {
        width: 100,
        height: 80,
        margin: 5,
        marginTop: 10,
        marginLeft: 50,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: '400',
        color: '#FFF',
        borderWidth: 0,
    },
    buttonLabelTitle: {
        fontSize: 18,
        fontWeight: '400',
        color: '#FFF',
        borderWidth: 0,
    },
    buttonLabelText: {
        fontSize: 12,
        color: '#FFF',
        borderWidth: 0,
    },

    bottomArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
