<template>
  <div class="relative">
    <div class="absolute top-2 left-2 z-10 flex items-center">
      <UInput
        v-model="selectedCode"
        name="selectedCode"
        placeholder="メッシュコード"
        icon="i-heroicons-magnifying-glass-20-solid"
        autocomplete="off"
        size="md"
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template #trailing>
          <UButton
            v-show="selectedCode !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="selectedCode = ''"
          />
        </template>
      </UInput>
      <UButton
        v-if="isValidCode"
        icon="i-heroicons-clipboard-document"
        color="white"
        variant="solid"
        size="md"
        class="ml-2"
        @click="onCopy">
        GeoJSON をコピー
      </UButton>
    </div>
    <div class="absolute top-2 right-2 z-10 flex items-center">
      <USelectMenu v-model="selectedLevel" :options="MESH_LEVELS" class="w-80" :disabled="fixedLevel">
        <template #label>
          <UBadge variant="outline" class="w-12 justify-center">{{ selectedLevel.level }}</UBadge>
          <span class="truncate">{{ selectedLevel.name }}</span>
        </template>
        <template #option="{ option: mesh }">
          <UBadge variant="outline" class="w-12 justify-center">{{ mesh.level }}</UBadge>
          <span class="truncate">{{ mesh.name }}</span>
        </template>
      </USelectMenu>
      <!-- <UTooltip text="メッシュレベルを固定する">
        <UToggle v-model="fixedLevel" class="mx-2"/>
      </UTooltip> -->
    </div>
    <div id="map" />
  </div>
</template>

<script lang="ts" setup>
import maplibregl, { Map } from 'maplibre-gl'
import { japanmesh, LatLngBounds } from '../../../src/index'
import { Protocol } from 'pmtiles'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { GeoJSON } from 'geojson'
import { MAP_STYLE, MESH_LEVELS } from '~/constants'

const route = useRoute()
const router = useRouter()
const colorMode = useColorMode()
const toast = useToast()

const selectedCode = ref<string>(route.query.code as string || '')
const selectedLevel = ref(MESH_LEVELS[0])
const fixedLevel = ref(false)
let map: Map | null = null

const mapStyleUrl = computed(() => colorMode.preference === 'light' ? MAP_STYLE.LIGHT : MAP_STYLE.DARK)

const isValidCode = computed(() => japanmesh.isValidCode(selectedCode.value))

watch(colorMode, () => {
  if (!map) return
  map.setStyle(mapStyleUrl.value)
  const level = getLevelByZoom(map.getZoom())
  // HACK: wait for the style to be applied
  setTimeout(() => drawMesh(map!, level), 1000)
})

watch(selectedCode, (code) => {
  if (!map) return
  if (code && !japanmesh.isValidCode(code)) return
  const level = code ? japanmesh.getLevel(code) : getLevelByZoom(map.getZoom())
  drawMesh(map, level)
  router.push({ query: { code } })
})

watch(selectedLevel, (mesh) => {
  if (!map) return
  fixedLevel.value = false
  const zoom = map.getZoom()
  if (zoom <= mesh.minZoom || zoom > mesh.maxZoom) {
    map.setZoom(mesh.maxZoom)
  }
})

watch(fixedLevel, (value) => {
  if (!map) return
  if (value) {
    map.setMinZoom(selectedLevel.value.minZoom)
    map.setMaxZoom(selectedLevel.value.maxZoom)
  } else {
    map.setMinZoom(4)
    map.setMaxZoom(18)
  }
})

onMounted(() => {
  let defaultCenter: maplibregl.LngLatLike = [138.517821, 34.380147]
  let defaultZoom = 4
  let defaultLevel = 80000
  if (selectedCode.value) {
    const bounds = japanmesh.toLatLngBounds(selectedCode.value)
    const center = bounds.getCenter()
    defaultCenter = [center.lng, center.lat]
    defaultZoom = getZoomByCode(selectedCode.value)
    defaultLevel = japanmesh.getLevel(selectedCode.value)
  }
  map = new Map({
    container: 'map',
    style: mapStyleUrl.value,
    center: defaultCenter,
    zoom: defaultZoom,
    minZoom: 4,
    maxZoom: 18
  })
  const protocol = new Protocol()
  maplibregl.addProtocol('pmtiles', protocol.tile)

  map.on('load', () => {
    if (!map) return

    drawMesh(map, defaultLevel)
    map.on('click', `polygon-mesh-fill`, (e) => {
      const features = e.features as maplibregl.MapGeoJSONFeature[];
      const code = features[0].properties.code
      const bounds = japanmesh.toLatLngBounds(code)
      const center = bounds.getCenter()
      const level = japanmesh.getLevel(code)
      selectedCode.value = code
      if (map) {
        map.jumpTo({
          center: [center.lng, center.lat],
          zoom: getZoomByCode(code)
        })
        drawMesh(map, level)
      }
    })
  })

  map.on('moveend', () => {
    if (!map) return
    const level = getLevelByZoom(map.getZoom())
    drawMesh(map, level)
  })
})

function drawMesh(map: Map, level?: number) {
  const meshLevel = MESH_LEVELS.find((m) => m.id === level)
  if (meshLevel) {
    selectedLevel.value = meshLevel
  }
  drawSelectedMesh(map, level)
  drawBoundingMesh(map, level)
}

