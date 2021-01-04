package com.mic.bluezone2;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Icon;
import android.net.Uri;
import android.os.Build;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class ShortcutModule extends ReactContextBaseJavaModule {
    private Context context;

    ShortcutModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "ShortcutModule";
    }

    @ReactMethod
    public void getAllShortcut(final Callback onDone, final Callback onCancel) {
        if (Build.VERSION.SDK_INT < 26) {
            onCancel.invoke(null);

        } else {
            List<ShortcutInfo> shortcuts = getReactApplicationContext().getSystemService(ShortcutManager.class)
                    .getPinnedShortcuts();
            List finalShortcuts = new ArrayList(shortcuts.size());

            for (ShortcutInfo shortcut : shortcuts) {
                HashMap<String, String> shortcutMap = new HashMap<>();
                shortcutMap.put("id", shortcut.getId());
                shortcutMap.put("label", shortcut.getShortLabel().toString());
                shortcutMap.put("description", shortcut.getLongLabel().toString());

                finalShortcuts.add(shortcutMap);
            }

            onDone.invoke(finalShortcuts.toString());
        }
    }

    @ReactMethod
    private void AddPinnedShortcut(ReadableMap shortcut, final Callback onDone, final Callback onCancel) {
        String label = shortcut.getString("label");
        String description = shortcut.getString("description");
        ReadableMap icon = shortcut.getMap("icon");
        ReadableMap link = shortcut.getMap("link");

        BitmapDrawable drawable = null;
        try {
            Class<?> clazz = Class.forName("prscx.imagehelper.RNImageHelperModule");
            Class params[] = {ReadableMap.class};
            Method method = clazz.getDeclaredMethod("GenerateImage", params);

            drawable = (BitmapDrawable) method.invoke(null, icon);
        } catch (Exception e) {
        }

        if (Build.VERSION.SDK_INT > 26) {
            ShortcutManager mShortcutManager = getReactApplicationContext().getSystemService(ShortcutManager.class);

            Intent shortcutIntent = new Intent(getReactApplicationContext(), ShortcutModule.class);
            shortcutIntent.setAction(Intent.ACTION_MAIN);
            Intent intent = new Intent();
            intent.setAction(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(link.getString("url")));

            ShortcutInfo shortcutInfo = null;
            if (drawable != null) {
                shortcutInfo = new ShortcutInfo.Builder(getReactApplicationContext(), label).setShortLabel(label)
                        .setLongLabel(description).setIntent(intent).setIcon(Icon.createWithBitmap(drawable.getBitmap())).build();
            } else {
                shortcutInfo = new ShortcutInfo.Builder(getReactApplicationContext(), label).setShortLabel(label)
                        .setLongLabel(description).setIntent(intent).build();
            }

            if (mShortcutManager != null) {
                mShortcutManager.requestPinShortcut(shortcutInfo, null);

                onDone.invoke();
                return;
            }

            onCancel.invoke();
        } else {
            Intent shortcutIntent = new Intent(context,
                    MainActivity.class);

            shortcutIntent.setAction(Intent.ACTION_MAIN);

            Intent addIntent = new Intent();
            addIntent.setAction(Intent.ACTION_VIEW);
            addIntent.setData(Uri.parse(link.getString("url")));

            addIntent
                    .putExtra(Intent.EXTRA_SHORTCUT_INTENT, shortcutIntent);
            addIntent.putExtra(Intent.EXTRA_SHORTCUT_NAME, label);
            addIntent.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE, Icon.createWithBitmap(drawable.getBitmap()));

            addIntent
                    .setAction("com.android.launcher.action.INSTALL_SHORTCUT");
            context.getApplicationContext().sendBroadcast(addIntent);
        }
    }
}
