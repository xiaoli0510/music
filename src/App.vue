<template>
  <div id="app">
     <MyHeader></MyHeader>
     <Tab></Tab>
     <keep-alive>
    <router-view></router-view>
     </keep-alive>
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
