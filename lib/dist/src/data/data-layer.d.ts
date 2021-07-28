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
import { AuthClientConfig, OIDCProviderMetaData, SessionData, Store, StoreValue, TemporaryData } from "../models";
export declare class DataLayer<T> {
    private _id;
    private _store;
    constructor(instanceID: string, store: Store);
    private setDataInBulk;
    private setValue;
    private removeValue;
    private _resolveKey;
    setConfigData(config: Partial<AuthClientConfig<T>>): Promise<void>;
    setOIDCProviderMetaData(oidcProviderMetaData: Partial<OIDCProviderMetaData>): Promise<void>;
    setTemporaryData(temporaryData: Partial<TemporaryData>): Promise<void>;
    setSessionData(sessionData: Partial<SessionData>): Promise<void>;
    getConfigData(): Promise<AuthClientConfig<T>>;
    getOIDCProviderMetaData(): Promise<OIDCProviderMetaData>;
    getTemporaryData(): Promise<TemporaryData>;
    getSessionData(): Promise<SessionData>;
    removeConfigData(): Promise<void>;
    removeOIDCProviderMetaData(): Promise<void>;
    removeTemporaryData(): Promise<void>;
    removeSessionData(): Promise<void>;
    getConfigDataParameter(key: keyof AuthClientConfig<T>): Promise<StoreValue>;
    getOIDCProviderMetaDataParameter(key: keyof OIDCProviderMetaData): Promise<StoreValue>;
    getTemporaryDataParameter(key: keyof TemporaryData): Promise<StoreValue>;
    getSessionDataParameter(key: keyof SessionData): Promise<StoreValue>;
    setConfigDataParameter(key: keyof AuthClientConfig<T>, value: StoreValue): Promise<void>;
    setOIDCProviderMetaDataParameter(key: keyof OIDCProviderMetaData, value: StoreValue): Promise<void>;
    setTemporaryDataParameter(key: keyof TemporaryData, value: StoreValue): Promise<void>;
    setSessionDataParameter(key: keyof SessionData, value: StoreValue): Promise<void>;
    removeConfigDataParameter(key: keyof AuthClientConfig<T>): Promise<void>;
    removeOIDCProviderMetaDataParameter(key: keyof OIDCProviderMetaData): Promise<void>;
    removeTemporaryDataParameter(key: keyof TemporaryData): Promise<void>;
    removeSessionDataParameter(key: keyof SessionData): Promise<void>;
}
//# sourceMappingURL=data-layer.d.ts.map