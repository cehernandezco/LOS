//Avoid warning message for AsyncStorage and setTimer
import { LogBox, Platform } from 'react-native'
LogBox.ignoreLogs([
    `AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage`,
])
LogBox.ignoreLogs(['Linking requires a build-time setting'])

LogBox.ignoreLogs(['Setting a timer'])

import { StatusBar } from 'expo-status-bar'
//Navigation component
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
//React native paper
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
//Expo notification
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
//Screens
import GuardianHomeScreen from './screens/GuardianHomeScreen'
import LoginScreen from './screens/LoginScreen'
import SplashScreen from './screens/SplashScreen'
import RegisterScreen from './screens/RegisterScreen'
import RegisterGoogleScreen from './screens/RegisterGoogleScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import SelectRoleScreen from './screens/SelectRoleScreen'
import ElderlyHomeScreen from './screens/ElderlyHomeScreen'
import ListOfGuardiansScreen from './screens/ListOfGuardiansScreen'
//React
import React, { useState, useEffect, useRef } from 'react'
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
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithCredential,
} from 'firebase/auth'
import {
    arrayUnion,
    arrayRemove,
    collection,
    initializeFirestore,
    setDoc,
    query,
    doc,
    getDoc,
    updateDoc,
    where,
    onSnapshot,
} from 'firebase/firestore'
//Google signin
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
//Facebook signin
import * as Facebook from 'expo-auth-session/providers/facebook'
import { ResponseType } from 'expo-auth-session'
//Auth functions

WebBrowser.maybeCompleteAuthSession()

//Signout module
import Signout from './components/Signout'
import ElderlySensorsScreen from './screens/ElderlySensorsScreen'

//Const Stack for the screen navigation
const Stack = createNativeStackNavigator()
//Firebase initialization
const app = initializeApp(firebaseConfig)
const db = initializeFirestore(app, { useFetchStreams: false })
const FBauth = getAuth()

//General theme
const theme = {
    ...DefaultTheme,
    roundness: 6,
    colors: {
        ...DefaultTheme.colors,
        primary: '#3498db',
        accent: '#f1c40f',
    },
}

//Notifications

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
})

async function registerForPushNotificationsAsync() {
    let token
    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!')
            return
        }
        token = (await Notifications.getExpoPushTokenAsync()).data
        console.log(token)
    } else {
        alert('Must use physical device for Push Notifications')
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }

    return token
}

