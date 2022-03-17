import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = (props) => {
    const navigation = useNavigation()
    useEffect(() => {
        if (!props.auth) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        } else {
            console.log(props.user)
            if (
                !props.user.elderly &&
                !props.user.guardian &&
                !props.user.admin
            ) {
                navigation.reset({ index: 0, routes: [{ name: 'SelectRole' }] })
                //navigation.navigate('SelectRole',{user: props.user})
            } else {
                if (props.user.elderly) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'ElderlyHome' }],
                    })
                } else {
                    if (props.user.guardian) {
                        /*
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'GuardianHome' }],
                        })
                        */
                    } else {
                        //admin
                    }
                }
            }
        }
    }, [props.auth])

    return (
        <View>
            <Text>Home {props.user?.firstname}</Text>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})
