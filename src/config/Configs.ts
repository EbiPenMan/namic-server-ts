import {PacketMessageSendingType} from "../data/model/packet/PacketMessageSendingType";
import {PacketMessageSerializationType} from "../data/model/packet/PacketMessageSerializationType";

export const PASSWORD_SALT_ROUNDS = 10;
export const SERVER_PORT = 8080;
export const BASE_URL = "http://localhost/cdn/namic";
export const USER_DEFAULT_PICTURE = "/general/user-default-picture.png";
export const DB_URL = "mongodb://localhost:27017/";
export const DB_NAME = "namic";
export const PACKET_MESSAGE_SENDING_TYPE : PacketMessageSendingType = PacketMessageSendingType.Text;
export const Packet_Message_Serialization_Type :PacketMessageSerializationType = PacketMessageSerializationType.None;
export const TRUSTED_ORIGINS : string[] = ["localhost" , "hoppscotch.io","cbcbkhdmedgianpaifchdaddpnmgnknn" , "omalebghpgejjiaoknljcfmglgbpocdp"];
