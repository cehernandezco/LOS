//Avoid warning message for AsyncStorage and setTimer
import { LogBox } from 'react-native'
LogBox.ignoreLogs(['Setting a timer'])
LogBox.ignoreLogs(['AsyncStorage'])

import { StatusBar } from 'expo-status-bar'
//Navigation component
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
//React native paper
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
//Screens
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import SplashScreen from './screens/SplashScreen'
import RegisterScreen from './screens/RegisterScreen'
//React
import React, { useState, useEffect } from 'react'

//firebase
import { firebaseConfig } from './FirebaseConfig'
import { initializeApp } from 'firebase/app'
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
} from 'firebase/auth'

import {
    initializeFirestore,
    setDoc,
    doc,
    addDoc,
    getDoc,
    collection,
    query,
    where,
    onSnapshot,
    updateDoc,
    arrayUnion,
    arrayRemove,
    increment,
    deleteDoc,
} from 'firebase/firestore'
import Signout from './components/Signout'

//Const Stack for the screen navigation
const Stack = createNativeStackNavigator()

const app = initializeApp(firebaseConfig)
const db = initializeFirestore(app, { useFetchStreams: false })
const FBauth = getAuth()

//Generl theme
const theme = {
    ...DefaultTheme,
    roundness: 6,
    colors: {
        ...DefaultTheme.colors,
        primary: '#3498db',
        accent: '#f1c40f',
    },
}

export default function App() {
    const [auth, setAuth] = useState(false)
    const [user, setUser] = useState()
    const [signupError, setSignupError] = useState()
    const [signinError, setSigninError] = useState()

    useEffect(() => {
        onAuthStateChanged(FBauth, (user) => {
            if (user) {
                setAuth(true)
                setUser(user)
            } else {
                setAuth(false)
                setUser(null)
            }
        })
    })

    const SignupHandler = (
        email,
        password,
        firstName,
        lastName,
        dob,
        phoneNumber
    ) => {
        setSignupError(null)
        createUserWithEmailAndPassword(FBauth, email, password)
            .then(() => {
                setDoc(doc(db, 'Users', FBauth.currentUser.uid), {
                    email: email,
                    firstname: firstName,
                    lastname: lastName,
                    dob: dob,
                    phoneNumber: phoneNumber,
                    admin: false,
                    guardian: false,
                    elderly: false,
                })

                setUser(FBauth.currentUser.user)
                setAuth(true)
            })
            .catch((error) => {
                setSignupError(error.code)
                setTimeout(() => {
                    setSignupError('')
                }, 3000)
            })
    }

    const SigninHandler = (email, password) => {
        signInWithEmailAndPassword(FBauth, email, password)
            .then(() => {
                setUser(FBauth.currentUser.user)
                setAuth(true)
                // console.log(FBauth.currentUser.uid)
            })
            .catch((error) => {
                const message = error.code.includes('/')
                    ? error.code.split('/')[1].replace(/-/g, ' ')
                    : error.code
                setSigninError(message)
                setTimeout(() => {
                    setSigninError('')
                }, 3000)
            })
    }

    const SignoutHandler = () => {
        signOut(FBauth)
            .then(() => {
                setAuth(false)
                setUser(null)
            })
            .catch((error) => console.log(error.code))
    }

    const resetPassword = (email) => {
        sendPasswordResetEmail(FBauth, email)
            .then(() => {
                setForgotPasswordSuccess('Email sent!')
                setTimeout(() => {
                    setForgotPasswordSuccess('')
                }, 3000)
            })
            .catch((error) => {
                setForgotPasswordError(error.code)
                setTimeout(() => {
                    setForgotPasswordError('')
                }, 3000)
            })
    }

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Splash"
                        options={{ headerShown: false }}
                    >
                        {(props) => (
                            <SplashScreen
                                {...props}
                                auth={auth}
                                error={signinError}
                                handler={SigninHandler}
                            />
                        )}
                    </Stack.Screen>
                    <Stack.Screen name="Login" options={{ headerShown: false }}>
                        {(props) => (
                            <LoginScreen
                                {...props}
                                auth={auth}
                                error={signinError}
                                handler={SigninHandler}
                            />
                        )}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Register"
                        options={{
                            headerTitle: 'Create Account',
                            headerTitleStyle: {
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: '#1A73E9',
                            },
                        }}
                    >
                        {(props) => (
                            <RegisterScreen
                                {...props}
                                user={user}
                                error={signupError}
                                handler={SignupHandler}
                            />
                        )}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Home"
                        options={{
                            headerShown: true,
                            headerTitle: 'Home',
                            headerRight: (props) => (
                                <Signout
                                    {...props}
                                    handler={SignoutHandler}
                                    user={user}
                                />
                            ),
                        }}
                    >
                        {(props) => <HomeScreen {...props} auth={auth} />}
                    </Stack.Screen>
                </Stack.Navigator>
                <StatusBar style="auto" />
            </NavigationContainer>
        </PaperProvider>
    )
}
