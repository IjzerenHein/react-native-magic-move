package com.wixnavigation;

import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewManager;
import com.facebook.react.views.view.ReactViewGroup;

public class ReactMagicMoveCloneManager extends ReactViewManager {

    private ReactMagicMoveCloneDataManager mCloneDataManager;

    public static final String REACT_CLASS = "RCTMagicMoveClone";

    ReactMagicMoveCloneManager(ReactMagicMoveCloneDataManager cloneDataManager) {
        super();
        mCloneDataManager = cloneDataManager;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public ReactViewGroup createViewInstance(ThemedReactContext context) {
        return new ReactMagicMoveCloneView(context, mCloneDataManager);
    }

    @Override
    public void onDropViewInstance(ReactViewGroup view) {
        super.onDropViewInstance(view);
        ((ReactMagicMoveCloneView)view).releaseData();
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