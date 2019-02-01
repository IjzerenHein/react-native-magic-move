package com.wixnavigation;

import android.view.View;
// import java.util.Timer;
// import java.util.TimerTask;

import java.util.Map;
import java.util.HashMap;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

public class ReactMagicMoveCloneModule extends ReactContextBaseJavaModule {
    private ReactMagicMoveCloneDataManager cloneDataManager;

    public ReactMagicMoveCloneModule(ReactApplicationContext reactContext, ReactMagicMoveCloneDataManager cloneDataManager) {
        super(reactContext);
        this.cloneDataManager = cloneDataManager;
    }

    @Override
    public String getName() {
        return "MagicMoveCloneManager";
    }

    @ReactMethod
    public void init(final ReadableMap config, final int tag, final Promise promise) {

        // Deconstruct config
        final String sharedId = config.getString("id");
        final int options = config.getInt("options");
        final int contentType = config.getInt("contentType");
        final int source = config.getInt("source");
        final int parent = config.getInt("parent");

        final ReactApplicationContext context = getReactApplicationContext();
        final UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);

        final Map<String, Float> layout = new HashMap<String, Float>();
        final ReactMagicMoveCloneDataManager cloneDataManager = this.cloneDataManager;

        final UIBlock uiBlock = new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {

                // Get views
                ReactMagicMoveCloneView view = (ReactMagicMoveCloneView) nativeViewHierarchyManager.resolveView(tag);
                View sourceView = nativeViewHierarchyManager.resolveView(source);

                // Prepare result
                final WritableMap result = Arguments.createMap();
                result.putDouble("x", layout.get("x"));
                result.putDouble("y", layout.get("y"));
                result.putDouble("width", layout.get("width"));
                result.putDouble("height", layout.get("height"));

                // Create snapshot

                // Get raw image & size

                // Resolve promise with result
                promise.resolve(result);

                // Create clone data object
                ReactMagicMoveCloneData data = new ReactMagicMoveCloneData(sharedId, tag, layout, options);
                cloneDataManager.put(data);
                view.setInitialData(data);
            }
        };

        //final Timer timer = new Timer();

        final Callback errorCallback = new Callback() {
            @Override
            public void invoke(Object... args) {
                String err = ((String) args[0]).toString();
                // timer.cancel();
                promise.reject("measure_failed", err);
            }
        };

        final Callback successCallback = new Callback() {
            @Override
            public void invoke(Object... args) {
                float x = ((Float) args[0]).floatValue();
                float y = ((Float) args[1]).floatValue();
                float width = ((Float) args[2]).floatValue();
                float height = ((Float) args[3]).floatValue();

                if (width == 0f || height == 0f) {
                    width = 100f;
                    height = 100f;
                    //return;
                }

                layout.put("x", x);
                layout.put("y", y);
                layout.put("width", width);
                layout.put("height", height);

                uiManager.prependUIBlock(uiBlock);
            }
        };

        uiManager.measureLayout(source, parent, errorCallback, successCallback);

        /*timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                uiManager.measureLayout(source, parent, errorCallback, successCallback);
            }
        }, 0, 4);*/
    }
}