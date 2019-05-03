package com.myapp;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.common.MapBuilder;
import java.util.Map;

public class BulbManager extends SimpleViewManager<BulbView> {

    @Override
    public String getName() {
        return "Bulb";
    }

    @Override
    protected BulbView createViewInstance(ThemedReactContext reactContext) {

        return new BulbView(reactContext);

    }

    @Override
    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder()
                .put(
                        "statusChange",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onStatusChange")))
                .build();
    }
}