async function drawSelectedMesh(map: Map, level?: number) {
  const source = map.getSource('polygon-selected-mesh')
  if (source) {
    const data = await (source as maplibregl.GeoJSONSource).getData()
    // @ts-ignore
    const code = data.properties.code
    if (code === selectedCode.value) {
      return
    }
  }

  if (map.getLayer('polygon-selected-mesh')) {
    map.removeLayer('polygon-selected-mesh')
  }

  if (map.getSource('polygon-selected-mesh')) {
    map.removeSource('polygon-selected-mesh')
  }

  if (selectedCode.value) {
    map.addSource('polygon-selected-mesh', {
      type: 'geojson',
      data: japanmesh.toGeoJSON(selectedCode.value, {code: selectedCode.value}) as GeoJSON
    })

    // NOTE: 一番下のレイヤーに追加
    const beforeLayerId = map.getLayer('polygon-mesh-line') ? 'polygon-mesh-line' : undefined
    map.addLayer({
      id: 'polygon-selected-mesh',
      type: 'fill',
      source: 'polygon-selected-mesh',
      paint: {
        'fill-color': '#f87171',
        'fill-opacity': 0.5
      }
    }, beforeLayerId)
  }
}

async function drawBoundingMesh(map: Map, level?: number) {
  const codes = getBoundingCodes(map, level)
  if (!codes) return

  const source = map.getSource('polygon-mesh')
  if (source) {
    const data = await (source as maplibregl.GeoJSONSource).getData()
    // @ts-ignore
    const sourceCodes = data.features.map((feature: any) => feature.properties.code)
    if (codes.sort().toString() === sourceCodes.sort().toString()) {
      return
    }
  }

  const polygonGeoJSON = {
    type: 'FeatureCollection',
    features: codes.map((code) => japanmesh.toGeoJSON(code, {code}))
  }

  const centerGeoJSON = {
    type: 'FeatureCollection',
    features: codes.map((code) => {
      const bounds = japanmesh.toLatLngBounds(code)
      const center = bounds.getCenter()
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [center.lng, center.lat]
        },
        properties: {
          code
        }
      }
    })
  }

  if (map.getLayer('polygon-mesh-line')) {
    map.removeLayer('polygon-mesh-line')
  }

  if (map.getLayer('polygon-mesh-fill')) {
    map.removeLayer('polygon-mesh-fill')
  }

  if (map.getLayer(`polygon-mesh-symbol`)) {
    map.removeLayer(`polygon-mesh-symbol`)
  }

  if (map.getSource('polygon-mesh')) {
    map.removeSource('polygon-mesh')
  }

  if (map.getSource('center-mesh')) {
    map.removeSource('center-mesh')
  }

  map.addSource('polygon-mesh', {
    type: 'geojson',
    data: polygonGeoJSON as GeoJSON
  })

  map.addSource('center-mesh', {
    type: 'geojson',
    data: centerGeoJSON as GeoJSON
  })

  map.addLayer({
    id: 'polygon-mesh-line',
    type: 'line',
    source: 'polygon-mesh',
    paint: {
      'line-color': '#f87171',
      'line-width': 1
    }
  })

  map.addLayer({
    id: 'polygon-mesh-fill',
    type: 'fill',
    source: 'polygon-mesh',
    paint: {
      'fill-opacity': 0
    }
  })

  map.addLayer({
    id: `polygon-mesh-symbol`,
    type: 'symbol',
    source: 'center-mesh',
    layout: {
      'text-field': ['get', 'code'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        4, 8,
        9, 14,
      ],
      'text-anchor': 'center',
      'text-justify': 'center',
      'text-allow-overlap': true,
    },
    paint: {
      'text-halo-color': '#fff',
      'text-halo-width': 1
    }
  })
}

function getBoundingCodes(map: Map, level?: number) {
  if (level) {
    const ne = map.getBounds().getNorthEast() // 北東端
    const sw = map.getBounds().getSouthWest() // 南西端
    const bounds = new LatLngBounds(ne.lat, ne.lng, sw.lat, sw.lng)
    return japanmesh.getCodesWithinBounds(bounds, level)
  }
  return japanmesh.getCodes()
}

function getLevelByZoom(zoom: number) {
  let level: number | undefined
  if (zoom <= 9) {
    level = 80000
  } else if (zoom > 9 && zoom <= 11) {
    level = 10000
  } else if (zoom > 11 && zoom <= 12) {
    level = 5000
  } else if (zoom > 12 && zoom <= 13) {
    level = 2000
  } else if (zoom > 13 && zoom <= 14) {
    level = 1000
  } else if (zoom > 14 && zoom <= 15) {
    level = 500
  } else if (zoom > 15 && zoom <= 16) {
    level = 250
  } else if (zoom > 16) {
    level = 125
  } else {
    level = 80000
  }
  return level
}

function getZoomByCode(code: string) {
  const level = japanmesh.getLevel(code)
  switch (level) {
    case 80000:
      return 9
    case 10000:
      return 11
    case 5000:
      return 12
    case 2000:
      return 13
    case 1000:
      return 14
    case 500:
      return 15
    case 250:
      return 16
    case 125:
      return 17
    default:
      return 4
  }
}

async function onCopy() {
  const geojson = japanmesh.toGeoJSON(selectedCode.value, {code: selectedCode.value})
  await navigator.clipboard.writeText(JSON.stringify(geojson, null, 2))
  toast.add({
    color: 'gray',
    icon: 'i-heroicons-check-circle',
    title: 'クリップボードにコピーしました',
  })
}
</script>

<style scoped>
#map {
  width: 100%;
  height: calc(100vh - var(--header-height));
}
</style>