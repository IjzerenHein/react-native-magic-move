package com.wixnavigation;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.image.ReactImageView;
import com.facebook.react.views.image.ReactImageManager;

public class ReactMagicMoveImageManager extends ReactImageManager {

    public static final String REACT_CLASS = "RCTMagicMoveImage";

    ReactMagicMoveImageManager() {
        super();
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public ReactImageView createViewInstance(ThemedReactContext context) {
        return new ReactMagicMoveImageView(
                context, getDraweeControllerBuilder(), null, getCallerContext());
    }
}