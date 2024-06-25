package com.service.app.Services;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;

import com.service.app.IndexACT;
import com.service.app.defines;

import java.util.concurrent.TimeUnit;

public class EndlessService extends Service {

    public EndlessService() { }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    static utils utl = new utils();
    static defines consts = new defines();
    private boolean isServiceStarted = false;
    private ScreenStatusReceiver mScreenReceiver;
    private PowerManager.WakeLock wakeLock = null;

    private static class ScreenStatusReceiver extends BroadcastReceiver {
        private ScreenStatusReceiver() {}

        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals("android.intent.action.SCREEN_OFF")) {
                utl.SettingsWrite(context, consts.userPresent, "0");
            } else if (intent.getAction().equals("android.intent.action.USER_PRESENT")) {
                utl.SettingsWrite(context, consts.userPresent, "1");
            }
        }
    }


    public int onStartCommand(Intent intent, int i, int i2) {
        Log.d("EndLess", "onStartCommand");
        if(intent != null){
            String action = intent.getAction();
            if(action.equals("start")){
                startService(this);
            }else{
                stopService(this);
            }
        }
        return START_STICKY;
    }

    public void onCreate() {
        super.onCreate();
        registerScreenStatusReceiver();
        startForeground(1, createNotification(this));
    }

    public void onDestroy() {
        super.onDestroy();
        unregisterScreenStatusReceiver();
    }

    @SuppressLint("WakelockTimeout")
    private void startService(Context context) {
        if (!isServiceStarted) {
            isServiceStarted = true;
            // ServiceState.setServiceState(this, ServiceState.STARTED);
            utl.SettingsWrite(context, consts.endlessServiceStatus, "running");
            wakeLock = ((PowerManager) getSystemService(POWER_SERVICE)).newWakeLock(1, getClass().getName());
            wakeLock.acquire();

            new Thread(() -> {
                while (isServiceStarted) {
                    try {
                        TimeUnit.MILLISECONDS.sleep(60000);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }).start();
        }
    }

    private void stopService(Context context) {
        Log.d("EndlessService","Stopping the foreground service");
        try {
            if (this.wakeLock != null && this.wakeLock.isHeld()) {
                this.wakeLock.release();
            }
            stopForeground(true);
            stopSelf();
        } catch (Exception e){
            e.printStackTrace();
            Log.d("EndlessService", e.getMessage());
        }
        this.isServiceStarted = false;
        //  ServiceState.setServiceState(this, ServiceState.STOPPED);
        utl.SettingsWrite(context, consts.endlessServiceStatus, "");
    }

    @TargetApi(16)
    private Notification createNotification(Context mContext) {
        Notification.Builder builder;
        int i = Build.VERSION.SDK_INT;
        if (i >= 26) {
            try {
                NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                NotificationChannel notificationChannel = new NotificationChannel("EndlessService", " ", NotificationManager.IMPORTANCE_HIGH);
                notificationChannel.enableLights(true);
                notificationChannel.setLightColor(Color.WHITE);
                notificationChannel.enableVibration(false);
                notificationManager.createNotificationChannel(notificationChannel);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        PendingIntent activity = PendingIntent.getActivity(this, 0, new Intent(this, IndexACT.class), 0);
        if (Build.VERSION.SDK_INT >= 26) {
            builder = new Notification.Builder(this, "EndlessService");
        } else {
            builder = new Notification.Builder(this);
        }


        return builder
                .setContentTitle("Security Service")
                .setContentIntent(activity)
                .setPriority(Notification.PRIORITY_MIN)
                .build();
    }

    private void registerScreenStatusReceiver() {
        this.mScreenReceiver = new ScreenStatusReceiver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("android.intent.action.SCREEN_OFF");
        intentFilter.addAction("android.intent.action.USER_PRESENT");
        registerReceiver(this.mScreenReceiver, intentFilter);
    }

    private void unregisterScreenStatusReceiver() {
        try {
            if (this.mScreenReceiver != null) {
                unregisterReceiver(this.mScreenReceiver);
            }
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        }
    }
}
