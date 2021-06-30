<template>
    <div class="home">
        <el-button type="primary" @click="logout">buttonCont</el-button>
    </div>
</template>

<script>
export default {
  props: {
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style type="scss" scoped>

</style>
