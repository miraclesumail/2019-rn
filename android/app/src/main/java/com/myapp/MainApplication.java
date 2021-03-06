package com.myapp;

import android.app.Application;
import com.myapp.CustomToastPackage;
import com.myapp.BulbPackage;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage; // <--- This!

import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.entria.views.RNViewOverflowPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SvgPackage(),
            new ImagePickerPackage(),
            new ReanimatedPackage(),
            new VectorIconsPackage(),
            new RNFSPackage(),
            new RNDeviceInfo(),
            new RNViewOverflowPackage(),
            new RNGestureHandlerPackage(),
            new CustomToastPackage(),
            new BulbPackage(),
            new LinearGradientPackage() 
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

  // @Override
  // public String getFileProviderAuthority() {
  //        return BuildConfig.APPLICATION_ID + ".provider";
  // }
}
