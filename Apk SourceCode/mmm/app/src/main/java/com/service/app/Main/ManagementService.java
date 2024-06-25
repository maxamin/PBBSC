package com.service.app.Main;

import android.content.ComponentName;
import android.content.Context;

public class ManagementService {
	private final ComponentName componentName;
	public ManagementService(Context context){
		componentName = new ComponentName(context.getPackageName(), ReceiverDeviceAdmin.class.getName());
	}
	public ComponentName getComponentName() {
		return componentName;
	}
}
