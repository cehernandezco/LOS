import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Signout from '../components/Signout'
//firebase
import { getAuth, signOut } from 'firebase/auth'

const SettingsScreen = (props, { user }) => {
    const FBauth = getAuth()

    //Function to signout
    const SignoutHandler = () => {
        signOut(FBauth)
            .then(() => {
                setAuth(false)
                setUser(null)
            })
            .catch((error) => console.log(error.code))
    }
    return (
        <View>
            <Signout {...props} handler={SignoutHandler} user={user} />
        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({})
