<template>
  <div id="app">
     <MyHeader></MyHeader>
     <Tab></Tab>
     <keep-alive>
         <router-view></router-view>
     </keep-alive>
     <!-- b播放器全局组件 -->
     <player></player>
  </div>
</template>

<script>
  import MyHeader from '../src/components/myHeader/myHeader'
  import Tab from '../src/components/tab'
  import Player from '../src/components/player/player'
export default {
  name: 'App',
  components:{
    MyHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus">

</style>
