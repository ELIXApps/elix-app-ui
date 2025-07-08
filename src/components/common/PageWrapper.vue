<template>
    <v-container class="ms-3 me-3">
        <h2 class="pb-5">{{ title }}</h2>
        <slot name="default" />
    </v-container>
</template>

<script setup lang="ts">
defineProps<{
    title: string
}>()
</script>
