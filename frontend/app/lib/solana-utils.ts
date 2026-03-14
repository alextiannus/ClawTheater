/**
 * Simple Solana wallet address validation
 * Solana addresses are Base58 strings, 32-44 characters long.
 */
export function isValidSolanaAddress(address: string): boolean {
    if (!address) return false;
    
    // Check length
    if (address.length < 32 || address.length > 44) return false;
    
    // Check characters (Base58: no 0, O, I, l)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    return base58Regex.test(address);
}
