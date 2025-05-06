import 'dotenv/config';
const APP_ENV = process.env.APP_ENV || process.env.NODE_ENV || 'development';
const isProd = APP_ENV === 'production';

export default ({ config }) => ({
	...config,

	expo: {
		...config.expo,
		name: isProd ? 'Gym Tracker' : 'Gym Tracker (Dev)',
		slug: "gym-tracker",
		version: '1.0.1',
		// Definimos sdkVersion solo en producción
		...( isProd && { sdkVersion: '53.0.7' } ),
		orientation: "portrait",
		icon: "./assets/icon.png",
		userInterfaceStyle: "light",
		newArchEnabled: true,
		splash: {
		  image: "./assets/splash-icon.png",
		  resizeMode: "contain",
		  backgroundColor: "#ffffff"
		},
		ios: {
		  supportsTablet: true
		},
		android: {
		  package: "com.tudominio.gymtracker",
		  versionCode: 1,
		  adaptiveIcon: {
			foregroundImage: "./assets/adaptive-icon.png",
			backgroundColor: "#ffffff"
		  }
		},
		web: {
		  favicon: "./assets/favicon.png"
		},
		plugins: [
		  "expo-sqlite"
		],
		extra: {
		  eas: {
			projectId: "b99c42df-f182-4777-82ba-13faecf71dd3"
		  }
		}
	}
})

/* {
  "expo": {
    "name": "Gym Tracker",
    "slug": "gym-tracker",
    "version": "1.0.1",
	"sdkVersion": "53.0.7",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "package": "com.tudominio.gymtracker",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-sqlite"
    ],
    "extra": {
      "eas": {
        "projectId": "b99c42df-f182-4777-82ba-13faecf71dd3"
      }
    }
  }
} */
