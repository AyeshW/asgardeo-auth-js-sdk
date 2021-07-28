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
import { AUTHORIZATION_ENDPOINT, CLIENT_ID_TAG, CLIENT_SECRET_TAG, END_SESSION_ENDPOINT, JWKS_ENDPOINT, OIDC_SCOPE, OIDC_SESSION_IFRAME_ENDPOINT, REVOKE_TOKEN_ENDPOINT, SCOPE_TAG, SERVICE_RESOURCES, TOKEN_ENDPOINT, TOKEN_TAG, USERNAME_TAG } from "../constants";
import { AsgardeoAuthException, AsgardeoAuthNetworkException } from "../exception";
import { AuthenticationUtils, CryptoUtils } from "../utils";
export class AuthenticationHelper {
    constructor(dataLayer) {
        this._dataLayer = dataLayer;
        this._config = () => __awaiter(this, void 0, void 0, function* () { return yield this._dataLayer.getConfigData(); });
        this._oidcProviderMetaData = () => __awaiter(this, void 0, void 0, function* () { return yield this._dataLayer.getOIDCProviderMetaData(); });
    }
    resolveWellKnownEndpoint() {
        return __awaiter(this, void 0, void 0, function* () {
            const configData = yield this._config();
            if (configData.wellKnownEndpoint) {
                return configData.serverOrigin + configData.wellKnownEndpoint;
            }
            return configData.serverOrigin + SERVICE_RESOURCES.wellKnownEndpoint;
        });
    }
    resolveEndpoints(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const oidcProviderMetaData = {};
            const configData = yield this._config();
            if (configData.overrideWellEndpointConfig) {
                configData.endpoints &&
                    Object.keys(configData.endpoints).forEach((endpointName) => {
                        const snakeCasedName = endpointName.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
                        oidcProviderMetaData[snakeCasedName] =
                            (configData === null || configData === void 0 ? void 0 : configData.endpoints) ? configData.endpoints[endpointName]
                                : "";
                    });
            }
            return Object.assign(Object.assign({}, response), oidcProviderMetaData);
        });
    }
    resolveFallbackEndpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            const oidcProviderMetaData = {};
            const configData = yield this._config();
            (configData === null || configData === void 0 ? void 0 : configData.endpoints) &&
                Object.keys(configData.endpoints).forEach((endpointName) => {
                    const camelCasedName = endpointName
                        .split("_")
                        .map((name, index) => {
                        if (index !== 0) {
                            return name[0].toUpperCase() + name.substring(1);
                        }
                        return name;
                    })
                        .join("");
                    oidcProviderMetaData[camelCasedName] = (configData === null || configData === void 0 ? void 0 : configData.endpoints) ? configData.endpoints[camelCasedName]
                        : "";
                });
            const defaultEndpoints = {
                [AUTHORIZATION_ENDPOINT]: configData.serverOrigin + SERVICE_RESOURCES.authorizationEndpoint,
                [END_SESSION_ENDPOINT]: configData.serverOrigin + SERVICE_RESOURCES.endSessionEndpoint,
                [JWKS_ENDPOINT]: configData.serverOrigin + SERVICE_RESOURCES.jwksUri,
                [OIDC_SESSION_IFRAME_ENDPOINT]: configData.serverOrigin + SERVICE_RESOURCES.checkSessionIframe,
                [REVOKE_TOKEN_ENDPOINT]: configData.serverOrigin + SERVICE_RESOURCES.revocationEndpoint,
                [TOKEN_ENDPOINT]: configData.serverOrigin + SERVICE_RESOURCES.tokenEndpoint
            };
            return Object.assign(Object.assign({}, defaultEndpoints), oidcProviderMetaData);
        });
    }
    validateIdToken(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwksEndpoint = (yield this._dataLayer.getOIDCProviderMetaData()).jwks_uri;
            if (!jwksEndpoint || jwksEndpoint.trim().length === 0) {
                return Promise.reject(new AsgardeoAuthException("AUTH_HELPER-VIT-NF01", "authentication-helper", "validateIdToken", "JWKS endpoint not found.", "No JWKS endpoint was found in the OIDC provider meta data returned by the well-known endpoint " +
                    "or the JWKS endpoint passed to the SDK is empty."));
            }
            return axios
                .get(jwksEndpoint)
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                if (response.status !== 200) {
                    return Promise.reject(new AsgardeoAuthException("AUTH_HELPER-VIT-NR02", "authentication-helper", "validateIdToken", "Invalid response status received for jwks request.", "The request sent to get the jwks returned " + response.status + " , which is invalid."));
                }
                const issuer = (yield this._oidcProviderMetaData()).issuer;
                const issuerFromURL = (yield this.resolveWellKnownEndpoint()).split("/.well-known")[0];
                // Return false if the issuer in the open id config doesn't match
                // the issuer in the well known endpoint URL.
                if (!issuer || issuer !== issuerFromURL) {
                    return Promise.resolve(false);
                }
                return CryptoUtils.getJWKForTheIdToken(idToken.split(".")[0], response.data.keys)
                    .then((jwk) => __awaiter(this, void 0, void 0, function* () {
                    return CryptoUtils.isValidIdToken(idToken, jwk, (yield this._config()).clientID, issuer, AuthenticationUtils.getAuthenticatedUserInfo(idToken).username, (yield this._config()).clockTolerance)
                        .then((response) => response)
                        .catch((error) => {
                        return Promise.reject(new AsgardeoAuthException("AUTH_HELPER-VIT-ES03", "authentication-helper", "validateIdToken", undefined, undefined, error));
                    });
                }))
                    .catch((error) => {
                    return Promise.reject(new AsgardeoAuthException("AUTH_HELPER-VIT-ES04", "authentication-helper", "validateIdToken", undefined, undefined, error));
                });
            }))
                .catch((error) => {
                var _a, _b, _c;
                return Promise.reject(new AsgardeoAuthNetworkException("AUTH_HELPER-VIT-NR05", "authentication-helper", "validateIdToken", "Request to jwks endpoint failed.", "The request sent to get the jwks from the server failed.", (_a = error === null || error === void 0 ? void 0 : error.code) !== null && _a !== void 0 ? _a : "", error === null || error === void 0 ? void 0 : error.message, (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.status, (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data));
            });
        });
    }
    replaceCustomGrantTemplateTags(text) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let scope = OIDC_SCOPE;
            const configData = yield this._config();
            const sessionData = yield this._dataLayer.getSessionData();
            if (configData.scope && configData.scope.length > 0) {
                if (!configData.scope.includes(OIDC_SCOPE)) {
                    configData.scope.push(OIDC_SCOPE);
                }
                scope = configData.scope.join(" ");
            }
            return text
                .replace(TOKEN_TAG, sessionData.access_token)
                .replace(USERNAME_TAG, AuthenticationUtils.getAuthenticatedUserInfo(sessionData.id_token).username)
                .replace(SCOPE_TAG, scope)
                .replace(CLIENT_ID_TAG, configData.clientID)
                .replace(CLIENT_SECRET_TAG, (_a = configData.clientSecret) !== null && _a !== void 0 ? _a : "");
        });
    }
    clearUserSessionData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._dataLayer.removeOIDCProviderMetaData();
            yield this._dataLayer.removeTemporaryData();
            yield this._dataLayer.removeSessionData();
        });
    }
    handleTokenResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (response.status !== 200) {
                return Promise.reject(new AsgardeoAuthException("AUTH_HELPER-HTR-NR01", "authentication-helper", "handleTokenResponse", "Invalid response status received for token request.", "The request sent to get the token returned " + response.status + " , which is invalid."));
            }
            if ((yield this._config()).validateIDToken) {
                return this.validateIdToken(response.data.id_token)
                    .then((valid) => __awaiter(this, void 0, void 0, function* () {
                    if (valid) {
                        yield this._dataLayer.setSessionData(response.data);
                        const tokenResponse = {
                            accessToken: response.data.access_token,
                            expiresIn: response.data.expires_in,
                            idToken: response.data.id_token,
                            refreshToken: response.data.refresh_token,
                            scope: response.data.scope,
                            tokenType: response.data.token_type
                        };
                        return Promise.resolve(tokenResponse);
                    }
                    return Promise.reject(new AsgardeoAuthException("AUTH_HELPER-HTR-IV02", "authentication-helper", "handleTokenResponse", "The id token returned is not valid.", "The id token returned has failed the validation check."));
                }))
                    .catch((error) => {
                    return Promise.reject(new AsgardeoAuthException("AUTH_HELPER-HAT-ES03", "authentication-helper", "handleTokenResponse", undefined, undefined, error));
                });
            }
            else {
                const tokenResponse = {
                    accessToken: response.data.access_token,
                    expiresIn: response.data.expires_in,
                    idToken: response.data.id_token,
                    refreshToken: response.data.refresh_token,
                    scope: response.data.scope,
                    tokenType: response.data.token_type
                };
                yield this._dataLayer.setSessionData(response.data);
                return Promise.resolve(tokenResponse);
            }
        });
    }
}
//# sourceMappingURL=authentication-helper.js.map