package com.react_native_read_sms; // Replace with your app name

import android.app.Application;
import java.io.IOException; // Ensure this is included
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage; // Import MainReactPackage
import com.facebook.soloader.SoLoader;
import com.facebook.react.soloader.OpenSourceMergedSoMapping;

import java.util.List;
import java.util.Arrays; // Import Arrays for combining packages
import com.facebook.react.ReactNativeHost; // Import ReactNativeHost
import com.facebook.react.ReactApplication; // Import ReactApplication
import com.react_native_read_sms.SmsListenerPackage; // Import your custom package
import com.rnfs.RNFSPackage; // <------- add package
import com.wenkesj.voice.VoicePackage; // add VoicePackage
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage; // add NotificationPackage
import com.asterinet.react.bgactions.BackgroundActionsPackage;
import com.react.SmsPackage;
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// import com.voximplant.foregroundservice.VIForegroundServicePackage;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG; // Enable debug support in development
        }

        @Override
        protected List<ReactPackage> getPackages() {
            // Get the autolinked packages
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(), // Include the main React package
                new SmsListenerPackage(), // Add your custom package
                new RNFSPackage(),
                new VoicePackage(),
                new ReactNativePushNotificationPackage(),
                new BackgroundActionsPackage(),
                new SmsPackage(),
                new RNGestureHandlerPackage()
                // new VIForegroundServicePackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index"; // Entry point for JavaScript code
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        try {
        SoLoader.init(this, OpenSourceMergedSoMapping.INSTANCE); // Initialization with exception handling
    } catch (IOException e) {
        e.printStackTrace(); // Handle the exception (log it or report it as needed)
    }
    }
}
