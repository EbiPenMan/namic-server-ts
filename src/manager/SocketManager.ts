import MetricsManager from "./MetricsManager";
import SocketModel from "../data/model/core/SocketModel";
import {v4 as uuidv4} from "uuid";
import UserModule from "../module/UserModule";
import Packet from "../data/model/packet/Packet";
import {
    ERROR_ALREADY_SING_IN,
    ERROR_PACKET_UNDEFINED,
    ERROR_UNAUTHORIZED,
    ERROR_UNKNOWN
} from "../data/model/packet/PacketError";
import PlaceManager from "./PlaceManager";
import {PacketMessageSendingType} from "../data/model/packet/PacketMessageSendingType";
import {PACKET_MESSAGE_SENDING_TYPE, Packet_Message_Serialization_Type} from "../config/Configs";
import {PacketMessageSerializationType} from "../data/model/packet/PacketMessageSerializationType";
import {PACKET_CLASS_TYPES} from "../data/model/packet/PacketClassType";
import ControllerFactory from "../controller/ControllerFactory";


export default class SocketManager {
    private static instance: SocketManager;
    private socketsList: SocketModel[];
    private printMetrics_uuid: string;

    private constructor() {
        console.log("[SocketManager][constructor] - Start");
        this.socketsList = [];
        this.printMetrics_uuid = MetricsManager.getInstance().registerMetric(this, null, this.printMetrics);
        console.log("[SocketManager][constructor] - printMetrics_uuid: ", this.printMetrics_uuid);
    }

