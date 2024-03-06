<!-- https://epic-spinners.epicmax.co -->
<script setup lang="ts">
import {
  AtomSpinner,
  BreedingRhombusSpinner,
  CirclesToRhombusesSpinner,
  FingerprintSpinner,
  FlowerSpinner,
  FulfillingBouncingCircleSpinner,
  FulfillingSquareSpinner,
  HalfCircleSpinner,
  HollowDotsSpinner,
  IntersectingCirclesSpinner,
  LoopingRhombusesSpinner,
  OrbitSpinner,
  PixelSpinner,
  RadarSpinner,
  ScalingSquaresSpinner,
  SelfBuildingSquareSpinner,
  SemipolarSpinner,
  SpringSpinner,
  SwappingSquaresSpinner,
  TrinityRingsSpinner
} from "epic-spinners"
import {computed} from "vue";
import colors from "tailwindcss/colors"
import {get} from "lodash";
// ---------------------------------------
import resolveConfig from "tailwindcss/resolveConfig"
import tailwindConfig from "@/../tailwind.config.js"
import type {Config} from "tailwindcss/types/config";
import type {ILoading} from "@/components/functional/Loading";
import {cn} from "@/helpers/tailwind";
// ---------------------------------------
const tailwind = resolveConfig(tailwindConfig as Config)
const props = defineProps<ILoading>()
// ---------------------------------------
const color = computed(()=> {
  let result = get(tailwind?.theme?.["caretColor"] ?? {}, (props.color as string)) as string
  if (result && result?.length && result.match("^hsl\\(var\\(")) {
    result = `hsl(${getComputedStyle(document.documentElement).getPropertyValue(result?.match(/^hsl\(var\((--[a-zA-Z0-9-]*)/)?.[1] ?? "")} / 1)`
  }
  return result
})
const type = computed<NonNullable<ILoading["type"]>>(()=> {
  switch (props.type) {
    case "simple": return "simple"
    case "Atom": return AtomSpinner
    case "BreedingRhombus": return BreedingRhombusSpinner
    case "CirclesToRhombuses": return CirclesToRhombusesSpinner
    case "Fingerprint": return FingerprintSpinner
    case "Flower": return FlowerSpinner
    case "FulfillingBouncingCircle": return FulfillingBouncingCircleSpinner
    case "FulfillingSquare": return FulfillingSquareSpinner
    case "HalfCircle": return HalfCircleSpinner
    case "HollowDots": return HollowDotsSpinner
    case "IntersectingCircles": return IntersectingCirclesSpinner
    case "LoopingRhombuses": return LoopingRhombusesSpinner
    case "Orbit": return OrbitSpinner
    case "Pixel": return PixelSpinner
    case "Radar": return RadarSpinner
    case "ScalingSquares": return ScalingSquaresSpinner
    case "SelfBuildingSquare": return SelfBuildingSquareSpinner
    case "Semipolar": return SemipolarSpinner
    case "Spring": return SpringSpinner
    case "SwappingSquares": return SwappingSquaresSpinner
    case "TrinityRings": return TrinityRingsSpinner
    default: return HalfCircleSpinner
  }
})
</script>
<template>
  <svg
    v-if="type === 'simple'"
    :class="cn('animate-[spin_1.5s_ease-in-out_infinite] duration-50', props.class)"
    xmlns="http://www.w3.org/2000/svg" :width="size??18" :height="size??18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" ><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
  <component
    :is="type"
    :class="props.class"
    :animation-duration="animationDuration"
    :size="size"
    :color="color??colors.neutral[500]"
    :pixel-size="70"
    :dot-size="15"
    :dots-num="3"
    :circles-num="3"
    :circle-size="15"
  />
</template>
