import { AppRegistry } from 'react-native';
import {
	RNAndroidNotificationListenerHeadlessJsName
} from 'react-native-android-notification-listener';

export function startListener(setNotification: (notification: any) => void) {
  const headlessNotificationListener = async (response: any) => {
    if (response) {
      const notification: any = response.notification;
      await new Promise(async (resolve, reject) => {
        if (notification) {
          //   console.log('Notification ,', notification);

          setNotification(notification);
          resolve(notification);
        } else {
          reject(notification);
        }
      });
    }
  };

  AppRegistry.registerHeadlessTask(
    RNAndroidNotificationListenerHeadlessJsName,
    () => headlessNotificationListener
  );

}
