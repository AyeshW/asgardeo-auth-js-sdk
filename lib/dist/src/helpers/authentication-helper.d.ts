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
import { OIDCEndpointsInternal, OIDCProviderMetaData, TokenResponse } from "../models";
export declare class AuthenticationHelper<T> {
    private _dataLayer;
    private _config;
    private _oidcProviderMetaData;
    constructor(dataLayer: DataLayer<T>);
    resolveWellKnownEndpoint(): Promise<string>;
    resolveEndpoints(response: OIDCProviderMetaData): Promise<OIDCProviderMetaData>;
    resolveFallbackEndpoints(): Promise<OIDCEndpointsInternal>;
    validateIdToken(idToken: string): Promise<boolean>;
    replaceCustomGrantTemplateTags(text: string): Promise<string>;
    clearUserSessionData(): Promise<void>;
    handleTokenResponse(response: AxiosResponse): Promise<TokenResponse>;
}
//# sourceMappingURL=authentication-helper.d.ts.map