import React, {Component, useEffect} from 'react';
import {Text, View} from 'react-native';
import RNAndroidNotificationListener, {
  RNAndroidNotificationListenerPermissionStatus,
} from 'react-native-android-notification-listener';
import {startListener} from './Notification';
import {Scanner} from './Scanner';
import {gql, useMutation, useQuery} from '@apollo/client';
const CREATE_SESSION = gql`
  mutation add_session($userid: String!, $meta_data: String!) {
    add_session(input: {userid: $userid, meta_data: $meta_data})
  }
`;

const test = gql`
  query test {
    test
  }
`;

export default function Index() {
  const [createSession, createSessionResponse] = useMutation(CREATE_SESSION);
  const testQuery = useQuery(test);
  useEffect(() => {
    (async () => {
      const permission =
        await RNAndroidNotificationListener.getPermissionStatus();
      if (permission != 'authorized') {
        RNAndroidNotificationListener.requestPermission();
      }
      startListener();
      console.log(
        'Status : ',
        await RNAndroidNotificationListener.getPermissionStatus(),
      );
    })();

    console.log('testQuery.data', testQuery.error);
  }, []);

  useEffect(() => {
    if (testQuery.data) {
      console.log('testQuery.data', testQuery.data);
    }
  }, [testQuery.data]);
  return (
    <View style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
      <Text>Go to http://localhost:3000 and Scan the QQ Code</Text>
      <Scanner
        onSuccess={event => {
          console.log('Uniwue String: ', event.data);

          createSession({
            variables: {
              userid: event.data,
              meta_data: event,
            },
          })
            .then(res => {
              console.log('Response: ', res);
            })
            .catch(err => {
              console.log('err', err);
            });
        }}
      />
    </View>
  );
}
