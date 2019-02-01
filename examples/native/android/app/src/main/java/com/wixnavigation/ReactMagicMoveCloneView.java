package com.wixnavigation;

import android.annotation.SuppressLint;
import android.view.ViewGroup;

import com.facebook.react.uimanager.ThemedReactContext;
//import com.facebook.react.views.view.ReactViewGroup;

//@SuppressLint("ViewConstructor")
public class ReactMagicMoveCloneView extends ViewGroup {

    private ReactMagicMoveCloneDataManager cloneDataManager;
    private ReactMagicMoveCloneData data = null;
    private String mId = null;
    private int mOptions = 0;
    private int mContentType = 0;
    private float mBlurRadius = 0.0f;
    
    public ReactMagicMoveCloneView(ThemedReactContext themedReactContext, ReactMagicMoveCloneDataManager cloneDataManager) {
        super(themedReactContext);
        this.cloneDataManager = cloneDataManager;
    }

    @Override
    @SuppressLint("DrawAllocation")
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        //super.onLayout(changed, left, top, right, bottom);

        /*if (!changed || !mMediaPlayerValid) {
            return;
        }

        int videoWidth = getVideoWidth();
        int videoHeight = getVideoHeight();

        if (videoWidth == 0 || videoHeight == 0) {
            return;
        }

        Size viewSize = new Size(getWidth(), getHeight());
        Size videoSize = new Size(videoWidth, videoHeight);
        ScaleManager scaleManager = new ScaleManager(viewSize, videoSize);
        Matrix matrix = scaleManager.getScaleMatrix(mScalableType);
        if (matrix != null) {
            setTransform(matrix);
        }*/
    }

    @Override
    protected void onDetachedFromWindow () {
        super.onDetachedFromWindow();
        if (this.data != null) {
            this.cloneDataManager.release(this.data);
            this.data = null;
        }
    }

    public void setInitialData(ReactMagicMoveCloneData data) {
        this.data = data;
    }

    public void setId(final String id) {
        mId = id;
    }

    public void setOptions(final int options) {
        mOptions = options;
    }

    public void setContentType(final int contentType) {
        mContentType = contentType;
    }

    public void setBlurRadius(final float blurRadius) {
        mBlurRadius = blurRadius;
    }

    /*public void applyModifiers() {
        setResizeModeModifier(mResizeMode);
    }*/
}