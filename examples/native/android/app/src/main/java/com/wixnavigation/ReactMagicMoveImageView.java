package com.wixnavigation;

import android.content.Context;
import android.graphics.Canvas;

import com.facebook.drawee.controller.AbstractDraweeControllerBuilder;
import com.facebook.react.views.image.ReactImageView;
import com.facebook.react.views.image.GlobalImageLoadListener;

import javax.annotation.Nullable;

public class ReactMagicMoveImageView extends ReactImageView {

    public ReactMagicMoveImageView(
            Context context,
            AbstractDraweeControllerBuilder draweeControllerBuilder,
            @Nullable GlobalImageLoadListener globalImageLoadListener,
            @Nullable Object callerContext) {
        super(context, draweeControllerBuilder, globalImageLoadListener, callerContext);

    }
    public void getSize() {
        // TODO
    }

    public void drawRaw(Canvas canvas) {
        // TODO
    }
}