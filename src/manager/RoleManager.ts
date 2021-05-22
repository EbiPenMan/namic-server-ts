import Packet from "../data/model/packet/Packet";
import UserModule from "../module/UserModule";
import EventManager from "./EventManager";
import DbManager from "./DbManager";
import {ERROR_DB_CREATE} from "../data/model/packet/PacketError";
import {PACKET_DATA_TYPES} from "../data/model/packet/PacketDataType";

export default class RoleManager {
    private static instance: RoleManager;
    private constructor() {
        console.log("[RoleManager][constructor] - Start");
    }

    public static getInstance(): RoleManager {
        if (!RoleManager.instance) {
            RoleManager.instance = new RoleManager();
        }

        return RoleManager.instance;
    }

    getRole(roleId: string) {
        return DbManager.getInstance().foundDocumentById("role", roleId);
    }

    // get - remove all roles by placeId

    onCreateRole(packet:Packet, userM:UserModule) {
        const self = this;
        // this.createRole(
        //     userM.userProfile._id,
        //     packet.data.name,
        //     packet.data.parentPlaceId
        // ).then(function (res) {
        //     userM.sendPacketToUser(new Packet().createResponse(packet).setType(PK_TYPES_SEND.ROLE_CREATE).setData({id: res.insertedId.toString()}).toString())
        // }).catch(function (error) {
        //     userM.sendPacketToUser(new Packet().createResponse(packet).setType(PK_TYPES_SEND.ROLE_CREATE).setError(ERROR_DB_CREATE("role")).toString());
        // });
    }


    createRole(data:any) {

        // return EventManager.getInstance().runEvent(EVENT_NAMES.ROLE_CREATE,
        //     data)
        //     .then(function (eventResult) {
        //         return DbManager.getInstance().insertDocumentOne(
        //             "role",
        //             data);
        //     })
        //     .catch(function (eventError) {
        //         return Promise.reject(eventError)
        //     });

    }

    updateRole(roleId: any, docObj: any) {
        return DbManager.getInstance().updateDocument("role", {_id: roleId}, docObj);
    }

    deleteRole(roleId: any) {
        return DbManager.getInstance().removeDocument("role", {_id: roleId});
    }
}
