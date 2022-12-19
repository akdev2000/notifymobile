import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Dashboard(props: any) {
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
        onPress={() => {
          console.log('Pressed');
          props.navigation.navigate('Home');
        }}
        backgroundColor="#014EDE">
        <Text style={{color:"#ffffff"}} >Logout</Text>
      </Icon.Button>
    </View>
  );
}
