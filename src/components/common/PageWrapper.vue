<template>
    <v-container class="ms-3 me-3" :max-width="containerWidth ? containerWidth : '100%'">
        <h2 class="pb-5">{{ title }}</h2>
        <slot name="default" />
    </v-container>
</template>

<script setup lang="ts">
defineProps<{
    title: string,
    containerWidth?: string
}>();
</script>
