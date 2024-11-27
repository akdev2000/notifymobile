package com.notifymobile;

import android.content.Intent;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class NotificationModule extends ReactContextBaseJavaModule {
    static ReactApplicationContext context;
    public NotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "NotificationModule";
    }

    @ReactMethod
    public void initializeNotificationPermission() {
        if (!isNotificationAccessEnabled()) {
            // Redirect to Notification Access Settings
            Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getReactApplicationContext().startActivity(intent);
        }
    }

    private boolean isNotificationAccessEnabled() {
        String enabledListeners = Settings.Secure.getString(
                getReactApplicationContext().getContentResolver(),
                "enabled_notification_listeners"
        );
        String packageName = getReactApplicationContext().getPackageName();

        return !TextUtils.isEmpty(enabledListeners) && enabledListeners.contains(packageName);
    }
    public static void sendEventToReactNative(String eventName, String data) {
        Log.d("Data ", context.toString());
        if (context != null) {
            context
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, data);
        }
    }
}
