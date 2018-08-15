"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websockets_1 = require("@nestjs/websockets");
const socket_request_model_1 = require("../models/socket-request.model");
exports.SubscribeMessageWithAck = (message) => {
    const defaultDecorator = websockets_1.SubscribeMessage(message);
    return (target, key, descriptor) => {
        const result = defaultDecorator(target, key, descriptor);
        const func = result.value;
        result.value = function (socket, payload) {
            const req = new socket_request_model_1.SocketRequestModel(payload);
            func.bind(this)(socket, req.data)
                .then((msg) => {
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
            });
        };
        Reflect.defineMetadata("__isMessageMapping", true, descriptor.value);
        Reflect.defineMetadata("message", message, descriptor.value);
        return result;
    };
};
//# sourceMappingURL=subscribe-message-with-ack.decorator.js.map