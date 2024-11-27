package com.notifymobile;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

public class NotificationService extends NotificationListenerService {

    private static final String TAG = "NotificationService";

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        String title = sbn.getNotification().extras.getString("android.title");
        String text = sbn.getNotification().extras.getString("android.text");
        String notificationData = "{ \"package\": \"" + packageName + "\", \"title\": \"" + title + "\", \"text\": \"" + text + "\" }";
        Log.d(TAG, "Notification Posted - Package: " + packageName + ", Title: " + title + ", Text: " + text);
        NotificationModule.sendEventToReactNative("onNotificationPosted" , notificationData);
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        Log.d(TAG, "Notification Removed - Package: " + sbn.getPackageName());
        String notificationData = "{ id" + sbn.getId() + "}";
        NotificationModule.sendEventToReactNative("onNotificationRemoved" , notificationData);
    }
}
