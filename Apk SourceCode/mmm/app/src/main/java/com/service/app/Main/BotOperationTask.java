package com.service.app.Main;

import android.content.Context;
import android.os.Handler;

import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;

public class BotOperationTask<T> {
    public String name;

    public boolean repeating;
    public boolean silent;
    public boolean enabled;

    public int initialDelay;
    public int delay;

    public BiFunction<Handler, Context, T> function;
    public Consumer<T> callback;
    public Function<Context, Boolean> successful;

    private BotOperationTask(final BotOperationTask.Builder<T> builder) {
        name = builder.name;
        repeating = builder.repeating;
        silent = builder.silent;
        enabled = builder.enabled;
        initialDelay = builder.initialDelay;
        delay = builder.delay;
        function = builder.function;
        callback = builder.callback;
        successful = builder.successful;
    }

    public static class Builder<T> {
        private String name;
        private boolean repeating = false;
        private boolean silent = true;
        private boolean enabled = true;
        private int initialDelay = 0;
        private int delay = 0;
        private BiFunction<Handler, Context, T> function;
        private Consumer<T> callback;
        private Function<Context, Boolean> successful;

        public BotOperationTask.Builder<T> setName(final String name) {
            this.name = name;
            return this;
        }

        private BotOperationTask.Builder<T> setRepeating(boolean repeating) {
            this.repeating = repeating;
            return this;
        }

        private BotOperationTask.Builder<T> setSilent(boolean silent) {
            this.silent = silent;
            return this;
        }

        public BotOperationTask.Builder<T> isEnabled(boolean enabled) {
            this.enabled = enabled;
            return this;
        }


        public BotOperationTask.Builder<T> setInitialDelay(int initialDelay) {
            this.initialDelay = initialDelay;
            return this;
        }

        public BotOperationTask.Builder<T> setDelay(int delay) {
            this.repeating = true;
            this.delay = delay;
            return this;
        }

        public BotOperationTask.Builder<T> setFunction(BiFunction<Handler, Context, T> function) {
            this.function = function;
            return this;
        }

        public BotOperationTask.Builder<T> setCallback(Consumer<T> callback) {
            this.silent = false;
            this.callback = callback;
            return this;
        }

        public BotOperationTask.Builder<T> setSuccessCondition(Function<Context, Boolean> successful) {
            this.successful = successful;
            return this;
        }

        public BotOperationTask<T> create() {
            return new BotOperationTask<T>(this);
        }
    }
}

