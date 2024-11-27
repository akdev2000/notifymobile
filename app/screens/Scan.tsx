import {gql, useMutation, useQuery, useSubscription} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {Text, ToastAndroid, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Scanner} from '../components/Scanner';
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

export type InputType = {
  input: {
    device_id: string;
    source: string;
    title: string;
    mainTitle: string;
    notificationData: string;
    notificationReceivedTime: Date;
  };
};

export type NotificationOutputType = {
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

export type SessionInputProps = {
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
  const [createNotification, createNotificationResponse] = useMutation<
    NotificationOutputType,
    InputType
  >(CREATE_NOTIFICATION);
  const testQuery = useQuery(test);
  


  useEffect(() => {
    if (createSessionResponse?.error) {
      ToastAndroid.show(
        createSessionResponse?.error?.message,
        ToastAndroid.LONG,
      );
    }
  }, [createSessionResponse?.error]);

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
