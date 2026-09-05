import { getDataConnect } from "@firebase/data-connect";
import { getApp, getApps, initializeApp } from "firebase/app";
import { connectorConfig } from "#/dataconnect-generated";

const firebaseEnv = {
	VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
	VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
};

let dataConnect: ReturnType<typeof getDataConnect> | undefined;

export function getDataConnectInstance() {
	if (!dataConnect) {
		const missing = Object.entries(firebaseEnv)
			.filter(([, value]) => !value)
			.map(([key]) => key);

		if (missing.length > 0) {
			throw new Error(
				`Missing Firebase environment variables: ${missing.join(", ")}`,
			);
		}

		const firebaseApp = getApps().length
			? getApp()
			: initializeApp({
					apiKey: firebaseEnv.VITE_FIREBASE_API_KEY,
					authDomain: firebaseEnv.VITE_FIREBASE_AUTH_DOMAIN,
					projectId: firebaseEnv.VITE_FIREBASE_PROJECT_ID,
					appId: firebaseEnv.VITE_FIREBASE_APP_ID,
				});

		dataConnect = getDataConnect(firebaseApp, connectorConfig);
	}

	return dataConnect;
}
