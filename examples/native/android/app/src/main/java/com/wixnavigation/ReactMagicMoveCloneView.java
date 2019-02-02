package com.wixnavigation;

import android.graphics.Color;
import android.util.Log;
import android.view.ViewGroup;
import android.graphics.Rect;
import android.graphics.Canvas;
import android.graphics.Paint;

import com.facebook.react.uimanager.ThemedReactContext;

public class ReactMagicMoveCloneView extends ViewGroup {

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

    @Override
    protected void onAttachedToWindow ()
    {
        //Log.d(LOG_TAG, "onAttachedToWindow " + getDebugName());

        /*Rect layout = (mData != null) ? mData.getLayout() : null;
        if (layout != null) {
            layout(layout.left, layout.top, layout.right, layout.bottom);
            invalidate();
        }*/

        super.onAttachedToWindow();
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
    protected void onWindowVisibilityChanged (int visibility)
    {
        //Log.d(LOG_TAG, "onWindowVisibilityChanged " + getDebugName() + ", visibility: " + visibility);
        super.onWindowVisibilityChanged(visibility);

        /*Rect layout = (mData != null) ? mData.getLayout() : null;
        if (layout != null) {
            layout(layout.left, layout.top, layout.right, layout.bottom);
            invalidate();
        }*/
    }

    private String getDebugName() {
        String source = ((mOptions & 4) != 0) ? "target" : "source";
        String type = ((mOptions & 2) != 0) ? "scene" : "component";
        return source + " " + type + " " + mId;
    }

    //@Override
    /*protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        Log.d(LOG_TAG, "onMeasure " + getDebugName());
        if ((mData != null) && (mOptions & 1) != 0) {
            setMeasuredDimension(mData.getLayout().width(), mData.getLayout().height());
        }
        else {
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        }
    }*/

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        // nop
        //super.onLayout(changed, left, top, right, bottom);
        //Log.d(LOG_TAG, "This is my log message at the debug level here");
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Log.d(LOG_TAG, "onDraw " + getDebugName() + ", width: " + canvas.getWidth() + ", height: " + canvas.getHeight());
        Paint mPaint = new Paint();
        if (mData != null) {
            //Paint paint = new Paint();
            //mData.getView().draw(canvas);

            /*int width = this.getWidth();
            int height = this.getHeight();
            int radius = width > height ? height/2 : width/2;
            int center_x = width/2;
            int center_y = height/2;

            // prepare a paint
            mPaint.setStyle(Paint.Style.STROKE);
            mPaint.setStrokeWidth(5);
            mPaint.setAntiAlias(true);

            // draw a rectangle
            mPaint.setColor(Color.BLUE);
            mPaint.setStyle(Paint.Style.FILL); //fill the background with blue color
            canvas.drawRect(center_x - radius, center_y - radius, center_x + radius, center_y + radius, mPaint);*/
        }
    }

    public void setInitialData(ReactMagicMoveCloneData data, int options, int contentType) {
        Log.d(LOG_TAG, "setInitialData " + getDebugName() + ", layout: " + data.getLayout());
        mData = data;
        mOptions = options;
        mContentType = contentType;

        /*Rect layout = (mData != null) ? mData.getLayout() : null;
        if (layout != null) {
            layout(layout.left, layout.top, layout.right, layout.bottom);
            setLeft(layout.left);
            setTop(layout.top);
            setLayoutParams(new LayoutParams(layout.width(), layout.height()));
            invalidate();
        }

        //layout(x, y, x + width, y + height);

        /*setLayoutParams(new LayoutParams(
            Math.round(data.getLayout().get("width")),
            Math.round(data.getLayout().get("height"))
                ));*/
        //invalidate();*/
    }

    public void setId(final String id) {
        if (mId != id) {
            mId = id;
            mPropsChanged = true;
        }
    }

    public void setOptions(final int options) {
        if (mOptions != options) {
            mOptions = options;
            mPropsChanged = true;
        }
    }

    public void setContentType(final int contentType) {
        if (mContentType != contentType) {
            mContentType = contentType;
            mPropsChanged = true;
        }
    }

    public void setBlurRadius(final float blurRadius) {
        if (mBlurRadius != blurRadius) {
            mBlurRadius = blurRadius;
            mPropsChanged = true;
        }
    }

    public void onAfterUpdateTransition() {
        if ((mData == null) && (mId != null) && ((mOptions & 1) == 0)) {
            Log.d(LOG_TAG, "onAfterUpdateTransition " + getDebugName() + ", acquiring clone data...");
            mData = mCloneDataManager.acquire(ReactMagicMoveCloneData.keyForSharedId(mId, mOptions));
        }

        if (mPropsChanged) {
            Log.d(LOG_TAG, "onAfterUpdateTransition " + getDebugName());
            mPropsChanged = false;
            invalidate();
        }
    }
}