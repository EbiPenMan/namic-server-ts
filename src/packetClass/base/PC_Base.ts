import {PACKET_CLASS_TYPES} from "../../data/model/packet/PacketClassType";
import Packet from "../../data/model/packet/Packet";

export default abstract class PC_Base {

    public classType: PACKET_CLASS_TYPES;

    constructor(classType: PACKET_CLASS_TYPES) {
        this.classType = classType;
    }

    onPacket(packet: Packet) {
        switch (packet.dataType) {

        }
    }

}
