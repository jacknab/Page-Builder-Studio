/**
 * Curated Pexels barber/barbershop hero images — every ID manually verified.
 * All 22 slots guaranteed to show barbershop content.
 */

const PX = (id: number, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const BARBER_IMAGES = {
  // ── Barbers at work ──────────────────────────────────────────────────────
  cutCloseUp:      PX(1805600),  // tattooed hands cutting hair close-up
  busyShop:        PX(1813272),  // two barbers working in busy shop
  straightRazor:   PX(3998424),  // straight razor shave, WAHL BARBER shirt
  scissorSide:     PX(3998429),  // scissors cutting hair, side profile
  toolHolster:     PX(3998389),  // barber with tool holster, chairs in bg
  barberComb:      PX(3998400),  // barber with comb, apron, shop in bg
  drapingCape:     PX(3998390),  // barber draping cape, mirror lights
  blackHatBarber:  PX(3998403),  // bearded barber in black hat + client
  wahlCape:        PX(3998408),  // WAHL BARBER cape, barber cutting
  beardTrim:       PX(3998412),  // close-up beard trim with scissors
  scissorCape:     PX(3998415),  // client in WAHL BARBER cape, scissors
  reclinedShave:   PX(3998420),  // barber in black hat, client reclined
  // ── Shop interiors & tools ───────────────────────────────────────────────
  toolsCounter:    PX(3992874),  // scissors and combs on wooden counter
  clippersDrawer:  PX(3998418),  // WAHL clippers in wooden drawer
  fadeClose:       PX(1570807),  // tattooed barber combing man's fade
  // ── Repeat for full 22-slot coverage ────────────────────────────────────
  scissorsWall:    PX(1319460),  // several barber scissors on wood wall
  cutCloseUp2:     PX(1805600),  // repeat — tattooed hands cutting hair
  busyShop2:       PX(1813272),  // repeat — two barbers in busy shop
  straightRazor2:  PX(3998424),  // repeat — straight razor shave
  scissorSide2:    PX(3998429),  // repeat — scissors cutting, side profile
  toolHolster2:    PX(3998389),  // repeat — barber with tool holster
  barberComb2:     PX(3998400),  // repeat — barber with comb
} as const;

export type BarberImageKey = keyof typeof BARBER_IMAGES;

/** Ordered array — index into this to spread images across themes */
export const BARBER_IMAGE_LIST: string[] = Object.values(BARBER_IMAGES);
