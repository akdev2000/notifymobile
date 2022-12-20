import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getAsyncDataByKey, logout} from '../utils/helpers';
import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/client';

const LOGOUT = gql`
  mutation logout($input: NotificationInputType!) {
    logout(input: $input)
  }
`;

export default function Dashboard(props: any) {
  const [logoutDevice, logoutDeviceResponse] = useMutation(LOGOUT);
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
          console.log('Pressed');
          props.navigation.navigate('Home');
          await logoutDevice({
            variables: {
              input: {
                device_id: await getAsyncDataByKey('deviceId'),
                session_id: await getAsyncDataByKey('sessionId'),
              },
            },
          });
          logout();
        }}
        backgroundColor="#014EDE">
        <Text style={{color: '#ffffff'}}>Logout</Text>
      </Icon.Button>
    </View>
  );
}
