import * as http from 'http'
import url from "url";
import * as Configs from "../config/Configs";
import WebSocketServer from "websocket";
import SocketManager from "./SocketManager";
import SocketModel from "../data/model/core/SocketModel";
import {TRUSTED_ORIGINS} from "../config/Configs";

export default class ServerManager {
    private static instance: ServerManager;
    private httpServer: http.Server;
    private wsServer: WebSocketServer.server;

    private constructor() {
        console.log("[ServerManager][constructor] - Start");
    }

    public static getInstance(): ServerManager {
        if (!ServerManager.instance) {
            ServerManager.instance = new ServerManager();
        }

        return ServerManager.instance;
    }


    init() {
        this.createHttpServer();
        this.startHttpServer();
        this.createWebSocketServer();
    }


    createHttpServer() {
        this.httpServer = http.createServer();
        console.log("[ServerManager][createHttpServer] - Done.");
    }

    startHttpServer() {
        this.httpServer.listen(Configs.SERVER_PORT);
        console.log("[ServerManager][startHttpServer] - Done with port: " + Configs.SERVER_PORT);
    }

    createWebSocketServer() {
        this.wsServer = new WebSocketServer.server({
            httpServer: this.httpServer,
            autoAcceptConnections: false
        });
        console.log("[ServerManager][createWebSocketServer] - Done.");

        this.onRequest_WebSocketServer();
    }

    onRequest_WebSocketServer() {

        const self = this;
        console.log("[ServerManager][onRequest_WebSocketServer] - Called.");

        this.wsServer.on('request', function (request: WebSocketServer.request) {

            console.log("[ServerManager][onRequest_WebSocketServer] - wsServer on_request.");

            const pathname = url.parse(<string>request.httpRequest.url).pathname;
            // const query = url.parse(packetDataModel.httpRequest.url).query;
            // console.log("query: ", query);
            // console.log("querys: ", querystring.parse(query).user_name);
            // if (pathname !== '/ws' || query == null || query === "" ||
            //     querystring.parse(query).user_name == null || querystring.parse(query).user_name === "" ||
            //     querystring.parse(query).password == null || querystring.parse(query).password === "") {
            //     console.warn(`Endpoint not valid. [pathname: ${pathname}] -  [query: ${query}]`);
            //     packetDataModel.reject(404, "Endpoint not valid.");
            //     return;
            // }

            const origin = url.parse(request.origin).hostname;

            if (TRUSTED_ORIGINS.find(x => x === origin) == null) {
                console.warn(`origin not valid. [origin: ${origin}]`);
                request.reject(404, "origin not valid.");
                return;
            }


            if (pathname !== '/ws') {
                console.warn(`Endpoint not valid. [pathname: ${pathname}]`);
                request.reject(404, "Endpoint not valid.");
                return;
            }

            const socket: SocketModel = new SocketModel().setConnection(request.accept(undefined, request.origin));
            SocketManager.getInstance().onNewSocket(socket);

        });

    }

}
