import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
} from 'react-native'
import { Button, TextInput as TextInputCustom } from 'react-native-paper'
import Constants from 'expo-constants'
import { useNavigation } from '@react-navigation/native'

const ForgotPasswordScreen = (props) => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [resetText, setResetText] = useState('RESET')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        props.error
            ? Alert.alert('Error resetting password', props.error)
            : null
    }, [props.error])

    const resetPasswordHandler = () => {
        if (email === '') {
            Alert.alert(
                'Error resetting password',
                'Please fill in your email!'
            )
        } else {
            setTimeout(() => {
                setResetText('RESET')
                setLoading(false)
            }, 3000)
            setResetText('SENDING EMAIL...')
            setLoading(true)
            props.handler(email)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header} />
                <View style={styles.signinArea}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/los_logo.png')}
                    />
                    <TextInputCustom
                        placeholder="Type email"
                        label="Email address"
                        mode="outlined"
                        autoComplete="email"
                        activeOutlineColor="#0071c2"
                        onChangeText={(text) => setEmail(text)}
                        style={styles.signinInput}
                    />
                </View>

                <View style={styles.resetButtonArea}>
                    <Button
                        style={[styles.buttons, styles.resetButton]}
                        labelStyle={styles.resetText}
                        accessibilityLabel="Reset Password"
                        loading={loading}
                        mode="contained"
                        onPress={() => resetPasswordHandler()}
                    >
                        {resetText}
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        marginTop: Constants.statusBarHeight,
    },
    header: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        maxHeight: '13%',
    },
    signinArea: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    logo: {
        width: 320,
        height: 156,
        marginBottom: '5%',
        marginTop: '5%',
    },
    signinInput: {
        width: '85%',
        paddingLeft: 10,
        marginBottom: 20,
    },
    resetText: {
        color: '#FFF',
        fontSize: 18,
    },
    resetButtonArea: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginBottom: 20,
    },
    buttons: {
        width: '85%',
        height: 40,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    resetButton: {
        backgroundColor: '#2D71B6',
    },
    forgotPassword: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2D71B6',
    },
    forgotArea: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        width: '70%',
    },
    bottomArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
    },
    or: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        paddingHorizontal: 10,
    },
    orLine: {
        backgroundColor: '#000',
        height: 1,
        flex: 1,
    },
    socialButtonArea: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '85%',
        marginTop: 20,
    },
    socialButton: {
        marginBottom: 10,
    },
    socialButtonLabel: {
        fontSize: 18,
    },
})
