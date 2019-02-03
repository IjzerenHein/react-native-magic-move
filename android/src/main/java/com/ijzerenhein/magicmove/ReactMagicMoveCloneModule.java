package com.ijzerenhein.magicmove;

import android.view.View;
import android.os.Handler;
import android.graphics.Rect;

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
    private ReactMagicMoveCloneDataManager mCloneDataManager;

    public ReactMagicMoveCloneModule(ReactApplicationContext reactContext,
            ReactMagicMoveCloneDataManager cloneDataManager) {
        super(reactContext);
        mCloneDataManager = cloneDataManager;
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
        final ReactMagicMoveCloneDataManager cloneDataManager = mCloneDataManager;

        // Called whenever the view has been successfully measured
        // or the number of measure retries has been exceeded.
        final Callback measureSuccessCallback = new Callback() {
            @Override
            public void invoke(Object... args) {
                layout.put("x", ((Float) args[0]).floatValue());
                layout.put("y", ((Float) args[1]).floatValue());
                layout.put("width", ((Float) args[2]).floatValue());
                layout.put("height", ((Float) args[3]).floatValue());

                if (layout.get("width") == 0f || layout.get("height") == 0f) {
                    // promise.reject("measure_failed", "measureLayout returned 0 for width/height
                    // after 3 times");
                    layout.put("width", 100f);
                    layout.put("height", 100f);
                }

                // Update the layout props for the view
                WritableMap styles = Arguments.createMap();
                styles.putString("position", "absolute");
                styles.putDouble("left", layout.get("x"));
                styles.putDouble("top", layout.get("y"));
                styles.putDouble("width", layout.get("width"));
                styles.putDouble("height", layout.get("height"));
                styles.putInt("backgroundColor", 1);
                styles.putString("overflow", "hidden");
                uiManager.updateView(tag, "RCTMagicMoveClone", styles);

                uiManager.prependUIBlock(new UIBlock() {
                    @Override
                    public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {

                        // Get views
                        ReactMagicMoveCloneView view = (ReactMagicMoveCloneView) nativeViewHierarchyManager
                                .resolveView(tag);
                        View sourceView = nativeViewHierarchyManager.resolveView(source);

                        // Prepare result
                        final WritableMap result = Arguments.createMap();
                        result.putDouble("x", layout.get("x"));
                        result.putDouble("y", layout.get("y"));
                        result.putDouble("width", layout.get("width"));
                        result.putDouble("height", layout.get("height"));

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
        // I know, I know, this solution down here is a "regelrechte" mess.
        // I couldn't figure out how to do a generic delayed retry mechanism
        // without tripping up Java...
        // If you read this code and you know how to (without using external libs),
        // let me know at: https://github.com/IjzerenHein/react-native-magic-move
        final Handler handler = new Handler();
        uiManager.measureLayout(source, parent, measureErrorCallback, new Callback() {
            @Override
            public void invoke(Object... args) {
                if (((Float) args[2]).floatValue() == 0f || ((Float) args[3]).floatValue() == 0f) {
                    handler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            uiManager.measureLayout(source, parent, measureErrorCallback, new Callback() {
                                @Override
                                public void invoke(Object... args) {
                                    if (((Float) args[2]).floatValue() == 0f || ((Float) args[3]).floatValue() == 0f) {
                                        handler.postDelayed(new Runnable() {
                                            @Override
                                            public void run() {
                                                uiManager.measureLayout(source, parent, measureErrorCallback,
                                                        new Callback() {
                                                            @Override
                                                            public void invoke(Object... args) {
                                                                if (((Float) args[2]).floatValue() == 0f
                                                                        || ((Float) args[3]).floatValue() == 0f) {
                                                                    handler.postDelayed(new Runnable() {
                                                                        @Override
                                                                        public void run() {
                                                                            uiManager.measureLayout(source, parent,
                                                                                    measureErrorCallback,
                                                                                    measureSuccessCallback);
                                                                        }
                                                                    }, 4);
                                                                } else {
                                                                    measureSuccessCallback.invoke(args);
                                                                }
                                                            }
                                                        });
                                            }
                                        }, 4);
                                    } else {
                                        measureSuccessCallback.invoke(args);
                                    }
                                }
                            });
                        }
                    }, 4);
                } else {
                    measureSuccessCallback.invoke(args);
                }
            }
        });
    }
}