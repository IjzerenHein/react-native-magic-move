package com.wixnavigation;

import java.util.Map;

public class ReactMagicMoveCloneData extends Object {
    private String sharedId;
    private int reactTag;
    private Map<String, Float> layout;
    private int options;
    private int refCount;

    public ReactMagicMoveCloneData(String sharedId, int reactTag, Map<String, Float> layout, int options) {
        this.sharedId = sharedId;
        this.reactTag = reactTag;
        this.layout = layout;
        this.options = options;
        this.refCount = 1;
    }

    public String getSharedId() {
        return this.sharedId;
    }

    public int getReactTag() {
        return this.reactTag;
    }

    public Map<String, Float> getLayout() {
        return this.layout;
    }

    public int getOptions() {
        return this.options;
    }

    public int getRefCount() {
        return this.refCount;
    }

    public void setRefCount(int refCount) {
        this.refCount = refCount;
    }

    public String getKey() {
        return keyForSharedId(this.sharedId, this.options);
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