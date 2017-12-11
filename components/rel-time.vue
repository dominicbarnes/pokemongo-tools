<template>
  <time v-bind:datetime="machine" v-bind:title="tooltip">{{ human }}</time>
</template>

<script>
  import moment from 'moment'
  import ms from 'ms'

  export default {
    data() {
      return { now: new Date() }
    },

    props: {
      datetime: {
        type: Date,
        required: true
      },
      formatTooltip: {
        type: String,
        default: 'LLL'
      },
      refresh: {
        type: String
      }
    },

    created() {
      if (this.refresh) {
        this.$options.interval = setInterval(this.tick, ms(this.refresh))
      }
    },

    computed: {
      machine() {
        return this.datetime.toISOString()
      },

      tooltip() {
        return moment(this.datetime).format(this.formatTooltip)
      },

      human() {
        return moment(this.datetime).from(this.now)
      }
    },

    methods: {
      tick() {
        this.now = new Date()
      }
    },

    beforeDestroy() {
      clearInterval(this.$options.interval)
    }
  }
</script>
