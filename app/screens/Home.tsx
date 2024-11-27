import { useMutation } from '@apollo/client';
import { gql } from 'apollo-boost';
import Lottie from 'lottie-react-native';
import { useEffect } from 'react';
import { NativeEventEmitter, NativeModules, Text, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAsyncDataByKey } from '../utils/helpers';
import lottie from '../utils/mobile_notification.json';
import { InputType, NotificationOutputType } from './Scan';

const { NotificationModule } = NativeModules;

const CREATE_NOTIFICATION = gql`
  mutation create_notification($input: NotificationInput!) {
    create_notification(input: $input) {
      user_id
    }
  }
`;


export default function Home(props: any) {
  const [createNotification] = useMutation<
    NotificationOutputType,
    InputType
  >(CREATE_NOTIFICATION);

  useEffect(() => {
    (async () => {
      const sessionIds = await getAsyncDataByKey('session_ids');
      console.log('sessionIds : ', sessionIds);
      if (sessionIds) {
        let sessionIdArray: string[] = JSON.parse(sessionIds);
        if (sessionIdArray.length > 0) {
          props.navigation.navigate('Dashboard');
        }
      }
    })();
  }, []);


  useEffect(() => {
    NotificationModule.initializeNotificationPermission();
    const eventEmitter = new NativeEventEmitter(NotificationModule);
    eventEmitter.addListener('onNotificationPosted', async (notification) => {
      callBack(notification);
    });
  }, []);

  async function callBack(notification: any) {
    const notify = JSON.parse(notification);

    const input = {
      device_id: await DeviceInfo.getUniqueId(),
      mainTitle: notify?.title,
      notificationData: JSON.stringify(notify),
      title: notify.title,
      source: notify?.package,
      notificationReceivedTime: new Date(),
    }
    await createNotification({
      variables: {
        input,
      },
    }).then(res => {
      console.log('Respose : ', res);
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      <View>
        <Text
          style={{
            fontSize: 30,
            color: 'black',
            fontFamily: 'sans-serif-medium',
          }}>
          Notify Me
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          // justifyContent: 'space-around',
        }}>
        <View style={{ marginBottom: 10, marginTop: 10 }}>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              marginTop: 5,
              marginBottom: 2,
            }}>
            1. Goto https://www.notifyme.akdev.com
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              marginTop: 5,
              marginBottom: 2,
            }}>
            2. Click on below Scanner
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              marginTop: 5,
              marginBottom: 2,
            }}>
            3. Scan the QR code on your system.
          </Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Icon.Button
            name="qr-code-scanner"
            color={'black'}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            iconStyle={{ fontSize: 30, color: '#ffffff' }}
            onPress={() => {
              // console.log("Test")
              props.navigation.navigate('Scan');
            }}
            backgroundColor="#014EDE">
            <Text style={{ color: '#ffffff' }}>Connect Now</Text>
          </Icon.Button>
        </View>
      </View>
      <View>
        <Lottie source={lottie} autoPlay loop />
      </View>
    </View>
  );
}
