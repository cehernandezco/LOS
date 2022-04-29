import { View } from 'react-native'
import React from 'react'
import Signout from '../components/Signout'
import { FBauth } from '../App'
import { signOut } from 'firebase/auth'

const SettingsScreen = (props, { user, setUser, setAuth }) => {
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
