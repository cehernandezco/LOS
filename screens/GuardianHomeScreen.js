import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Alert,
    SafeAreaView,
    ScrollView,
    FlatList,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {
    Button,
    TextInput as TextInputCustom,
    Card,
    Title,
} from 'react-native-paper'
import Constants from 'expo-constants'
import { sendPushNotification } from '../components/NotificationsCustom'
import TopBar from '../components/TopBar'

const handleNotification = (data, title, props, message) => {
    sendPushNotification(
        data.expoPushToken,
        title,
        `${props.user.firstname} ${props.user.lastname} ${message}`
    )
}

const handleRemoveElderly = (data, props) => {
    // props.removeElderly(data)
    Alert.alert(
        'Confirmation',
        'Are you sure you want to remove: ' +
            data.elderlyName +
            ' from your elderly list?',
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
                        'Your elderly: ' +
                            data.elderlyName +
                            ' has been removed from your list.'
                    )
                    props.removeElderly(data)
                    handleNotification(
                        data,
                        'You have been removed',
                        props,
                        'removed you from his elderly list'
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
    editElderlyNickname,
    setUpdate,
    keyExtractor,
}) => (
    <Card mode={'outlined'} style={styles.card} key={keyExtractor}>
        <Card.Content>
            <Title style={!item.accept ? { color: 'red' } : { color: 'green' }}>
                {item.elderlyName}
            </Title>
            {!edit ? (
                <Text>
                    Nickname: {item.nickname ? item.nickname : 'No nickname'}
                </Text>
            ) : (
                <>
                    <Text>Nickname:</Text>
                    <TextInputCustom
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
                                editElderlyNickname(item)
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
                <Button onPress={() => handleRemoveElderly(item, props)}>
                    Delete
                </Button>
            </Card.Actions>
        </Card.Content>
    </Card>
)

const GuardianHomeScreen = (props) => {
    const [email, setEmail] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [elderlyUsers, setElderlyUsers] = useState([])
    const navigation = useNavigation()
    const [elderlyInTheList, setElderlyInTheList] = useState(0)

    const [edit, setEdit] = useState(false)
    const [update, setUpdate] = useState(false)
    const [nickname, setNickname] = useState('')

    useEffect(() => {
        setElderlyUsers(props.elderlyUsers)
    }, [props.elderlyUsers])

    const handleFilter = () => {
        setFilteredData([])
        elderlyUsers.map((elder) => {
            if (elder.email === email.toLowerCase().trim()) {
                const newFilter = elderlyUsers.filter((text) => {
                    return text.email
                        .toLowerCase()
                        .includes(email.toLowerCase().trim())
                })
                if (email === '') {
                    setFilteredData([])
                } else {
                    setFilteredData(newFilter)
                }
            }
        })
    }

    const handleAdd = (elderly) => {
        Alert.alert(
            'Elderly added',
            `${elderly.firstname} ${elderly.lastname} has been added to your list`
        )
        setEmail('')
        setFilteredData([])
        props.addElderlyUser(elderly)
        sendPushNotification(
            elderly.expoPushToken,
            'A guardian add you',
            `${props.user.firstname} ${props.user.lastname} has added you to his elderly list`
        )
    }

    useEffect(() => {
        if (!props.auth) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        } else {
            // console.log(elderlyUsers)
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

    useEffect(() => {
        if (props.user?.elderlyFollow !== undefined) {
            {
                filteredData?.map((elderly) => {
                    props.user?.elderlyFollow.map((elderlyFollow) => {
                        if (elderlyFollow.id === elderly?.id) {
                            setElderlyInTheList(1)
                        } else {
                            setElderlyInTheList(0)
                        }
                    })
                })
            }
        }
    }, [filteredData])

    const renderItem = ({ item }) => (
        <Item
            item={item}
            props={props}
            edit={edit}
            setEdit={setEdit}
            nickname={nickname}
            setNickname={setNickname}
            editElderlyNickname={editElderlyNickname}
            setUpdate={setUpdate}
            keyExtractor={item.id}
        />
    )

    const editElderlyNickname = (guardian) => {
        props.editElderlyNickname(nickname, guardian)
        setNickname('')
        setEdit(false)
        setTimeout(() => {
            setUpdate(false)
        }, 2000)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
                <TopBar />
                <View style={styles.emailArea}>
                    {props.user?.elderlyFollow?.length > 0 ? (
                        <>
                            <Text style={styles.text}>
                                You are following{' '}
                                {props.user?.elderlyFollow.length} elderly
                            </Text>
                            <View
                                style={[
                                    styles.viewContainer,
                                    styles.viewContainerFlatlist,
                                ]}
                            >
                                {update ? (
                                    <Card mode={'outlined'} style={styles.card}>
                                        <Card.Title title="Update" />
                                        <Card.Content>
                                            <Text>
                                                We are updating the information
                                                of your guardian.
                                            </Text>
                                        </Card.Content>
                                    </Card>
                                ) : (
                                    <FlatList
                                        scrollEnabled={false}
                                        data={props.user?.elderlyFollow}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => item.id}
                                    />
                                )}
                            </View>
                        </>
                    ) : (
                        <Text style={styles.text}>
                            You are not following any elderly
                        </Text>
                    )}
                    <TextInputCustom
                        placeholder="Enter email"
                        label="Find elderly by email"
                        mode="outlined"
                        autoComplete="email"
                        activeOutlineColor="#0071c2"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        style={styles.emailInput}
                    />
                    <Button
                        mode="contained"
                        labelStyle={styles.buttonSearchLabel}
                        style={styles.buttonSearch}
                        onPress={() => handleFilter(email)}
                    >
                        search
                    </Button>
                    {filteredData.length > 0 && (
                        <>
                            <View style={styles.elderlyList}>
                                <Text style={styles.elderlylistText}>
                                    {filteredData[0].firstname}{' '}
                                    {filteredData[0].lastname}
                                </Text>
                                <Text style={styles.elderlylistText}>
                                    {filteredData[0].email}
                                </Text>
                            </View>
                            <View style={styles.addButtonArea}>
                                <Button
                                    mode="contained"
                                    labelStyle={styles.buttonSearchLabel}
                                    style={[
                                        styles.buttonSearch,
                                        styles.buttonCancel,
                                    ]}
                                    onPress={() => {
                                        setEmail('')
                                        setFilteredData([])
                                    }}
                                >
                                    cancel
                                </Button>
                                {elderlyInTheList === 1 ? (
                                    <Button
                                        mode="contained"
                                        labelStyle={styles.buttonSearchLabel}
                                        style={[
                                            styles.buttonSearch,
                                            styles.buttonAdd,
                                        ]}
                                        onPress={() => {
                                            Alert.alert(
                                                'Already added',
                                                `${filteredData[0].firstname} ${filteredData[0].lastname} is already added to your list.`
                                            )
                                        }}
                                    >
                                        Added
                                    </Button>
                                ) : (
                                    <Button
                                        mode="contained"
                                        labelStyle={[
                                            styles.buttonSearchLabel,
                                            styles.buttonAddLabel,
                                        ]}
                                        style={[
                                            styles.buttonSearch,
                                            styles.buttonAdd,
                                        ]}
                                        onPress={() => {
                                            handleAdd(filteredData[0])
                                        }}
                                    >
                                        add
                                    </Button>
                                )}
                            </View>
                        </>
                    )}
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
        //alignItems: 'center',

        marginTop: Constants.statusBarHeight,
    },
    viewContainer: {
        width: '100%',
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
    scrollView: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
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
    buttonSearch: {
        backgroundColor: '#ff6b15',
        marginBottom: 20,
    },
    buttonSearchLabel: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 18,
    },
    elderlyList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
        overflow: 'hidden',
        marginBottom: 20,
        borderRadius: 6,
        borderColor: '#c1c1c1',
        borderWidth: 1,
    },
    elderlylistText: {
        padding: 10,
        fontSize: 18,
    },
    addButtonArea: {
        flexDirection: 'row',
        width: '85%',
        justifyContent: 'space-between',
    },
    buttonCancel: {
        backgroundColor: 'red',
    },
    buttonAdd: {
        backgroundColor: '#2D71B6',
    },
    buttonAddLabel: {
        paddingHorizontal: 30,
    },
    card: {
        width: '100%',
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
