import WebSocketServer from "websocket";
export default class SocketModel {
    connection : WebSocketServer.connection;
    socketId : string;
    isTrusted: boolean;
    token: string;
    userId: string;

    constructor() {
    }

    setConnection(connection: WebSocketServer.connection) : SocketModel {
        this.connection = connection;
        return this;
    }
}
