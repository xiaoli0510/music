<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
      <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
         <scroll class="shortcut"
         :data="shortCut"
         ref="shortcut"
         :refreshDelay="refreshDelay"
         >
         <div class="hot-key">
           <h1 class="title">热门搜索</h1>
           <ul>
             <li class="item"
              v-for="item in hotkey" :key="item.key" @click="addQuery(item.k)"
             >
             <span>{{item.k}}</span>
             </li>
           </ul>
         </div>
         <!-- 搜索历史部分 -->
         <div class="search-history" v-show="searchHistory">
           <h1 class="title">
             <span class="text">搜索历史</span>
             <span @click="showConfirm" class="clear">
               <i class="icon-clear"></i>
             </span>
           </h1>
           <!--搜索历史列表 -->
          <search-list
           @delete="addQuery"
          ></search-list>
         </div>
          
         </scroll>
      </div>
  </div>
</template>
<script>
  import SearchBox from '../../base/searchBox/searchBox'
  import Scroll from '../../base/scroll'
  import searchList from '../../base/searchList/searchList'
  import Confirm from '../../base/confirm/confirm'
  import {ERR_OK} from '../../api/config'
  import {getHotKey} from '../../api/config'
  import Suggest from '../../components/suggest/suggest'
  import {mapActions} from 'vuex'
  import {playListMixin,searchMixin} from '../../common/js/mixin'
export default {
  minxins:[playListMixin,searchMixin],
   components:{
     SearchBox,
     Scroll,
     searchList,
     Confirm,
     Suggest
   },
   data(){
     return {
       hotkey: [],
       refreshDelay:100
     }
   },
   computed:{
     shortCut(){
       return this.hotkey.concat(this.searchHistory)
     }
   },
   created(){
      this._getHotKey()
   },
  
   methods:{
       ...mapActions([
         'clearSearchHistory'
       ]),
      // mini底部自适应
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      showConfirm(){
        this.$refs.confirm.show()
      },
      // 截取前面10个作为热门搜索key
      _getHotKey(){
        getHotKey().then(res=>{
          if(res.code===ERR_OK){
            this.hotkey=res.data.hotkey.slice(0,10)
          }
        })
      },
      onQueryChange(){

      }
   }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>


