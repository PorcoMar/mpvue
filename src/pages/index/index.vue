<template>
  <div class="container" @click="clickHandle('test click', $event)">

    <div class="userinfo" @click="bindViewTap">
<!--       <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div> -->
      index
    </div>

    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto" :text2="aaa"></card>
      </div>
    </div>
    <!-- 动画部分开始 -->
    <view :class="['addn', 'animated', addNum ? 'fadeInUp' : 'addn']">+{{addN}}</view>
    <view class="sty sty1"><text :class="addNum? 'sc': ''">@</text> {{curveNumber}}</view>
    <view :class="['sty', fade ? 'curve yes': 'yellow']"><view :class="fade ? 'horz' : ''">@</view></view>
    <view style="position:absolute;bottom:20%;left:50%-20px;">@@@</view>
    <view @click="change1()" class="act">点击</view>
    <!-- 动画结束 -->
    <form class="form-container">
      <input type="text" class="form-control" v-model="motto" placeholder="v-model" />
      <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy" />
    </form>
    <view >
      <liveLike :count="count"></liveLike>
      <image class="icon-dianzan" @click="clickCanvas" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAE0klEQVRoQ+2YW2wUZRTH/2emdy6WdndbG8REIQZvCSnbhVRN092tKS9GY9F4jWlI8JIoBqOEJ0nw8mBEUkgNSBBjiBgTH+BBOwsVi7q7rNGYavqgpRID3UuLoUqz3fmOmcWFbTu7s7Mzo4R0HnfO+f/P75z5dub7CNfJRdcJBxZArrVJLkxkYSIOdaCkR4sBSnWta4PKnQxxN4AWALVMSEuM84KkX2TGyYaGqa/o0+F0KbWOdnTULKq81CkJbhfAaiL2EKiCwVPMOAvgB1lAaTwRHS5FzxBk3N+2XiK8BOBWI0EGkiB84B6IfEaA0Ivnnh45OXHmUTCegUT1RpoE/JiBvKtZ+fanYrEFQTTD+OTYyxKwETD7N83fVzNtWxqKpPLN4x3eZkmmt5hwpxHArPvMQiZp/zIlvI8A1svVBbnctbE3Qeg0ZZgXTIyzNaDNi0Phce3nVJf3JiGoH0BT2ZrgzxuV6E49GF2QRKBtC4DHyzXMyxuZytT1LkKiAhV1HxLoZquaEmhvoxI+MFdnHkiiy9cKlftBZh8n/RKZ+RBAi4nwkFWIbD6zCsFPuU+cHsnXmw/i934EotW2mF4WyYBZApFklyYzhz2h6PMFQeKBtWsI0j67DJ3UEeCNTUr0t5zHrIkkAmtfAaRHnCzANm1Cv3sgsr8ASNvHAG6zzcxBIWIacoXC2vste82eiL/tJAh1DvrbJs3MZzyh6MOFJnLaNienhZjj7lB0gy5I3O/9hoiqnK7BDn0Ghj1K5GldkGTAt4fBPjuMHNcgOuweCL+jD+L3PsFEVxaQ48VYMJAZWxpCka91QS523+ueTk8fBZFswcPxVAIujJ/7a8Mdw1e3DPPe7PGg9w1i6nK8GgsGLHDQczzSly8xD2Q84L1FYhy+ZqfC+LuypuqB+mNDk0VBtJvJgPc1Bl35j7bQPNtTGbTXU8rXr+acaG9fgpr0ERC5ba/EgiAxRhsvqI9RLDYzV6bgDnE8uK5dEmKXXZ/zFurPpWYyKvfeWGAPX3TPngr6XhTMT9pQhGUJAna7lMihQkJFQY70QO6Y8O4mov/1JcmgAY8S3lasG4anKKlu31I1zQeJsMJyW8sTGHFl6nppcHDaEkh28QfXtLCoPEAEV3m1lJvFf8xkRG/LYCxppGA4kZxAPOhbRYLfB2Gpkagd95l5QpbR2/hlVDusM7xKBtGUUn7f7QJiD4iWGCpbCCDmiQrC5vq8rayRnCmQqzDc59RktElUsXi2/njsV6Pi8++bBtGS4/evXympah/D3jXDjPMVpD7XoMR+NwOhxZYFkp1Mt2+5SGcns9ysqV48M0YZ9ELTvyeTZjXLBtGMxu65a1ltde27ZPYsd06VEjgmLlVtdZ86ddEsQC7eEogmwt0rqxMzDa8TECiziKOuSXWn3veTGT3LIFkYgOIB7yaJsQlEpWkyCyLqK/bZ8Z+D5Awnu7z3ZQR2aGe9RYtg/KkSbW9Wwt+ZKbZYbGndM+E2EWhdobL0NohWFUj7GbL6qvuL2DkTsoahtoPkrZutBDyYVwED/IlrUrxndT3oUTkCkjNKBr1+FrSdwRmQtMOjhIcMW1tmgKMgWk0TgdYbMplp1TM4PFVmjSWlOQ5SUhU2BC2A2NBEWyUWJmJrO20Q+wcY6J9CHHzXnQAAAABJRU5ErkJggg=="></image>
  </view>
  <button @click="gotoVideoHorizontal">跳转到videoHorizontal页</button>
  </div>
