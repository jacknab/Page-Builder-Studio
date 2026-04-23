/**
 * Curated Pexels barber/barbershop hero images.
 * Each entry is a unique shot — use these to give every theme card its own thumbnail.
 * All images are 800 px wide (compressed). Swap ?w=1920 for full-bleed hero use.
 */

const PX = (id: number, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const BARBER_IMAGES = {
  // ── Barbers at work ──────────────────────────────────────────────────────
  cutCloseUp:        PX(1805600),   // close-up hands cutting hair
  fadeDetail:        PX(3993299),   // overhead fade detail
  chairSide:         PX(1813272),   // side view in chair
  straightRazor:     PX(3998424),   // straight razor shave
  clippersWork:      PX(3998429),   // clippers in action
  scissorCut:        PX(1484808),   // scissors cut top view
  barberStanding:    PX(2269872),   // bearded barber standing, arms crossed
  barberFocus:       PX(4812636),   // barber focused on client
  edgeUp:            PX(3992874),   // edge-up hairline detail
  hotTowel:          PX(3407777),   // hot towel shave setup
  beardTrim:         PX(2531529),   // beard trim close-up
  neckShave:         PX(3999288),   // neck shave with razor
  // ── Shop interiors ───────────────────────────────────────────────────────
  mirrorRow:         PX(3993312),   // row of mirrors and chairs
  darkShopInterior:  PX(1371360),   // moody dark barbershop interior
  vintagePole:       PX(1570807),   // vintage barber pole + entrance
  modernChairs:      PX(3065209),   // modern leather chairs in a row
  brickWallShop:     PX(3992876),   // brick wall industrial shop
  lightWoodShop:     PX(7697253),   // light wood modern interior
  // ── Clients & results ────────────────────────────────────────────────────
  freshCut:          PX(1319460),   // client with fresh cut, smiling
  pompadourResult:   PX(2061626),   // client with slick pompadour
  // ── Tools & detail ───────────────────────────────────────────────────────
  toolsFlat:         PX(3997391),   // flat-lay of barber tools
  combsAndScissors:  PX(4906215),   // combs, scissors on counter
} as const;

export type BarberImageKey = keyof typeof BARBER_IMAGES;

/** Ordered array — index into this to spread images across themes */
export const BARBER_IMAGE_LIST: string[] = Object.values(BARBER_IMAGES);
