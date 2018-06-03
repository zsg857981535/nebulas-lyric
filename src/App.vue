<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// import API from '@/request/api'
export default {
  name: 'App',
  mounted () {
  }
}
</script>

<style>
#app {
  text-align: center;
}
.lyric-confirm-style {
  white-space: pre;
  width: auto;
  min-width: 400px;
  height: 80%;
}
.lyric-confirm-style .el-message-box__content{
  height: 100%;
  overflow-y: scroll;
}
.lyric-confirm-style .el-message-box__content p{
  padding: 100px 0 0;
}
.lyric-confirm-style .el-message-box__header {
  display: none;
}
</style>
