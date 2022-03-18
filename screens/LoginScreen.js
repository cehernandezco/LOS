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

const LoginScreen = (props) => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginText, setLoginText] = useState('LOG IN')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [facebookLoading, setFacebookLoading] = useState(false)

    useEffect(() => {
        if (props.auth && !props.user) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'RegisterGoogle' }],
            })
        } else if (props.auth) {
            if (props.user.elderly) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'ElderlyHome' }],
                })
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'GuardianHome' }],
                })
            }
        }
    }, [props.auth])

    useEffect(() => {
        props.error ? Alert.alert('Error Login', props.error) : null
    }, [props.error])

    const handleSignin = () => {
        if (email === '' || password === '') {
            Alert.alert('Error Login', 'Please fill all fields!')
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
                </View>

                <View style={styles.signinButtonArea}>
                    <Button
                        style={[styles.buttons, styles.signinButton]}
                        labelStyle={styles.signinText}
                        accessibilityLabel="Login"
                        loading={loading}
                        mode="contained"
                        onPress={() => handleSignin()}
                    >
                        {loginText}
                    </Button>
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

                <View style={styles.bottomArea}>
                    <View style={styles.orArea}>
                        <View style={styles.orLine} />
                        <Text style={styles.or}>OR</Text>
                        <View style={styles.orLine} />
                    </View>
                    <View style={styles.socialButtonArea}>
                        <Button
                            mode="contained"
                            labelStyle={[styles.socialButtonLabel]}
                            color="#000"
                            uppercase={false}
                            style={[styles.socialButton, styles.signinButton]}
                            icon={require('../assets/facebook.png')}
                            loading={facebookLoading}
                            onPress={() => {
                                setFacebookLoading(true)
                                props.facebookLogin()
                            }}
                        >
                            Continue with Facebook
                        </Button>
                        <Button
                            mode="contained"
                            labelStyle={styles.socialButtonLabel}
                            color="#000"
                            uppercase={false}
                            style={[
                                styles.socialButton,
                                styles.signinButton,
                                { paddingRight: 24 },
                            ]}
                            icon={require('../assets/google.png')}
                            loading={googleLoading}
                            onPress={() => {
                                setGoogleLoading(true)
                                props.googleLogin()
                            }}
                        >
                            Continue with Google
                        </Button>
                    </View>
                </View>

                <Button
                    style={{
                        width: '100%',
                    }}
                    mode="text"
                    uppercase={false}
                    color="#000"
                    accessibilityLabel="Register"
                    onPress={() => navigation.navigate('Register')}
                >
                    Don't have an account? Sign up.
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LoginScreen

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
    signinText: {
        color: '#FFF',
        fontSize: 18,
    },
    signinButtonArea: {
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
    signinButton: {
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
