import PC_Base from "../base/PC_Base";
import {PACKET_CLASS_TYPES} from "../../data/model/packet/PacketClassType";
import Packet from "../../data/model/packet/Packet";
import {PDT_USER} from "../../controller/user/PDT_USER";
import {ERROR_GENERAL_INVALID_SHOULD_STATE, ERROR_REQUIRED_FIELD} from "../../data/model/packet/PacketError";
import SocketManager from "../../manager/SocketManager";
import {PACKET_DATA_TYPES} from "../../data/model/packet/PacketDataType";

export default class PC_AuthManager extends PC_Base{

    constructor() {
        super(PACKET_CLASS_TYPES.USER);
    }


    onPacket(packet: Packet) {
        super.onPacket(packet);

        switch (packet.dataType as PDT_USER) {
            case PDT_USER.USER_SING_IN:
                break;
            case PDT_USER.USER_SING_UP:
                break;
            case PDT_USER.USER_SING_OUT:
                break;
        }
    }

    onSignIn(packet: Packet) {

        const self = this;

        if (packet.data == null || packet.data.loginPlatformType == null || packet.data.loginPlatformType === "") {
            this.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_IN).setError(ERROR_REQUIRED_FIELD("loginPlatformType")).toString());
            return;
        }

        if (this.getCurrentLoginPlatform() != null) {
            console.warn("[PlayerController] - [onSignIn] - Current Login Platform not null. - loginPlatformType:", packet.data.loginPlatformType);
            this.sendPacketToUser(new Packet().createResponse(packet).setError(
                ERROR_GENERAL_INVALID_SHOULD_STATE("Current Login Platform not null")).toString());
        } else {
            this.currentLoginPlatform = this.createCurrentLoginPlatform(packet.data.loginPlatformType);
            this.getCurrentLoginPlatform().onSignIn(packet)
                .then(function (res) {
                    self.userProfile = res[0];
                    SocketManager.getInstance().onSingIn(self);
                })
                .catch(function (error) {
                    self.currentLoginPlatform = null;
                });
        }

    }

    onSignUp(packet: Packet) {
        const self = this;

        if (packet.data == null || packet.data.loginPlatformType == null || packet.data.loginPlatformType === "") {
            this.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_UP).setError(ERROR_REQUIRED_FIELD("loginPlatformType")).toString());
            return;
        }
        if (this.getCurrentLoginPlatform() != null) {
            console.warn("[PlayerController] - [onSignUp] - Current Login Platform not null. - loginPlatformType:", packet.data.loginPlatformType);
            this.sendPacketToUser(new Packet().createResponse(packet).setError(
                ERROR_GENERAL_INVALID_SHOULD_STATE("Current Login Platform not null")).toString());
        } else {
            let tempCurrentLoginPlatform = this.createCurrentLoginPlatform(packet.data.loginPlatformType);
            tempCurrentLoginPlatform.onSignUp(packet);
        }

    }

    onSignOut(packet: Packet) {
        SocketManager.getInstance().onSingOut(this);
        this.userProfile = null;
        this.currentLoginPlatform = null;
        this.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_OUT).setData({result: true}).toString());
    }


}
