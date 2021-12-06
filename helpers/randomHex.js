import crypto from "crypto";

function getRanHex() {
    const randomString = crypto.randomBytes(3).toString("hex")
    const hex=`#${randomString}`
    return hex
}

export default getRanHex