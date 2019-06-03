<script>
export default {
  props: {
    videoSrc: {
      default: ''
    }
  },
  data () {
    return {
      isPlay: false, //是否播放
      touchmoveDistance: 0, //拖动距离
      barClientWidth: 700, //进度条长度
      barPadLeft: 0, //进度条左边距
      sliderRatio: 0, //进度条比率
      updateState: false, //防止视频播放过程中导致的拖拽失效
      playStates: true, //控制播放 & 暂停按钮的显示
      videoContext: null,
      isSliderBar: false, //是否显示sliderBar
      setTimeCount: 0, //计时
      onOff: true,
    }
  },
  onLoad(){
  },
  onShow(){
  },
  onReady(){
    this.videoContext = wx.createVideoContext('video')
    this.updateState = true;
    this.barPadLeft = (750 - this.barClientWidth) / 4;
  },
  watch: {
  },
  methods: {
    caleRatio (x) { //计算点击或拖拽进条百分比
      return (x - this.barPadLeft) / (this.barClientWidth / 2);
    },
    touchstart (e) {
      this.setTimeCount = 0;
      if (!this.isPlay) this.videoContext.play();
      this.videoContext.seek(this.caleRatio(e.clientX) * this.duration);
    },
    touchmove (e) {
      let {clientX} = e;
      this.setTimeCount = 0;
      if (!this.isPlay) this.videoContext.play();
      if (clientX >= this.barPadLeft && clientX <= (375 - this.barPadLeft)) {
        // console.log(clientX)
        this.videoContext.seek(this.caleRatio(clientX) * this.duration); //视频随滚动条拖动播放

        /* 以下是拖拽完毕再播放视频 */
        // this.sliderRatio = this.caleRatio(clientX);
        // this.cancelClientx = clientX;

      }
    },
    touchend () {
      this.setTimeCount = 0;
      /* 以下是拖拽完毕再播放视频 */
      // if (!this.isPlay) this.videoContext.play();
      // this.videoContext.seek(this.caleRatio(this.cancelClientx) * this.duration);
    },
    videoEnded () {
      this.isPlay = false;
    },
    videoPlay () {
      this.isPlay = true;
    },
    videoTimeupdate (e) {
      let {currentTime, duration} = e.mp.detail;
      if (this.updateState) {
        this.sliderRatio = currentTime / duration;
        this.duration = duration;
      }
    },
    clickBlockArea () {
      if (this.onOff) {
        let timer = null;
        let count = 3;
        this.onOff = false;
        this.setTimeCount = 0;
        if (!this.isPlay) this.videoContext.play();
        if (!this.isSliderBar) this.isSliderBar = true;
        clearInterval(timer);
        timer = setInterval(() => {
          this.setTimeCount++;
          if (this.setTimeCount === count) {
            this.isSliderBar = false;
            clearInterval(timer);
            this.setTimeCount = 0;
          }
        }, 1000)
        setTimeout(() => {
          this.onOff = true;
        }, count * 1000)
      }
    }
  }
}
</script>

<template>
  <div class="contebt-box1" >
    <video
          id="video"
          class="video"
          :src="videoSrc"
          objectFit="cover"
          :initial-time="getHasStartTime"
          :controls = " false "
          :show-progress=" false "
          :show-fullscreen-btn=" false "
          :show-play-btn=" false "
          :show-center-play-btn=" false "
          :enable-progress-gesture=" false "
          :direction="0"
          :loop= " false "
          :autoplay=" true "
          :custom-cache = "false"
          @play="videoPlay"
          @pause="videoPause"
          @ended="videoEnded"
          @timeupdate="videoTimeupdate"
          @waiting="videoWaiting"
          @error="videoError"
      >
      <cover-view  :class="['vc-bar animated', isSliderBar ? 'fadeIn' : 'fadeOut']" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
          <cover-view class="vc-bar-current" :style="{width: sliderRatio * 100 +'%'}"></cover-view>
      </cover-view>
      <cover-view class="blockarea" @touchstart="clickBlockArea"></cover-view>
    </video>
  </div>
</template>

<style scope>
.contebt-box1{
  width:100vw;
  height:100vh;
}
.contebt-box1 video{
  width:100%;
  height:100%;
  position:relative;
}
.vc-bar{
  margin:0 auto;
  margin-top:10px;
  width:700rpx;
  height: 10rpx;
  background: #ccc;
  position: relative;
  line-height: 1;
  border-radius: 6rpx;
}
.vc-bar-current{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: red;
  border-radius: 6rpx;
  overflow:visible;
}
.vc-bar-current:after{
  content: '';
  display:block;
  height: 10rpx;
  width: 10rpx;
  background: red;
  position: absolute;
  top: 0;
  right: 0;
  transform: scale(2);
  border-radius: 50%;
}
.blockarea{
  width:100%;
  height:80%;
  margin-top:5rpx;
  background:yellow;
  opacity: .5;
}
cover-view{
  overflow:visible;
}
@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
.animated {
    animation-duration: .6s;
    animation-fill-mode: both;
}
.fadeIn {
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
}
@keyframes fadeOut {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.fadeOut {
    -webkit-animation-name: fadeOut;
    animation-name: fadeOut;
}
</style>
