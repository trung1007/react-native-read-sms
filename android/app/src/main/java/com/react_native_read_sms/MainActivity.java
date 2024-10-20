package com.react_native_read_sms; // Replace with your app name

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import android.os.Bundle;

public class MainActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return "react_native_read_sms"; // Replace with your app name
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SoLoader.init(this, /* native exopackage */ false);
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName());
    }
}
