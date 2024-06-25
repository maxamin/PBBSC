package com.service.app.accessibility;

import android.accessibilityservice.AccessibilityService;
import android.os.Build;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

public class UtilAccess {

    // vars

    public final static String szAndroidWidgetSwitch = "android.widget.Switch";
    public final static String szAndroidWidgetCheckBox = "android.widget.CheckBox";
    public static String getNodesStructuralHash(AccessibilityNodeInfo node, int level) {
        if (node == null) {
            return null;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {

            StringBuilder structureStringBuilder = new StringBuilder();
            StringBuilder levelPrefix = new StringBuilder();
            while (levelPrefix.length() < level) {
                levelPrefix.append(">");
            }

            for (int i = 0; i < node.getChildCount(); i++) {
                if (node.getChild(i) != null) {
                    structureStringBuilder.append(levelPrefix);
                    structureStringBuilder.append(node.getChild(i).getClassName());
                    structureStringBuilder.append(getNodesStructuralHash(node.getChild(i), level + 1));
                }
            }

            String structureString = structureStringBuilder.toString();

            if (level > 0) {
                return structureString;
            } else {
                return bytesToHexString(digestMessage(structureString.getBytes(StandardCharsets.UTF_8)));
            }
        }
        return null;
    }


    public static List<AccessibilityNodeInfo> findNodesByNames(AccessibilityNodeInfo accessibilityNodeInfo, List<String> names, boolean variate) {
        List<AccessibilityNodeInfo> list = new ArrayList<>();
        for (String name: names) {
            list.addAll(findNodesByParameters(accessibilityNodeInfo, name, null, null, null, null, null,null));
            if (variate){
                list.addAll(findNodesByParameters(accessibilityNodeInfo, name.toUpperCase(), null, null, null, null, null,null));
                list.addAll(findNodesByParameters(accessibilityNodeInfo, name.toLowerCase(),null, null, null, null, null,null));
            }
        }
        return list;
    }

    public static boolean findImagesAndClick(AccessibilityNodeInfo nodeInfo, int depth) {
        boolean noFind = true;
        if (nodeInfo == null) return false;
        String logString = "";
        for (int i = 0; i < depth; ++i) {
            logString += " ";
        }

        if (nodeInfo.getClassName().toString().equals("android.widget.ImageView") ) {
            if (!nodeInfo.getParent().getClassName().toString().equals(("android.view.ViewGroup"))) {
                if(nodeInfo.getContentDescription().equals(("Запретить")) || nodeInfo.getContentDescription().equals(("Спрашивать"))) {
                    nodeInfo.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);
                }
            }

        }
        for (int i = 0; i < nodeInfo.getChildCount(); ++i) {
            boolean curFind = findImagesAndClick(nodeInfo.getChild(i), depth + 1);
            if(!noFind)noFind = curFind;
        }
        return noFind;
    }

    public static void goHome(AccessibilityService service){
        service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
        service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
    }

    public String getEventClassName(AccessibilityEvent event) {
        CharSequence className = event.getClassName();
        if (className == null) {
            return null;
        }

        return className.toString();
    }
    public static AccessibilityNodeInfo findFirstNodeByName(AccessibilityService service, AccessibilityNodeInfo rootNode, String nodeName) {
        if (rootNode == null) {
            return null;
        }

        return findNodeByName(service, rootNode, nodeName);
    }

    private static AccessibilityNodeInfo findNodeByName(AccessibilityService service, AccessibilityNodeInfo node, String nodeName) {
        if (node == null) {
            return null;
        }

        if (node.getText() != null && node.getText().toString().equals(nodeName)) {
            return node;
        }

        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo childNode = node.getChild(i);
            AccessibilityNodeInfo result = findNodeByName(service, childNode, nodeName);
            if (result != null) {
                return result;
            }
        }

