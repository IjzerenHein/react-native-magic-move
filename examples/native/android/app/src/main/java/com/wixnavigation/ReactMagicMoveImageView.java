package com.wixnavigation;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;

import com.facebook.drawee.controller.AbstractDraweeControllerBuilder;
import com.facebook.drawee.interfaces.DraweeController;

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
    public Rect getSize() {
        // holder - controller - datasource

        DraweeController controller = this.getController();

        RectF imageBounds = new RectF();
        Drawable drawable = this.getHierarchy().getTopLevelDrawable();
        this.getHierarchy().getActualImageBounds(imageBounds);

        Rect size = new Rect(0, 0, this.getTopLevelDrawable().getIntrinsicWidth(), this.getTopLevelDrawable().getIntrinsicHeight());
        return size;
    }

    public void drawRaw(Canvas canvas) {
        // TODO
    }
}