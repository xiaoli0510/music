<template>
  <div class="recommend" ref="recommend">
    <Scroll class="recommend-content" :data="discList" ref="scroll">
      
      <div>
        <div class="slider-wrapper" v-if="recommendList.length">
          <slider>
            <div v-for="(item,index) in recommendList" v-bind:key="index">
               <a v-bind:href="item.linkUrl">
                 <img @load="loadImage" v-bind:src="item.picUrl" class="needsclick" alt="">
               </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item,index) in discList" v-bind:key="index" class="item" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul> 
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        1111111111111
        <loading></loading>
      </div>
    </Scroll>

          <router-view></router-view>
         
  </div>
</template>
<script>
  import Loading from '../../base/loading'
  import Slider from '../../base/slider'
  import Scroll from '../../base/scroll'
  import {getDiscList,getRecommend} from '../../api/recommend'
  import {ERR_OK} from '../../api/config'
  import {playListMixin} from '../../common/js/mixin'
  import {mapMutations} from 'vuex'
export default {
  mixins:[playListMixin],
  data(){
    return {
      recommendList:[],
     discList:[],
    }
  },
  components:{
    Loading,
    Slider,
    Scroll
  },
  created(){
    this._getRecommend()
    this._getDiscList()
       
     
  },
  methods:{
    handlePlayList (playlist) {  
        let bottom = playlist.length > 0 ? '60px' : ''  
        this.$refs.recommend.style.bottom = bottom  

        this.$refs.scroll.refresh()
      },  
      //jsonp
      _getRecommend(){
       
        getRecommend().then(res=>{
         
          if(res.code===ERR_OK){
           
            this.recommendList=res.data.slider
          }
        })
      },
      _getDiscList(){
        console.log(1)
        getDiscList().then(res=>{
          console.log(123456)
           if(res.code==ERR_OK){
              this.discList=res.data.list
           }
        })
      },
    loadImage(){
      if(!this.checkedload){
        this.$refs.scroll.refresh()
        this.checkedload=true
      }
     
    },
    selectItem(item){
      this.$router.push({
        path:`/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc:'SET_DISC'
    }),
  }
}
</script>
<style scoped lang="stylus">
  @import "../../common/stylus/variable"
img 
    transform: scale(1)
    transition: all ease 0.2s

img.scale 
    transform: scale(1.5)

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

