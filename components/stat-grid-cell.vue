<template>
    <b-col v-bind:cols="cols" class="mb-2">
        <div><slot /></div>
        <small class="text-muted">{{ label }}</small>
    </b-col>
</template>

<script>
    export default {
        props: {
            cols: {
                type: [ Number, String ],
                default: 4
            },
            label: String
        }
    }
</script>