export default function App() {
    const [auth, setAuth] = useState(false)
    const [user, setUser] = useState()
    const [guardianUser, setGuardianUser] = useState()
    const [guardianUserAccepted, setGuardianUserAccepted] = useState()
    const [elderlyUsers, setElderlyUsers] = useState([])
    const [elderlyForGuardian, setElderlyForGuardian] = useState([])
    const [elderlyAcceptGuardian, setElderlyAcceptGuardian] = useState([])
    const [userGoogle, setUserGoogle] = useState()
    const [signupError, setSignupError] = useState()
    const [signinError, setSigninError] = useState()
    const [forgotPasswordError, setForgotPasswordError] = useState()
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState()
    const [selectRoleError, setSelectRoleError] = useState()
    const [guardianAddElderlyError, setGuardianAddElderlyError] = useState()

    const [expoPushToken, setExpoPushToken] = useState('')
    const [notification, setNotification] = useState(false)
    const notificationListener = useRef()
    const responseListener = useRef()
    //-------------------------Notifications------------------------
    useEffect(() => {
        registerForPushNotificationsAsync().then((token) =>
            setExpoPushToken(token)
        )

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification)
            })

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(response)
                }
            )

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            )
            Notifications.removeNotificationSubscription(
                responseListener.current
            )
        }
    }, [])

    //-----------------------end of Push Notification-----------------------

    const [requestGoogle, responseGoogle, promptAsyncGoogle] =
        Google.useIdTokenAuthRequest({
            androidClientId: process.env.ANDROID_ID,
            androidStandaloneAppId: process.env.ANDROID_ID,
            iosStandaloneAppId: process.env.IOS_ID,
            iosClientId: process.env.IOS_ID,
            expoClientId: process.env.WEB_ID,
            webClientId: process.env.WEB_ID,
        })

    const [requestFacebook, responseFacebook, promptAsyncFacebook] =
        Facebook.useAuthRequest({
            responseType: ResponseType.Token,
            clientId: '2806562206313924',
        })

    const updateUserInfo = async (id) => {
        //realtime snapshot user info
        const docRef = doc(db, 'Users', id)
        onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                if (
                    docSnap.data().expoPushToken === undefined ||
                    docSnap.data().expoPushToken === null ||
                    docSnap.data().expoPushToken === ''
                ) {
                    updateDoc(docRef, { expoPushToken: expoPushToken })
                }
                // console.log('docSnap', docSnap.data())
                setUser(docSnap.data())
                setAuth(true)
                // console.log('User found and saved')
            } else {
                setAuth(true)
                // console.log('No such document!')
            }
        })
    }

    //Listener for authentication state
    useEffect(() => {
        onAuthStateChanged(FBauth, async (userAuth) => {
            if (userAuth) {
                updateUserInfo(userAuth.uid)
            } else {
                setAuth(false)
                setUser(null)
            }
        })
    }, [onAuthStateChanged])
    // UseEffect to listen the google auth response to the signin
    useEffect(() => {
        if (responseGoogle?.type === 'success') {
            const { id_token } = responseGoogle.params

            const credential = GoogleAuthProvider.credential(id_token)
            signInWithCredential(FBauth, credential)
                .then(() => {
                    // console.log('User signed in with Google!')
                    // console.log('User Google:', FBauth.currentUser)
                    setUserGoogle(FBauth.currentUser)
                })
                .catch((error) => {
                    const errorCode = error.code
                    const errorMessage = error.message
                    const email = error.email
                    console.log(errorCode, errorMessage, email)
                    const credential =
                        GoogleAuthProvider.credentialFromError(error)
                })
        }
    }, [responseGoogle])
    // UseEffect to listen the facebook auth response to the signin
    useEffect(() => {
        if (responseFacebook?.type === 'success') {
            const { access_token } = responseFacebook.params

            const credential = FacebookAuthProvider.credential(access_token)
            // Sign in with the credential from the Facebook user.
            signInWithCredential(FBauth, credential)
                .then(() => {
                    // console.log('User signed in with Facebook!')
                    // console.log('User Facebook:', FBauth.currentUser)
                    setUserGoogle(FBauth.currentUser)
                })
                .catch((error) => {
                    const errorCode = error.code
                    const errorMessage = error.message
                    const email = error.email
                    console.log(errorCode, errorMessage, email)
                    const credential =
                        FacebookAuthProvider.credentialFromError(error)
                })
        }
    }, [responseFacebook])
    //useEffect to get elderly user from firebase
    useEffect(() => {
        // console.log('Enter in the elderly useEffect')
        const q = query(collection(db, 'Users'), where('elderly', '==', true))
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const users = []
                querySnapshot.forEach((doc) => {
                    // console.log('doc.data(): ', doc.data())
                    users.push({ id: doc.id, ...doc.data() })
                })
                setElderlyUsers(users)
            },
            (error) => {
                console.log('Error getting documents: ', error)
            }
        )
        // unsubscribe()
    }, [user])

    //Function to signup with email
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
                    expoPushToken: expoPushToken,
                    elderlyFollow: [],
                    guardianFollowing: [],
                    admin: false,
                    guardian: false,
                    elderly: false,
                })
            })
            .catch((error) => {
                setSignupError(error.code)
                setTimeout(() => {
                    setSignupError('')
                }, 3000)
            })
    }

    //Function to signup with Google
    const SignupGoogleHandler = (
        email,
        firstName,
        lastName,
        dob,
        phoneNumber
    ) => {
        setDoc(doc(db, 'Users', FBauth.currentUser.uid), {
            email: email,
            firstname: firstName,
            lastname: lastName,
            dob: dob,
            phoneNumber: phoneNumber,
            elderlyFollow: [],
            guardianFollowing: [],
            admin: false,
            guardian: false,
            elderly: false,
            expoPushToken: expoPushToken,
        })
    }

    //Function to signin with email
    const SigninHandler = (email, password) => {
        signInWithEmailAndPassword(FBauth, email, password)
            .then(() => {
                // setUser(FBauth.currentUser.user)
                // setAuth(true)
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

    //Function to signout
    const SignoutHandler = () => {
        signOut(FBauth)
            .then(() => {
                setAuth(false)
                setUser(null)
            })
            .catch((error) => console.log(error.code))
    }

    //Function to reset password
    const resetPassword = (email) => {
        sendPasswordResetEmail(FBauth, email)
            .then(() => {
                setForgotPasswordSuccess('Email sent!')
                setTimeout(() => {
                    setForgotPasswordSuccess('')
                }, 3000)
            })
            .catch((error) => {
                console.log(error.code)
                setForgotPasswordError(error.code)
                setTimeout(() => {
                    setForgotPasswordError('')
                }, 3000)
            })
    }

    //Function to login/signup with Google
    const googleLogin = () => {
        promptAsyncGoogle()
    }
    //Function to login/signup with Facebook
    const facebookLogin = () => {
        promptAsyncFacebook()
    }

    //Function to update user
    const updateUser = async (user) => {
        const docRef = doc(db, 'Users', FBauth.currentUser.uid)
        // console.log(user)
        await updateDoc(docRef, user)
            .then(() => {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
            })
            .catch((error) => {
                setSelectRoleError(error.code)
            })
    }
    //Function guardian add an elderly user
    const addElderlyUser = async (elderlyUser) => {
        const docRef = doc(db, 'Users', FBauth.currentUser.uid)
        console.log(elderlyUser)
        await updateDoc(docRef, {
            elderlyFollow: arrayUnion({
                id: elderlyUser.id,
                phone: elderlyUser.phoneNumber,
                dob: elderlyUser.dob,
                elderlyName: elderlyUser.firstname + ' ' + elderlyUser.lastname,
                nickname: null,
                accept: false,
                respond: false,
                expoPushToken: elderlyUser.expoPushToken,
            }),
        }).then(() => {
            updateUserInfo(FBauth.currentUser.uid)
        })

        const docRef2 = doc(db, 'Users', elderlyUser.id)
        await updateDoc(docRef2, {
            guardianFollowing: arrayUnion({
                id: FBauth.currentUser.uid,
                phone: user.phoneNumber,
                guardianName: user.firstname + ' ' + user.lastname,
                expoPushToken: expoPushToken,
                nickname: null,
                accept: false,
                respond: false,
            }),
        })
    }

    //Function remove Guardian in the elderly guardianFollowing list
    const removeGuardian = async (guardian) => {
        const docRef = doc(db, 'Users', FBauth.currentUser.uid)
        await updateDoc(docRef, {
            guardianFollowing: arrayRemove({
                id: guardian.id,
                phone: guardian.phone,
                guardianName: guardian.guardianName,
                nickname: guardian.nickname,
                accept: guardian.accept,
                respond: guardian.respond,
                expoPushToken: guardian.expoPushToken,
            }),
        })

        const docGuardian = doc(db, 'Users', guardian.id)
        const docSnapGuardian = await getDoc(docGuardian)
        if (docSnapGuardian.exists()) {
            setGuardianUser({
                id: guardian.id,
                ...docSnapGuardian.data(),
            })
        }
    }

    //useEffect as a listener for the variable guardianUser
    useEffect(() => {
        guardianUser?.elderlyFollow.map((elderly) => {
            if (elderly.id === FBauth.currentUser.uid) {
                setElderlyForGuardian(elderly)
            }
        })
    }, [guardianUser])

    //useEffect to delete the elderly in the guardian list when an elderly delete the guardian
    useEffect(() => {
        if (elderlyForGuardian.length === undefined) {
            const docRef = doc(db, 'Users', guardianUser.id)
            const deleteElderly = async () => {
                await updateDoc(docRef, {
                    elderlyFollow: arrayRemove({
                        id: elderlyForGuardian.id,
                        dob: elderlyForGuardian.dob,
                        phone: elderlyForGuardian.phone,
                        nickname: elderlyForGuardian.nickname,
                        elderlyName: elderlyForGuardian.elderlyName,
                        accept: elderlyForGuardian.accept,
                        respond: elderlyForGuardian.respond,
                        expoPushToken: elderlyForGuardian.expoPushToken,
                    }),
                })
            }

            deleteElderly()
            setElderlyForGuardian([])
        }
    }, [elderlyForGuardian])

    //useEffect as a listener for the variable guardianUserAccepted
    useEffect(() => {
        guardianUserAccepted?.elderlyFollow.map((elderly) => {
            if (elderly.id === FBauth.currentUser.uid) {
                setElderlyAcceptGuardian(elderly)
            }
        })
    }, [guardianUserAccepted])

    //useEffect to update the accept status of the Guardian in the guardian list when an elderly accept the guardian
    useEffect(() => {
        if (elderlyAcceptGuardian.length === undefined) {
            const docRef = doc(db, 'Users', guardianUserAccepted.id)
            const updateAccept = async () => {
                await updateDoc(docRef, {
                    elderlyFollow: arrayRemove({
                        id: elderlyAcceptGuardian.id,
                        dob: elderlyAcceptGuardian.dob,
                        phone: elderlyAcceptGuardian.phone,
                        nickname: elderlyAcceptGuardian.nickname,
                        elderlyName: elderlyAcceptGuardian.elderlyName,
                        accept: elderlyAcceptGuardian.accept,
                        respond: elderlyAcceptGuardian.respond,
                        expoPushToken: elderlyAcceptGuardian.expoPushToken,
                    }),
                })
            }

            const updateAccept2 = async () => {
                await updateDoc(docRef, {
                    elderlyFollow: arrayUnion({
                        id: elderlyAcceptGuardian.id,
                        dob: elderlyAcceptGuardian.dob,
                        phone: elderlyAcceptGuardian.phone,
                        nickname: elderlyAcceptGuardian.nickname,
                        elderlyName: elderlyAcceptGuardian.elderlyName,
                        accept: true,
                        respond: true,
                        expoPushToken: elderlyAcceptGuardian.expoPushToken,
                    }),
                })
            }

            updateAccept()
            updateAccept2()
            setElderlyAcceptGuardian([])
        }
    }, [elderlyAcceptGuardian])

    //edit guardian nickname in the elderly database
    const editGuardianNickname = async (nickname, guardian) => {
        const docRef = doc(db, 'Users', FBauth.currentUser.uid)
        await updateDoc(docRef, {
            guardianFollowing: arrayRemove({
                id: guardian.id,
                phone: guardian.phone,
                nickname: guardian.nickname,
                guardianName: guardian.guardianName,
                expoPushToken: guardian.expoPushToken,
                accept: guardian.accept,
                respond: guardian.respond,
                expoPushToken: guardian.expoPushToken,
            }),
        })

        await updateDoc(docRef, {
            guardianFollowing: arrayUnion({
                id: guardian.id,
                phone: guardian.phone,
                nickname: nickname,
                expoPushToken: guardian.expoPushToken,
                guardianName: guardian.guardianName,
                accept: guardian.accept,
                respond: guardian.respond,
                expoPushToken: guardian.expoPushToken,
            }),
        })
    }

    //elderly accept guardian
    const acceptGuardian = async (guardian) => {
        const docRef = doc(db, 'Users', FBauth.currentUser.uid)
        await updateDoc(docRef, {
            guardianFollowing: arrayRemove({
                id: guardian.id,
                phone: guardian.phone,
                nickname: guardian.nickname,
                guardianName: guardian.guardianName,
                accept: guardian.accept,
                respond: guardian.respond,
                expoPushToken: guardian.expoPushToken,
            }),
        })

        await updateDoc(docRef, {
            guardianFollowing: arrayUnion({
                id: guardian.id,
                phone: guardian.phone,
                nickname: guardian.nickname,
                guardianName: guardian.guardianName,
                accept: true,
                respond: true,
                expoPushToken: guardian.expoPushToken,
            }),
        })

        const docGuardian = doc(db, 'Users', guardian.id)
        const docSnapGuardian = await getDoc(docGuardian)
        if (docSnapGuardian.exists()) {
            setGuardianUserAccepted({
                id: guardian.id,
                ...docSnapGuardian.data(),
            })
        }
    }

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <Stack.Navigator>
                    {/* Splash screen */}
                    <Stack.Screen
                        name="Splash"
                        options={{ headerShown: false }}
                    >
                        {(props) => <SplashScreen {...props} auth={auth} />}
                    </Stack.Screen>
                    {/* Login screen */}
                    <Stack.Screen name="Login" options={{ headerShown: false }}>
                        {(props) => (
                            <LoginScreen
                                {...props}
                                auth={auth}
                                user={user}
                                error={signinError}
                                handler={SigninHandler}
                                googleLogin={googleLogin}
                                facebookLogin={facebookLogin}
                            />
                        )}
                    </Stack.Screen>
                    {/* Register screen */}
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
                    {/* Register Google screen */}
                    <Stack.Screen
                        name="RegisterGoogle"
                        options={{ headerShown: false }}
                    >
                        {(props) => (
                            <RegisterGoogleScreen
                                {...props}
                                auth={auth}
                                userUser={user}
                                user={userGoogle}
                                error={signupError}
                                handler={SignupGoogleHandler}
                                signoutHandler={SignoutHandler}
                            />
                        )}
                    </Stack.Screen>
                    {/* ForgotPassword screen */}
                    <Stack.Screen
                        name="ForgotPassword"
                        options={{
                            headerTitle: 'Forgot Password',
                            headerTitleStyle: {
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: '#1A73E9',
                            },
                        }}
                    >
                        {(props) => (
                            <ForgotPasswordScreen
                                {...props}
                                user={user}
                                error={forgotPasswordError}
                                success={forgotPasswordSuccess}
                                handler={resetPassword}
                            />
                        )}
                    </Stack.Screen>
                    {/* SelectRole screen */}
                    <Stack.Screen
                        name="SelectRole"
                        options={{
                            headerShown: false,
                            // headerTitle: 'Select role',
                            // headerTitleStyle: {
                            //     fontSize: 20,
                            //     fontWeight: 'bold',
                            //     color: '#1A73E9',
                            // },
                        }}
                    >
                        {(props) => (
                            <SelectRoleScreen
                                {...props}
                                user={user}
                                error={selectRoleError}
                                handler={updateUser}
                            />
                        )}
                    </Stack.Screen>
                    {/* Home screen */}
                    <Stack.Screen
                        name="GuardianHome"
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
                        {(props) => (
                            <GuardianHomeScreen
                                {...props}
                                auth={auth}
                                user={user}
                                elderlyUsers={elderlyUsers}
                                error={guardianAddElderlyError}
                                addElderlyUser={addElderlyUser}
                            />
                        )}
                    </Stack.Screen>
                    {/* ElderlyHome screen */}
                    <Stack.Screen
                        name="ElderlyHome"
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
                        {(props) => (
                            <ElderlyHomeScreen
                                {...props}
                                auth={auth}
                                user={user}
                            />
                        )}
                    </Stack.Screen>

                    {/* Sensors screen */}
                    <Stack.Screen
                        name="ElderlySensors"
                        options={{
                            headerShown: true,
                            headerTitle: 'Sensors',
                            headerRight: (props) => (
                                <Signout
                                    {...props}
                                    handler={SignoutHandler}
                                    user={user}
                                />
                            ),
                        }}
                    >
                      {(props) => (
                            <ElderlySensorsScreen
                                {...props}
                                auth={auth}
                                user={user}
                                elderlyUsers={elderlyUsers}
                                error={guardianAddElderlyError}
                                addElderlyUser={addElderlyUser}
                            />
                        )}
                    </Stack.Screen>
                    {/* ElderlyHome screen */}
                    <Stack.Screen
                        name="ListOfGuardians"
                        options={{
                            headerShown: true,
                            headerTitle: 'Guardians list',
                            headerRight: (props) => (
                                <Signout
                                    {...props}
                                    handler={SignoutHandler}
                                    user={user}
                                />
                            ),
                        }}
                    >
                      {(props) => (
                            <ListOfGuardiansScreen
                                {...props}
                                auth={auth}
                                user={user}
                                removeGuardian={removeGuardian}
                                editGuardianNickname={editGuardianNickname}
                                acceptGuardian={acceptGuardian}
                            />
                        )}
                    </Stack.Screen>
                </Stack.Navigator>
                <StatusBar style="auto" />
            </NavigationContainer>
        </PaperProvider>
    )
}
