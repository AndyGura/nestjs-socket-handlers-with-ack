import { SubscribeMessage } from '@nestjs/websockets';

export const SubscribeMessageWithAck: <T = string>(message: T) => MethodDecorator = (message) => {
    const defaultDecorator: MethodDecorator = SubscribeMessage(message);
    return (target, key, descriptor) => {
        const result: any = defaultDecorator(target, key, descriptor);
        const func: Function = result.value;
        result.value = function (socket, payload) {
            const req = new SocketRequestModel(payload);
            func.bind(this)(socket, req.data)
                .then(
                    (msg) => {
                        req.callback({
                            success: true,
                            msg: msg
                        });
                    })
                .catch((err) => {
                        req.callback({
                            success: false,
                            msg: err.message
                        });
                    }
                );
        };
        Reflect.defineMetadata("__isMessageMapping", true, descriptor.value);
        Reflect.defineMetadata("message", message, descriptor.value);
        return result;
    };
};

export class SocketRequestModel {

    data: any;
    callback: (response: SocketResponseModel) => void;

    constructor(array: any[]) {
        this.data = array[ 0 ];
        this.callback = array[ 1 ] as ((response: SocketResponseModel) => void);
    }
}

export class SocketResponseModel {

    success: boolean;
    msg: any;

}