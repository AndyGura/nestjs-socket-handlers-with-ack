"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketRequestModel = void 0;
class SocketRequestModel {
    constructor(array) {
        if (array[array.length - 1] instanceof Function) {
            this.callback = array.pop();
        }
        this.data = array.slice();
    }
}
exports.SocketRequestModel = SocketRequestModel;
//# sourceMappingURL=socket-request.model.js.map