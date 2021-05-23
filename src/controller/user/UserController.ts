import {PACKET_CLASS_TYPES} from "../../data/model/packet/PacketClassType";
import Packet from "../../data/model/packet/Packet";
import {PDT_USER} from "./PDT_USER";
import {PACKET_DATA_TYPES} from "../../data/model/packet/PacketDataType";
import PacketError, {ERROR_GENERAL_INVALID_SHOULD_STATE, ERROR_REQUIRED_FIELD} from "../../data/model/packet/PacketError";
import SocketManager from "../../manager/SocketManager";
import {RegisterController} from "../../decorators/RegisterController";
import BaseController from "../BaseController";
import {DM_I_USER_SING_IN} from "../../data/model/packet/packetDataModel/UserControllerPacketDataModel";
import LoginUserPassModule from "../../packetClass/auth/login/LoginUserPassModule";
import {LoginPlatformType} from "../../packetClass/auth/login/LoginPlatformBaseModule";
import UserModule from "../../module/UserModule";
import LoginPlatformFactory from "../../packetClass/auth/login/LoginPlatformFactory";

export default class UserController extends BaseController {
    public classType: PACKET_CLASS_TYPES = PACKET_CLASS_TYPES.USER;

    onPacket(packet: Packet) {
        switch (packet.dataType as PDT_USER) {
            case PDT_USER.USER_SING_IN:
                this.onSignIn(packet, packet.data as DM_I_USER_SING_IN)
                break;
            case PDT_USER.USER_SING_UP:
                this.onSignUp(packet, packet.data as DM_I_USER_SING_IN)
                break;
            case PDT_USER.USER_SING_OUT:
                this.onSignOut(packet)
                break;
        }
    }

    onSignIn(packet: Packet, data: DM_I_USER_SING_IN) {
        const self = this;

        if (data == null || data.loginPlatformType == null) {
            SocketManager.getInstance().sendPacket(packet.socketId, new Packet().createResponse(packet).setError(ERROR_REQUIRED_FIELD("loginPlatformType")));
            return;
        }

        LoginPlatformFactory.getInstance().getLoginPlatformByType(data.loginPlatformType).onSignIn(packet)
            .then(function (result : any) {
                SocketManager.getInstance().trustSocket(packet.socketId);
                //TODO set socket data : userId , token
                SocketManager.getInstance().sendPacket(packet.socketId, new Packet().createResponse(packet).setData(result));
            })
            .catch(function (error : PacketError) {
                SocketManager.getInstance().sendPacket(packet.socketId, new Packet().createResponse(packet).setError(error));
            });

    }
    onSignUp(packet: Packet, data: DM_I_USER_SING_IN) {
        const self = this;

        if (data == null || data.loginPlatformType == null) {
            SocketManager.getInstance().sendPacket(packet.socketId, new Packet().createResponse(packet).setError(ERROR_REQUIRED_FIELD("loginPlatformType")));
            return;
        }

        LoginPlatformFactory.getInstance().getLoginPlatformByType(data.loginPlatformType).onSignUp(packet)
            .then(function (result : any) {
                SocketManager.getInstance().trustSocket(packet.socketId);
                //TODO set socket data : userId , token
                SocketManager.getInstance().sendPacket(packet.socketId, new Packet().createResponse(packet).setData(result));
            })
            .catch(function (error : PacketError) {
                SocketManager.getInstance().sendPacket(packet.socketId, new Packet().createResponse(packet).setError(error));
            });

    }


    onSignOut(packet: Packet) {
        SocketManager.getInstance().unTrustSocket(packet.socketId);
        SocketManager.getInstance().sendPacket(packet.socketId, new Packet().createResponse(packet).setData({result: true}));
    }


}