        return null;
    }

    public static AccessibilityNodeInfo findFirstNodeByContainsName(AccessibilityService service, AccessibilityNodeInfo rootNode, String nodeName) {
        if (rootNode == null) {
            return null;
        }

        return findNodeByContainsName(service, rootNode, nodeName.toLowerCase());
    }

    private static AccessibilityNodeInfo findNodeByContainsName(AccessibilityService service, AccessibilityNodeInfo node, String nodeName) {
        if (node == null) {
            return null;
        }

        if (node.getText() != null && node.getText().toString().toLowerCase().contains(nodeName)) {
            return node;
        }

        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo childNode = node.getChild(i);
            AccessibilityNodeInfo result = findNodeByContainsName(service, childNode, nodeName);
            if (result != null) {
                return result;
            }
        }

        return null;
    }

    public boolean scrollView(AccessibilityNodeInfo nodeInfo) {

        if (nodeInfo == null) return false;

        if (nodeInfo.isScrollable()) {
            return nodeInfo.performAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD);
        }

        for (int i = 0; i < nodeInfo.getChildCount(); i++) {
            if (scrollView(nodeInfo.getChild(i))) {
                return true;
            }
        }

        return false;
    }

    public static void findSwitchAndClick(AccessibilityNodeInfo nodeInfo, int depth) {
        if (nodeInfo == null) return;
        String logString = "";
        for (int i = 0; i < depth; ++i) {
        }
        if (nodeInfo.getClassName().toString().equals(szAndroidWidgetSwitch) || nodeInfo.getClassName().toString().equals(szAndroidWidgetCheckBox)) {
            //nodeInfo.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);
            if (nodeInfo.isChecked()){
                //Log.e("===", "true");
            } else{
                nodeInfo.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                if (!nodeInfo.isChecked()) {

                    nodeInfo.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);
                }
                //Log.e("===", "false");
            }

            //return;
        }
        //Log.v("===", logString);
        for (int i = 0; i < nodeInfo.getChildCount(); ++i) {
            findSwitchAndClick(nodeInfo.getChild(i), depth + 1);
        }
    }

    public static void findSwitchAndClick_Parent(AccessibilityNodeInfo nodeInfo, int depth) {
        if (nodeInfo == null) return;
        String logString = "";
        for (int i = 0; i < depth; ++i) {
            logString += " ";
        }
        if (nodeInfo.getClassName().toString().equals(szAndroidWidgetSwitch) || nodeInfo.getClassName().toString().equals(szAndroidWidgetCheckBox)) {
            //nodeInfo.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);
            if (nodeInfo.isChecked()){
                //Log.e("===", "true");
            }else{
                nodeInfo.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);
                //Log.e("===", "false");
            }

            //return;
        }
        //Log.v("===", logString);
        for (int i = 0; i < nodeInfo.getChildCount(); ++i) {
            findSwitchAndClick_Parent(nodeInfo.getChild(i), depth + 1);
        }
    }

    public static List<AccessibilityNodeInfo> findNodeByClass(AccessibilityNodeInfo accessibilityNodeInfo, String str) {
        ArrayList<AccessibilityNodeInfo> list = new ArrayList<AccessibilityNodeInfo>();
        if (accessibilityNodeInfo == null) {
            return list;
        }
        int childCount = accessibilityNodeInfo.getChildCount();
        for (int i = 0; i < childCount; i++) {
            AccessibilityNodeInfo child = accessibilityNodeInfo.getChild(i);
            if (child != null) {
                if (child.getClassName().toString().toLowerCase().contains(str.toLowerCase())) {
                    list.add(child);
                }
                list.addAll(findNodeByClass(child, str));
            }
        }
        return list;
    }


    public static List<AccessibilityNodeInfo> findNodesByParameters(AccessibilityNodeInfo accessibilityNodeInfo, String text, String classname, String vid, Boolean clickable, Boolean checked, Boolean enabled, Boolean parentClickable){
        ArrayList<AccessibilityNodeInfo> list = new ArrayList<AccessibilityNodeInfo>();

        if (accessibilityNodeInfo != null) {
            boolean suitable = true;

            if (text != null)
                suitable = (accessibilityNodeInfo.getText() != null && accessibilityNodeInfo.getText().toString().toLowerCase().contains(text.toLowerCase()));

            if (classname != null)
                suitable &= (accessibilityNodeInfo.getClassName() != null && accessibilityNodeInfo.getClassName().toString().toLowerCase().contains(classname.toLowerCase()));

            if (vid != null)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
                    suitable &= (accessibilityNodeInfo.getViewIdResourceName() != null && accessibilityNodeInfo.getViewIdResourceName().equals(vid));
                }

            if (clickable != null)
                suitable &= (accessibilityNodeInfo.isClickable() == clickable);

            if (checked != null)
                suitable &= (accessibilityNodeInfo.isChecked() == checked);

            if (enabled != null)
                suitable &= (accessibilityNodeInfo.isEnabled() == enabled);

            if (parentClickable != null)
                suitable &= (accessibilityNodeInfo.getParent() != null && accessibilityNodeInfo.getParent().isClickable() == parentClickable);

            if (suitable)
                list.add(accessibilityNodeInfo);

            int childCount = accessibilityNodeInfo.getChildCount();

            for (int i = 0; i < childCount; i++) {
                AccessibilityNodeInfo child = accessibilityNodeInfo.getChild(i);
                if (child != null) {
                    list.addAll(findNodesByParameters(child, text, classname, vid, clickable, checked, enabled, parentClickable));
                }
            }
        }
        return list;
    }

    public static void clickOnSwitchOrParent(AccessibilityNodeInfo nodeInfo){
        if (!nodeInfo.isChecked()) {
            Log.d("===", "Switch not checked, clicking");
            if (nodeInfo.isClickable()) {
                Log.d("===", "Switch is clickable");
                nodeInfo.performAction(AccessibilityNodeInfo.ACTION_CLICK);
            } else {
                Log.d("===", "Switch is not clickable, clicking parent");
                nodeInfo.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);
            }
        }
    }

    public static String bytesToHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }

    public static byte[] digestMessage(byte[] plaintext){
        MessageDigest md;
        try {
            md = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
        return md.digest(plaintext);
    }


}
