package com.wixnavigation;

import android.view.View;
import android.os.Handler;

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

    public ReactMagicMoveCloneModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "MagicMoveCloneManager";
    }

    @ReactMethod
    public void init(final ReadableMap config, final int tag, final Promise promise) {

        // Deconstruct config
        final String id = config.getString("id");
        final int options = config.getInt("options");
        final int contentType = config.getInt("contentType");
        final int source = config.getInt("source");
        final int parent = config.getInt("parent");

        final ReactApplicationContext context = getReactApplicationContext();
        final UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);

        final WritableMap result = Arguments.createMap();

        final UIBlock uiBlock = new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {

                // Get views
                ReactMagicMoveCloneView view = (ReactMagicMoveCloneView) nativeViewHierarchyManager.resolveView(tag);
                View sourceView = nativeViewHierarchyManager.resolveView(source);

                // Create snapshot

                // Get raw image & size

                // Resolve promise with result
                promise.resolve(result);

                // Create clone data object

                // Update clone view

            }
        };

        final Callback errorCallback = new Callback() {
            @Override
            public void invoke(Object... args) {
                String err = ((String) args[0]).toString();
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
                    /*new Handler().postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            uiManager.measureLayout(source, parent, errorCallback, successCallback);
                        }
                    }, 4);*/
                    //return;
                    // TODO
                }

                result.putDouble("x", x);
                result.putDouble("y", y);
                result.putDouble("width", width);
                result.putDouble("height", height);

                uiManager.prependUIBlock(uiBlock);
            }
        };

        uiManager.measureLayout(source, parent, errorCallback, successCallback);

        /*final Runnable measureLayout = new Runnable() {
            @Override
            public void run() {
                uiManager.measureLayout(source, parent, errorCallback, successCallback);
            }
        };
        measureLayout.run();*/
    }
}