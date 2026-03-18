
/**
 * Obfuscates an email for privacy.
 * Example: yosefyitayal@gmail.com -> yo*******al@gmail.com
 */
export const maskEmail = (email: string): string => {
    const [localPart, domain] = email.split("@");

    if (!localPart || !domain) return email;

    if (localPart.length <= 4) {
        return `${localPart[0]}***@${domain}`;
    }

    const start = localPart.slice(0, 2);
    const end = localPart.slice(-2);
    const stars = "*".repeat(localPart.length - 4);

    return `${start}${stars}${end}@${domain}`;
};
