<template>
  <div class="singer" ref="singer">
    <singer-list v-bind:data="singers" ref="list" @select="selectSinger"></singer-list>
      <router-view></router-view>
  </div>
</template>
<script>
  import {getSingerList} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import Singer from '../../common/js/singer'
  import SingerList from '../../base/singerList/singerList'
  import {mapMutations} from 'vuex'
  import {playListMixin} from '../../common/js/mixin'
  const HOT_NAME='热门'
  const HOT_SINGER_LEN = 10
export default {
  mixins:[playListMixin],
  data(){
   return {
     singers:[]
   }
  },
  created(){
    this._getSingerList()
  },
   components:{
     SingerList
   },
   methods:{
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      _getSingerList(){
        getSingerList().then(res=>{
          if(res.code===ERR_OK){
           
              this.singers=this._normalizeSinger(res.data.list)
              
          }
        })
      },
      // 格式化拿到的歌手数据 方便渲染数据
  _normalizeSinger(list){
          let map = {
            hot:{
              title:HOT_NAME,
              items:[]
            }
          }
          list.forEach((item,index)=>{
             if(index<HOT_SINGER_LEN){
               console.log(map.hot)
               console.log(map.hot.items)
               map.hot.items.push(new Singer({
                 id:item.Fsinger_mid,
                 name:item.Fsinger_name
               }))
              }

              //  key为歌手的姓 =》字母
              const key = item.Findex
              if(!map[key]){
                  map[key]={
                    title:key,
                    items:[]
                  }
              }
              map[key].items.push(new Singer({
                 id:item.Fsinger_mid,
                 name:item.Fsinger_name
               }))
             
          })
          let hot = []
          let ret = []
          for(let key in map){
             let val = map[key]
             if(val.title.match(/[a-zA-Z]/)){
                 ret.push(val)
             }else if(val.title===HOT_NAME){
                  hot.push(val)
             }
          }
          // 排序
          ret.sort((a,b)=>{
              return a.title.charCodeAt(0) - b.title.charCodeAt(0)
          })
          return hot.concat(ret)
       },
     selectSinger(singer){
         this.$router.push({
           path:`/singer/${singer.id}`
         })
         this.setSinger(singer)
     }
   }
}
</script>
<style lang="stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>


