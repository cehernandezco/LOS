import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Keyboard } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
//Signout module
import Signout from '../components/Signout'

import { useNavigation } from '@react-navigation/native'

const RegisterGoogleScreen = (props) => {
    const navigation = useNavigation()
    const nameProps = props.user?.displayName.split(' ') || ''
    const [firstName, setFirstName] = useState(nameProps[0] || '')
    const [lastName, setLastName] = useState(nameProps[1] || '')
    const [email, setEmail] = useState(props.user?.email || '')
    const [dob, setDob] = useState(new Date())
    const [phoneNumber, setPhoneNumber] = useState(
        props.user?.phoneNumber || ''
    )
    const [show, setShow] = useState(false)
    const [error, setError] = useState('')
    const [registerText, setRegisterText] = useState('SAVE')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (props.userUser) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        }
        if (!props.auth) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        }
    }, [props.auth])

    //Formatted date with full to print in the input field
    const formatDate = (date) => {
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    const handlerSignUp = () => {
        if (
            firstName === undefined ||
            firstName === '' ||
            lastName === undefined ||
            lastName === '' ||
            email === undefined ||
            email === '' ||
            phoneNumber === undefined ||
            phoneNumber === ''
        ) {
            setError('Please fill all the fields')
            setTimeout(() => {
                setError('')
            }, 3000)
            return
        }

        setTimeout(() => {
            setRegisterText('Register')
            setLoading(false)
        }, 3000)

        setLoading(true)
        setRegisterText('Registering...')
        props.handler(email, firstName, lastName, dob, phoneNumber)
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || dob
        setShow(Platform.OS === 'ios')
        setDob(currentDate)
    }

    return (
        <View style={styles.container}>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={dob}
                    mode={'date'}
                    display="default"
                    onChange={onChange}
                />
            )}

            <View style={styles.inputsContainer}>
                <Text style={styles.title}>Register</Text>
                <TextInput
                    placeholder="Type Email"
                    label="Email address"
                    mode="outlined"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    textContentType="emailAddress"
                    autoComplete="email"
                />

                <TextInput
                    placeholder="Type First Name"
                    label="First name"
                    mode="outlined"
                    onChangeText={(text) => setFirstName(text)}
                    value={firstName}
                    textContentType="givenName"
                    autoComplete="name-given"
                />

                <TextInput
                    placeholder="Type Last Name"
                    label="Last name"
                    mode="outlined"
                    onChangeText={(text) => setLastName(text)}
                    value={lastName}
                    textContentType="familyName"
                    autoComplete="name-family"
                />
                <TextInput
                    placeholder="Date of birth"
                    label="Date of birth"
                    mode="outlined"
                    value={formatDate(dob)}
                    onFocus={() => {
                        Keyboard.dismiss()
                        setShow(true)
                    }}
                    textContentType="familyName"
                    autoComplete="name-family"
                />
                <TextInput
                    placeholder="Phone number"
                    label="Phone number"
                    mode="outlined"
                    onChangeText={(text) => setPhoneNumber(text)}
                    value={phoneNumber}
                    textContentType="telephoneNumber"
                    autoComplete="tel"
                />
            </View>

            <View style={styles.buttonContainer}>
                <Text style={styles.error}>{error || props.error}</Text>
                <Button
                    style={styles.button}
                    accessibilityLabel="Register"
                    labelStyle={styles.buttonLabel}
                    mode="contained"
                    loading={loading}
                    onPress={() =>
                        handlerSignUp(email, firstName, lastName, dob)
                    }
                >
                    {registerText}
                </Button>
                <Signout
                    {...props}
                    handler={props.signoutHandler}
                    user={props.user}
                />
            </View>
        </View>
    )
}

export default RegisterGoogleScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    inputsContainer: {
        flex: 1,
        width: '90%',
        marginTop: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        marginTop: 20,
        color: '#2D71B6',
    },
    input: {
        width: '90%',
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        fontSize: 18,
    },
    buttonContainer: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '70%',
        height: 40,
        backgroundColor: '#2D71B6',
        marginBottom: 10,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },
    error: {
        color: 'red',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
})
