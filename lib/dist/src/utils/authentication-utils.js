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
import { CryptoUtils } from "./crypto-utils";
export class AuthenticationUtils {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
    static getAuthenticatedUserInfo(idToken) {
        var _a, _b, _c;
        const payload = CryptoUtils.decodeIDToken(idToken);
        const tenantDomain = this.getTenantDomainFromIdTokenPayload(payload);
        const username = this.extractUserName(payload);
        const givenName = (_a = payload.given_name) !== null && _a !== void 0 ? _a : "";
        const familyName = (_b = payload.family_name) !== null && _b !== void 0 ? _b : "";
        const fullName = givenName && familyName
            ? `${givenName} ${familyName}`
            : givenName
                ? givenName
                : familyName
                    ? familyName
                    : "";
        const displayName = (_c = payload.preferred_username) !== null && _c !== void 0 ? _c : fullName;
        return Object.assign({ displayName: displayName, tenantDomain, username: username }, this.filterClaimsFromIDTokenPayload(payload));
    }
    static filterClaimsFromIDTokenPayload(payload) {
        const optionalizedPayload = Object.assign({}, payload);
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.iss;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.sub;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.aud;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.exp;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.iat;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.acr;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.amr;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.azp;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.auth_time;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.nonce;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.c_hash;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.at_hash;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.nbf;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.isk;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.sid;
        const camelCasedPayload = {};
        Object.entries(optionalizedPayload).forEach(([key, value]) => {
            const keyParts = key.split("_");
            const camelCasedKey = keyParts
                .map((key, index) => {
                if (index === 0) {
                    return key;
                }
                return [key[0].toUpperCase(), ...key.slice(1)].join("");
            })
                .join("");
            camelCasedPayload[camelCasedKey] = value;
        });
        return camelCasedPayload;
    }
    static getTokenRequestHeaders() {
        return {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        };
    }
}
AuthenticationUtils.extractUserName = (payload, uidSeparator = "@") => {
    const uid = payload.sub;
    const parts = uid.split(uidSeparator);
    parts.length > 2 && parts.pop();
    return parts.join(uidSeparator);
};
AuthenticationUtils.getTenantDomainFromIdTokenPayload = (payload, uidSeparator = "@") => {
    // Try to extract the tenant domain from the `sub` claim.
    const uid = payload.sub;
    const tokens = uid.split(uidSeparator);
    // This works only when the email is used as the username
    // and the tenant domain is appended to the`sub` attribute.
    return tokens.length > 2 ? tokens[tokens.length - 1] : "";
};
//# sourceMappingURL=authentication-utils.js.map