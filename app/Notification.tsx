import { AppRegistry } from 'react-native';
import RNAndroidNotificationListener, {
	RNAndroidNotificationListenerHeadlessJsName
} from 'react-native-android-notification-listener';

/**
 * Note that this method MUST return a Promise.
 * Is that why I'm using an async function here.
 */
export function startListener() {
	const headlessNotificationListener = async (response: any) => {
		if (response) {
			const notification: any = response.notification;
			await new Promise((resolve, reject) => {
				if (notification) {
					console.log('Notification ,', notification);
					resolve(notification);
				} else {
					reject(notification);
				}
			});
		}
	};

	// AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName, () => headlessNotificationListener);
}
