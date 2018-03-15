<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
        <search-box
          ref="searchBox" @query="onQueryChange"
        >
        </search-box>
    </div>
    <!-- 热门搜索 -->
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
       <scroll
        class="shortcut"
        :data="shortcut"
        ref="shortcut"
        :refreshDelay="refreshDelay"
       >
         <div class="hot-key">
           <h1 class="title">热门搜索</h1>
           <ul>
             <li class="item" v-for="item in hotkey" :key="item.key"
               @clcik="addQuery(item.k)"
             >
               <span>{{item.k}}</span>
             </li>
           </ul>
         </div>
         <!-- 搜索历史部分 -->
         <div class="search-history" v-show="searchHistory.length">
           <h1 class="title">
             <span class="text">搜索历史</span>
             <span @click="showConfirm" class="clear">
               <i class="icon-clear"></i>
             </span>
           </h1>
           <!-- 搜索历史列表 -->
         <search-list 
            :searches="searchHistory" 
            @select="addQuery"
            @delete="deleteSearchHistory"
         ></search-list>
           
         </div>
       </scroll>
    </div>

    <div class="search-result" v-show="query" ref="searchResult">
      <!-- 搜索结果component -->
      <suggest
        :query="query"
        @listScroll="blurInput"
        @select="saveSearch"
        ref="suggest"
      ></suggest>
    </div>
    <router-view></router-view>
    <confirm ref="confirm" @confirm="clearSearchHistory"
       text="是否清空所有搜索历史"
       confirmBtnText="清空"
    ></confirm>
  </div>
</template>
<script>
  import SearchBox from '../../base/searchBox/searchBox.vue'
  import Scroll from '../../base/scroll/index.vue'
  import SearchList from '../../base/searchList/searchList.vue'
  import Confirm from '../../base/confirm/confirm'
  import {ERR_OK} from '../../api/config'
  import {getHotKey} from '../../api/search'
  import Suggest from '../../components/suggest/suggest.vue'
  import {mapActions} from 'vuex'
  import {playListMixin,searchMixin} from '../../common/js/mixin'
  export default {
    mixins:[playListMixin,searchMixin],
    data(){
      return {
        hotkey:[],
        refreshDelay:100
      }
    },
    created(){
          console.log(this.searchHistory)
          this._getHotKey()
    },
    computed:{
          shortcut(){
              return this.hotkey.concat(this.searchHistory)
          }
    },
     components:{
       SearchBox,
       Scroll,
       SearchList,
       Confirm,
       Suggest
     },
     methods:{
          ...mapActions([
            'clearSearchHistory'
          ]),
          // 底部mini自适应
          handlePlayList(playlist){
            const bottom = playlist.length>0?'60px':''
            
          },
          showConfirm(){
            this.$refs.confirm.show()
          },
          _getHotKey(){
             getHotKey().then(res=>{
                if(res.code===ERR_OK){
                   this.hotkey=res.data.hotkey.slice(0,10)
                }
             })
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
