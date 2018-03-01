<template>
  <div id="app">
     <MyHeader></MyHeader>
    <router-view/>
  </div>
</template>

<script>
  import MyHeader from '../src/components/myHeader/myHeader'
export default {
  name: 'App',
  components:{
    MyHeader
  }
}
</script>

<style scoped lang="stylus">

</style>
