"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeMessageWithAck = void 0;
const websockets_1 = require("@nestjs/websockets");
const constants_1 = require("@nestjs/websockets/constants");
const socket_request_model_1 = require("../models/socket-request.model");
const successCallback = (req, data) => {
    if (req.callback) {
        req.callback({
            success: true,
            data
        });
    }
};
const errorCallback = (req, error) => {
    if (req.callback) {
        req.callback({
            success: false,
            data: error.message
        });
    }
};
const SubscribeMessageWithAck = (message) => {
    const defaultDecorator = websockets_1.SubscribeMessage(message);
    return (target, key, descriptor) => {
        const result = defaultDecorator(target, key, descriptor);
        const func = result.value;
        result.value = function (socket, payload) {
            const req = new socket_request_model_1.SocketRequestModel(payload);
            try {
                const syncCallResult = func.bind(this)(socket, ...req.data);
                if (syncCallResult instanceof Promise) {
                    syncCallResult
                        .then(data => successCallback(req, data))
                        .catch(error => errorCallback(req, error));
                    return;
                }
                successCallback(req, syncCallResult);
            }
            catch (err) {
                errorCallback(req, err);
            }
        };
        Reflect.defineMetadata(constants_1.MESSAGE_MAPPING_METADATA, true, descriptor.value);
        Reflect.defineMetadata(constants_1.MESSAGE_METADATA, message, descriptor.value);
        return result;
    };
};
exports.SubscribeMessageWithAck = SubscribeMessageWithAck;
//# sourceMappingURL=subscribe-message-with-ack.decorator.js.map