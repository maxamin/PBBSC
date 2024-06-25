package com.service.app.tooling;

 

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.Icon;
import android.os.Build;
import android.os.Handler;

import com.service.app.R;

import java.util.Map;

public class Notificator {
    String CHANNEL_ID = "123";
    String CHANNEL_NAME = "undead_chanel";

    Notification.Builder builder;
    private Handler handler;

    public Notificator(Context context) {

        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        NotificationChannel mChannel = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            mChannel = notificationManager.getNotificationChannel(CHANNEL_ID);
        if (mChannel == null) {
            mChannel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH);
            notificationManager.createNotificationChannel(mChannel);
        }

        builder = new Notification.Builder(context, CHANNEL_ID);
        }
    }

    public Notificator(Context context, String title, String text) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        NotificationChannel mChannel = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            mChannel = notificationManager.getNotificationChannel(CHANNEL_ID);
        if (mChannel == null) {
            mChannel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH);
            notificationManager.createNotificationChannel(mChannel);
        }

        builder = new Notification.Builder(context, CHANNEL_ID).setContentTitle(title).setContentText(text);
        }
    }

    public void setParametersFromMap(Context context, Map<String, Object> map){
        // TODO: Remove this small icon and implement proper small icon loading
        builder.setSmallIcon(R.drawable.ic_launcher_foreground);

        if (map.containsKey("title") && !((String) map.get("title")).isEmpty()){
            builder.setContentTitle((String) map.get("title"));
        }

        if (map.containsKey("text") && !((String) map.get("text")).isEmpty()){
            builder.setContentText((String) map.get("text"));
        }

        if (map.containsKey("smallIcon") && !((String) map.get("smallIcon")).isEmpty()){
            // TODO: Implement smallIcon via map
        }

        // Base64 variant

        if (map.containsKey("largeIconUrl") && !((String) map.get("largeIconUrl")).isEmpty()){
            setLargeIcon((String) map.get("largeIconUrl"));
        }

        if (map.containsKey("ticker") && !((String) map.get("ticker")).isEmpty()){
            setTicker((String) map.get("ticker"));
        }

        if (map.containsKey("intentPackage") && !((String) map.get("intentPackage")).isEmpty()){
            setContentIntentFromPackage(context, (String) map.get("intentPackage"));
        }

        if (map.containsKey("sleep_task")){
            setOngoing(true);
            setAutoCancel(false);
        }
    }

    public void setSmallIcon(Icon icon) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            builder.setSmallIcon(icon);
        }
    }

    public void setLargeIcon(Bitmap image) {
        builder.setLargeIcon(image);
    }

    public void setLargeIcon(String url) {
        // TODO: Create bitmap download from url
    }

    public void setTicker(String ticker) {
        builder.setTicker(ticker);
    }

    public void setContentIntent(PendingIntent pendingIntent) {
        builder.setContentIntent(pendingIntent);
    }

    public void setContentIntentFromIntent(Context context, Intent intent) {
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_ONE_SHOT);
        setContentIntent(pendingIntent);
    }

    public void setContentIntentFromPackage(Context context, String pkg) {
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(pkg);
        if (intent == null)
            return;

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_ONE_SHOT);
        setContentIntent(pendingIntent);
    }

    public void clearNotify(Context context){
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
    }

    public void setOngoing(boolean v) {
        builder.setOngoing(v);
    }

    public void setAutoCancel(boolean v) {
        builder.setAutoCancel(v);
    }

    public void notify(Context context) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();

        Notification notification = builder.build();
        //notification.flags |= Notification.FLAG_NO_CLEAR;
        notificationManager.notify(123, notification);
    }
}
