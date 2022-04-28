import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const TopBar = () => {
    const navigation = useNavigation()

    return (
        <View style={styles.header}>
            <Image
                style={styles.logo}
                source={require('../assets/los_logo.png')}
            />
            <IconButton
                icon="cog"
                color="#000"
                size={40}
                onPress={() => navigation.navigate('Settings')}
            />
        </View>
    )
}

export default TopBar

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    logo: {
        width: 151,
        height: 75,
        marginBottom: '5%',
        marginTop: '5%',
    },
})
