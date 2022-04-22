// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
export const sendPushNotification = async (token, title, body) => {
    //console.log('Token to send to Push Notification: ', token)
    // console.log('Title to send to Push Notification: ', title)
    //console.log('Body to send to Push Notification: ', body)
    const message = {
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: { someData: 'goes here' },
    }

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
}

const NotificationsCustom = () => {}

export default NotificationsCustom
