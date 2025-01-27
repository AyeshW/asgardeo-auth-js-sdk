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
import { AsgardeoAuthNetworkException } from ".";
export declare class AsgardeoAuthException extends Error {
    name: string;
    code: string | undefined;
    file: string;
    method: string;
    description: string | undefined;
    error: AsgardeoAuthException | AsgardeoAuthNetworkException | undefined;
    constructor(code: string | undefined, file: string, method: string, message?: string, description?: string, error?: AsgardeoAuthException | AsgardeoAuthNetworkException | undefined);
}
//# sourceMappingURL=exception.d.ts.map