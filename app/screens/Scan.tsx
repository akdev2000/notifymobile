import {gql, useMutation, useQuery, useSubscription} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {Text, ToastAndroid, View} from 'react-native';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import DeviceInfo from 'react-native-device-info';
import {Scanner} from '../components/Scanner';
import {startListener} from '../Notification';
import {
  getAsyncDataByKey,
  LOCAL_DEVICE_ID,
  LOCAL_SESSION_IDS,
  setAsyncData,
} from '../utils/helpers';

const CREATE_SESSION = gql`
  mutation add_session($input: InputProps!) {
    add_session(input: $input) {
      id
      session_id
    }
  }
`;

const test = gql`
  query test {
    test {
      device_name
    }
  }
`;

const CREATE_NOTIFICATION = gql`
  mutation create_notification($input: NotificatoinInput!) {
    create_notification(input: $input) {
      user_id
    }
  }
`;

type InputType = {
  input: {
    device_id: string;
    source: string;
    title: string;
    mainTitle: string;
    notificationData: string;
    notificationReceivedTime: Date;
  };
};

type NotificationOutputType = {
  id: number;
  user_id: number;
  source: string;
  title: string;
  mainTitle: string;
  notificationData: string;
  notificationReceivedTime: Date;
  createdAt: string;
  updatedAt: string;
};

type SessionInputProps = {
  input: {
    device_info: String;
    device_name: String;
    device_id: String;
    sessionId: string;
  };
};
export default function Scan(props: any) {
  const [createSession, createSessionResponse] = useMutation<
    any,
    SessionInputProps
  >(CREATE_SESSION);
  const [notification, setNotification] = useState<any>({});
  const [createNotification, createNotificationResponse] = useMutation<
    NotificationOutputType,
    InputType
  >(CREATE_NOTIFICATION);
  const testQuery = useQuery(test);
  useEffect(() => {
    (async () => {
      const permission =
        await RNAndroidNotificationListener.getPermissionStatus();
      if (permission != 'authorized') {
        RNAndroidNotificationListener.requestPermission();
      }
      console.log(
        'Status : ',
        await RNAndroidNotificationListener.getPermissionStatus(),
      );
    })();
  }, []);

  // useEffect(() => {
  //   if (notificationListener.data) {
  //     console.log('notificationListener.data : ', notificationListener.data);
  //   }
  // }, [notificationListener.data]);

  useEffect(() => {
    if (createSessionResponse?.error) {
      ToastAndroid.show(
        createSessionResponse?.error?.message,
        ToastAndroid.LONG,
      );
    }
  }, [createSessionResponse?.error]);

  useEffect(() => {
    // console.log('Notification Received', notification);

    if (typeof notification == 'string') {
      let notify: any = JSON.parse(notification);
      (async () => {
        console.log(
          'test : ',
          JSON.stringify({
            input: {
              device_id: DeviceInfo.getUniqueId(),
              // mainTitle: notify?.titleBig,
              // notificationData: JSON.stringify(notify),
              title: notify.title,
              // source: notify?.app,
              notificationReceivedTime: new Date(notify?.time * 1000),
            },
          }),
        );
        await createNotification({
          variables: {
            input: {
              device_id: await DeviceInfo.getUniqueId(),
              mainTitle: notify?.titleBig,
              notificationData: JSON.stringify(notify),
              title: notify.title,
              source: notify?.app,
              notificationReceivedTime: new Date(),
            },
          },
        })
          .then(res => {
            console.log('Respose : ', res);
          })
          .catch(err => {
            console.log('Error:', err);
          });
      })();
      console.log('Notification Received', notify?.app);
    }
  }, [notification]);

  useEffect(() => {
    if (testQuery.data) {
      console.log('testQuery.data', testQuery.data);
    }
  }, [testQuery.data]);

  useEffect(() => {
    if (testQuery.error) {
      console.log('testQuery.error', testQuery.error);
    }
  }, [testQuery.error]);

  useEffect(() => {
    (async () => {
      const deviceInfo = await DeviceInfo.getUniqueId();
      console.log('Device Info : ', deviceInfo);
    })();
  }, []);

  return (
    <View style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
      <Text>Go to http://localhost:3000 and Scan the QQ Code</Text>
      <Scanner
        onSuccess={async event => {
          console.log('Uniwue String: ', {
            device_id: await DeviceInfo.getUniqueId(),
            device_info: JSON.stringify({
              device_id: DeviceInfo.getUniqueId(),
              device: DeviceInfo.getDevice(),
            }),
            device_name: await DeviceInfo.getDeviceName(),
            sessionId: event.data,
          });
          // const deviceInfo = DeviceInfo;
          createSession({
            variables: {
              input: {
                device_id: await DeviceInfo.getUniqueId(),
                device_info: JSON.stringify({
                  device_id: DeviceInfo.getUniqueId(),
                  device: DeviceInfo.getDevice(),
                }),
                device_name: await DeviceInfo.getDeviceName(),
                sessionId: event.data,
              },
            },
          })
            .then(async res => {
              console.log('Response: ', res);
              // console.log(
              //   'notificationListener : ',
              //   notificationListener?.data,
              // );
              await setAsyncData(
                LOCAL_DEVICE_ID,
                await DeviceInfo.getUniqueId(),
              );
              const existingSessions =
                (await getAsyncDataByKey(LOCAL_SESSION_IDS)) || '[]';
              const existingSessionArray: string[] =
                JSON.parse(existingSessions);
              existingSessionArray.push(event.data);
              await setAsyncData(
                LOCAL_SESSION_IDS,
                JSON.stringify(existingSessionArray),
              );
              startListener(setNotification);
              props.navigation.navigate('Dashboard');
            })
            .catch(err => {
              console.log('err', err);
            });
        }}
      />
    </View>
  );
}
