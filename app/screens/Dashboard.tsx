import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getAsyncDataByKey,
  LOCAL_DEVICE_ID,
  LOCAL_SESSION_IDS,
  logout,
} from '../utils/helpers';
import {gql} from 'apollo-boost';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {getDeviceId, usePowerState} from 'react-native-device-info';
import {Card} from 'react-native-elements';

const LOGOUT = gql`
  mutation logoutAll($input: NotificationInputType!) {
    logoutAll(input: $input)
  }
`;

const GET_ALL_AVAILABLE_SESSION = gql`
  query getAvailableSessions($input: GetAllSessionsInput!) {
    getAvailableSessions(input: $input) {
      id
      device_id
      UserSession {
        id
        session_id
      }
    }
  }
`;

export default function Dashboard(props: any) {
  const [logoutDevice, logoutDeviceResponse] = useMutation(LOGOUT);
  const [getAllAvailableSession, getAllAvailableSessionResponse] = useLazyQuery(
    GET_ALL_AVAILABLE_SESSION,
  );

  useEffect(() => {
    if (logoutDeviceResponse?.data) {
      props.navigation.navigate('Home');
      logout();
    }
  }, [logoutDeviceResponse?.data]);

  useEffect(() => {
    (async () => {
      await getAllAvailableSession({
        variables: {
          input: {
            device_id: await getAsyncDataByKey(LOCAL_DEVICE_ID),
          },
        },
      });
    })();
  }, []);

  useEffect(() => {
    if (getAllAvailableSessionResponse?.data) {
      console.log(
        'getAllAvailableSession : ',
        getAllAvailableSessionResponse?.data,
      );
    }
  }, [getAllAvailableSessionResponse?.data]);

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
    <View
      style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
      {!getAllAvailableSessionResponse?.loading && (
        <View>
          {getAllAvailableSessionResponse?.data?.getAvailableSessions?.UserSession.map(
            (session: any) => {
              return (
                <Text style={{color:"black"}} > 
                  {session?.session_id}
                </Text>
                // <SafeAreaView>
                //   <View>
                //     <Card>
                //       {/*react-native-elements Card*/}
                //       <Text style={styles.paragraph}>
                //           {session?.session_id}
                //       </Text>
                //     </Card>
                //   </View>
                // </SafeAreaView>
                // <Card title="Local Modules">
                //   {/*react-native-elements Card*/}
                //   <Text style={{color: "black"}}>
                //     {session.session_id}
                //   </Text>
                // </Card>
              );
            },
          )}
        </View>
      )}
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
        <Text style={{color: '#ffffff'}}>Logout From All Device</Text>
      </Icon.Button>
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontWeight: 'bold',
    color: '#34495e',
  },
});
