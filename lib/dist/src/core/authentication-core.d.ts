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
import { AxiosResponse } from "axios";
import { DataLayer } from "../data";
import { AuthClientConfig, AuthorizationURLParams, BasicUserInfo, CustomGrantConfig, DecodedIDTokenPayload, OIDCEndpoints, TokenResponse } from "../models";
export declare class AuthenticationCore<T> {
    private _dataLayer;
    private _config;
    private _oidcProviderMetaData;
    private _authenticationHelper;
    constructor(dataLayer: DataLayer<T>);
    getAuthorizationURL(config?: AuthorizationURLParams): Promise<string>;
    requestAccessToken(authorizationCode: string, sessionState: string): Promise<TokenResponse>;
    refreshAccessToken(): Promise<TokenResponse>;
    revokeAccessToken(): Promise<AxiosResponse>;
    requestCustomGrant(customGrantParams: CustomGrantConfig): Promise<TokenResponse | AxiosResponse>;
    getBasicUserInfo(): Promise<BasicUserInfo>;
    getDecodedIDToken(): Promise<DecodedIDTokenPayload>;
    getIDToken(): Promise<string>;
    getOIDCProviderMetaData(forceInit: boolean): Promise<boolean>;
    getOIDCServiceEndpoints(): Promise<OIDCEndpoints>;
    getSignOutURL(): Promise<string>;
    signOut(): Promise<string>;
    getAccessToken(): Promise<string>;
    isAuthenticated(): Promise<boolean>;
    getPKCECode(): Promise<string>;
    setPKCECode(pkce: string): Promise<void>;
    updateConfig(config: Partial<AuthClientConfig<T>>): Promise<void>;
}
//# sourceMappingURL=authentication-core.d.ts.map