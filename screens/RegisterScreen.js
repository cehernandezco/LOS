import React, { useState } from 'react'
import { StyleSheet, Text, View, Keyboard } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import { stringify } from '@firebase/util'

const RegisterScreen = (props) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState(new Date())
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [registerText, setRegisterText] = useState('REGISTER')
  const [loading, setLoading] = useState(false)

  //Formatted date with full to print in the input field
  const formatDate = (date) => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handlerSignUp = () => {
    if (
      (firstName === undefined || firstName === '') &&
      (lastName === undefined || lastName === '') &&
      (email === undefined || email === '') &&
      (password === undefined || password === '')
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
    props.handler(email, password, firstName, lastName, dob)
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
          placeholder="Type Password"
          label="Password"
          mode="outlined"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Text style={styles.error}>{error || props.error}</Text>
        <Button
          style={styles.button}
          accessibilityLabel="Register"
          mode="contained"
          loading={loading}
          onPress={() =>
            handlerSignUp(email, password, firstName, lastName, dob)
          }
        >
          {registerText}
        </Button>
      </View>
    </View>
  )
}

export default RegisterScreen

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
    marginBottom: 10,
  },
})
