/**
 * Scan-from-photo service: detects ingredients from an image.
 * MVP uses a mock implementation; replace with real API when backend is ready.
 */

export interface DetectedIngredient {
  id: string;
  name: string;
  quantity: string;
  expiryDate?: string;
}

export type ScanImageInput =
  | { type: 'uri'; uri: string }
  | { type: 'base64'; base64: string };

const MOCK_DELAY_MS = 1500;

/**
 * Simulated scan: returns example ingredients after a delay.
 * Replace the body with a real fetch() to your backend (see comment below).
 */
export async function scanIngredientsFromImage(
  input: ScanImageInput,
): Promise<DetectedIngredient[]> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  // Mock response: realistic example data
  const mockItems: DetectedIngredient[] = [
    { id: `det-${Date.now()}-1`, name: 'Tomato', quantity: '2 pcs' },
    { id: `det-${Date.now()}-2`, name: 'Egg', quantity: '3 pcs' },
    { id: `det-${Date.now()}-3`, name: 'Milk', quantity: '1 carton' },
  ];

  return mockItems;

  /*
   * --- Replace with real API call ---
   *
   * Example backend contract:
   *
   * Request: POST /api/scan-ingredients
   * Body: FormData with image file, or JSON { imageBase64: string }
   * Response: { ingredients: Array<{ name: string; quantity: string }> }
   *
   * const response = await fetch('https://your-api.com/api/scan-ingredients', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify(
   *     input.type === 'base64'
   *       ? { imageBase64: input.base64 }
   *       : { imageUri: input.uri }
   *   ),
   * });
   * if (!response.ok) throw new Error('Scan failed');
   * const data = await response.json();
   * return (data.ingredients ?? []).map((item: { name: string; quantity: string }, i: number) => ({
   *   id: `det-${Date.now()}-${i}`,
   *   name: item.name ?? '',
   *   quantity: item.quantity ?? '',
   *   expiryDate: undefined,
   * }));
   */
}

/** Generate a new temporary id for a manually added row */
export function createDetectedIngredientId(): string {
  return `det-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Default expiry date for new items: today + 3 days (YYYY-MM-DD) */
export function getDefaultExpiryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 10);
}
