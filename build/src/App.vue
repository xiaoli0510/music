<template>
  <div id="app">
     <MyHeader></MyHeader>
     <Tab></Tab>
    <router-view/>
  </div>
</template>

<script>
  import MyHeader from '../src/components/myHeader/myHeader'
  import Tab from '../src/components/tab'
export default {
  name: 'App',
  components:{
    MyHeader,
    Tab
  }
}
</script>

<style scoped lang="stylus">

</style>
