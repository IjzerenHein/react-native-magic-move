package com.wixnavigation;

import java.util.Map;

import android.view.View;
import android.graphics.Rect;

public class ReactMagicMoveCloneData extends Object {
    private String mSharedId;
    private View mView;
    private Rect mLayout;
    private int mOptions;
    private int mRefCount;

    public ReactMagicMoveCloneData(String sharedId, View view, Map<String, Float> layout, int options) {
        mSharedId = sharedId;
        int x = Math.round(layout.get("x"));
        int y = Math.round(layout.get("y"));
        int width = Math.round(layout.get("width"));
        int height = Math.round(layout.get("height"));
        mLayout = new Rect(x, y, x + width, y + height);
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

    public Rect getLayout() {
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
            type = ((options & ReactMagicMoveCloneOption.SCENE) != 0) ? "TargetScene" : "SourceScene";
        }
        else {
            type = ((options & ReactMagicMoveCloneOption.SCENE) != 0) ? "TargetComponent" : "SourceComponent";
        }
        return type + ":" + sharedId;
    }
}