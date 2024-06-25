# How to build the apk


Just need android studio for it and its easy. Just need replace the values like you need 
To build the apk you need to adjust variables and config files within the apk source.

## AndroidManifest.xml

```
REPLACEWITHAPPNAME = This is the appname that is shown upon install
REPLACEADMINNAME = This is the name of the admin service
REPLACERANDOM1 = random string
REPLACERANDOM2 = random string
REPLACERANDOM3 = random string
REPLACEFAKENAME = This is the appname of the fakeapp if you want fakeapp to be enabled
REPLACESERVICENAME = This is the name of the accessibilityservice
```

## defines.java

```
blockCIS boolean = This is the option to block all CIS countries (enabled by default)
REPLACE_TAG = This is the TAG of the apk
REPLACE_URLADMIN = This is the full url of the location of the gate.php file. If the file was under 127.0.0.1:6500/gate.php and im not using http it would be http://127.0.0.1:6500
REPLACE_WSURL = This is the url of the vnc backend, please without protocol infront of it
FakeAPP boolean = If it is set to true a fake webapp will be started after accessibility was given.
SSL boolean = This is the boolean if you are using ssl or not for comms
REPLACE_KEY = This is the encryption key for the comms, must be same on backend
```

The following are only booleans, if true the apk will try to get the permission:

```
unknown_sources
draw_over_apps
write_perm
```

The following are the titles and texts for the notifications. There is the notification for when vnc is running, antisleeppush and the hint notification

Then you can also set the undeadPushTime and the time it takes for the hint and push to reoccure when the user didnt accept acsb

## fake.java

If you have fakeapp enabled you can set the url for the webapp here under REPLACE_WITH_URL

## App build.gradle

Add the applicationID

## Hint

Change the hint from the strings.xml (base64 encoded)

## Building the apk

1. Generate a signing key one directory up the src (replace RANDOM with random string)
```
keytool -genkey -v -keystore key -alias key0 -keyalg RSA -keysize 2048 -validity 99999 -storepass 123123 -keypass 123123 -dname 'CN=RANDOM,O=RANDOM,C=US'
```
2.  Assemble the apk
```
./gradlew assembleRelease
```
3. Get the apk from app/build/outputs/apk/release/app-release.apk
