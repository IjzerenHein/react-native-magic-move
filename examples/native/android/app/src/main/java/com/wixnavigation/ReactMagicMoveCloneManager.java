package com.wixnavigation;

import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class ReactMagicMoveCloneManager extends SimpleViewManager<ReactMagicMoveCloneView> {

    public static final String REACT_CLASS = "RCTMagicMoveClone";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ReactMagicMoveCloneView createViewInstance(ThemedReactContext themedReactContext) {
        return new ReactMagicMoveCloneView(themedReactContext);
    }

    @ReactMethod
    public void init(int tag, ReadableMap config, Promise promise) {
        final String id = config.getString("id");
        final int options = config.getInt("options");
        final int contentType = config.getInt("contentType");
        final double blurRadius = config.getDouble("blurRadius");

        //promis.resolve()
    }

    @ReactProp(name = "id")
    public void setId(final ReactMagicMoveCloneView view, final String id) {
        view.setId(id);
    }

    @ReactProp(name = "options")
    public void setOptions(final ReactMagicMoveCloneView view, final int options) {
        view.setOptions(options);
    }

    @ReactProp(name = "contentType")
    public void setContentType(final ReactMagicMoveCloneView view, final int contentType) {
        view.setContentType(contentType);
    }

    @ReactProp(name = "blurRadius", defaultFloat = 0.0f)
    public void setBlurRadius(final ReactMagicMoveCloneView view, final float blurRadius) {
        view.setBlurRadius(blurRadius);
    }
}