    public static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }

        return SocketManager.instance;
    }


    onNewSocket(socket: SocketModel) {
        console.log("[SocketManager][onNewSocket] - Called.");
        socket.socketId = uuidv4();
        this.socketsList.push(socket);
        this.setSocketCallbacks(socket);
        // new UserModule().init(socket);
    }

    setSocketCallbacks(socket: SocketModel) {
        const self = this;
        socket.connection.on('message', function (packet: any) {
            console.log("[SocketManager][setSocketCallbacks][on packet] - packet: ");
            // self.socket.send('Hi this is WebSocket server!');
            if (packet.type && packet.type === "utf8") {
                if (packet.utf8Data != null && packet.utf8Data !== "") {
                    try {
                        if (Packet_Message_Serialization_Type == PacketMessageSerializationType.Base64)
                            self.onPacket(socket.socketId, new Packet(atob(JSON.parse(packet.utf8Data))));
                        else
                            self.onPacket(socket.socketId, new Packet(JSON.parse(packet.utf8Data)));
                    } catch (e) {
                        console.warn("[SocketManager][messageHandler] - packet parsing error. - packet:", packet);
                        // self.sendPacketToUser(new Packet().createResponse(packet).setError(ERROR_GENERAL_PARSE_DATA()).toString());
                    }
                }
                else {
                    console.warn("[SocketManager][messageHandler] - packet null or empty. - packet:", packet);
                    // self.sendPacketToUser(new Packet().createResponse(packet).setError(ERROR_PACKET_EMPTY_DATA()).toString());
                }
            }
            else if (packet.type && packet.type === "binary") {
                if (packet.binaryData != null && packet.binaryData.length > 0) {
                    try {
                        let data = packet.binaryData.toString('utf8');
                        let text = "";
                        if (Packet_Message_Serialization_Type == PacketMessageSerializationType.Base64) {
                            let buff = new Buffer(data, 'base64');
                            text = buff.toString('utf8');
                            self.onPacket(socket.socketId, new Packet(JSON.parse(text)));
                        }
                        else {
                            let data = packet.binaryData.toString('utf8');
                            text = data.toString('utf8');
                        }
                        self.onPacket(socket.socketId, new Packet(JSON.parse(text)));

                    } catch (e) {
                        console.warn("[SocketManager][messageHandler] - packet parsing error. - packet:", packet);
                        // self.sendPacketToUser(new Packet().createResponse(JSON.parse(packet.binaryData.toString('utf8'))).setError(ERROR_GENERAL_PARSE_DATA()).toString());
                    }
                }
                else {
                    console.warn("[SocketManager][messageHandler] - packet null or empty. - packet:", packet);
                    // self.sendPacketToUser(new Packet().createResponse(packet).setError(ERROR_PACKET_EMPTY_DATA()).toString());
                }
            }
        });
        socket.connection.on('close', function (reasonCode, description) {
            console.log(`[SocketManager][setSocketCallbacks][on close] -  reasonCode: ${reasonCode} - description: ${description}`);
            self.onSocketClose(socket);
        });
    }

    onPacket(socketId: string, packet: Packet) {
        if (packet == null) {
            console.warn("[SocketManager][messageHandler] - packet null or empty. - packet:", packet);
            // this.sendPacketToUser(new Packet().createResponse(packet).setError(ERROR_PACKET_EMPTY_DATA()).toString());
            return;
        }

        if (packet.classType != null) {
            packet.setSocketId(socketId);
            ControllerFactory.getInstance().getControllerByType(packet.classType).onPacket(packet);
        }
        else {
            console.warn("[SocketManager][messageHandler] - packet does not have classType.", packet);
            this.sendPacket(socketId, new Packet().createResponse(packet).setError(ERROR_PACKET_UNDEFINED()));
        }

        // if (packet.dataType != null) {
        //     // if (packet.dataType === PACKET_DATA_TYPES.AUTH_SING_IN) {
        //     //     if (this.userProfile) {
        //     //         this.sendPacketToUser(new Packet().createResponse(packet).setError(ERROR_ALREADY_SING_IN(this.userProfile._id.toString())).toString());
        //     //     }
        //     //     else {
        //     //         this.onSignIn(packet);
        //     //     }
        //     // }
        //     // else if (packet.dataType === PACKET_DATA_TYPES.AUTH_SING_UP) {
        //     //     if (this.userProfile) {
        //     //         this.sendPacketToUser(new Packet().createResponse(packet).setError(ERROR_ALREADY_SING_IN(this.userProfile._id.toString())).toString());
        //     //     }
        //     //     else {
        //     //         this.onSignUp(packet);
        //     //     }
        //     // }
        //     // else {
        //     //     if (this.userProfile) {
        //     //         if (packet.dataType === PACKET_DATA_TYPES.AUTH_SING_OUT) {
        //     //             this.onSignOut(packet);
        //     //         }
        //     //         else if (packet.dataType === PACKET_DATA_TYPES.PROFILE_UPDATE_MUTABLE_DATA) {
        //     //             this.onUpdateMutableData(packet);
        //     //         }
        //     //         else if (packet.dataType === PACKET_DATA_TYPES.PLACE_CREATE) {
        //     //             PlaceManager.getInstance().onCreatePlace(packet, this);
        //     //         }
        //     //         else if (packet.dataType === PACKET_DATA_TYPES.PLACE_GET) {
        //     //             PlaceManager.getInstance().onGetPlace(packet, this);
        //     //         }
        //     //         else if (packet.dataType === PACKET_DATA_TYPES.PLACE_GET_MY) {
        //     //             PlaceManager.getInstance().onGetMyPlace(packet, this);
        //     //         }
        //     //         else if (packet.dataType === PACKET_DATA_TYPES.PLACE_JOIN) {
        //     //             PlaceManager.getInstance().onJoinPlace(packet, this);
        //     //         }
        //     //         else if (packet.dataType === PACKET_DATA_TYPES.PLACE_LEAVE) {
        //     //             PlaceManager.getInstance().onLeavePlace(packet, this);
        //     //         }
        //     //         else {
        //     //             this.sendPacketToUser(new Packet().createResponse(packet).setError(ERROR_UNKNOWN("Packet type")).toString());
        //     //         }
        //     //     }
        //     //     else {
        //     //         this.sendPacketToUser(new Packet().createResponse(packet).setError(ERROR_UNAUTHORIZED()).toString());
        //     //     }
        //     // }
        // }
        // else if (packet.opCode != null) {
        //
        // }
        // else {
        //     console.warn("[SocketManager][messageHandler] - packet does not have type or opCode.", packet);
        //     this.sendPacket(socketId, new Packet().createResponse(packet).setError(ERROR_PACKET_UNDEFINED()));
        // }

    }

    trustSocket(socketId: string, userId?: string, token?: string) {
        console.log("[SocketManager][trustSocket] - Called.");
        this.getSocketBySocketId(socketId).isTrusted = true;
        this.getSocketBySocketId(socketId).userId = userId;
        this.getSocketBySocketId(socketId).token = token;
    }

    unTrustSocket(socketId: string) {
        console.log("[SocketManager][unTrustSocket] - Called.");
        this.getSocketBySocketId(socketId).isTrusted = false;
        this.getSocketBySocketId(socketId).userId = null;
        this.getSocketBySocketId(socketId).token = null;
    }

    onSocketClose(socket: SocketModel) {
        this.unTrustSocket(socket.socketId);

        let foundedIndex = this.socketsList.findIndex(socketRef => socketRef.socketId === socket.socketId);
        if (foundedIndex === -1) {
            console.warn("[SocketManager][onSocketClose] - can not found socket in list socketId: ", socket.socketId);
        }
        else {
            this.socketsList.splice(foundedIndex, 1);
        }
    }


    sendPacket(socketId: string, packet: Packet) {
        if (this.getSocketBySocketId(socketId) == null) {
            console.error("[SocketManager][sendPacket] - Can not found socketId in the map. socketId: ", socketId);
            return;
        }

        packet.setSocketId(null);

        // if (packet.sendingType != null) {
        //     if (packet.sendingType == PacketMessageSendingType.Text) {
        //         this.getSocketBySocketId(socketId).connection.sendUTF(packet.toString());
        //     }
        //     else if (packet.sendingType == PacketMessageSendingType.ByteBuffer) {
        //         this.getSocketBySocketId(socketId).connection.sendBytes(packet.toBuffer());
        //     }
        // }
        // else {
        if (PACKET_MESSAGE_SENDING_TYPE == PacketMessageSendingType.Text) {
            this.getSocketBySocketId(socketId).connection.sendUTF(packet.toString(Packet_Message_Serialization_Type));
        }
        else if (PACKET_MESSAGE_SENDING_TYPE == PacketMessageSendingType.ByteBuffer) {
            this.getSocketBySocketId(socketId).connection.sendBytes(packet.toBuffer(Packet_Message_Serialization_Type));
        }
        // }

    }

    printMetrics() {
        console.log("[METRICS][SocketManager] - connected_players: ", this.socketsList.length);
        console.log("[METRICS][SocketManager] - trusted_players: ", this.socketsList.filter(socket => socket.isTrusted === true).length);
    }


    getSocketBySocketId(socketId: string): SocketModel {
        const socketModel: SocketModel = this.socketsList.find(socket => socket.socketId === socketId);
        if (socketModel == null)
            throw new Error('[SocketManager][getSocketBySocketId] - socket id not found.');
        return socketModel;
    }

}
