package com.wixnavigation;

import android.annotation.SuppressLint;
import android.view.ViewGroup;

import com.facebook.react.uimanager.ThemedReactContext;
//import com.facebook.react.views.view.ReactViewGroup;

//@SuppressLint("ViewConstructor")
public class ReactMagicMoveCloneView extends ViewGroup {

    private String mId = null;
    private int mOptions = 0;
    private int mContentType = 0;
    private float mBlurRadius = 0.0f;
    
    public ReactMagicMoveCloneView(ThemedReactContext themedReactContext) {
        super(themedReactContext);
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

    public void setId(final String id) {
        //setSrc(uriString, type, isNetwork, isAsset, requestHeaders, 0, 0);
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
        setRepeatModifier(mRepeat);
        setPausedModifier(mPaused);
        setMutedModifier(mMuted);
        setProgressUpdateInterval(mProgressUpdateInterval);
        setRateModifier(mRate);
    }*/
}