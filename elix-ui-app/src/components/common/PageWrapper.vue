<template>
    <div>
        <h1>{{ title }}</h1>
        <v-container>
            <slot name="default" />
        </v-container>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
}>()
</script>
