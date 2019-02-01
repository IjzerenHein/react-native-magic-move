package com.wixnavigation;

import java.util.Map;
import java.util.HashMap;

public class ReactMagicMoveCloneDataManager extends Object {
    private Map<String, ReactMagicMoveCloneData> items = new HashMap<String, ReactMagicMoveCloneData>();

    public ReactMagicMoveCloneData acquire(String key) {
        synchronized (this.items) {
            ReactMagicMoveCloneData item = this.items.get(key);
            if (item != null) {
                item.setRefCount(item.getRefCount() + 1);
            }
            return item;
        }
    }

    public int release(ReactMagicMoveCloneData item) {
        synchronized (this.items) {
            item.setRefCount(item.getRefCount() - 1);
            if (item.getRefCount() == 0) {
                this.items.remove(item.getKey());
            }
            return item.getRefCount();
        }
    }

    public void put (ReactMagicMoveCloneData item) {
        synchronized (this.items) {
            this.items.put(item.getKey(), item);
        }
    }
}