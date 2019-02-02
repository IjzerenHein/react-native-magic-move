package com.wixnavigation;

import android.view.ViewGroup;
import android.graphics.Canvas;

import com.facebook.react.uimanager.ThemedReactContext;

public class ReactMagicMoveCloneView extends ViewGroup {

    private ReactMagicMoveCloneDataManager mCloneDataManager;
    private ReactMagicMoveCloneData mData = null;
    private String mId = null;
    private int mOptions = 0;
    private int mContentType = 0;
    private float mBlurRadius = 0.0f;
    
    public ReactMagicMoveCloneView(ThemedReactContext themedReactContext, ReactMagicMoveCloneDataManager cloneDataManager) {
        super(themedReactContext);
        mCloneDataManager = cloneDataManager;
    }

    @Override
    protected void onDetachedFromWindow () {
        // Called whenever the clone is destroyed.
        // Releases our reference to the clone data
        super.onDetachedFromWindow();
        if (mData != null) {
            mCloneDataManager.release(mData);
            mData = null;
        }
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        // nop
    }

    @Override
    protected void onDraw(Canvas canvas) {
        if (mData != null) {
            mData.getView().draw(canvas);
        }
    }

    public void setInitialData(ReactMagicMoveCloneData data) {
        mData = data;
        invalidate();
    }

    public void setId(final String id) {
        mId = id;
        invalidate();
    }

    public void setOptions(final int options) {
        mOptions = options;
        invalidate();
    }

    public void setContentType(final int contentType) {
        mContentType = contentType;
        invalidate();
    }

    public void setBlurRadius(final float blurRadius) {
        mBlurRadius = blurRadius;
        invalidate();
    }
}