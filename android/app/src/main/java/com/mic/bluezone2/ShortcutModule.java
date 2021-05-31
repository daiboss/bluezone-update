package com.mic.bluezone2;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Icon;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.content.pm.ShortcutInfoCompat;
import androidx.core.content.pm.ShortcutManagerCompat;
import androidx.core.graphics.drawable.IconCompat;

import com.facebook.infer.annotation.SynchronizedCollection;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.mic.bluezone2.R;

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
        if (Build.VERSION.SDK_INT < 25) {
            HashMap<String, String> shortcutMap = new HashMap<>();
            List<ShortcutInfoCompat> shortcuts = ShortcutManagerCompat.getDynamicShortcuts(context);

            onDone.invoke(shortcutMap.toString());
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
        ReadableMap link = shortcut.getMap("link");

        Bitmap bitmapIcon = BitmapFactory.decodeResource(context.getResources(), R.drawable.ic_health);
        if (Build.VERSION.SDK_INT > 26) {
            ShortcutManager mShortcutManager = getReactApplicationContext().getSystemService(ShortcutManager.class);

            Intent shortcutIntent = new Intent(getReactApplicationContext(), ShortcutModule.class);
            shortcutIntent.setAction(Intent.ACTION_MAIN);
            Intent intent = new Intent();
            intent.setAction(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(link.getString("url")));


            ShortcutInfo shortcutInfo = null;
            if (bitmapIcon != null) {
                shortcutInfo = new ShortcutInfo.Builder(getReactApplicationContext(), label).setShortLabel(label)
                        .setLongLabel(description).setIntent(intent).setIcon(Icon.createWithBitmap(bitmapIcon)).build();
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
            Intent intent = new Intent();
            intent.setAction(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(link.getString("url")));

            ShortcutInfoCompat shortcutInfo = new ShortcutInfoCompat.Builder(context, "#1")
                    .setIntent(intent)
                    .setShortLabel(label)
                    .setLongLabel(description)
                    .setIcon(IconCompat.createWithResource(context, R.drawable.ic_health))
                    .build();
            ShortcutManagerCompat.requestPinShortcut(context, shortcutInfo, null);

            onDone.invoke();
        }
    }

    @ReactMethod
    private void CheckSupportedShortcut(final Callback onResult) {
        if (ShortcutManagerCompat.isRequestPinShortcutSupported(context)) {
            onResult.invoke(true);
        } else {
            onResult.invoke(false);
        }
    }
}
