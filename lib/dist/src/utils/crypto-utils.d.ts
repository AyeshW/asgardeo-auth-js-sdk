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
/// <reference types="node" />
import { KeyLike } from "../../node_modules/jose/dist/browser/jwt/verify";
import { DecodedIDTokenPayload, JWKInterface } from "../models";
export declare class CryptoUtils {
    private constructor();
    /**
     * Get URL encoded string.
     *
     * @param {CryptoJS.WordArray} value.
     * @returns {string} base 64 url encoded value.
     */
    static base64URLEncode(value: Buffer | string): string;
    /**
     * Generate code verifier.
     *
     * @returns {string} code verifier.
     */
    static getCodeVerifier(): string;
    /**
     * Derive code challenge from the code verifier.
     *
     * @param {string} verifier.
     * @returns {string} code challenge.
     */
    static getCodeChallenge(verifier: string): string;
    /**
     * Get the supported signing algorithms for the id_token.
     *
     * @returns {string[]} array of supported algorithms.
     */
    static getSupportedSignatureAlgorithms(): string[];
    /**
     * Get JWK used for the id_token
     *
     * @param {string} jwtHeader header of the id_token.
     * @param {JWKInterface[]} keys jwks response.
     * @returns {any} public key.
     */
    static getJWKForTheIdToken(jwtHeader: string, keys: JWKInterface[]): Promise<KeyLike>;
    /**
     * Verify id token.
     *
     * @param idToken id_token received from the IdP.
     * @param jwk public key used for signing.
     * @param {string} clientID app identification.
     * @param {string} issuer id_token issuer.
     * @param {string} username Username.
     * @param {number} clockTolerance - Allowed leeway for id_tokens (in seconds).
     * @returns {Promise<boolean>} whether the id_token is valid.
     */
    static isValidIdToken(idToken: string, jwk: KeyLike, clientID: string, issuer: string, username: string, clockTolerance: number | undefined): Promise<boolean>;
    /**
     * This function decodes the payload of an id token and returns it.
     *
     * @param {string} idToken - The id token to be decoded.
     *
     * @return {DecodedIdTokenPayloadInterface} - The decoded payload of the id token.
     */
    static decodeIDToken(idToken: string): DecodedIDTokenPayload;
}
//# sourceMappingURL=crypto-utils.d.ts.map