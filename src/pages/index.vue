<template>
  <div class="input-wrapper">
    <el-autocomplete
      class="input-style"
      v-model="keywords"
      :fetch-suggestions="querySearchAsync"
      :trigger-on-focus="false"
      placeholder="输入歌曲名"
      :debounce="500"
      @select="handleSelect"
    >
    </el-autocomplete>
    <el-button type="primary"
      icon="el-icon-search"
      @click="callWebWallet"
    >
    搜索
    </el-button>
  </div>
</template>

<script>
import API from '@/request/api'

const CONTRCT_ADDRESS = 'n1rVLTRxQEXscTgThmbTnn2NqdWFEKwpYUM'
export default {
  data () {
    return {
      keywords: '',
      songs: [],
      song: {},
      lyric: ''
    }
  },
  methods: {
    querySearchAsync (keywords, cb) {
      keywords && API.searchByKeywords({ keywords, limit: '10' }).then(res => {
        const { result: { songs } } = res
        let results = songs.map(el => {
          let s = {
            id: el.id,
            value: `${el.name} ${(0 in el.artists && el.artists[0].name) || ''}`
          }
          return s
        })
        this.songs = results
        cb(results)
      }).catch(e => {})
    },
    handleSelect (song) {
      // console.log(song.id)
      this.song = song
    },
    openConfirm () {
      const { id } = this.song
      id && API.getLyricById({ id }).then(res => {
        const { lrc: { lyric } } = res
        const _lyric = lyric.replace(/[\d\.:\[\]]/g, '')
        this.lyric = _lyric
        this.$confirm('', '', {
          // title: value,
          message: _lyric,
          confirmButtonText: '复制到剪贴板',
          cancelButtonText: '取消',
          lockScroll: false,
          closeOnClickModal: false,
          customClass: 'lyric-confirm-style'
        }).then(() => {
          this.copyToClipBoard(this.lyric)
          this.$message({
            type: 'success',
            message: '复制成功'
          })
        }).catch(() => {
          this.$message({
            type: 'fail',
            message: '取消复制'
          })
        })
      })
    },
    callWebWallet () {
      window.postMessage({
        'target': 'contentscript',
        'data': {
          'to': CONTRCT_ADDRESS,
          'value': '0',
          'contract': {// "contract" is a parameter used to deploy a contract or call a smart contract function
            'function': 'save',
            'args': ''
          }
        },
        'method': 'neb_sendTransaction'
      }, '*')
      window.addEventListener('message', this.handleTransitonResult)
    },
    handleTransitonResult (e) {
      console.log('message received, msg.data: ' + JSON.stringify(e.data))
      if (e && e.data && e.data.data && e.data.data.txhash) {
        this.openConfirm()
        console.log('Transaction hash:\n' + JSON.stringify(e.data.data.txhash, null, '\t'))
      }
    },
    copyToClipBoard (lyric) {
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', lyric)
      document.body.appendChild(input)
      input.select()
      input.setSelectionRange(0, 9999)
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        console.log('复制成功')
      }
      document.body.removeChild(input)
    }
  },
  destroyed () {
    window.removeEventListener('message', this.handleTransitonResult)
  }
}
</script>

<style scoped>
.input-wrapper {
  margin-top: 20%;
}
.input-style {
  width: 100%;
  max-width: 500px;
}
.confrim-style {
  height: 90%;
  overflow-y: scroll !important;
}
</style>
