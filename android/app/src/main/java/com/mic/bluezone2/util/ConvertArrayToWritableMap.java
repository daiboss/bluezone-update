package com.mic.bluezone2.util;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.gson.Gson;
import com.mic.bluezone2.model.StepCounter;
import com.mic.bluezone2.model.StepHistory;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.List;

public class ConvertArrayToWritableMap {
    public static WritableArray convertToWritableMapStepCounter(List<StepCounter> list) {
        try {
            Gson gson = new Gson();
            WritableArray array = new WritableNativeArray();
            for (StepCounter co : list) {
                JSONObject jo = new JSONObject(gson.toJson(co));
                WritableMap wm = convertJsonToMap(jo);
                array.pushMap(wm);
            }
            return array;
        } catch (Exception e) {
            return null;
        }
    }

    public static WritableArray convertToWritableMapStepHistory(List<StepHistory> list) {
        try {
            Gson gson = new Gson();
            WritableArray array = new WritableNativeArray();
            for (StepHistory co : list) {
                JSONObject jo = new JSONObject(gson.toJson(co));
                WritableMap wm = convertJsonToMap(jo);
                array.pushMap(wm);
            }
            return array;
        } catch (Exception e) {
            return null;
        }
    }

    private static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();
        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String) {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }
}
