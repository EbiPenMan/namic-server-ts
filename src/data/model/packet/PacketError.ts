//region --- GENERAL ---

export const ERROR_GENERAL_PARSE_DATA = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            101001,
            ERROR_GENERAL_PARSE_DATA.name,
            `Error on parsing the packet data ${name}.`
        );
    return new PacketError(
        101001,
        ERROR_GENERAL_PARSE_DATA.name,
        "Error on parsing the packet data."
    );
};

export const ERROR_GENERAL_INVALID_SHOULD_STATE = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            101002,
            ERROR_GENERAL_INVALID_SHOULD_STATE.name,
            `Error on invalid state of ${name}.`
        );
    return new PacketError(
        101002,
        ERROR_GENERAL_INVALID_SHOULD_STATE.name,
        "Error on invalid state."
    );
};


//endregion

//region --- Packet ---

export const ERROR_PACKET_EMPTY_DATA = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            102001,
            ERROR_PACKET_EMPTY_DATA.name,
            `Packet null or empty ${name}.`
        );
    return new PacketError(
        102001,
        ERROR_PACKET_EMPTY_DATA.name,
        "Packet null or empty."
    );
};

export const ERROR_PACKET_UNDEFINED = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            102002,
            ERROR_PACKET_UNDEFINED.name,
            `Packet does not have type or opCode ${name}.`
        );
    return new PacketError(
        102002,
        ERROR_PACKET_UNDEFINED.name,
        "Packet does not have type or opCode."
    );
};

//endregion

//region --- DB ---

export const ERROR_DB_CREATE = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            103001,
            ERROR_DB_CREATE.name,
            `DB create ${name}.`
        );
    return new PacketError(
        103001,
        ERROR_DB_CREATE.name,
        "DB create."
    );
};
export const ERROR_DB_UPDATE = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            103002,
            ERROR_DB_UPDATE.name,
            `DB update ${name}.`
        );
    return new PacketError(
        103002,
        ERROR_DB_UPDATE.name,
        "DB update."
    );
};

//endregion


export const ERROR_NOT_FOUND = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            601,
            ERROR_NOT_FOUND.name,
            `Not found ${name}.`
        );
    return new PacketError(
        601,
        ERROR_NOT_FOUND.name,
        "Not found."
    );
};

export const ERROR_INVALID_PARAM = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            602,
            ERROR_INVALID_PARAM.name,
            `Invalid Param ${name}.`
        );
    return new PacketError(
        602,
        ERROR_INVALID_PARAM.name,
        "Invalid Param."
    );
};

export const ERROR_REQUIRED_FIELD = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            603,
            ERROR_REQUIRED_FIELD.name,
            `Required field ${name}.`
        );
    return new PacketError(
        603,
        ERROR_REQUIRED_FIELD.name,
        "Required field."
    );
};

export const ERROR_ALREADY_EXISTS = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            604,
            ERROR_ALREADY_EXISTS.name,
            `Already exists ${name}.`
        );
    return new PacketError(
        604,
        ERROR_ALREADY_EXISTS.name,
        "Already exists."
    );
};

export const ERROR_CREATE = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            605,
            ERROR_CREATE.name,
            `Create ${name}.`
        );
    return new PacketError(
        605,
        ERROR_CREATE.name,
        "Create."
    );
};

export const ERROR_UNAUTHORIZED = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            607,
            ERROR_UNAUTHORIZED.name,
            `Unauthorized ${name}.`
        );
    return new PacketError(
        607,
        ERROR_UNAUTHORIZED.name,
        "Unauthorized."
    );
};

export const ERROR_UNKNOWN = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            608,
            ERROR_UNKNOWN.name,
            `Unknown ${name}.`
        );
    return new PacketError(
        608,
        ERROR_UNKNOWN.name,
        "Unknown."
    );
};

export const ERROR_ALREADY_SING_IN = function (name?: string) : PacketError {
    if (name)
        return new PacketError(
            608,
            ERROR_ALREADY_SING_IN.name,
            `Already sing-in ${name}.`
        );
    return new PacketError(
        608,
        ERROR_ALREADY_SING_IN.name,
        "Already sing-in."
    );
};


export default class PacketError {
    private code: number;
    private codeStr: string;
    private message: string;


    constructor(code?: number, codeStr?: string, message?: string) {
        this.code = code;
        this.codeStr = codeStr;
        this.message = message;
    }
}
