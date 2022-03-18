import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView, ScrollView, Image } from 'react-native'
import {
    Button,
    IconButton,
    TextInput as TextInputCustom,
} from 'react-native-paper'
import Constants from 'expo-constants'

const GuardianHomeScreen = (props) => {
    const [email, setEmail] = useState('')
    const navigation = useNavigation()
    useEffect(() => {
        if (!props.auth) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        } else {
            // console.log(props.user)
            if (!props.user.elderly && !props.user.guardian) {
                navigation.reset({ index: 0, routes: [{ name: 'SelectRole' }] })
                //navigation.navigate('SelectRole',{user: props.user})
            } else {
                if (props.user.elderly) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'ElderlyHome' }],
                    })
                }
            }
        }
    }, [props.auth])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/los_logo.png')}
                    />
                    <IconButton
                        icon="menu"
                        color="#000"
                        size={40}
                        onPress={() => navigation.openDrawer()}
                    />
                </View>
                <View style={styles.emailArea}>
                    <TextInputCustom
                        placeholder="Enter email"
                        label="Find elderly by email"
                        mode="outlined"
                        autoComplete="email"
                        activeOutlineColor="#0071c2"
                        onChangeText={(text) => setEmail(text)}
                        style={styles.emailInput}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GuardianHomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',

        // marginTop: Constants.statusBarHeight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 'auto',
        width: '80%',
        justifyContent: 'space-between',
        borderColor: '#0071c2',
        borderWidth: 2,
    },
    logo: {
        width: 151,
        height: 75,
        marginBottom: '5%',
        marginTop: '5%',
    },
    emailArea: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    emailInput: {
        width: '85%',
        paddingLeft: 10,
        marginBottom: 20,
    },
})
