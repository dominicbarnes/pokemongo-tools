<template>
    <b-row class="text-center">
        <slot />
    </b-row>
</template>

<script>
    export default {
        props: {
            label: String
        }
    }
</script>