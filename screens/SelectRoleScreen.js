import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
} from 'react-native'
import { Button, TextInput as TextInputCustom } from 'react-native-paper'
import Constants from 'expo-constants'
import { useNavigation } from '@react-navigation/native'

const SelectRoleScreen = (props) => {
    const navigation = useNavigation()
    const [role, setRole] = useState('')
    const [caregiverButtonTitle, setCaregiverButtonTitle] = useState(
        'This is my phone (Caregiver)'
    )
    const [caregiverButtonText, setCaregiverButtonText] = useState(
        'Use this app to help seniors remain safe and assist in an emergency'
    )
    const [elderButtonTitle, setElderButtonTitle] = useState(
        "This is my senior's phone"
    )
    const [elderButtonText, setElderButtonText] = useState(
        'Use this app for your safety and as an emergency aid'
    )
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        props.error ? Alert.alert('Error selecting a role ', props.error) : null
    }, [props.error])
    useEffect(() => {
        console.log(role)
        if (role.length > 0)
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
    }, [role])

    useEffect(() => {
        if (caregiverButtonTitle.length < 0) {
            setCaregiverButtonTitle('This is my phone (Caregiver)')
            setCaregiverButtonText(
                'Use this app to help seniors remain safe and assist in an emergency'
            )
            setElderButtonTitle("This is my senior's phone")
            setElderButtonText(
                'Use this app for your safety and as an emergency aid'
            )
        }
    })

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
        console.log(props)
        props.handler(props.user)
        setRole(role)
    }

    const ButtonTitleText = (props) => {
        return (
            <View style={styles.viewButtonTitleContainer}>
                <Text style={styles.buttonLabelTitle}>{props.title}</Text>
                <Text style={styles.buttonLabelText}>{props.text}</Text>
            </View>
        )
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
                    <Button
                        style={[styles.buttons, styles.selectRoleButton]}
                        labelStyle={styles.selectRoleText}
                        accessibilityLabel="Select role elderly"
                        loading={loading}
                        icon={() => (
                            <Image
                                source={require('../assets/elderly_icon_small.png')}
                                style={styles.iconButton}
                            />
                        )}
                        mode="contained"
                        onPress={() => selectRole('elderly')}
                    >
                        <ButtonTitleText
                            style={styles.buttonTitleContainer}
                            title={elderButtonTitle}
                            text={elderButtonText}
                        ></ButtonTitleText>
                    </Button>
                    <Button
                        style={[styles.buttons, styles.selectRoleButton]}
                        labelStyle={styles.selectRoleText}
                        accessibilityLabel="Select role guardian"
                        loading={loading}
                        icon={() => (
                            <Image
                                source={require('../assets/young_adults_icon_small.png')}
                                style={styles.iconButton}
                            />
                        )}
                        mode="contained"
                        onPress={() => selectRole('guardian')}
                    >
                        <ButtonTitleText
                            style={styles.buttonTitleContainer}
                            title={caregiverButtonTitle}
                            text={caregiverButtonText}
                        ></ButtonTitleText>
                    </Button>
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
        paddingBottom: 20,
    },
    selectRoleText: {
        color: '#FFF',
        fontSize: 18,
    },
    resetButtonArea: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginBottom: 20,
    },
    buttons: {
        width: '85%',
        height: 100,
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
        width: '85%',
        alignItems: 'flex-start',
        flexDirection: 'column',
    },
    buttonTitleContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    selectRoleButton: {
        backgroundColor: '#2D71B6',
    },
    iconButton: {
        width: 100,
        height: 80,
        margin: 5,
        marginTop: 10,
        marginLeft: 50,
    },
    buttonLabelTitle: {
        fontSize: 18,
        fontWeight: '400',
        color: '#FFF',
        borderWidth: 0,
    },
    buttonLabelText: {
        fontSize: 12,
        color: '#FFF',
        borderWidth: 0,
    },

    bottomArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})