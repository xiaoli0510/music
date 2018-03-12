<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="bar-inner">
          <div class="progress" ref="progress"></div>
          <div class="progress-btn-wrapper"
             ref="progressBtn"
             @touchstart.prevent="progressTouchStart"
             @touchmove.prevent="progressTouchMove"
              @touchend="progressTouchEnd"
          >
            <div class="progress-btn"></div>
          </div>
      </div>
  </div>
</template>
<script>
  import {prefixStyle} from '../../common/js/dom'
  const transform = prefixStyle('transform')
  const progressBtnWidth = 16
export default {
 props:{
    percent:{
        type:Number,
        default:0
    }
 },
 watch:{
    percent(newVal){
         if(newVal>=0&&!this.touch.initiated){
             const barWidth = this.$refs.progressBar.clientWidth-progressBtnWidth
             const offsetWidth = newVal*barWidth
             this._offset(offsetWidth)
         }
    }
 },
 created(){
    this.touch={}
 },
 methods:{
   
    //  进度条拖动效果 
     progressTouchStart(){
       this.touch.initiated=true
       //拖到到的位置
       this.touch.startX = e.touches[0].pageX
       //拖动条当前自己移动到的位置
       this.touch.left = this.$refs.progress.clientWidth
     },
    // 进度条在开始拖动的过程中的 
     progressTouchMove(){
         //如果没有初始化成功就返回 
         if(!this.touch.initiated){
             return 
         }
         const deltaX = e.touches[0].pageX - this.touch.startX
         const offsetWidth = Math.min(Max(0,this.touch.left+deltaX),this.$refs.progressBar.clientWidth-progressBtnWidth)
         this._offset(offsetWidth)
         this._triggerPercent()
     },
     _triggerPercent(){
          const barWidth = this.$refs.progressBar.clientWidth-progressBtnWidth
          const percent = this.$refs.progress.clientWidth/barWidth
        //   讲percent传给父组件
          this.$emit('percentChange',percent)
     },
     progressTouchEnd(){
        this.touch.initiated=false
        // 计算百分比 
     },
     _offset(offsetWidth){
        //  进度条的偏移
        this.$refs.progress.style.width= `${offsetWidth}px`
        // 按钮的偏移
        this.$refs.progressBtn.style[transform]= `translate3d(${offsetWidth}px,0,0)`
     },
     progressClick(e){
       const rect = this.$refs.progressBar.getBoundingClientRect()
       const offsetWidth = e.pageX-rect.left
       this._offset(offsetWidth)
       this._triggerPercent()

     }
 }
}
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>