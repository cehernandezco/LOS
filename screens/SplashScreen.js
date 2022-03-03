import React, { useEffect } from 'react'
import { StyleSheet, Image, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const SplashScreen = (props) => {
    const navigation = useNavigation()

    useEffect(() => {
        setTimeout(() => {
            if (!props.auth) {
                navigation.navigate('Login')
            } else {
                // console.log('auth', props)
                navigation.navigate('Home')
            }
        }, 3000)
    }, [])

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../assets/los_logo.png')}
            />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
    },
})
