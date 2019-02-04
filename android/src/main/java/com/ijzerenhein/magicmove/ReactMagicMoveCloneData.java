package com.ijzerenhein.magicmove;

import java.util.Map;

import android.view.View;
import android.graphics.RectF;

public class ReactMagicMoveCloneData extends Object {
    private String mSharedId;
    private View mView;
    private RectF mLayout;
    private int mOptions;
    private int mRefCount;

    public ReactMagicMoveCloneData(String sharedId, View view, RectF layout, int options) {
        mSharedId = sharedId;
        mLayout = layout;
        mView = view;
        mOptions = options;
        mRefCount = 1;
    }

    public String getSharedId() {
        return mSharedId;
    }

    public View getView() {
        return mView;
    }

    public RectF getLayout() {
        return mLayout;
    }

    public int getOptions() {
        return mOptions;
    }

    public int getRefCount() {
        return mRefCount;
    }

    public void setRefCount(int refCount) {
        mRefCount = refCount;
    }

    public String getKey() {
        return keyForSharedId(mSharedId, mOptions);
    }

    public static String keyForSharedId(String sharedId, int options) {
        String type;
        if ((options & ReactMagicMoveCloneOption.SCENE) != 0) {
            type = ((options & ReactMagicMoveCloneOption.TARGET) != 0) ? "TargetScene" : "SourceScene";
        } else {
            type = ((options & ReactMagicMoveCloneOption.TARGET) != 0) ? "TargetComponent" : "SourceComponent";
        }
        return type + ":" + sharedId;
    }
}