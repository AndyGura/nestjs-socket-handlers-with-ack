import { SocketResponseModel } from './socket-response.model';

export class SocketRequestModel {

    data: any;
    callback: (response: SocketResponseModel) => void;

    constructor(array: any[]) {
        this.data = array[ 0 ];
        this.callback = array[ 1 ] as ((response: SocketResponseModel) => void);
    }
}