<template>
    <v-container>
        <h1 class="pb-3">{{ title }}</h1>
        <slot name="default" />
    </v-container>
</template>

<script setup lang="ts">
defineProps<{
    title: string
}>()
</script>
