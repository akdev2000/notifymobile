import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  VirtualizedList,
} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getAsyncDataByKey,
  LOCAL_DEVICE_ID,
  LOCAL_SESSION_IDS,
  logout,
} from '../utils/helpers';
import {gql} from 'apollo-boost';
import {
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client';
import {getDeviceId, usePowerState} from 'react-native-device-info';
import {Card, Image, ThemeProvider} from 'react-native-elements';
import FontAweSomeIcon from 'react-native-vector-icons/FontAwesome';

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
        browser_name
        os
        createdAt
      }
    }
  }
`;

const SESSION_LOG_OUT_LISTENER = gql`
  subscription logoutListener {
    logoutListener {
      device_id
      session_id
    }
  }
`;

export default function Dashboard(props: any) {
  const [logoutDevice, logoutDeviceResponse] = useMutation(LOGOUT);
  const [getAllAvailableSession, getAllAvailableSessionResponse] = useLazyQuery(
    GET_ALL_AVAILABLE_SESSION,
    {
      fetchPolicy: 'no-cache',
    },
  );
  const sessionLogoutListener = useSubscription(SESSION_LOG_OUT_LISTENER);

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
    if (sessionLogoutListener?.data) {
      console.log(
        'sessionLogoutListener?.data : ',
        sessionLogoutListener?.data,
      );
      (async () => {
        if (sessionLogoutListener?.data?.logoutListener) {
          const {session_id, device_id} =
            sessionLogoutListener?.data?.logoutListener;
          const existingSessions =
            (await getAsyncDataByKey(LOCAL_SESSION_IDS)) || '[]';
          const s_id: string[] = JSON.parse(existingSessions);
          const d_id = await getAsyncDataByKey(LOCAL_DEVICE_ID);

          if (d_id == device_id) {
            session_id?.map((sid: any) => {
              if (s_id.includes(sid)) {
                props.navigation.navigate('Home');
                logout();
              }
            });
          }
        }
      })();
    }
  }, [sessionLogoutListener?.data]);

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

  function findBrowserImage(browsername: string) {
    console.log('test', browsername);
    switch (browsername) {
      case 'chrome':
        return 'chrome';
      case 'firefox':
        return 'firefox';
      default:
        return 'chrome';
    }
  }

  return (
    <View
      style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
      {!getAllAvailableSessionResponse?.loading && (
        <View
          style={{
            width: '100%',
            padding: 5,
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          {getAllAvailableSessionResponse?.data?.getAvailableSessions?.UserSession.map(
            (session: any) => {
              return (
                <View
                  // title={session?.os}
                  style={{
                    backgroundColor: '#ffffff',
                    flexGrow: 1,
                    flexDirection: 'row',
                    width: '100%',
                    margin: 10,
                    padding: 10,
                    maxHeight: 80,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                  key={session?.session_id}>
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      flexGrow: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <FontAweSomeIcon
                      name={findBrowserImage(
                        session?.browser_name?.toLowerCase(),
                      )}
                      color="black"
                      size={30}
                    />
                    <View style={{marginLeft: 10}}>
                      <Text style={{fontWeight: 'bold', color: 'black'}}>
                        {session?.os}
                      </Text>
                      <Text style={styles.paragraph}>
                        Active From :{' '}
                        {new Date(session?.createdAt)?.toLocaleDateString()}{' '}
                        {new Date(session?.createdAt)?.toLocaleTimeString()}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Icon.Button
                      name="logout"
                      color={'black'}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      iconStyle={{fontSize: 20, color: '#ffffff'}}
                      onPress={async () => {
                        await logoutDevice({
                          variables: {
                            input: {
                              device_id: await getAsyncDataByKey(
                                LOCAL_DEVICE_ID,
                              ),
                              session_id: [session?.session_id],
                            },
                          },
                        });
                      }}
                      backgroundColor="#014EDE">
                      <Text style={{color: '#ffffff'}}>Logout</Text>
                    </Icon.Button>
                  </View>
                </View>
              );
            },
          )}
        </View>
      )}
      <View style={{marginBottom: 20}}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    color: '#34495e',
    fontSize: 15,
  },
});
