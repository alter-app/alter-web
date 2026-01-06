/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly VITE_FIREBASE_APP_ID: string;
    readonly VITE_FIREBASE_MEASUREMENT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Global interfaces for reCAPTCHA and native app bridge
interface Window {
    recaptchaVerifier: any;
    recaptchaWidgetId: number | undefined;
    grecaptcha: any;
    sendAuthDataToNative: () => void;
    onWebLogout: () => void;
    LocationChannel: {
        postMessage: (message: string) => void;
    };
    ConsoleChannel: {
        postMessage: (message: string) => void;
    };
    LogoutChannel: {
        postMessage: (message: string) => void;
    };
    flutter_inappwebview: any;
    flutter_webview: any;
    nativeScreenInfo?: {
        statusBarHeight?: number;
        bottomPadding?: number;
        [key: string]: unknown;
    };
    naver?: any; // Naver Map API global object
}

