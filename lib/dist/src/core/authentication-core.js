/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { AUTHORIZATION_ENDPOINT, OIDC_SCOPE, OP_CONFIG_INITIATED, PKCE_CODE_VERIFIER, SESSION_STATE, SIGN_OUT_SUCCESS_PARAM } from "../constants";
import { AsgardeoAuthException, AsgardeoAuthNetworkException } from "../exception";
import { AuthenticationHelper } from "../helpers";
import { AuthenticationUtils, CryptoUtils } from "../utils";
export class AuthenticationCore {
    constructor(dataLayer) {
        this._authenticationHelper = new AuthenticationHelper(dataLayer);
        this._dataLayer = dataLayer;
        this._config = () => __awaiter(this, void 0, void 0, function* () { return yield this._dataLayer.getConfigData(); });
        this._oidcProviderMetaData = () => __awaiter(this, void 0, void 0, function* () { return yield this._dataLayer.getOIDCProviderMetaData(); });
    }
    getAuthorizationURL(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizeEndpoint = (yield this._dataLayer.getOIDCProviderMetaDataParameter(AUTHORIZATION_ENDPOINT));
            const configData = yield this._config();
            if (!authorizeEndpoint || authorizeEndpoint.trim().length === 0) {
                throw new AsgardeoAuthException("AUTH_CORE-GAU-NF01", "authentication-core", "getAuthorizationURL", "No authorization endpoint found.", "No authorization endpoint was found in the OIDC provider meta data from the well-known endpoint " +
                    "or the authorization endpoint passed to the SDK is empty.");
            }
            const authorizeRequest = new URL(authorizeEndpoint);
            authorizeRequest.searchParams.append("response_type", "code");
            authorizeRequest.searchParams.append("client_id", configData.clientID);
            let scope = OIDC_SCOPE;
            if (configData.scope && configData.scope.length > 0) {
                if (!configData.scope.includes(OIDC_SCOPE)) {
                    configData.scope.push(OIDC_SCOPE);
                }
                scope = configData.scope.join(" ");
            }
            authorizeRequest.searchParams.append("scope", scope);
            authorizeRequest.searchParams.append("redirect_uri", configData.signInRedirectURL);
            if (configData.responseMode) {
                authorizeRequest.searchParams.append("response_mode", configData.responseMode);
            }
            if (configData.enablePKCE) {
                const codeVerifier = CryptoUtils.getCodeVerifier();
                const codeChallenge = CryptoUtils.getCodeChallenge(codeVerifier);
                yield this._dataLayer.setTemporaryDataParameter(PKCE_CODE_VERIFIER, codeVerifier);
                authorizeRequest.searchParams.append("code_challenge_method", "S256");
                authorizeRequest.searchParams.append("code_challenge", codeChallenge);
            }
            if (configData.prompt) {
                authorizeRequest.searchParams.append("prompt", configData.prompt);
            }
            const customParams = config;
            if (customParams) {
                for (const [key, value] of Object.entries(customParams)) {
                    if (key != "" && value != "") {
                        authorizeRequest.searchParams.append(key, value.toString());
                    }
                }
            }
            return authorizeRequest.toString();
        });
    }
    requestAccessToken(authorizationCode, sessionState) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenEndpoint = (yield this._oidcProviderMetaData()).token_endpoint;
            const configData = yield this._config();
            if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
                return Promise.reject(new AsgardeoAuthException("AUTH_CORE-RAT1-NF01", "authentication-core", "requestAccessToken", "Token endpoint not found.", "No token endpoint was found in the OIDC provider meta data returned by the well-known endpoint " +
                    "or the token endpoint passed to the SDK is empty."));
            }
            sessionState && (yield this._dataLayer.setSessionDataParameter(SESSION_STATE, sessionState));
            const body = [];
            body.push(`client_id=${configData.clientID}`);
            if (configData.clientSecret && configData.clientSecret.trim().length > 0) {
                body.push(`client_secret=${configData.clientSecret}`);
            }
            const code = authorizationCode;
            body.push(`code=${code}`);
            body.push("grant_type=authorization_code");
            body.push(`redirect_uri=${configData.signInRedirectURL}`);
            if (configData.enablePKCE) {
                body.push(`code_verifier=${yield this._dataLayer.getTemporaryDataParameter(PKCE_CODE_VERIFIER)}`);
                yield this._dataLayer.removeTemporaryDataParameter(PKCE_CODE_VERIFIER);
            }
            return axios
                .post(tokenEndpoint, body.join("&"), { headers: AuthenticationUtils.getTokenRequestHeaders() })
                .then((response) => {
                return this._authenticationHelper
                    .handleTokenResponse(response)
                    .then((response) => response)
                    .catch((error) => {
                    return Promise.reject(new AsgardeoAuthException("AUTH_CORE-RAT1-ES02", "authentication-core", "requestAccessToken", undefined, undefined, error));
                });
            })
                .catch((error) => {
                var _a, _b, _c;
                return Promise.reject(new AsgardeoAuthNetworkException("AUTH_CORE-RAT1-NR03", "authentication-core", "requestAccessToken", "Requesting access token failed", "The request to get the access token from the server failed.", (_a = error === null || error === void 0 ? void 0 : error.code) !== null && _a !== void 0 ? _a : "", error === null || error === void 0 ? void 0 : error.message, (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.status, (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data));
            });
        });
    }
    refreshAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenEndpoint = (yield this._oidcProviderMetaData()).token_endpoint;
            const configData = yield this._config();
            const sessionData = yield this._dataLayer.getSessionData();
            if (!sessionData.refresh_token) {
                return Promise.reject(new AsgardeoAuthException("AUTH_CORE-RAT2-NF01", "authentication-core", "refreshAccessToken", "No refresh token found.", "There was no refresh token found. The identity server doesn't return a " +
                    "refresh token if the refresh token grant is not enabled."));
            }
            if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
                return Promise.reject(new AsgardeoAuthException("AUTH_CORE-RAT2-NF02", "authentication-core", "refreshAccessToken", "No refresh token endpoint found.", "No refresh token endpoint was in the OIDC provider meta data returned by the well-known " +
                    "endpoint or the refresh token endpoint passed to the SDK is empty."));
            }
            const body = [];
            body.push(`client_id=${configData.clientID}`);
            body.push(`refresh_token=${sessionData.refresh_token}`);
            body.push("grant_type=refresh_token");
            if (configData.clientSecret && configData.clientSecret.trim().length > 0) {
                body.push(`client_secret=${configData.clientSecret}`);
            }
            return axios
                .post(tokenEndpoint, body.join("&"), { headers: AuthenticationUtils.getTokenRequestHeaders() })
                .then((response) => {
                return this._authenticationHelper
                    .handleTokenResponse(response)
                    .then((response) => response)
                    .catch((error) => {
                    return Promise.reject(new AsgardeoAuthException("AUTH_CORE-RAT2-ES03", "authentication-core", "refreshAccessToken", undefined, undefined, error));
                });
            })
                .catch((error) => {
                var _a, _b, _c;
                return Promise.reject(new AsgardeoAuthNetworkException("AUTH_CORE-RAT2-NR03", "authentication-core", "refreshAccessToken", "Refresh access token request failed.", "The request to refresh the access token failed.", (_a = error === null || error === void 0 ? void 0 : error.code) !== null && _a !== void 0 ? _a : "", error === null || error === void 0 ? void 0 : error.message, (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.status, (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data));
            });
        });
    }
    revokeAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const revokeTokenEndpoint = (yield this._oidcProviderMetaData()).revocation_endpoint;
            const configData = yield this._config();
            if (!revokeTokenEndpoint || revokeTokenEndpoint.trim().length === 0) {
                return Promise.reject(new AsgardeoAuthException("AUTH_CORE-RAT3-NF01", "authentication-core", "revokeAccessToken", "No revoke access token endpoint found.", "No revoke access token endpoint was found in the OIDC provider meta data returned by " +
                    "the well-known endpoint or the revoke access token endpoint passed to the SDK is empty."));
            }
            const body = [];
            body.push(`client_id=${configData.clientID}`);
            body.push(`token=${(yield this._dataLayer.getSessionData()).access_token}`);
            body.push("token_type_hint=access_token");
            return axios
                .post(revokeTokenEndpoint, body.join("&"), {
                headers: AuthenticationUtils.getTokenRequestHeaders(),
                withCredentials: true
            })
                .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new AsgardeoAuthException("AUTH_CORE-RAT3-NR02", "authentication-core", "revokeAccessToken", "Invalid response status received for revoke access token request.", "The request sent to revoke the access token returned " +
                        response.status +
                        " , which is invalid."));
                }
                this._authenticationHelper.clearUserSessionData();
                return Promise.resolve(response);
            })
                .catch((error) => {
                var _a, _b, _c;
                return Promise.reject(new AsgardeoAuthNetworkException("AUTH_CORE-RAT3-NR03", "authentication-core", "revokeAccessToken", "The request to revoke access token failed.", "The request sent to revoke the access token failed.", (_a = error === null || error === void 0 ? void 0 : error.code) !== null && _a !== void 0 ? _a : "", error === null || error === void 0 ? void 0 : error.message, (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.status, (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data));
            });
        });
    }
    requestCustomGrant(customGrantParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const oidcProviderMetadata = yield this._oidcProviderMetaData();
            let tokenEndpoint;
            if (customGrantParams.tokenEndpoint && customGrantParams.tokenEndpoint.trim().length !== 0) {
                tokenEndpoint = customGrantParams.tokenEndpoint;
            }
            else {
                tokenEndpoint = oidcProviderMetadata.token_endpoint;
            }
            if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
                return Promise.reject(new AsgardeoAuthException("AUTH_CORE-RCG-NF01", "authentication-core", "requestCustomGrant", "Token endpoint not found.", "No token endpoint was found in the OIDC provider meta data returned by the well-known endpoint " +
                    "or the token endpoint passed to the SDK is empty."));
            }
            const data = yield Promise.all(Object.entries(customGrantParams.data)
                .map(([key, value]) => __awaiter(this, void 0, void 0, function* () {
                const newValue = yield this._authenticationHelper.replaceCustomGrantTemplateTags(value);
                return `${key}=${newValue}`;
            })));
            const requestConfig = {
                data: data.join("&"),
                headers: Object.assign({}, AuthenticationUtils.getTokenRequestHeaders()),
                method: "POST",
                url: tokenEndpoint
            };
            if (customGrantParams.attachToken) {
                requestConfig.headers = Object.assign(Object.assign({}, requestConfig.headers), { Authorization: `Bearer ${(yield this._dataLayer.getSessionData()).access_token}` });
            }
            return axios(requestConfig)
                .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new AsgardeoAuthException("AUTH_CORE-RCG-NR02", "authentication-core", "requestCustomGrant", "Invalid response status received for the custom grant request.", "The request sent to get the custom grant returned " +
                        response.status +
                        " , which is invalid."));
                }
                if (customGrantParams.returnsSession) {
                    return this._authenticationHelper
                        .handleTokenResponse(response)
                        .then((response) => response)
                        .catch((error) => {
                        return Promise.reject(new AsgardeoAuthException("AUTH_CORE-RCG-ES03", "authentication-core", "requestCustomGrant", undefined, undefined, error));
                    });
                }
                else {
                    return Promise.resolve(response);
                }
            })
                .catch((error) => {
                var _a, _b, _c;
                return Promise.reject(new AsgardeoAuthNetworkException("AUTH_CORE-RCG-NR04", "authentication-core", "requestCustomGrant", "The custom grant request failed.", "The request sent to get the custom grant failed.", (_a = error === null || error === void 0 ? void 0 : error.code) !== null && _a !== void 0 ? _a : "", error === null || error === void 0 ? void 0 : error.message, (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.status, (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data));
            });
        });
    }
    getBasicUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionData = yield this._dataLayer.getSessionData();
            const authenticatedUser = AuthenticationUtils.getAuthenticatedUserInfo(sessionData === null || sessionData === void 0 ? void 0 : sessionData.id_token);
            let basicUserInfo = {
                allowedScopes: sessionData.scope,
                sessionState: sessionData.session_state,
                username: authenticatedUser.username
            };
            if (!authenticatedUser.displayName || authenticatedUser.displayName === "") {
                delete authenticatedUser.displayName;
            }
            if (!authenticatedUser.tenantDomain || authenticatedUser.tenantDomain === "") {
                delete authenticatedUser.tenantDomain;
            }
            basicUserInfo = Object.assign(Object.assign({}, basicUserInfo), authenticatedUser);
            return basicUserInfo;
        });
    }
    getDecodedIDToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const idToken = (yield this._dataLayer.getSessionData()).id_token;
            const payload = CryptoUtils.decodeIDToken(idToken);
            return payload;
        });
    }
    getIDToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._dataLayer.getSessionData()).id_token;
        });
    }
    getOIDCProviderMetaData(forceInit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!forceInit && (yield this._dataLayer.getTemporaryDataParameter(OP_CONFIG_INITIATED))) {
                return Promise.resolve(true);
            }
            const wellKnownEndpoint = yield this._authenticationHelper.resolveWellKnownEndpoint();
            return axios
                .get(wellKnownEndpoint)
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                if (response.status !== 200) {
                    return Promise.reject(new AsgardeoAuthException("AUTH_CORE-GOPM-NR01", "authentication-core", "getOIDCProviderMetaData", "Invalid response status received for OIDC provider meta data request.", "The request sent to the well-known endpoint to get the OIDC provider meta data returned " +
                        response.status +
                        " , which is invalid."));
                }
                yield this._dataLayer.setOIDCProviderMetaData(yield this._authenticationHelper.resolveEndpoints(response.data));
                yield this._dataLayer.setTemporaryDataParameter(OP_CONFIG_INITIATED, true);
                return Promise.resolve(true);
            }))
                .catch(() => __awaiter(this, void 0, void 0, function* () {
                yield this._dataLayer.setOIDCProviderMetaData(yield this._authenticationHelper.resolveFallbackEndpoints());
                yield this._dataLayer.setTemporaryDataParameter(OP_CONFIG_INITIATED, true);
                return Promise.resolve(true);
            }));
        });
    }
    getOIDCServiceEndpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            const oidcProviderMetaData = yield this._oidcProviderMetaData();
            return {
                authorizationEndpoint: oidcProviderMetaData.authorization_endpoint,
                checkSessionIframe: oidcProviderMetaData.check_session_iframe,
                endSessionEndpoint: oidcProviderMetaData.end_session_endpoint,
                introspectionEndpoint: oidcProviderMetaData.introspection_endpoint,
                issuer: oidcProviderMetaData.issuer,
                jwksUri: oidcProviderMetaData.jwks_uri,
                registrationEndpoint: oidcProviderMetaData.registration_endpoint,
                revocationEndpoint: oidcProviderMetaData.revocation_endpoint,
                tokenEndpoint: oidcProviderMetaData.token_endpoint,
                userinfoEndpoint: oidcProviderMetaData.userinfo_endpoint,
                wellKnownEndpoint: yield this._authenticationHelper.resolveWellKnownEndpoint()
            };
        });
    }
    getSignOutURL() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const logoutEndpoint = (_a = (yield this._oidcProviderMetaData())) === null || _a === void 0 ? void 0 : _a.end_session_endpoint;
            const configData = yield this._config();
            if (!logoutEndpoint || logoutEndpoint.trim().length === 0) {
                throw new AsgardeoAuthException("AUTH_CORE-GSOU-NF01", "authentication-core", "getSignOutURL", "Sign-out endpoint not found.", "No sign-out endpoint was found in the OIDC provider meta data returned by the well-known endpoint " +
                    "or the sign-out endpoint passed to the SDK is empty.");
            }
            const idToken = (_b = (yield this._dataLayer.getSessionData())) === null || _b === void 0 ? void 0 : _b.id_token;
            if (!idToken || idToken.trim().length === 0) {
                throw new AsgardeoAuthException("AUTH_CORE-GSOU-NF02", "authentication-core", "getSignOutURL", "ID token n0t found.", "No ID token could be found. Either the session information is lost or you have not signed in.");
            }
            const callbackURL = (_c = configData === null || configData === void 0 ? void 0 : configData.signOutRedirectURL) !== null && _c !== void 0 ? _c : configData === null || configData === void 0 ? void 0 : configData.signInRedirectURL;
            if (!callbackURL || callbackURL.trim().length === 0) {
                throw new AsgardeoAuthException("AUTH_CORE-GSOU-NF03", "authentication-core", "getSignOutURL", "No sign-out redirect URL found.", "The sign-out redirect URL cannot be found or the URL passed to the SDK is empty. " +
                    "No sign-in redirect URL has been found either. ");
            }
            const logoutCallback = `${logoutEndpoint}?` +
                `id_token_hint=${idToken}` +
                `&post_logout_redirect_uri=${callbackURL}&state=` +
                SIGN_OUT_SUCCESS_PARAM;
            return logoutCallback;
        });
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            const signOutURL = yield this.getSignOutURL();
            this._authenticationHelper.clearUserSessionData();
            return signOutURL;
        });
    }
    getAccessToken() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (yield this._dataLayer.getSessionData())) === null || _a === void 0 ? void 0 : _a.access_token;
        });
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            return Boolean(yield this.getAccessToken());
        });
    }
    getPKCECode() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._dataLayer.getTemporaryDataParameter(PKCE_CODE_VERIFIER));
        });
    }
    setPKCECode(pkce) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._dataLayer.setTemporaryDataParameter(PKCE_CODE_VERIFIER, pkce);
        });
    }
    updateConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._dataLayer.setConfigData(config);
        });
    }
}
//# sourceMappingURL=authentication-core.js.map