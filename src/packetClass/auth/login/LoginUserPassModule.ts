import Packet from "../../../data/model/packet/Packet";
import PacketError, {
    ERROR_ALREADY_EXISTS,
    ERROR_CREATE,
    ERROR_DB_CREATE,
    ERROR_INVALID_PARAM,
    ERROR_NOT_FOUND,
    ERROR_REQUIRED_FIELD
} from "../../../data/model/packet/PacketError";
import bcrypt from "bcrypt";
import {BASE_URL, PASSWORD_SALT_ROUNDS, USER_DEFAULT_PICTURE} from "../../../config/Configs";
import LoginPlatformBaseModule, {LoginPlatformType} from "./LoginPlatformBaseModule";
import DbManager from "../../../manager/DbManager";
import {PACKET_DATA_TYPES} from "../../../data/model/packet/PacketDataType";
import SocketManager from "../../../manager/SocketManager";


export default class LoginUserPassModule extends LoginPlatformBaseModule {

    public loginPlatformType: LoginPlatformType = LoginPlatformType.USER_PASS;

    onSignIn(packet: Packet): Promise<any | PacketError> {

        const self = this;

        return new Promise((resolve: any, reject: (value: PacketError) => void) => {

            if (packet.data == null || packet.data.loginPlatformData == null || packet.data.loginPlatformData.userName == null || packet.data.loginPlatformData.password == null) {
                reject(ERROR_REQUIRED_FIELD("userName,password"));
                return;
            }

            if (packet.data.loginPlatformData.userName === "" || packet.data.loginPlatformData.password === "") {
                reject(ERROR_INVALID_PARAM("userName,password"));
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
                                    resolve(res);
                                },
                                function (error) {
                                    reject(ERROR_NOT_FOUND("user on user"));
                                }
                            );
                        }
                        else {
                            reject(ERROR_INVALID_PARAM("password on user"));
                        }
                    });
                },
                function (error) {
                    reject(ERROR_NOT_FOUND("userName on login-platform"));
                }
            );
        });

    }

    onSignUp(packet: Packet): Promise<any | PacketError> {
        const self = this;

        return new Promise((resolve: any, reject: (value: PacketError) => void) => {

            if (packet.data == null || packet.data.loginPlatformData == null || packet.data.loginPlatformData.userName == null || packet.data.loginPlatformData.password == null) {
                reject(ERROR_REQUIRED_FIELD("userName,password"));
                return;
            }

            if (packet.data.loginPlatformData.userName === "" || packet.data.loginPlatformData.password === "") {
                reject(ERROR_INVALID_PARAM("userName,password"));
                return;
            }

            DbManager.getInstance().foundDocument(
                "login-platform",
                {loginPlatformPlayerId: packet.data.loginPlatformData.userName})
                .then(function (res) {
                    reject(ERROR_ALREADY_EXISTS("userName"));
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
                                        loginPlatformPlayerIdOriginalName: "userName",
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
                                                        resolve(res);
                                                    })
                                                    .catch(function (error) {
                                                        reject(ERROR_DB_CREATE("user"));
                                                    });
                                            })
                                            .catch(function (errorDef) {
                                                reject(ERROR_NOT_FOUND("defaultUserData"));
                                            })
                                    })
                                    .catch(function (error) {
                                        reject(ERROR_DB_CREATE("login Platform"));
                                    });
                            }
                            else {
                                reject(ERROR_CREATE("user password"));
                            }
                        });
                    }
                );
        });
    }


    // TODO Change password
    // TODO Player can not change userName but admin can do this
    // TODO Update user profile (other general fields like name - email - mobile)


};