</template>

<script>
import card from '@/components/card'
import livelike from '@/components/liveLike'
export default {
  data () {
    return {
      motto: 'Hello World',
      count: 0,
      userInfo: {},
      aaa:'this is text2 fro porco',
      fade: false,
      curveNumber: 30,
      addN: 5,
      addNum: false,
      timeout: {
        aaa: ((arg) =>{
        //   console.error('aaa--'+ arg)
        }).call(this, 'AAA')
      },
    }
  },

  components: {
    card,
    liveLike: livelike
  },

  methods: {
      gotoVideoHorizontal () {
          wx.navigateTo({
              url: '../videoHorizontal/main'
          })
      },
    assign () {
        let name = 'porco'
        let obj = {
            name,
            fn () {
                console.log(this.name)
            }
        }
    },
    clickCanvas() {
      this.count = this.count + 1;
    },
    change1 () {
      this.fade = !this.fade;
      if (this.fade) {
        setTimeout(() => {
          this.curveNumber += 5;
          this.addNum = true
          setTimeout(() => {
            this.addNum = false
          }, 1000)
        }, 1500)
      }
    },
    time (delay) {
      setTimeout(() => {

      }, delay)
    },
    bindViewTap () {
      const url = '../logs/main?name=index'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    clickHandle (msg, ev) {
      console.log('clickHandle:', msg, ev)
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  },
  onLoad (options) {
    console.log('onLoad')
    console.log(options)
    console.log(this.assign())
  },
  onShow (options) {
    console.log('onShow')
  }
}
</script>

<style>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}



/* 动画部分的样式 */
.sc{
  animation:play 1s;
}
@keyframes play{
  0%{color:red;}
  50%{}
  100%{transform:scale(.5)}
}
.yes{
  color:red;
}
.yellow{
  color:blue;
  bottom:20%;
}
.addn{
  position:absolute;
  left:71%;
  bottom:83%;
  font-size:30rpx;
  color:red;
  opacity: 1
}
.sty{
  position:absolute;
  left:50%-15px;
  width:30px;
  height:30px;
  text-align:center;
}
.sty1{
  width:80px;
  height:30px;
  left:60%;
}
.act:active{transform: scale(1.05);}
.horz{
  animation:horz 1s linear;
  animation-fill-mode: forwards;
}
.curve{
    animation:verty 1s cubic-bezier(.25, .1, .25, 1);
    animation-fill-mode: forwards;
}
@keyframes horz {
   0% { transform: translateX(0px);     }
   100% { transform: translateX(80px); }
}
@keyframes verty {
    0% {
      transform: translate3d(0, 0, 0);
      bottom:20%;
      opacity:1;
    }
    50% {
      opacity:.5;
    }
    100% {
      transform: translate3d(0, 0, 0);
      bottom:78%;
      opacity:0;
      width:20px;
      height:20px;
    }
}
.icon-dianzan{
  position: absolute;
  right: 30rpx;
  bottom: 30rpx;
  width: 80rpx;
  height: 80rpx;
}

</style>
