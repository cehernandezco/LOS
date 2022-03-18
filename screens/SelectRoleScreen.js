import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    TouchableOpacity,
} from 'react-native'
import { Button } from 'react-native-paper'
import Constants from 'expo-constants'
import { useNavigation } from '@react-navigation/native'

const SelectRoleScreen = (props) => {
    const navigation = useNavigation()
    const [role, setRole] = useState('')
    const [caregiverButtonTitle, setCaregiverButtonTitle] = useState('')
    const [caregiverButtonText, setCaregiverButtonText] = useState('')
    const [elderButtonTitle, setElderButtonTitle] = useState('')
    const [elderButtonText, setElderButtonText] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        props.error ? Alert.alert('Error selecting a role ', props.error) : null
    }, [props.error])

    useEffect(() => {
        console.log(role)
        if (role.length > 0) {
            if (role == 'elderly') {
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
    }, [role])

    useEffect(() => {
        setCaregiverButtonTitle("This is my Caregiver's phone")
        setCaregiverButtonText(
            'Use this app to help seniors remain safe and assist in an emergency.'
        )
        setElderButtonTitle("This is my senior's phone")
        setElderButtonText(
            'Use this app for your safety and as an emergency aid.'
        )
    }, [])

    const selectRole = (role) => {
        console.log(role)
        //assure it is one or the other
        if (role == 'elderly') {
            props.user.elderly = true
            props.user.guardian = false
        } else {
            props.user.guardian = true
            props.user.elderly = false
        }
        // console.log(props)
        props.handler(props.user)
        setRole(role)
        setLoading(true)
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
                    <Text style={styles.title}>
                        I am setting up this phone for
                    </Text>
                </View>

                <View style={styles.resetButtonArea}>
                    {/* Elderly button */}
                    <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                        onPress={() => selectRole('elderly')}
                    >
                        <Image
                            source={require('../assets/elderly_icon_small.png')}
                            style={styles.iconButton}
                        />
                        <View style={styles.viewButtonTitleContainer}>
                            <Text style={styles.buttonLabelTitle}>
                                {elderButtonTitle}
                            </Text>
                            <Text style={styles.buttonLabelText}>
                                {elderButtonText}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* Guardian button */}
                    <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                        onPress={() => selectRole('guardian')}
                    >
                        <Image
                            source={require('../assets/young_adults_icon_small.png')}
                            style={styles.iconButton}
                        />
                        <View style={styles.viewButtonTitleContainer}>
                            <Text style={styles.buttonLabelTitle}>
                                {caregiverButtonTitle}
                            </Text>
                            <Text style={styles.buttonLabelText}>
                                {caregiverButtonText}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SelectRoleScreen

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

    title: {
        color: '#000',
        fontSize: 24,
        marginBottom: 20,
        marginTop: 50,
    },
    buttonTouchableOpacity: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#2D71B6',
        height: 100,
        borderRadius: 6,
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
    viewButtonTitleContainer: {
        width: 210,
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginRight: 15,
    },
    iconButton: {
        width: 117,
        height: 80,
        margin: 5,
        marginTop: 10,
        marginLeft: 5,
    },
    buttonLabelTitle: {
        fontSize: 18,
        fontWeight: '400',
        color: '#FFF',
    },
    buttonLabelText: {
        fontSize: 12,
        color: '#FFF',
        borderWidth: 0,
    },
})
