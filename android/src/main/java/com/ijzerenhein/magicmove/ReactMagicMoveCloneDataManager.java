package com.ijzerenhein.magicmove;

import java.util.Map;
import java.util.HashMap;

public class ReactMagicMoveCloneDataManager extends Object {
    private Map<String, ReactMagicMoveCloneData> mItems = new HashMap<String, ReactMagicMoveCloneData>();

    public ReactMagicMoveCloneData acquire(String key) {
        synchronized (mItems) {
            ReactMagicMoveCloneData item = mItems.get(key);
            if (item != null) {
                item.setRefCount(item.getRefCount() + 1);
            }
            return item;
        }
    }

    public int release(ReactMagicMoveCloneData item) {
        synchronized (mItems) {
            item.setRefCount(item.getRefCount() - 1);
            if (item.getRefCount() == 0) {
                mItems.remove(item.getKey());
            }
            return item.getRefCount();
        }
    }

    public void put(ReactMagicMoveCloneData item) {
        synchronized (mItems) {
            mItems.put(item.getKey(), item);
        }
    }
}