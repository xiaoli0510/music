<template>
  <scroll class="list-view" v-bind:data="data" ref="listView"
   v-bind:listenScroll="listenScroll" 
   v-bind:probeType="probeType"
   @scroll="scroll"
   >
   <ul>
     <li v-for="group in data" class="list-group" :key="group.key" ref="listGroup">
       <h2 class="list-group-title">{{group.title}}</h2>
       <ul>
         <li class="list-group-item" v-for="item in group.items" :key="item.key">
           <img src="" alt="" class="avatar">
           <span class="name">{{item.name}}</span>
         </li>
       </ul>
     </li>
   </ul>

  </scroll>
</template>
<script>
  import Scroll from '../../base/scroll'
  import Loading from '../../base/loading'
  import {getData} from '../../common/js/dom'
export default {
  created(){
    this.touch={},
    this.listenScroll=true
    this.listHeight=[]
    this.probeType=3
    console.log(this.data)
  },
  data(){
    return {
      scrollY:-1,
      currentIndex:0,
      diff:-1
    }
  },
  props:{
   data:{
     type:Array,
     default:[]
   }
  },
  computed:{
    shortcutList(){
      return this.data.map((group)=>{
        return group.title.substr(0,1)
      })
    }
  },
   components:{
     Scroll,
     Loading
   },
   methods:{
     scroll(pos){
        this.scrollY=pos.y
     }
   }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/variable"

  .list-view
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>


