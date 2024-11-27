package com.notifymobile;

import android.content.Context;
import android.provider.Settings;
import android.text.TextUtils;

import java.security.AccessController;

public class Utils {
    public static boolean isNotificationAccessGranted(Context context) {
        String packageName = context.getPackageName();
        String enabledListeners = Settings.Secure.getString(
                context.getContentResolver(),
                "enabled_notification_listeners"
        );

        if (!TextUtils.isEmpty(enabledListeners)) {
            String[] listeners = enabledListeners.split(":");
            for (String listener : listeners) {
                if (listener.contains(packageName)) {
                    return true; // Permission is granted
                }
            }
        }
        return false; // Permission is not granted
    }
}
