import Packet from "../../../data/model/packet/Packet";
import PacketError from "../../../data/model/packet/PacketError";

export default abstract class LoginPlatformBaseModule {
    loginPlatformType: LoginPlatformType = LoginPlatformType.NONE
    abstract onSignIn(packet: Packet): Promise<any | PacketError>;
    abstract onSignUp(packet: Packet): Promise<any | PacketError>;
};

export enum LoginPlatformType {
    NONE = "NONE",
    USER_PASS = "USER_PASS",
    GOOGLE = "GOOGLE",
    PHONE = "PHONE",
}
