export const SELECTORS = {
    USERNAME_INPUT: '[data-testid="input-username"]',
    PASSWORD_INPUT: '[data-testid="input-password"]',
    LOGIN_SUBMIT: '[data-testid="btn-signin-submit"]',

    COOKIE_ACCEPT: '.osano-cm-accept-all',

    OTP_INPUT: 'input[inputmode="numeric"]',
    OTP_SUBMIT: '[data-testid="btn-mfa-submit"]',

    EMAIL_INPUT: 'input[data-testid="personal-information-card__emailAddress"]',
    SAVE_BUTTON: 'button[data-testid="personal-information-card__saveChanges-btn"]',

    CURRENT_PASSWORD_INPUT: 'input[data-testid="password-card__currentPassword"]',
    NEW_PASSWORD_INPUT: 'input[data-testid="password-card__newPassword"]',
    CONFIRM_PASSWORD_INPUT: 'input[data-testid="password-card__confirmNewPassword"]',
    PASSWORD_SAVE_BUTTON: 'button[data-testid="password-card__submit-btn"]',

    SOCIAL_REMOVE_BUTTON: 'button[data-testid="login-button-remove"]',
    DISCONNECT_CONFIRM_BUTTON: 'button[data-testid="modal_close-btn"]'
};

export const URLS = {
    LOGIN_PAGE: 'https://account.riotgames.com/en/log-in/',
    ACCOUNT_PAGE: 'https://account.riotgames.com/',
    LOGIN_API: '/api/v1/login'
};
export const JWT_KEY = 'vcl_con_meo';

export const DEFAULT_ADMIN = {
    USERNAME: 'admin',
    PASSWORD: 'admin'
};
