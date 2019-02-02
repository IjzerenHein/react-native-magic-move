package com.wixnavigation;

import java.util.Map;

import android.view.View;

public class ReactMagicMoveCloneData extends Object {
    private String mSharedId;
    private View mView;
    private Map<String, Float> mLayout;
    private int mOptions;
    private int mRefCount;

    public ReactMagicMoveCloneData(String sharedId, View view, Map<String, Float> layout, int options) {
        mSharedId = sharedId;
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

    public Map<String, Float> getLayout() {
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
        if ((options & 2) != 0) {
            type = ((options & 4) != 0) ? "TargetScene" : "SourceScene";
        }
        else {
            type = ((options & 4) != 0) ? "TargetComponent" : "SourceComponent";
        }
        return type + ":" + sharedId;
    }
}