import {SubscribeMessage} from '@nestjs/websockets';
import {MESSAGE_MAPPING_METADATA, MESSAGE_METADATA} from '@nestjs/websockets/constants';
import {SocketRequestModel} from '../models/socket-request.model';

const successCallback = (req: SocketRequestModel, msg: any) => {
    if (req.callback) {
        req.callback({
            success: true,
            msg: msg
        });
    }
};

const errorCallback = (req: SocketRequestModel, err: any) => {
    if (req.callback) {
        req.callback({
            success: false,
            msg: err.message
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
                        .then(msg => successCallback(req, msg))
                        .catch(err => errorCallback(req, err));
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
