import {PACKET_CLASS_TYPES} from "../data/model/packet/PacketClassType";
import Packet from "../data/model/packet/Packet";
import FactoryController from "./FactoryController";


export default abstract class BaseController {
    public classType: PACKET_CLASS_TYPES = PACKET_CLASS_TYPES.NONE;
    abstract onPacket(packet: Packet): void;
}
