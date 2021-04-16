import PushNotification from "react-native-push-notification";
import { navigate, navigationRef } from './../../RootNavigation'

export default () => {
    PushNotification.popInitialNotification((notification) => {
        goToScreent(notification)
    })
    PushNotification.configure({
        popInitialNotification: true,
        onNotification: function (notification) {
            goToScreent(notification)
        }
    });
}

const goToScreent = (notification) => {
    if (notification?.userInfo?.screen) {
        navigationRef.current.navigate(notification?.userInfo?.screen, notification?.userInfo?.params)
    }
}
