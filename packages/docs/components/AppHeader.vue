<template>
  <header class="px-4 flex items-center border-b border-gray-200 dark:border-gray-800">
    <div class="app-logo flex items-center">
      <NuxtLink to="/">
        <h1>japanmesh</h1>
      </NuxtLink>
      <UBadge v-if="version" :label="version" variant="outline" color="primary" size="xs" class="mx-2"/>
    </div>
    <div class="grow"></div>
    <UButton
      :icon="themeIcon"
      size="sm"
      color="gray"
      square
      variant="ghost"
      @click="toggleTheme"
      class="mx-1"
    />
    <UButton
      icon="i-simple-icons-npm"
      size="sm"
      color="gray"
      square
      variant="ghost"
      to="https://www.npmjs.com/package/japanmesh"
      target="_blank"
      class="mx-1"
    />
    <UButton
      icon="i-simple-icons-github"
      size="sm"
      color="gray"
      square
      variant="ghost"
      to="https://github.com/qazsato/geo-docs"
      target="_blank"
      class="mx-1"
    />
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const version = ref('')

const themeIcon = computed(() => {
  return colorMode.preference === 'light' ? 'i-heroicons-sun' : 'i-heroicons-moon-16-solid'
})

function toggleTheme() {
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
}

onMounted(() => {
  const url = 'https://api.github.com/repos/qazsato/japanmesh/releases/latest'
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      version.value = data.tag_name
    })
})
</script>

<style scoped>
header {
  height: var(--header-height);
}
</style>