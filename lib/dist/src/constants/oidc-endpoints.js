/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
export const SERVICE_RESOURCES = {
    authorizationEndpoint: "/oauth2/authorize",
    checkSessionIframe: "/oidc/checksession",
    endSessionEndpoint: "/oidc/logout",
    jwksUri: "/oauth2/jwks",
    revocationEndpoint: "/oauth2/revoke",
    tokenEndpoint: "/oauth2/token",
    wellKnownEndpoint: "/oauth2/token/.well-known/openid-configuration"
};
export const AUTHORIZATION_ENDPOINT = "authorization_endpoint";
export const TOKEN_ENDPOINT = "token_endpoint";
export const REVOKE_TOKEN_ENDPOINT = "revocation_endpoint";
export const END_SESSION_ENDPOINT = "end_session_endpoint";
export const JWKS_ENDPOINT = "jwks_uri";
export const OP_CONFIG_INITIATED = "op_config_initiated";
export const TENANT = "tenant";
export const SIGN_IN_REDIRECT_URL = "sign_in_redirect_url";
export const SIGN_OUT_REDIRECT_URL = "sign_out_redirect_url";
export const OIDC_SESSION_IFRAME_ENDPOINT = "check_session_iframe";
export const OPEN_ID_CONFIG = "open_id_config";
export const REGISTRATION_ENDPOINT = "registration_endpoint";
export const USERINFO_ENDPOINT = "userinfo_endpoint";
export const INTROSPECTION_ENDPOINT = "introspection_endpoint";
//# sourceMappingURL=oidc-endpoints.js.map