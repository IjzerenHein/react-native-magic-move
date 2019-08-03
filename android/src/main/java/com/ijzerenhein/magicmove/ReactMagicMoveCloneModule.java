package com.ijzerenhein.magicmove;

import java.util.concurrent.TimeUnit;

import android.view.View;
import android.os.Handler;
import android.graphics.RectF;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

abstract class RetryRunnable implements Runnable {
    int numRetries = 0;
}

public class ReactMagicMoveCloneModule extends ReactContextBaseJavaModule {
    private ReactMagicMoveCloneDataManager mCloneDataManager;

    static String LOG_TAG = "MagicMove";

    public ReactMagicMoveCloneModule(ReactApplicationContext reactContext,
                                     ReactMagicMoveCloneDataManager cloneDataManager) {
        super(reactContext);
        mCloneDataManager = cloneDataManager;
    }

    @Override
    public String getName() {
        return "MagicMoveCloneManager";
    }

    private static RectF getScrollOffset(View view, ViewGroup ancestorView) {
        int left = 0;
        int top = 0;
        ViewParent parent = view.getParent();
        while ((parent != null) && (parent != ancestorView)) {
            View parentView = (View) parent;
            left += parentView.getScrollX();
            top += parentView.getScrollY();
            parent = parent.getParent();
        }
        return new RectF(PixelUtil.toDIPFromPixel(left), PixelUtil.toDIPFromPixel(top), 0, 0);
    }

    @ReactMethod
    public void init(final ReadableMap config, final int tag, final Promise promise) {

        // Deconstruct config
        final String sharedId = config.getString("id");
        final int options = config.getInt("options");
        final int contentType = config.getInt("contentType");
        final int sourceTag = config.getInt("source");
        final int parentTag = config.getInt("parent");

        final ReactApplicationContext context = getReactApplicationContext();
        final UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
        final ReactMagicMoveCloneDataManager cloneDataManager = mCloneDataManager;
        final Handler handler = new Handler();

        // Called whenever the view has been successfully measured
        // or the number of measure retries has been exceeded.
        final Callback measureSuccessCallback = new Callback() {
            @Override
            public void invoke(Object... args) {
                Float x = ((Float) args[0]).floatValue();
                Float y = ((Float) args[1]).floatValue();
                Float width = ((Float) args[2]).floatValue();
                Float height = ((Float) args[3]).floatValue();
                final RectF measuredLayout = new RectF(x, y, x + width, y + height);

                uiManager.prependUIBlock(new UIBlock() {
                    @Override
                    public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {

                        // Get views
                        ReactMagicMoveCloneView view = (ReactMagicMoveCloneView) nativeViewHierarchyManager
                                .resolveView(tag);
                        View sourceView = nativeViewHierarchyManager.resolveView(sourceTag);
                        ViewGroup parentView = (ViewGroup) nativeViewHierarchyManager.resolveView(parentTag);

                        // Calculate adjusted position
                        final RectF layout = measuredLayout;
                        final RectF scrollOffset = ReactMagicMoveCloneModule.getScrollOffset(sourceView, parentView);
                        layout.left -= scrollOffset.left;
                        layout.right -= scrollOffset.left;
                        layout.top -= scrollOffset.top;
                        layout.bottom -= scrollOffset.top;

                        // Update the layout props for the view
                        handler.post(new Runnable() {
                            @Override
                            public void run() {
                                WritableMap styles = Arguments.createMap();
                                styles.putString("position", "absolute");
                                styles.putDouble("left", layout.left);
                                styles.putDouble("top", layout.top);
                                styles.putDouble("width", layout.width());
                                styles.putDouble("height", layout.height());
                                styles.putInt("backgroundColor", 1); // This is a bit hackish
                                styles.putString("overflow", "hidden");
                                uiManager.updateView(tag, "RCTMagicMoveClone", styles);
                            }
                        });

                        // Prepare result
                        final WritableMap result = Arguments.createMap();
                        result.putDouble("x", layout.left);
                        result.putDouble("y", layout.top);
                        result.putDouble("width", layout.width());
                        result.putDouble("height", layout.height());

                        // Resolve promise with result
                        promise.resolve(result);

                        // Create clone data object
                        ReactMagicMoveCloneData data = new ReactMagicMoveCloneData(sharedId, sourceView, layout,
                                options);
                        cloneDataManager.put(data);
                        view.setInitialData(data, options, contentType);
                    }
                });
            }
        };

        // Called when the measure has failed for some reason
        // I've never seen that this method has been called
        final Callback measureErrorCallback = new Callback() {
            @Override
            public void invoke(Object... args) {
                String err = ((String) args[0]).toString();
                promise.reject("measure_failed", err);
            }
        };

        // Try a couple times to measure the layout.
        final long startTime = System.nanoTime();
        handler.post(new RetryRunnable() {

            @Override
            public void run() {
                final RetryRunnable runnable = this;
                uiManager.measureLayout(sourceTag, parentTag, measureErrorCallback, new Callback() {
                    @Override
                    public void invoke(Object... args) {
                        if (((Float) args[2]).floatValue() == 0f || ((Float) args[3]).floatValue() == 0f) {
                            runnable.numRetries++;
                            if (runnable.numRetries >= 100) {
                                promise.reject("measure_failed", "Too many retries");
                                return;
                            }
                            if (runnable.numRetries >= 3) {
                                Log.d(LOG_TAG, "Warning, retrying measure for element '" + sharedId  + "', numRetries: " + runnable.numRetries + ", delaySoFar: " + TimeUnit.NANOSECONDS.toMillis( (System.nanoTime() - startTime)) + " ms ...");
                            }
                            handler.postDelayed(runnable, 8);
                        } else {
                            if (runnable.numRetries >= 2) {
                                Log.d(LOG_TAG, "Warning, measure completed for element '" + sharedId  + "', after " + runnable.numRetries + " retries, totalDelay: " + TimeUnit.NANOSECONDS.toMillis((System.nanoTime() - startTime)) + " ms ...");
                            }
                            measureSuccessCallback.invoke(args);
                        }
                    }
                });
            }
        });
    }
}