import { SocketResponseModel } from './socket-response.model';
export declare class SocketRequestModel {
    data: any;
    callback: (response: SocketResponseModel) => void;
    constructor(array: any[]);
}
