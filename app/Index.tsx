import React, { Component, useEffect } from 'react'
import { Text, View } from 'react-native'
import RNAndroidNotificationListener,{ RNAndroidNotificationListenerPermissionStatus } from "react-native-android-notification-listener"
import { startListener } from './Notification';
import { Scanner } from './Scanner';

export default function Index() {
    useEffect(() => {
        (async () => {
            const permission = await RNAndroidNotificationListener.getPermissionStatus();
            if(permission != "authorized") {
                RNAndroidNotificationListener.requestPermission();
            }
            startListener();
            console.log("Status : " , await RNAndroidNotificationListener.getPermissionStatus())
        })();
    }, [])
    return (
        <View style={{display:"flex" , alignItems:"center",marginTop:10}} >  
            <Text>Go to http://localhost:3000 and Scan the QQ Code</Text>
            <Scanner 
                onSuccess={(event) => {
                    console.log("Uniwue String: "  , event.data)
                }}
            />
        </View>
    )
}
