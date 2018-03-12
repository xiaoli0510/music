<template>
  <div class="player">
      <transition name="normal"
         @enter="enter"
         @after-enter="afterEnter"
         @leave="leave"
         @after-leave="afterLeave"
      >
      <!-- 播放页面全屏 -->
      <div class="normal-player" v-show="fullScreen">
          <!-- 背景 模糊 -->
          <div class="background">
              <img :src="currentSong.image" alt="" width="100%" height="100%">
          </div>
          <!-- 顶部 -->
          <div class="top">
              <div class="back" @click="back">
                  <i class="icon-back"></i>
              </div>
              <h1 class="title" v-html="currentSong.name"></h1>
              <h2 class="subTitle" v-html="currentSong.singer"></h2>
          </div>

          <!-- 中间cd部分 -->
          <div class="middle"
            @touchstart.prevent="middleTouchStart"
            @touchmove.prevent="middleTouchMove"
            @touchend="middleTouchEnd"
          >
            <div class="middle-l" ref="middleL">
                <div class="cd-wrapper" ref="cdWrapper">
                    <div class="cd" :class="cdCls">
                        <img :src="currentSong.image" alt="" class="image">
                    </div>
                </div>
                <div class="playing-lyric-wrapper">
                    <div class="playing-lyric">
                        {{playingLyric}}
                    </div>
                </div>
            </div>
            <!-- 歌词滚动 -->
            <scroll class="middle-r" ref="lyriclist" :data="currentLyric&&currentLyric.lines"
            >
              <div class="lyric-wrapper">
                  <div v-if="currentLyric">
                      <p ref="lyricLine" class="text" v-for="(line,index) in currentLyric.lines" :key="index"
                        :class="{'current':currentLineNum===index}"
                      >
                      {{line.txt}}
                      </p>
                  </div>
              </div>
            </scroll>
          </div>
          <!-- 底部按钮控制部分 -->
          <div class="bottom">
              <div class="dot-wrapper">
                  <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                  <span class="dot" :class="{'active':currentShor==='lyric'}"></span>
              </div>
              <div class="progress-wrapper">
                  <span class="time time-l">
                      {{format(currentTime)}}
                  </span>
                  <!-- 播放进度条 -->
                  <div class="progress-bar-wrapper">
                      <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                  </div>
                  <span class="time time-r">
                     {{format(currentSong.duration)}}
                  </span>
              </div>
              <div class="operators">
                  <div class="icon i-left" @click="changeMode">
                      <i :class="iconMode"></i>
                  </div>
                  <div class="icon i-left" :class="disableCls">
                      <i class="icon-prev" @click="prev"></i>
                  </div>
                   <div class="icon i-center" :class="disableCls">
                      <i class="playIcon" @click="prev"></i>
                  </div>
                   <div class="icon i-left" :class="disableCls">
                      <i class="icon-prev" @click="togglePlaying"></i>
                  </div>
                    <div class="icon i-right" :class="disableCls">
                      <i class="icon-next" @click="next"></i>
                  </div>
                    <div class="icon i-right" :class="disableCls">
                      <i
                        @click="toggleFavorite(currentSong)"
                        class="icon"
                        :class="getFavoriteIcon(currentSong)"
                      >
                      </i>
                  </div>
              </div>
          </div>
      </div>
      </transition>
      <!-- 播放页面小屏 底部 -->
      <transition name="mini">
          <div class="mini-player" v-show="!fullScreen" @click="open">
              <div class="icon">
                  <img :src="currentSong.image" alt="" width="40" height="40" :class="cdCls">
              </div>
              <div class="text">
                  <h2 class="name" v-html="currentSong.name"></h2>
                  <p class="desc" v-html="currentSong.singer"></p>
              </div>
              <div class="control">
                  <!-- 阻止冒泡 -->
                  <progress-circle :radius="radius" :percent="percent">
                      <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
                  </progress-circle>
              </div>
              <div class="control" @click.stop="showPlayList">
                  <i class="icon-playlist"></i>
              </div>
          </div>
      </transition>
      <play-list ref="playList"></play-list>
      <audio :src="currentSong.url"
        ref="audio"
        @play="ready"
        @error="error"
        @timeupdate="updateTime"
        @ended="ended"
      ></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { prefixStyle } from "../../common/js/dom";
