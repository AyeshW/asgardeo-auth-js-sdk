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
import { DataLayer } from "./data";
import { AuthClientConfig, BasicUserInfo, CustomGrantConfig, DecodedIDTokenPayload, GetAuthURLConfig, OIDCEndpoints, Store, TokenResponse } from "./models";
/**
 * This class provides the necessary methods needed to implement authentication.
 *
 * @export
 * @class AsgardeoAuthClient
 */
export declare class AsgardeoAuthClient<T> {
    private _dataLayer;
    private _authenticationCore;
    private static _instanceID;
    /**
     * This is the constructor method that returns an instance of the .
     *
     * @param {Store} store - The store object.
     *
     * @example
     * ```
     * const _store: Store = new DataStore();
     * const auth = new AsgardeoAuthClient<CustomClientConfig>(_store);
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#constructor
     * @preserve
     */
    constructor(store: Store);
    /**
     *
     * This method initializes the SDK with the config data.
     *
     * @param {AuthClientConfig<T>} config - The config object to initialize with.
     *
     * @example
     * const config = {
     *     signInRedirectURL: "http://localhost:3000/sign-in",
     *     clientID: "client ID",
     *     serverOrigin: "https://localhost:9443"
     * }
     *
     * await auth.initialize(config);
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#initialize
     *
     * @preserve
     */
    initialize(config: AuthClientConfig<T>): Promise<void>;
    /**
     * This method returns the `DataLayer` object that allows you to access authentication data.
     *
     * @return {DataLayer} - The `DataLayer` object.
     *
     * @example
     * ```
     * const data = auth.getDataLayer();
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getDataLayer
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    getDataLayer(): DataLayer<T>;
    /**
     * This is an async method that returns a Promise that resolves with the authorization URL.
     *
     * @param {GetAuthURLConfig} config - (Optional) A config object to force initialization and pass
     * custom path parameters such as the fidp parameter.
     *
     * @return {Promise<string>} - A promise that resolves with the authorization URL.
     *
     * @example
     * ```
     * auth.getAuthorizationURL().then((url)=>{
     *  // console.log(url);
     * }).catch((error)=>{
     *  // console.error(error);
     * });
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getAuthorizationURL
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    getAuthorizationURL(config?: GetAuthURLConfig): Promise<string>;
    /**
     * This is an async method that sends a request to obtain the access token and returns a Promise
     * that resolves with the token and other relevant data.
     *
     * @param {string} authorizationCode - The authorization code.
     * @param {string} sessionState - The session state.
     *
     * @return {Promise<TokenResponse>} - A Promise that resolves with the token response.
     *
     * @example
     * ```
     * auth.requestAccessToken(authCode, sessionState).then((token)=>{
     *  // console.log(token);
     * }).catch((error)=>{
     *  // console.error(error);
     * });
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#requestAccessToken
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    requestAccessToken(authorizationCode: string, sessionState: string): Promise<TokenResponse>;
    /**
     * This method clears all authentication data and returns the sign-out URL.
     *
     * @return {Promise<string>} - A Promise that resolves with the sign-out URL.
     *
     * @example
     * ```
     * const signOutUrl = await auth.signOut();
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#signOut
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    signOut(): Promise<string>;
    /**
     * This method returns the sign-out URL.
     *
     * **This doesn't clear the authentication data.**
     *
     * @return {Promise<string>} - A Promise that resolves with the sign-out URL.
     *
     * @example
     * ```
     * const signOutUrl = await auth.getSignOutURL();
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getSignOutURL
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    getSignOutURL(): Promise<string>;
    /**
     * This method returns OIDC service endpoints that are fetched from the `.well-known` endpoint.
     *
     * @return {Promise<OIDCEndpoints>} - A Promise that resolves with an object containing the OIDC service endpoints.
     *
     * @example
     * ```
     * const endpoints = await auth.getOIDCServiceEndpoints();
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getOIDCServiceEndpoints
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    getOIDCServiceEndpoints(): Promise<OIDCEndpoints>;
    /**
     * This method decodes the payload of the ID token and returns it.
     *
     * @return {Promise<DecodedIDTokenPayload>} - A Promise that resolves with the decoded ID token payload.
     *
     * @example
     * ```
     * const decodedIdToken = await auth.getDecodedIDToken();
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getDecodedIDToken
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    getDecodedIDToken(): Promise<DecodedIDTokenPayload>;
    /**
     * This method returns the ID token.
     *
     * @return {Promise<string>} - A Promise that resolves with the ID token.
     *
     * @example
     * ```
     * const idToken = await auth.getIDToken();
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getIDToken
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    getIDToken(): Promise<string>;
    /**
     * This method returns the basic user information obtained from the ID token.
     *
     * @return {Promise<BasicUserInfo>} - A Promise that resolves with an object containing the basic user information.
     *
     * @example
     * ```
     * const userInfo = await auth.getBasicUserInfo();
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getBasicUserInfo
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    getBasicUserInfo(): Promise<BasicUserInfo>;
    /**
     * This method revokes the access token.
     *
     * **This method also clears the authentication data.**
     *
     * @return {Promise<AxiosResponse>} - A Promise that returns the response of the revoke-access-token request.
     *
     * @example
     * ```
     * auth.revokeAccessToken().then((response)=>{
     *  // console.log(response);
     * }).catch((error)=>{
     *  // console.error(error);
     * });
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#revokeAccessToken
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    revokeAccessToken(): Promise<AxiosResponse>;
    /**
     * This method refreshes the access token and returns a Promise that resolves with the new access
     * token and other relevant data.
     *
     * @return {Promise<TokenResponse>} - A Promise that resolves with the token response.
     *
     * @example
     * ```
     * auth.refreshAccessToken().then((response)=>{
     *  // console.log(response);
     * }).catch((error)=>{
     *  // console.error(error);
     * });
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#refreshAccessToken
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    refreshAccessToken(): Promise<TokenResponse>;
    /**
     * This method returns the access token.
     *
     * @return {Promise<string>} - A Promise that resolves with the access token.
     *
     * @example
     * ```
     * const accessToken = await auth.getAccessToken();
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getAccessToken
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    getAccessToken(): Promise<string>;
    /**
     * This method sends a custom-grant request and returns a Promise that resolves with the response
     * depending on the config passed.
     *
     * @param {CustomGrantConfig} config - A config object containing the custom grant configurations.
     *
     * @return {Promise<TokenResponse | AxiosResponse>} - A Promise that resolves with the response depending
     * on your configurations.
     *
     * @example
     * ```
     * const config = {
     *   attachToken: false,
     *   data: {
     *       client_id: "{{clientID}}",
     *       grant_type: "account_switch",
     *       scope: "{{scope}}",
     *       token: "{{token}}",
     *   },
     *   id: "account-switch",
     *   returnResponse: true,
     *   returnsSession: true,
     *   signInRequired: true
     * }
     *
     * auth.requestCustomGrant(config).then((response)=>{
     *  // console.log(response);
     * }).catch((error)=>{
     *  // console.error(error);
     * });
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#requestCustomGrant
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    requestCustomGrant(config: CustomGrantConfig): Promise<TokenResponse | AxiosResponse>;
    /**
     * This method returns if the user is authenticated or not.
     *
     * @return {Promise<boolean>} - A Promise that resolves with `true` if the user is authenticated, `false` otherwise.
     *
     * @example
     * ```
     * await auth.isAuthenticated();
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#isAuthenticated
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    isAuthenticated(): Promise<boolean>;
    /**
     * This method returns the PKCE code generated during the generation of the authentication URL.
     *
     * @return {Promise<string>} - A Promise that resolves with the PKCE code.
     *
     * @example
     * ```
     * const pkce = await getPKCECode();
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getPKCECode
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    getPKCECode(): Promise<string>;
    /**
     * This method sets the PKCE code to the data store.
     *
     * @param {string} pkce - The PKCE code.
     *
     * @example
     * ```
     * await auth.setPKCECode("pkce_code")
     * ```
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#setPKCECode
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    setPKCECode(pkce: string): Promise<void>;
    /**
     * This method returns if the sign-out is successful or not.
     *
     * @param {string} signOutRedirectUrl - The URL to which the user has been redirected to after signing-out.
     *
     * **The server appends path parameters to the `signOutRedirectURL` and these path parameters
     *  are required for this method to function.**
     *
     * @return {boolean} - `true` if successful, `false` otherwise.
     *
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#isSignOutSuccessful
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    static isSignOutSuccessful(signOutRedirectURL: string): boolean;
    /**
     * This method updates the configuration that was passed into the constructor when instantiating this class.
     *
     * @param {Partial<AuthClientConfig<T>>} config - A config object to update the SDK configurations with.
     *
     * @example
     * ```
     * const config = {
     *     signInRedirectURL: "http://localhost:3000/sign-in",
     *     clientID: "client ID",
     *     serverOrigin: "https://localhost:9443"
     * }
     *
     * await auth.updateConfig(config);
     * ```
     * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#updateConfig
     *
     * @memberof AsgardeoAuthClient
     *
     * @preserve
     */
    updateConfig(config: Partial<AuthClientConfig<T>>): void;
}
//# sourceMappingURL=authentication-client.d.ts.map