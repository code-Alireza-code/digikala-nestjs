namespace NodeJS {
  interface ProcessEnv {
    //APP
    APP_PORT: number;
    //DB
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    //ZARINPAL
    ZARINPAL_REQUEST_URL: string;
    ZARINPAL_GATEWAY_URL: string;
    ZARINPAL_VERIFY_URL: string;
    ZARINPAL_MERCHANT_ID: string;
    ZARINPAL_CALLBACK_URL: string;
    //FRONTEND
    FRONTEND_SUCCESS_PAYMENT_URL: string;
    FRONTEND_FAILED_PAYMENT_URL: string;
  }
}
