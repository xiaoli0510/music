<template>
<transition name="slide">
    
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>

</template>
<script>
  import MusicList from '../../components/musicList/musicList'
  import { mapGetters } from 'vuex'
  import {getSingerDetail} from '../../api/singer'
  import { ERR_OK } from '../../api/config'
  import { createSong } from '../../common/js/song'


  export default {
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    components: {
      MusicList
    },
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      }
    },
    created() {
      this._getDetail()
    },
    methods: {
     _getDetail(){
        //刷新当前页回退到singer
        if(!this.singer.id){
           this.$router.push('/singer')
        }
        getSingerDetail(this.singer.id)
         .then(res=>{
           if(res.code===ERR_OK){
              this.songs=this._normalizeSongs(res.data.list)
             
           }
         })
     },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item,index) => {
          let {musicData} = item
          if(musicData.songid&&musicData.albummid){
             ret.push(createSong(musicData))
          }
          
        })
        return ret
      }
    }
  }
</script>
<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>


