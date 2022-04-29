import { useState } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { SafeAreaView, FlatList } from 'react-native'
import { Button, TextInput, Title, Card } from 'react-native-paper'
import { sendPushNotification } from '../components/NotificationsCustom'
// import Constants from 'expo-constants'

const handleNotification = (data, title, props, message) => {
    sendPushNotification(
        data.expoPushToken,
        title,
        `${props.user.firstname} ${props.user.lastname} ${message}`
    )
}

const handleRemoveGuardian = (data, props) => {
    // props.removeGuardian(data)
    Alert.alert(
        'Confirmation',
        'Are you sure you want to remove: ' +
            data.guardianName +
            ' from your guardian list?',
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    Alert.alert(
                        'Guardian removed',
                        'Your guardian: ' +
                            data.guardianName +
                            ' has been removed from your list.'
                    )
                    props.removeGuardian(data)
                    handleNotification(
                        data,
                        'You have been removed',
                        props,
                        'removed you from his guardian list'
                    )
                },
            },
        ]
    )
}

const handleAcceptGuardian = (data, props) => {
    // props.removeGuardian(data)
    Alert.alert(
        'Confirmation',
        'Are you sure you want to accept: ' + data.guardianName + '?',
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    Alert.alert(
                        'Guardian accepted',
                        data.guardianName +
                            ' has been added to your guardian list.'
                    )
                    props.acceptGuardian(data)
                    handleNotification(
                        data,
                        'You have been accepted',
                        props,
                        'accepted you to his guardian list'
                    )
                },
            },
        ]
    )
}

const Item = ({
    item,
    props,
    edit,
    setEdit,
    nickname,
    setNickname,
    editGuardianNickname,
    setUpdate,
}) => (
    <Card mode={'outlined'} style={styles.card}>
        <Card.Content>
            <Title style={!item.accept ? { color: 'red' } : { color: 'green' }}>
                {item.guardianName}
            </Title>
            {!edit ? (
                <Text>
                    Nickname: {item.nickname ? item.nickname : 'No nickname'}
                </Text>
            ) : (
                <>
                    <Text>Nickname:</Text>
                    <TextInput
                        style={styles.editInput}
                        value={nickname}
                        onChangeText={(text) => setNickname(text)}
                    />
                    <View style={styles.editView}>
                        <Button onPress={() => setEdit(false)}>Cancel</Button>
                        <Button
                            style={styles.editButton}
                            onPress={() => {
                                setUpdate(true)
                                editGuardianNickname(item)
                            }}
                        >
                            Save
                        </Button>
                    </View>
                </>
            )}
            <Text>Phone: {item.phone}</Text>
            <Card.Actions>
                <Button onPress={() => setEdit(true)}>Edit</Button>
                <Button onPress={() => handleRemoveGuardian(item, props)}>
                    Delete
                </Button>
                {!item.accept ? (
                    <Button
                        onPress={() => {
                            handleAcceptGuardian(item, props)
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
    const [edit, setEdit] = useState(false)
    const [update, setUpdate] = useState(false)
    const [nickname, setNickname] = useState('')

    const editGuardianNickname = (guardian) => {
        props.editGuardianNickname(nickname, guardian)
        setNickname('')
        setEdit(false)
        setTimeout(() => {
            setUpdate(false)
        }, 2000)
    }

    const renderItem = ({ item }) => (
        <Item
            item={item}
            props={props}
            edit={edit}
            setEdit={setEdit}
            nickname={nickname}
            setNickname={setNickname}
            editGuardianNickname={editGuardianNickname}
            setUpdate={setUpdate}
        />
    )
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.viewContainer}>
                <Text style={styles.textTitle}>
                    List of{' '}
                    {props.user.guardianFollowing?.length === 1
                        ? 'Guardian '
                        : 'Guardians '}
                    following me:
                </Text>
            </View>
            <View style={[styles.viewContainer, styles.viewContainerFlatlist]}>
                {update ? (
                    <Card mode={'outlined'} style={styles.card}>
                        <Card.Title title="Update" />
                        <Card.Content>
                            <Text>
                                We are updating the information of your
                                guardian.
                            </Text>
                        </Card.Content>
                    </Card>
                ) : props.user.guardianFollowing?.length > 0 ? (
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
    editView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editInput: {
        fontSize: 20,
        fontWeight: 'bold',
    },
})
