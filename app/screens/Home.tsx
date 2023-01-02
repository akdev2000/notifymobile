import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getAsyncDataByKey} from '../utils/helpers';
import Lottie from 'lottie-react-native';
import lottie from '../utils/mobile_notification.json';
import {Button} from 'react-native-elements';

export default function Home(props: any) {
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
        <View style={{marginBottom: 10, marginTop: 10}}>
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
        <View style={{marginTop: 10}}>
          <Icon.Button
            name="qr-code-scanner"
            color={'black'}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            iconStyle={{fontSize: 30, color: '#ffffff'}}
            onPress={() => {
              // console.log("Test")
              props.navigation.navigate('Scan');
            }}
            backgroundColor="#014EDE">
            <Text style={{color: '#ffffff'}}>Connect Now</Text>
          </Icon.Button>
        </View>
      </View>
      <View>
        <Lottie source={lottie} autoPlay loop />
      </View>
    </View>
  );
}
