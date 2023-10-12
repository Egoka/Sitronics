<!-- https://epic-spinners.epicmax.co -->
<script setup lang="ts">
import {
  AtomSpinner, BreedingRhombusSpinner,
  CirclesToRhombusesSpinner, FingerprintSpinner,
  FlowerSpinner, FulfillingBouncingCircleSpinner,
  FulfillingSquareSpinner,
  HalfCircleSpinner,
  HollowDotsSpinner,
  IntersectingCirclesSpinner, LoopingRhombusesSpinner,
  OrbitSpinner,
  PixelSpinner,
  RadarSpinner,
  ScalingSquaresSpinner,
  SelfBuildingSquareSpinner,
  SemipolarSpinner, SpringSpinner,
  SwappingSquaresSpinner,
  TrinityRingsSpinner
} from 'epic-spinners'
import {computed} from "vue";
import colors from 'tailwindcss/colors'
import {DefaultColors} from "tailwindcss/types/generated/colors";
import {get} from "lodash";
// ---------------------------------------
export interface ILoading {
  type?: "Atom"| "BreedingRhombus"|
"CirclesToRhombuses"| "Fingerprint"|
"Flower"| "FulfillingBouncingCircle"|
"FulfillingSquare"|
"HalfCircle"|
"HollowDots"|
"IntersectingCircles"| "LoopingRhombuses"|
"Orbit"|
"Pixel"|
"Radar"|
"ScalingSquares"|
"SelfBuildingSquare"|
"Semipolar"| "Spring"|
"SwappingSquares"|
"TrinityRings"
  animationDuration?: number|1000|1200|1500|2000|2500|3000|4000|5000|6000,
  size?: number|40|50|55|60|64|65|66|70
  color?:string
}
// ---------------------------------------
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/../tailwind.config.js'
import type {Config} from "tailwindcss/types/config";

const tailwind = resolveConfig(tailwindConfig as Config)

const props = defineProps<ILoading>()
// ---------------------------------------
const type = computed<NonNullable<ILoading["type"]>>(()=> props.type||"HalfCircle")
const animationDuration = computed<ILoading["animationDuration"]>(()=> props.animationDuration)
const size = computed<ILoading["size"]>(()=> props.size)
const color = computed<string|undefined>(()=>get(tailwind?.theme["caretColor"]||{}, (props.color as string)))
</script>
<template>
  <flower-spinner
    v-if="type === 'Flower'"
    :animation-duration="animationDuration||2500"
    :size="size||70"
    :color="color||colors.neutral[500]"
  />
  <pixel-spinner
    v-if="type === 'Pixel'"
    :animation-duration="animationDuration||2000"
    :pixel-size="70"
    :color="color||colors.neutral[500]"
  />
  <hollow-dots-spinner
    v-if="type === 'HollowDots'"
    :animation-duration="animationDuration||1000"
    :dot-size="15"
    :dots-num="3"
    :color="color||colors.neutral[500]"
  />
  <intersecting-circles-spinner
    v-if="type === 'IntersectingCircles'"
    :animation-duration="animationDuration||1200"
    :size="size||70"
    :color="color||colors.neutral[500]"
  />
  <orbit-spinner
    v-if="type === 'Orbit'"
    :animation-duration="animationDuration||1200"
    :size="size||55"
    :color="color||colors.neutral[500]"
  />
  <radar-spinner
    v-if="type === 'Radar'"
    :animation-duration="animationDuration||2000"
    :size="size||60"
    :color="color||colors.neutral[500]"
  />
  <scaling-squares-spinner
    v-if="type === 'ScalingSquares'"
    :animation-duration="animationDuration||1250"
    :size="size||65"
    :color="color||colors.neutral[500]"
  />
  <half-circle-spinner
    v-if="type === 'HalfCircle'"
    :animation-duration="animationDuration||1000"
    :size="size||60"
    :color="color||colors.neutral[500]"
  />
  <trinity-rings-spinner
    v-if="type === 'TrinityRings'"
    :animation-duration="animationDuration||1500"
    :size="size||66"
    :color="color||colors.neutral[500]"
  />
  <fulfilling-square-spinner
    v-if="type === 'FulfillingSquare'"
    :animation-duration="animationDuration||4000"
    :size="size||50"
    :color="color||colors.neutral[500]"
  />
  <circles-to-rhombuses-spinner
    v-if="type === 'CirclesToRhombuses'"
    :animation-duration="animationDuration||1200"
    :circles-num="3"
    :circle-size="15"
    :color="color||colors.neutral[500]"
  />
  <semipolar-spinner
    v-if="type === 'Semipolar'"
    :animation-duration="animationDuration||2000"
    :size="size||65"
    :color="color||colors.neutral[500]"
  />
  <self-building-square-spinner
    v-if="type === 'SelfBuildingSquare'"
    :animation-duration="animationDuration||6000"
    :size="size||40"
    :color="color||colors.neutral[500]"
  />
  <swapping-squares-spinner
    v-if="type === 'SwappingSquares'"
    :animation-duration="animationDuration||1000"
    :size="size||65"
    :color="color||colors.neutral[500]"
  />
  <fulfilling-bouncing-circle-spinner
    v-if="type === 'FulfillingBouncingCircle'"
    :animation-duration="animationDuration||4000"
    :size="size||60"
    :color="color||colors.neutral[500]"
  />
  <fingerprint-spinner
    v-if="type === 'Fingerprint'"
    :animation-duration="animationDuration||1500"
    :size="size||64"
    :color="color||colors.neutral[500]"
  />
  <spring-spinner
    v-if="type === 'Spring'"
    :animation-duration="animationDuration||3000"
    :size="size||60"
    :color="color||colors.neutral[500]"
  />
  <atom-spinner
    v-if="type === 'Atom'"
    :animation-duration="animationDuration||1000"
    :size="size||60"
    :color="color||colors.neutral[500]"
  />
  <looping-rhombuses-spinner
    v-if="type === 'LoopingRhombuses'"
    :animation-duration="animationDuration||2500"
    :rhombus-size="15"
    :color="color||colors.neutral[500]"
  />
  <breeding-rhombus-spinner
    v-if="type === 'BreedingRhombus'"
    :animation-duration="animationDuration||2000"
    :size="size||65"
    :color="color||colors.neutral[500]"
  />
</template>
