import {PACKET_CLASS_TYPES} from "../../data/model/packet/PacketClassType";
import Packet from "../../data/model/packet/Packet";
import {PDT_USER} from "./PDT_USER";
import {PACKET_DATA_TYPES} from "../../data/model/packet/PacketDataType";
import {ERROR_GENERAL_INVALID_SHOULD_STATE, ERROR_REQUIRED_FIELD} from "../../data/model/packet/PacketError";
import SocketManager from "../../manager/SocketManager";
import {RegisterController} from "../../decorators/RegisterController";
import BaseController from "../BaseController";
import {DM_I_USER_SING_IN} from "../../data/model/packet/packetDataModel/UserControllerPacketDataModel";
import LoginUserPassModule from "../../packetClass/auth/login/LoginUserPassModule";
import {LoginPlatformType} from "../../packetClass/auth/login/LoginPlatformBaseModule";
import UserModule from "../../module/UserModule";

export default class UserController extends BaseController {
    public classType: PACKET_CLASS_TYPES = PACKET_CLASS_TYPES.USER;

    onPacket(packet: Packet) {
        switch (packet.dataType as PDT_USER) {
            case PDT_USER.USER_SING_IN:

                break;
            case PDT_USER.USER_SING_UP:
                this.onSignUp(packet, packet.data as DM_I_USER_SING_IN)
                break;
            case PDT_USER.USER_SING_OUT:
                break;
        }
    }

    // onSignIn(packet: Packet) {
    //
    //     const self = this;
    //
    //     if (packet.data == null || packet.data.loginPlatformType == null || packet.data.loginPlatformType === "") {
    //         this.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_IN).setError(ERROR_REQUIRED_FIELD("loginPlatformType")).toString());
    //         return;
    //     }
    //
    //     if (this.getCurrentLoginPlatform() != null) {
    //         console.warn("[PlayerController] - [onSignIn] - Current Login Platform not null. - loginPlatformType:", packet.data.loginPlatformType);
    //         this.sendPacketToUser(new Packet().createResponse(packet).setError(
    //             ERROR_GENERAL_INVALID_SHOULD_STATE("Current Login Platform not null")).toString());
    //     }
    //     else {
    //         this.currentLoginPlatform = this.createCurrentLoginPlatform(packet.data.loginPlatformType);
    //         this.getCurrentLoginPlatform().onSignIn(packet)
    //             .then(function (res) {
    //                 self.userProfile = res[0];
    //                 SocketManager.getInstance().onSingIn(self);
    //             })
    //             .catch(function (error) {
    //                 self.currentLoginPlatform = null;
    //             });
    //     }
    //
    // }
    //
    onSignUp(packet: Packet, data: DM_I_USER_SING_IN) {
        const self = this;


        if (data == null || data.loginPlatformType == null) {
            SocketManager.getInstance().sendPacket(packet.socketId, new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_UP).setError(ERROR_REQUIRED_FIELD("loginPlatformType")));
            return;
        }

            let tempCurrentLoginPlatform = this.createCurrentLoginPlatform(data.loginPlatformType);
            tempCurrentLoginPlatform.onSignUp(packet);


    }

    createCurrentLoginPlatform(loginPlatformType: LoginPlatformType) {
        if (loginPlatformType === LoginPlatformType.USER_PASS) {
            return new LoginUserPassModule(new UserModule());
        }
        return null;
    }

    //
    // onSignOut(packet: Packet) {
    //     SocketManager.getInstance().onSingOut(this);
    //     this.userProfile = null;
    //     this.currentLoginPlatform = null;
    //     this.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_OUT).setData({result: true}).toString());
    // }
    //

}
