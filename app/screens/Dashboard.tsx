import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getAsyncDataByKey,
  LOCAL_DEVICE_ID,
  LOCAL_SESSION_IDS,
  logout,
} from '../utils/helpers';
import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/client';

const LOGOUT = gql`
  mutation logout($input: NotificationInputType!) {
    logout(input: $input)
  }
`;

export default function Dashboard(props: any) {
  const [logoutDevice, logoutDeviceResponse] = useMutation(LOGOUT);

  useEffect(() => {
    if (logoutDeviceResponse?.data) {
      props.navigation.navigate('Home');
      logout();
    }
  }, [logoutDeviceResponse?.data]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <View>
            <Icon.Button
              name="qr-code-scanner"
              color={'black'}
              iconStyle={{fontSize: 40}}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                console.log('Pressed');
                props.navigation.navigate('Scan');
              }}
              backgroundColor="#ffffff"></Icon.Button>
          </View>
        );
      },
    });
  }, []);

  useEffect(() => {
    (async () => {
      const sessionIds = await getAsyncDataByKey(LOCAL_SESSION_IDS);
      const device_id = await getAsyncDataByKey(LOCAL_DEVICE_ID);
      console.log('sessionIds : ', sessionIds);
      if (!sessionIds || !device_id) {
        props.navigation.navigate('Home');
      }
    })();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Icon.Button
        name="logout"
        color={'black'}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        iconStyle={{fontSize: 30, color: '#ffffff'}}
        onPress={async () => {
          let sessionIdArray: string[] = JSON.parse(
            (await getAsyncDataByKey(LOCAL_SESSION_IDS)) || '[]',
          );
          console.log('Data : ', {
            device_id: await getAsyncDataByKey(LOCAL_DEVICE_ID),
            session_id: sessionIdArray,
          });
          await logoutDevice({
            variables: {
              input: {
                device_id: await getAsyncDataByKey(LOCAL_DEVICE_ID),
                session_id: sessionIdArray,
              },
            },
          });
        }}
        backgroundColor="#014EDE">
        <Text style={{color: '#ffffff'}}>Logout</Text>
      </Icon.Button>
    </View>
  );
}
