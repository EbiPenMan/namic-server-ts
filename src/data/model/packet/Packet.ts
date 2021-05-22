import PacketError from "./PacketError";
import {PACKET_CLASS_TYPES} from "./PacketClassType";
import {PacketMessageSerializationType} from "./PacketMessageSerializationType";
import {PACKET_DATA_TYPES} from "./PacketDataType";

export default class Packet {
    classType: PACKET_CLASS_TYPES;
    dataType: string;
    data: any;
    error: PacketError;
    opCode: number;
    reqIdServer: string;
    reqIdClient: string;
    socketId: string;

    constructor(packet?: string | Packet) {
        if (packet) {
            if (typeof packet === "string") {
                const pk = JSON.parse(packet);
                let key;

                // Object.getOwnPropertyNames(stringPacket);
                for (key in pk) {
                    // @ts-ignore
                    this[key] = pk[key];
                }
            }
            else if (typeof packet === "object") {
                const pk = JSON.parse(JSON.stringify(packet));
                let key;

                // Object.getOwnPropertyNames(stringPacket);
                for (key in pk) {
                    // @ts-ignore
                    this[key] = pk[key];
                }
            }
        }
    }

    createResponse(ReceivedPacket: Packet) {
        this
            .setDataType(ReceivedPacket.dataType)
            .setReqIdClient(ReceivedPacket.reqIdClient)
            .setReqIdServer(ReceivedPacket.reqIdServer);
        return this;
    }

    setDataType(type: string) {
        if (type)
            this.dataType = type;
        return this;
    }

    setSocketId(socketId: string) {
        if (socketId)
            this.socketId = socketId;
        return this;
    }

    setClassType(classtype: PACKET_CLASS_TYPES) {
        if (classtype)
            this.classType = classtype;
        return this;
    }

    setData(data: any) {
        this.data = data;
        return this;
    }

    setError(error: PacketError | undefined) {
        if (error)
            this.error = error;
        return this;
    }

    setOpCode(opCode: number | undefined) {
        if (opCode)
            this.opCode = opCode;
        return this;
    }

    setReqIdServer(reqIdServer: string | undefined) {
        if (reqIdServer)
            this.reqIdServer = reqIdServer;
        return this;
    }

    setReqIdClient(reqIdClient: string | undefined) {
        if (reqIdClient)
            this.reqIdClient = reqIdClient;
        return this;
    }

    toString(serializationType?: PacketMessageSerializationType): string {
        if (serializationType && serializationType == PacketMessageSerializationType.Base64) {
            let buff = Buffer.from(JSON.stringify(this));
            return buff.toString('base64');
        }
        return JSON.stringify(this);
    }

    toBuffer(serializationType?: PacketMessageSerializationType): Buffer {
        if (serializationType && serializationType == PacketMessageSerializationType.Base64) {
            let buff = Buffer.from(this.toString());
            let base64data = buff.toString('base64');
            return Buffer.from(base64data, "utf-8");
        }
        return Buffer.from(this.toString(), "utf-8");
    }

};

