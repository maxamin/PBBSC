package com.service.app.Main;

import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import okhttp3.internal.concurrent.TaskRunner;

public class ScheduledTaskRunner {
    private final ScheduledExecutorService executor;
    private final Handler handler = new Handler(Looper.getMainLooper());

    public ScheduledTaskRunner(int maxThreads){
        executor = Executors.newScheduledThreadPool(maxThreads);
    }

    public <T> void executeAsyncFixedDelay(BotOperationTask<T> task, Context context){
        executor.scheduleWithFixedDelay(
                () -> {
                    final T result;
                    try {
                        if (!task.enabled)
                            return;

                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                            result = task.function.apply(handler, context);
                        if (!task.silent && task.callback != null) {
                            handler.post(() -> {
                                task.callback.accept(result);
                            });
                        }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                },
                task.initialDelay,
                task.delay,
                TimeUnit.MILLISECONDS
        );
    }

    public <T> void executeAsyncFixedDelaySilent(Function<Handler, T> function, int initialDelay, int delay, TimeUnit unit) {
        executor.scheduleWithFixedDelay(() -> {
            final T result;
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    function.apply(handler);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, initialDelay, delay, unit);
    }
}

