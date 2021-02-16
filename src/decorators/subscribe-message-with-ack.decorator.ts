import {SubscribeMessage} from '@nestjs/websockets';
import {MESSAGE_MAPPING_METADATA, MESSAGE_METADATA} from '@nestjs/websockets/constants';
import {SocketRequestModel} from '../models/socket-request.model';

const successCallback = (req: SocketRequestModel, data: any) => {
    if (req.callback) {
        req.callback({
            success: true,
            data
        });
    }
};

const errorCallback = (req: SocketRequestModel, error: any) => {
    if (req.callback) {
        req.callback({
            success: false,
            data: error.message
        });
    }
};

export const SubscribeMessageWithAck: <T = string>(message: T) => MethodDecorator = (message) => {
    const defaultDecorator: MethodDecorator = SubscribeMessage(message);
    return (target, key, descriptor) => {
        const result: any = defaultDecorator(target, key, descriptor);
        const func: Function = result.value;
        result.value = function (socket, payload) {
            const req = new SocketRequestModel(payload);
            try {
                const syncCallResult = func.bind(this)(socket, ...req.data);
                if (syncCallResult instanceof Promise) {
                    syncCallResult
                        .then(data => successCallback(req, data))
                        .catch(error => errorCallback(req, error));
                    return;
                }
                successCallback(req, syncCallResult);
            } catch (err) {
                errorCallback(req, err);
            }
        };
        Reflect.defineMetadata(MESSAGE_MAPPING_METADATA, true, descriptor.value);
        Reflect.defineMetadata(MESSAGE_METADATA, message, descriptor.value);
        return result;
    };
};
