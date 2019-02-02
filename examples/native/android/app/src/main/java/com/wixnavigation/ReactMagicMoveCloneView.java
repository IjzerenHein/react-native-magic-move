package com.wixnavigation;

import android.graphics.Color;
import android.util.Log;
import android.view.ViewGroup;
import android.graphics.Rect;
import android.graphics.Canvas;
import android.graphics.Paint;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

public class ReactMagicMoveCloneView extends ReactViewGroup {

    static String LOG_TAG = "MagicMove";

    private ReactMagicMoveCloneDataManager mCloneDataManager;
    private ReactMagicMoveCloneData mData = null;
    private String mId = null;
    private int mOptions = 0;
    private int mContentType = 0;
    private float mBlurRadius = 0.0f;
    private boolean mPropsChanged = true;
    
    public ReactMagicMoveCloneView(ThemedReactContext themedReactContext, ReactMagicMoveCloneDataManager cloneDataManager) {
        super(themedReactContext);
        mCloneDataManager = cloneDataManager;
    }

    public void releaseData() {
        if (mData != null) {
            mCloneDataManager.release(mData);
            mData = null;
        }
    }

    private String getDebugName() {
        String source = ((mOptions & ReactMagicMoveCloneOption.TARGET) != 0) ? "target" : "source";
        String type = ((mOptions & ReactMagicMoveCloneOption.SCENE) != 0) ? "scene" : "component";
        return source + " " + type + " " + mId;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Log.d(LOG_TAG, "onDraw " + getDebugName() + ", width: " + canvas.getWidth() + ", height: " + canvas.getHeight());

        if ((mData == null) && (mId != null) && ((mOptions & ReactMagicMoveCloneOption.INITIAL) == 0)) {
            Log.d(LOG_TAG, "mCloneDataManager.acquire " + getDebugName());
            mData = mCloneDataManager.acquire(ReactMagicMoveCloneData.keyForSharedId(mId, mOptions));
        }

        if (mData == null) return;
        if ((mOptions & ReactMagicMoveCloneOption.VISIBLE) == 0) return;
        if (mContentType == ReactMagicMoveContentType.CHILDREN) return;

        mData.getView().draw(canvas);
    }

    public void setInitialData(ReactMagicMoveCloneData data, int options, int contentType) {
        Log.d(LOG_TAG, "setInitialData " + getDebugName() + ", layout: " + data.getLayout());
        mData = data;
        mOptions = options;
        mContentType = contentType;
        invalidate();
    }

    public void setId(final String id) {
        if (mId != id) {
            mId = id;
            mPropsChanged = true;
            invalidate();
        }
    }

    public void setOptions(final int options) {
        if (mOptions != options) {
            mOptions = options;
            mPropsChanged = true;
            invalidate();
        }
    }

    public void setContentType(final int contentType) {
        if (mContentType != contentType) {
            mContentType = contentType;
            mPropsChanged = true;
            invalidate();
        }
    }

    public void setBlurRadius(final float blurRadius) {
        if (mBlurRadius != blurRadius) {
            mBlurRadius = blurRadius;
            mPropsChanged = true;
            invalidate();
        }
    }
}