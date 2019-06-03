<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
.animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}
@keyframes fadeInUp {
  from {
    opacity: 1;
    /* -webkit-transform: translate3d(0, 100%, 0); */
    transform: translate3d(0, 50%, 0);
  }

  to {
    /* -webkit-transform: translate3d(0, 0, 0); */
    transform: translate3d(0, 0, 0) scale(0.8);
    opacity: 0;
  }
}

.fadeInUp {
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;

}
.fs14{
    font-size:28rpx;
}
.fs16{
    /* font-size:32rpx; */
}

</style>
