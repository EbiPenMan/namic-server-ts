import Packet from "../../../data/model/packet/Packet";

export default interface LoginPlatformBaseModule {

    userM: any;
    onSignIn(packet:Packet):Promise<any>;
    onSignUp(packet:Packet):Promise<any>;

};

export enum LoginPlatformType {
    NONE = "NONE",
    USER_PASS = "USER_PASS",
    GOOGLE = "GOOGLE",
    PHONE = "PHONE",
}
