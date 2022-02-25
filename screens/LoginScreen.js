import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, TextInput as TextInputCustom } from 'react-native-paper'
import Constants from 'expo-constants'
import { useNavigation } from '@react-navigation/native'

const LoginScreen = (props) => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loginText, setLoginText] = useState('LOGIN')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (props.auth === true) {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
        }
    }, [props.auth])

    const handleSignin = () => {
        if (email === '' || password === '') {
            setError('Please fill all fields')
            setTimeout(() => {
                setError('')
            }, 3000)
        } else {
            setTimeout(() => {
                setLoginText('LOGIN')
                setLoading(false)
            }, 3000)
            setLoginText('LOGGING IN...')
            setLoading(true)
            props.handler(email, password)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}></View>
            <View style={styles.signinArea}>
                <Text style={styles.signinTitle}>LOS LOGO</Text>
                <Text style={styles.error}>{error || props.error}</Text>
                <TextInputCustom
                    placeholder="Type email"
                    label="Email address"
                    mode="outlined"
                    autoComplete="email"
                    activeOutlineColor="#0071c2"
                    onChangeText={(text) => setEmail(text)}
                    style={styles.signinInput}
                />
                <TextInputCustom
                    style={styles.signinInput}
                    label="Password"
                    mode="outlined"
                    placeholder="Type Password"
                    secureTextEntry={true}
                    textContentType="password"
                    autoComplete="password"
                    activeOutlineColor="#0071c2"
                    onChangeText={(text) => setPassword(text)}
                />
                <View style={styles.forgotArea}>
                    <Text
                        style={styles.forgotPassword}
                        onPress={() => {
                            navigation.navigate('ForgotPassword')
                        }}
                    >
                        Forgot password?
                    </Text>
                </View>
            </View>

            <View style={styles.signinButtonArea}>
                <Button
                    style={styles.buttons}
                    accessibilityLabel="Login"
                    loading={loading}
                    mode="contained"
                    onPress={() => handleSignin()}
                >
                    {loginText}
                </Button>
                <Button
                    style={{ width: '70%' }}
                    color="#000"
                    accessibilityLabel="Register"
                    mode="outlined"
                    onPress={() => navigation.navigate('Register')}
                >
                    CREATE AN ACCOUNT
                </Button>
            </View>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#c7d8e6',
        alignItems: 'center',
        marginTop: Constants.statusBarHeight,
    },
    header: {
        flex: 1,
        backgroundColor: '#c7d8e6',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        maxHeight: '20%',
    },
    signinArea: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    signinTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 65,
    },
    signinInput: {
        width: '70%',
        paddingLeft: 10,
        marginBottom: 20,
    },
    signinButtonArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        maxHeight: '20%',
        marginTop: '20%',
    },
    buttons: {
        width: '70%',
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
    signinButton: {
        backgroundColor: '#1DC7DE',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        paddingTop: 8,
    },
    error: {
        color: 'red',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 8,
    },
    forgotPassword: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1A73E9',
    },
    forgotArea: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        width: '70%',
    },
})
