package com.wixnavigation;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.util.Log;
import android.view.WindowManager;
import android.view.View;
import android.view.Window;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.uimanager.ThemedReactContext;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.lang.Math;
import java.math.BigDecimal;

import javax.annotation.Nullable;

//@SuppressLint("ViewConstructor")
public class ReactMagicMoveCloneView extends View {

    //private ThemedReactContext mThemedReactContext;

    private String mId = null;
    // private ScalableType mResizeMode = ScalableType.LEFT_TOP;
    private int mOptions = 0;
    private int mContentType = 0;
    private float mBlurRadius = 0.0f;
    
    public ReactMagicMoveCloneView(ThemedReactContext themedReactContext) {
        super(themedReactContext);

        //mThemedReactContext = themedReactContext;
    }

    @Override
    @SuppressLint("DrawAllocation")
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);

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

    /*
    @Override
    public void onPrepared(MediaPlayer mp) {

        mMediaPlayerValid = true;
        mVideoDuration = mp.getDuration();

        WritableMap naturalSize = Arguments.createMap();
        naturalSize.putInt(EVENT_PROP_WIDTH, mp.getVideoWidth());
        naturalSize.putInt(EVENT_PROP_HEIGHT, mp.getVideoHeight());
        if (mp.getVideoWidth() > mp.getVideoHeight())
            naturalSize.putString(EVENT_PROP_ORIENTATION, "landscape");
        else
            naturalSize.putString(EVENT_PROP_ORIENTATION, "portrait");

        WritableMap event = Arguments.createMap();
        event.putDouble(EVENT_PROP_DURATION, mVideoDuration / 1000.0);
        event.putDouble(EVENT_PROP_CURRENT_TIME, mp.getCurrentPosition() / 1000.0);
        event.putMap(EVENT_PROP_NATURALSIZE, naturalSize);
        // TODO: Actually check if you can.
        event.putBoolean(EVENT_PROP_FAST_FORWARD, true);
        event.putBoolean(EVENT_PROP_SLOW_FORWARD, true);
        event.putBoolean(EVENT_PROP_SLOW_REVERSE, true);
        event.putBoolean(EVENT_PROP_REVERSE, true);
        event.putBoolean(EVENT_PROP_FAST_FORWARD, true);
        event.putBoolean(EVENT_PROP_STEP_BACKWARD, true);
        event.putBoolean(EVENT_PROP_STEP_FORWARD, true);
        mEventEmitter.receiveEvent(getId(), Events.EVENT_LOAD.toString(), event);

        applyModifiers();

        if (mUseNativeControls) {
            initializeMediaControllerIfNeeded();
            mediaController.setMediaPlayer(this);
            mediaController.setAnchorView(this);

            videoControlHandler.post(new Runnable() {
                @Override
                public void run() {
                    mediaController.setEnabled(true);
                    mediaController.show();
                }
            });
        }

        selectTimedMetadataTrack(mp);
    }*/

    /*@Override
    public void seekTo(int msec) {
        if (mMediaPlayerValid) {
            mSeekTime = msec;
            super.seekTo(msec);
            if (isCompleted && mVideoDuration != 0 && msec < mVideoDuration) {
                isCompleted = false;
            }
        }
    }*/
}