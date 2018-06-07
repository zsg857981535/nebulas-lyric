<template>
  <div class="input-wrapper">
    <div class="input-header">
      <h1 class="css1268f443d21d160" style="color:#4560E6;">
        星云有歌词
      </h1>
      <h3 style="font-family:'Malapropism';color:#4560E6;">Nebulas Lyric</h3>
    </div>
    <el-autocomplete
      ref="input"
      class="input-style"
      v-model="keywords"
      :fetch-suggestions="querySearchAsync"
      :trigger-on-focus="false"
      placeholder="输入歌曲名"
      :debounce="500"
      @select="handleSelect"
      @keypress.native="handleKeyPress"
    >
    </el-autocomplete>
    <el-button type="primary"
      icon="el-icon-search"
      @click="callWebWallet"
      native-type="submit"
      :disabled="!keywords"
    >
    搜索
    </el-button>
  </div>
</template>

<script>
import API from '@/request/api'
import { MessageBox, Message, Notification } from 'element-ui'

// const CONTRCT_ADDRESS = 'n1rVLTRxQEXscTgThmbTnn2NqdWFEKwpYUM' // test
const CONTRCT_ADDRESS = 'n1dtgvNzhHHfoKsY28XbtNZkdKTQsqwW4v2' // prod
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
        this.song = results[0] || {}
        cb(results)
      }).catch(e => {})
    },
    handleSelect (song) {
      // console.log(song.id)
      this.song = song
    },
    openConfirm () {
      const { id, value } = this.song
      const h = this.$createElement
      if (!id) {
        return Promise.reject(new Error('暂无该歌曲'))
      }
      return id && API.getLyricById({ id }).then(res => {
        const { lrc: { lyric = '' } = {} } = res
        if (!lyric) {
          return Promise.reject(new Error('暂无该歌曲歌词'))
        }
        const _lyric = lyric.replace(/[\d\.:\[\]]/g, '')
        this.lyric = _lyric
        MessageBox.confirm('', '', {
          // title: value,
          message: h('p', [
            h('h3', {}, value),
            _lyric
          ]),
          confirmButtonText: '复制到剪贴板',
          cancelButtonText: '取消',
          lockScroll: false,
          closeOnClickModal: false,
          customClass: 'lyric-confirm-style'
        }).then(() => {
          this.copyToClipBoard(this.song.value + this.lyric)
          Message({
            type: 'success',
            message: '复制成功'
          })
        }).catch(() => {
          Message({
            type: 'fail',
            message: '取消复制'
          })
        })
      }).catch(e => {
        return Promise.reject(e)
        // console.log('===', e)
      })
    },
    callWebWallet () {
      this.keywords && window.postMessage({
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
        this.openConfirm().catch(e => {
          Message({
            type: 'fail',
            message: e.message
          })
        })
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
    },
    handleKeyPress (e) {
      // console.log('keycode' + e.keyCode)
      if (e.keyCode == 13) {
        this.callWebWallet()
        this.$refs.input.blur && this.$refs.input.blur()
      }
    }
  },
  mounted () {
    const h = this.$createElement
    Notification({
      title: '提示',
      message: h('p',
        [
          h('span', {}, '需要安装'),
          h('a', {
            style: {
              marginLeft: '10px',
              color: '#4560E6',
              textDecoration: 'none'
            },
            attrs: {
              href: 'https://github.com/nebulasio/WebExtensionWallet'
            }
          },
          'WebExtensionWallet')
        ]
      ),
      duration: 5000
    })
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
