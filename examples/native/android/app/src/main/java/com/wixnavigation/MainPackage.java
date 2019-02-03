package com.wixnavigation;

import java.util.*;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

public class MainPackage implements ReactPackage {
    private ReactMagicMoveCloneDataManager cloneDataManager = new ReactMagicMoveCloneDataManager();

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(new ReactMagicMoveCloneModule(reactContext, this.cloneDataManager));
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(new ReactMagicMoveCloneManager(this.cloneDataManager),
                new ReactMagicMoveImageManager());
    }
}
