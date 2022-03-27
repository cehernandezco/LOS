import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView, ScrollView, FlatList } from 'react-native'
import { Card } from 'react-native-paper'
import {
    Button,
    IconButton,
    TextInput as TextInputCustom,
} from 'react-native-paper'
import Constants from 'expo-constants'

const Item = ({ item, props }) => (
    <Card mode={'outlined'} style={styles.card}>
        <Card.Title title={item.guardianName} />
        <Card.Content>
            <Text>
                Nickname: {item.nickname ? item.nickname : 'No nickname'}
            </Text>
            <Text>Phone: {item.phone}</Text>
            <Card.Actions>
                <Button>Edit</Button>
                <Button>Delete</Button>
                {!item.accept ? (
                    <Button
                        onPress={() => {
                            Alert.alert('Test', 'coucou')
                        }}
                    >
                        Accept
                    </Button>
                ) : null}
            </Card.Actions>
        </Card.Content>
    </Card>
)

const ListOfGuardiansScreen = (props) => {
    // console.log(props.user?.guardianFollowing)
    const renderItem = ({ item }) => <Item item={item} props={props} />
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.viewContainer}>
                <Text style={styles.textTitle}>
                    List of Guardians following me:
                </Text>
            </View>
            <View style={[styles.viewContainer, styles.viewContainerFlatlist]}>
                {props.user.guardianFollowing?.length > 0 ? (
                    <FlatList
                        data={props.user?.guardianFollowing}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <Card mode={'outlined'} style={styles.card}>
                        <Card.Title title="No Guardian" />
                        <Card.Content>
                            <Text>
                                We are so sorry, for the moment you don't have
                                any guardian!
                            </Text>
                        </Card.Content>
                    </Card>
                )}
            </View>
        </SafeAreaView>
    )
}

export default ListOfGuardiansScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    viewContainer: {
        padding: 10,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
    },
    viewContainerFlatlist: {
        flex: 1,
        alignContent: 'flex-start',
    },
    textTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    card: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10,
    },
})
