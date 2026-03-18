export function formatTelebirrMask(phoneNumber: string) {
    if (!/^(09|07)\d{8}$/.test(phoneNumber)) {
        throw new Error("Invalid phone number format provided.");
    }

    // Convert to international format
    const fullInternational = '251' + phoneNumber.substring(1); // 2519XXXXXXXX

    const prefix = fullInternational.substring(0, 4); // 2519
    const suffix = fullInternational.substring(8);    // last 4 digits

    return `${prefix}****${suffix}`; // 2519****2272
}
