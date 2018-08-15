import { SocketResponseModel } from './socket-response.model';

export class SocketRequestModel {

    data: any[];
    callback: (response: SocketResponseModel) => void;

    constructor(array: any[]) {
        if (array[array.length - 1] instanceof Function) {
            this.callback = array.pop() as ((response: SocketResponseModel) => void);
        }
        this.data = array.slice();
    }
}