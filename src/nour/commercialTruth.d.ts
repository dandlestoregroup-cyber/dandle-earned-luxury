export declare function containsCommercialClaim(text: string): boolean;

export declare const COMMERCIAL_DEFLECTION_EN: string;
export declare const COMMERCIAL_DEFLECTION_AR: string;

export declare function enforceAdviserOnly(
  reply: string,
  customerText?: string,
): { reply: string; deflected: boolean };
