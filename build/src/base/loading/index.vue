<template>
  <div class="loading">
           <img src="./Spinner.gif" alt="" class="load_img">
           <p class="desc">{{title}}</p>
  </div>
</template>
<script>
export default {
  props:{
    title:{
      type:String,
      default:'loading'
    }
  }
}
</script>
<style lang="stylus" scoped>
 @import "../../common/stylus/variable"
.load_img
  width:64px
  height:64px
  .loading
    width: 100%
    text-align: center
    .desc
      line-height: 20px
      font-size $font-size-small
      color: $color-text-l
</style>