import ProgressBar from "../../base/progressBar/progressBar";
import animations from 'create-keyframe-animation'
import ProgressCircle from '../../base/progressCircle/progressCircle'
import {playMode} from '../../common/js/config'
import Scroll from "../../base/scroll/index"
import PlayList from "../../base/playList/playList"
import {playerMixin} from '../../common/js/mixin'
import Lyric from 'lyric-parser'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
    mixins:[playerMixin],
  data() {
    return {
     soneReady:false,
     currentTime:0,
      currentLyric: null,
      currentLineNum:0,
      playingLyric:'',
      radius:32,
      currentShow:'cd'
    };
  },
  components: {
    ProgressBar,
    Scroll,
    ProgressCircle,
    PlayList,
  },
//   滑动touch
  created(){
    this.touch={}
  },
// 填充歌曲信息 控制歌曲播放
  computed: {
      cdCls(){
         return this.playing?'play':'pause'
      },
      playIcon(){
          return this.playing?'icon-pause':'icon-play'
      },
      miniIcon(){
        return this.playing?'icon-pause-mini':'icon-play-mini'
      },
      disableCls(){
          return this.soneReady?'':'disable'
      },
      percent(){
          return this.currentTime/this.currentSong.duration
      },
      iconMode(){
          return this.mode===playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      
    ...mapGetters([
        "fullScreen", 
        "playing", 
        "currentIndex"
        ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      // 当列表没有歌曲时直接return
      if (!newSong.id) {
        return;
      }
      if (newSong === oldSong) {
        return;
      }

      // 防止歌词切换跳动
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      clearTimer(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.audio.play();
        this.getLyric();
      }, 1000);
    },
    playing(newPlaying){
        const audio = this.$refs.audio
        this.$nextTick(()=>{
            newPlaying?audio.play():audio.pause()
        })
    }
  },
  methods: {
    //   格式化时间的
      format(interval){
           interval=interval|0
           const minute = interval/60|0
           const second = this._pad(interval%60)
           return `${minute}:${second}`
      },
      _pad(num,n=2){
           let len = num.toString().length
           while(len<n){
                 num = '0'+num
                 len++
           }
           return num
      },
    //   解析歌词 使用lyric-parser库
    getLyric(){
         this.currentSong.getLyric().then(lyric=>{
             
         })
    },
    //   监听progressBar派发的事件
      onProgressBarChange(percent){
            const currentTime = this.currentSong.duration*percent
            this.$refs.audio.currentTime= currentTime
            if(!this.playing){
               this.togglePlaying()
            }
            // 点击或滑动 歌曲进度条 歌词滚动到对应的位置
            if(this.currentLyric){
                  this.currentLyric.seek(currentTime*1000)
            }
      },
      updateTime(e){
        this.currentTime = e.target.currentTime
      },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };

      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {},
    leave() {},
    afterLeave() {},
    // 获取动画起始位置
    _getPosAndScale() {
      // 左下角小图片初始位置
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      // 中间大图片距离顶部位置
      const paddingTop = 80;
      // 中间图片宽度
      const width = window.innerWidth * 0.8;
      // 缩放尺度
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    changeMode(){

    },
    prev(){

    },
    next(){

    },
    back() {
      this.setFullScreen(false);
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN"
    })
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.player {
    .normal-player {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: $color-background;

        .background {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px);
        }

        .top {
            position: relative;
            margin-bottom: 25px;

            .back {
                position: absolute;
                top: 0;
                left: 6px;
                z-index: 50;

                .icon-back {
                    display: block;
                    padding: 9px;
                    font-size: $font-size-large-x;
                    color: $color-theme;
                    transform: rotate(-90deg);
                }
            }

            .title {
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
                no-wrap();
                font-size: $font-size-large;
                color: $color-text;
            }

            .subtitle {
                line-height: 20px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-text;
            }
        }

        .middle {
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-size: 0;

            .middle-l {
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;

                .cd-wrapper {
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    height: 100%;

                    .cd {
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border: 10px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50%;

                        &.play {
                            animation: rotate 20s linear infinite;
                        }

                        &.pause {
                            animation-play-state: paused;
                        }

                        .image {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                }

                .playing-lyric-wrapper {
                    width: 80%;
                    margin: 30px auto 0 auto;
                    overflow: hidden;
                    text-align: center;

                    .playing-lyric {
                        height: 20px;
                        line-height: 20px;
                        font-size: $font-size-medium;
                        color: $color-text-l;
                    }
                }
            }

            .middle-r {
                display: inline-block;
                vertical-align: top;
                width: 100%;
                height: 100%;
                overflow: hidden;

                .lyric-wrapper {
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;

                    .text {
                        line-height: 32px;
                        color: $color-text-l;
                        font-size: $font-size-medium;

                        &.current {
                            color: $color-text;
                        }
                    }
                }
            }
        }

        .bottom {
            position: absolute;
            bottom: 50px;
            width: 100%;

            .dot-wrapper {
                text-align: center;
                font-size: 0;

                .dot {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: $color-text-l;

                    &.active {
                        width: 20px;
                        border-radius: 5px;
                        background: $color-text-ll;
                    }
                }
            }

            .progress-wrapper {
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0px auto;
                padding: 10px 0;

                .time {
                    color: $color-text;
                    font-size: $font-size-small;
                    flex: 0 0 30px;
                    line-height: 30px;
                    width: 30px;

                    &.time-l {
                        text-align: left;
                    }

                    &.time-r {
                        text-align: right;
                    }
                }

                .progress-bar-wrapper {
                    flex: 1;
                }
            }

            .operators {
                display: flex;
                align-items: center;

                .icon {
                    flex: 1;
                    color: $color-theme;

                    &.disable {
                        color: $color-theme-d;
                    }

                    i {
                        font-size: 30px;
                    }
                }

                .i-left {
                    text-align: right;
                }

                .i-center {
                    padding: 0 20px;
                    text-align: center;

                    i {
                        font-size: 40px;
                    }
                }

                .i-right {
                    text-align: left;
                }

                .icon-favorite {
                    color: $color-sub-theme;
                }
            }
        }

        &.normal-enter-active, &.normal-leave-active {
            transition: all 0.4s;

            .top, .bottom {
                transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
            }
        }

        &.normal-enter, &.normal-leave-to {
            opacity: 0;

            .top {
                transform: translate3d(0, -100px, 0);
            }

            .bottom {
                transform: translate3d(0, 100px, 0);
            }
        }
    }

    .mini-player {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: $color-highlight-background;

        &.mini-enter-active, &.mini-leave-active {
            transition: all 0.4s;
        }

        &.mini-enter, &.mini-leave-to {
            opacity: 0;
        }

        .icon {
            flex: 0 0 40px;
            width: 40px;
            padding: 0 10px 0 20px;

            img {
                border-radius: 50%;

                &.play {
                    animation: rotate 10s linear infinite;
                }

                &.pause {
                    animation-play-state: paused;
                }
            }
        }

        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;

            .name {
                margin-bottom: 2px;
                no-wrap();
                font-size: $font-size-medium;
                color: $color-text;
            }

            .desc {
                no-wrap();
                font-size: $font-size-small;
                color: $color-text-d;
            }
        }

        .control {
            flex: 0 0 30px;
            width: 30px;
            padding: 0 10px;

            .icon-play-mini, .icon-pause-mini, .icon-playlist {
                font-size: 30px;
                color: $color-theme-d;
            }

            .icon-mini {
                font-size: 32px;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
}

@keyframes rotate {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>



