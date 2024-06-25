package com.service.app;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.PixelFormat;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.Image;
import android.media.ImageReader;
import android.os.Handler;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Looper;
import android.util.Base64;
import android.util.Log;
import android.view.Display;
import android.view.WindowManager;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;

public class CaptureActivity extends AppCompatActivity {
    private final Handler mHandler = new Handler(Looper.getMainLooper());
    private static final int REQUEST_MEDIA_PROJECTION = 1;
    private MediaProjection mMediaProjection;
    private static Boolean stop = false;
    private ImageReader mImageReader;
    private volatile boolean mStopHandler = false;
    private Display mDisplay;
    private VirtualDisplay mVirtualDisplay;
    private int mDensity;
    private int mWidth;
    private int mHeight;

    private String Image = "";
    Handler handler;
    Runnable runnable;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);
        LocalBroadcastManager.getInstance(this).registerReceiver(stopMediaProjectionReceiver, new IntentFilter("stop_mediaprojection"));
        requestScreenCapture();
    }

    private void requestScreenCapture() {
        MediaProjectionManager mediaProjectionManager = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            mediaProjectionManager = (MediaProjectionManager) getSystemService(Context.MEDIA_PROJECTION_SERVICE);
        }
        Intent permissionIntent = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            permissionIntent = mediaProjectionManager.createScreenCaptureIntent();
        }
        startActivityForResult(permissionIntent, REQUEST_MEDIA_PROJECTION);
    }

    private void startCaptureTimer(final int resultCode, Intent data) {
        if (!stop) {
            mStopHandler = false;
            startProjection(resultCode, data);
        } else {
            if (mMediaProjection != null) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    mMediaProjection.stop();
                }
                mMediaProjection = null;
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_MEDIA_PROJECTION) {
            if (resultCode == RESULT_OK) {
                stop = false;
                startCaptureTimer(resultCode,data);
            } else {
                Intent captureServiceIntent = new Intent(this, CaptureService.class);
                captureServiceIntent.setAction(CaptureService.ACTION_STOP_CAPTURE);
                startService(captureServiceIntent);
            }
        }
    }


    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    private class ImageAvailableListener implements ImageReader.OnImageAvailableListener {



        @Override
        public void onImageAvailable(ImageReader reader) {
            Image image = null;
            Bitmap bitmap = null;
            ByteBuffer buffer = null;
            byte[] byteArray = null;
            ByteArrayOutputStream byteArrayOutputStream = null;
            try {
                image = reader.acquireLatestImage();
                if (image != null) {
                    Image.Plane[] planes = image.getPlanes();
                    buffer = planes[0].getBuffer();
                    int pixelStride = planes[0].getPixelStride();
                    int rowStride = planes[0].getRowStride();
                    int rowPadding = rowStride - pixelStride * mWidth;

                    bitmap = Bitmap.createBitmap(mWidth + rowPadding / pixelStride, mHeight, Bitmap.Config.ARGB_8888);
                    bitmap.copyPixelsFromBuffer(buffer);

                    Bitmap croppedBitmap = Bitmap.createBitmap(bitmap, 0, 0, mWidth, mHeight);

                    byteArrayOutputStream = new ByteArrayOutputStream();
                    croppedBitmap.compress(Bitmap.CompressFormat.JPEG, 20, byteArrayOutputStream);
                    byteArray = byteArrayOutputStream.toByteArray();

                    String base64Image = Base64.encodeToString(byteArray, Base64.DEFAULT);
                    Image = base64Image;

                    if (image != null) {
                        image.close();
                    }
                    if (bitmap != null) {
                        bitmap.recycle();
                    }
                    if (byteArrayOutputStream != null) {
                        try {
                            byteArrayOutputStream.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if (buffer != null) {
                        buffer.clear();
                    }
                }
            } catch (Exception e) {
                Log.d("mytag", String.valueOf(e));
            }
        }
    }


    private void startProjection(int resultCode, Intent data) {
        MediaProjectionManager mpManager = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            mpManager = (MediaProjectionManager) getSystemService(Context.MEDIA_PROJECTION_SERVICE);
        }
        if (mMediaProjection == null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                mMediaProjection = mpManager.getMediaProjection(resultCode, data);
            }
            if (mMediaProjection != null) {
                mDensity = Resources.getSystem().getDisplayMetrics().densityDpi;
                WindowManager windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
                mDisplay = windowManager.getDefaultDisplay();
                createVirtualDisplay();

                handler = new Handler();

                runnable = new Runnable() {
                    @Override
                    public void run() {

                        sendBroadcast(Image);
                        handler.postDelayed(this, 500);
                    }
                };

                handler.post(runnable);

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    mMediaProjection.registerCallback(new MediaProjectionStopCallback(), mHandler);
                }
            }
        }
    }

    private static int getVirtualDisplayFlags() {
        return DisplayManager.VIRTUAL_DISPLAY_FLAG_OWN_CONTENT_ONLY | DisplayManager.VIRTUAL_DISPLAY_FLAG_PUBLIC;
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    private class MediaProjectionStopCallback extends MediaProjection.Callback {
        @Override
        public void onStop() {
            Log.e("mytag", "stopping projection.");
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    handler.removeCallbacks(runnable);
                    if (mVirtualDisplay != null) mVirtualDisplay.release();
                    if (mImageReader != null) mImageReader.setOnImageAvailableListener(null, null);
                    if (mMediaProjection != null){
                        mMediaProjection.unregisterCallback(MediaProjectionStopCallback.this);
                    }
                }
            });
        }
    }

    @SuppressLint("WrongConstant")
    private void createVirtualDisplay() {

        mWidth = Resources.getSystem().getDisplayMetrics().widthPixels;
        mHeight = Resources.getSystem().getDisplayMetrics().heightPixels;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            mImageReader = ImageReader.newInstance(mWidth, mHeight, PixelFormat.RGBA_8888, 2);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            mVirtualDisplay = mMediaProjection.createVirtualDisplay("screencap", mWidth, mHeight,
                    mDensity, getVirtualDisplayFlags(), mImageReader.getSurface(), null, mHandler);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            mImageReader.setOnImageAvailableListener(new ImageAvailableListener(), mHandler);
        }
    }



    private final BroadcastReceiver stopMediaProjectionReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            stop = true;
            if (mMediaProjection != null){
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    mMediaProjection.stop();
                }
                mMediaProjection = null;
            }
            finish();
        }
    };

    @Override
    protected void onDestroy() {
        super.onDestroy();

        LocalBroadcastManager.getInstance(this).unregisterReceiver(stopMediaProjectionReceiver);
    }



    private void sendBroadcast(String base64Image) {
        Intent intent = new Intent("com.app.SCREEN_CAPTURE");
        intent.putExtra("base64Image", base64Image);
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
    }
}
