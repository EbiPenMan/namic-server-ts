import Global from "../../../Global";
import Packet from "../../../data/model/packet/Packet";
import {
    ERROR_ALREADY_EXISTS, ERROR_CREATE, ERROR_DB_CREATE,
    ERROR_INVALID_PARAM,
    ERROR_NOT_FOUND,
    ERROR_REQUIRED_FIELD
} from "../../../data/model/packet/PacketError";
import bcrypt from "bcrypt";
import {BASE_URL, PASSWORD_SALT_ROUNDS, USER_DEFAULT_PICTURE} from "../../../config/Configs";
import {v4 as uuidv4} from "uuid";
import LoginPlatformBaseModule from "./LoginPlatformBaseModule";
import DbManager from "../../../manager/DbManager";
import UserModule from "../../../module/UserModule";
import {PACKET_DATA_TYPES} from "../../../data/model/packet/PacketDataType";


export default class LoginUserPassModule implements  LoginPlatformBaseModule{
    userM: UserModule;
    constructor(userM:UserModule) {
        this.userM = userM;
    }

    onSignIn(packet:Packet):Promise<any> {

        const self = this;

        return new Promise((resolve, reject) => {

            if (packet.data == null || packet.data.loginPlatformData == null || packet.data.loginPlatformData.userName == null || packet.data.loginPlatformData.password == null) {
                // this.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_IN).setError(ERROR_REQUIRED_FIELD("userName,password")).toString());
                reject("ERROR_REQUIRED_FIELD=userName,password");
                return;
            }

            if (packet.data.loginPlatformData.userName === "" || packet.data.loginPlatformData.password === "") {
                // this.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_IN).setError(ERROR_INVALID_PARAM("userName,password")).toString());
                reject("ERROR_INVALID_PARAM=userName,password");
                return;
            }

            DbManager.getInstance().foundDocument(
                "login-platform",
                {loginPlatformPlayerId: packet.data.loginPlatformData.userName},
                function (res) {
                    console.log("[PlayerController] - [onSignIn] - db login-platform res: ", res);
                    bcrypt.compare(packet.data.loginPlatformData.password, res[0].loginPlatformDataRaw.password, function (err, result) {
                        if (result != null && result === true) {

                            DbManager.getInstance().foundDocument(
                                "user",
                                {"loginPlatforms.loginPlatformId": res[0]._id.toString()},
                                function (res) {
                                    console.log("[PlayerController] - [onSignIn] - db user res: ", res);
                                    self.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_IN).setData(res[0]).toString());
                                    resolve(res);
                                },
                                function (error) {
                                    self.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_IN).setError(ERROR_NOT_FOUND("user by loginPlatform")).toString());
                                    reject("ERROR_NOT_FOUND=user on user");
                                }
                            );

                        } else {
                            self.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_IN).setError(ERROR_INVALID_PARAM("password")).toString());
                            reject("ERROR_INVALID_PARAM=password on user");
                        }
                    });
                },
                function (error) {
                    self.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_IN).setError(ERROR_NOT_FOUND("userName")).toString());
                    reject("ERROR_NOT_FOUND=userName on login-platform");
                }
            );
            //     .catch(function () {
            //     console.log("test ");
            //
            // });

        });

    }

    onSignUp(packet:Packet):Promise<any> {
        const self = this;

        if (packet.data == null || packet.data.loginPlatformData == null || packet.data.loginPlatformData.userName == null || packet.data.loginPlatformData.password == null) {
            this.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_UP).setError(ERROR_REQUIRED_FIELD("userName,password")).toString());
            return;
        }

        if (packet.data.loginPlatformData.userName === "" || packet.data.loginPlatformData.password === "") {
            this.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_UP).setError(ERROR_INVALID_PARAM("userName,password")).toString());
            return;
        }

        DbManager.getInstance().foundDocument(
            "login-platform",
            {loginPlatformPlayerId: packet.data.loginPlatformData.userName})
            .then(function (res) {
                self.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_UP).setError(ERROR_ALREADY_EXISTS("userName")).toString());
            })
            .catch(function (error) {
                    bcrypt.hash(packet.data.loginPlatformData.password, PASSWORD_SALT_ROUNDS, function (err, hash) {
                        if (hash) {
                            let displayNamePostfix = "_" + Date.now();
                            DbManager.getInstance().insertDocumentOne(
                                "login-platform",
                                {
                                    loginPlatformType: packet.data.loginPlatformType,
                                    loginPlatformPlayerId: packet.data.loginPlatformData.userName,
                                    loginPlatformPlayerIdOrginalName: "userName",
                                    loginPlatformDataRaw: {
                                        userName: packet.data.loginPlatformData.userName,
                                        password: hash
                                    },
                                    displayName: packet.data.loginPlatformData.userName + displayNamePostfix,
                                    names: {
                                        familyName: "",
                                        givenName: packet.data.loginPlatformData.userName + displayNamePostfix,
                                        middleName: ""
                                    },
                                    emails: [], // str
                                    phones: [],
                                    photos: [BASE_URL + USER_DEFAULT_PICTURE], // str
                                    friends: [],// { id,name,photo }
                                })
                                .then(function (res) {

                                    DbManager.getInstance().foundDocument("defaultUserData", {userType: packet.data.loginPlatformData.userType},
                                        function (resDef) {
                                            let userData = resDef[0];
                                            delete userData._id;
                                            userData.publicData.name = res.ops[0].displayName;
                                            userData.publicData.photoUrl = res.ops[0].photos[0];
                                            userData.loginPlatforms = [{
                                                loginPlatformId: res.insertedId.toString(),
                                                loginPlatformType: res.ops[0].loginPlatformType,
                                                loginPlatformPlayerId: res.ops[0].loginPlatformPlayerId
                                            }];

                                            DbManager.getInstance().insertDocumentOne(
                                                "user", userData)
                                                .then(function (res) {
                                                    self.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_UP).setData({id: res.insertedId.toString()}).toString());
                                                })
                                                .catch(function (error) {
                                                    self.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_UP).setError(ERROR_DB_CREATE("user")).toString());
                                                });
                                        }).catch(function (errorDef) {
                                        self.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_UP).setError(ERROR_NOT_FOUND("defaultUserData")).toString());
                                    })
                                })
                                .catch(function (error) {
                                    self.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_UP).setError(ERROR_DB_CREATE("login Platform")).toString());
                                });


                        } else {
                            self.userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.AUTH_SING_UP).setError(ERROR_CREATE("user password")).toString());
                        }
                    });
                }
            );

    }


    // TODO Change password
    // TODO Player can not change userName but admin can do this
    // TODO Update user profile (other general fields like name - email - mobile)


};

