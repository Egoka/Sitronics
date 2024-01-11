import type {StyleClass} from "@/components/BaseTypes";
type typesLoading =
  "simple"|
  "Atom"|
  "BreedingRhombus"|
  "CirclesToRhombuses"|
  "Fingerprint"|
  "Flower"|
  "FulfillingBouncingCircle"|
  "FulfillingSquare"|
  "HalfCircle"|
  "HollowDots"|
  "IntersectingCircles"|
  "LoopingRhombuses"|
  "Orbit"|
  "Pixel"|
  "Radar"|
  "ScalingSquares"|
  "SelfBuildingSquare"|
  "Semipolar"|
  "Spring"|
  "SwappingSquares"|
  "TrinityRings"

export interface ILoading {
  type?: typesLoading
  animationDuration?: number|1000|1200|1500|2000|2500|3000|4000|5000|6000,
  size?: number|40|50|55|60|64|65|66|70
  color?:string
  class?: StyleClass
}