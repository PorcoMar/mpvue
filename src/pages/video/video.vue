<script>
// import livelike from '@/components/liveLike'
export default {
    data () {
        return {
            videoSrc: 'https://appfiles.jojoread.tinman.cn/resource-file/content/v0/10004/subject_res/video/live_title_01.mp4',
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
            canvasCount: 0,
            canvasCount2: 0,
            canvasCount3: 0,
            canvasCount4: 0,
            canvasCount5: 0,
        }
    },
    components: {
    //   liveLike: livelike,
    },
    onLoad () {
    },
    onShow () {
    },
    onUnload () {
        if(timer != null){
          cancelAnimationFrame(timer);
        }
    },
    onReady () {
        this.videoContext = wx.createVideoContext('video')
        this.updateState = true;
        this.barPadLeft = (750 - this.barClientWidth) / 4;
    },
    watch: {
    },
    methods: {
        clickCanvas() {
          this.canvasCount++;
        },
        clickCanvas2() {
          this.canvasCount2++;
        },
        clickCanvas3() {
          this.canvasCount3++;
        },
        clickCanvas4() {
          this.canvasCount4++;
        },
        clickCanvas5() {
          this.canvasCount5++;
        },
        caleRatio (clientX) { //计算点击或拖拽进条百分比
            return (clientX - this.barPadLeft) / (this.barClientWidth / 2);
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
        },
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
          :autoplay=" false "
          :custom-cache = "false"
          @play="videoPlay"
          @pause="videoPause"
          @ended="videoEnded"
          @timeupdate="videoTimeupdate"
          @waiting="videoWaiting"
          @error="videoError"
      >
      <cover-view  :class="['vc-bar animatedA', isSliderBar ? 'fadeIn' : 'fadeOut']" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
          <cover-view class="vc-bar-current" :style="{width: sliderRatio * 100 +'%'}"></cover-view>
      </cover-view>
      <cover-view class="blockarea" @touchstart="clickBlockArea"></cover-view>
      <liveLike :count="canvasCount" :count2="canvasCount2" :count3="canvasCount3" :count4="canvasCount4" :count5="canvasCount5" ></liveLike>
      <cover-view class="canvas_content">
        <cover-view class="singel_cs">
          <!-- <liveLike :count="canvasCount"></liveLike> -->
          <cover-image class="icon-dianzan" @click="clickCanvas" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAE0klEQVRoQ+2YW2wUZRTH/2emdy6WdndbG8REIQZvCSnbhVRN092tKS9GY9F4jWlI8JIoBqOEJ0nw8mBEUkgNSBBjiBgTH+BBOwsVi7q7rNGYavqgpRID3UuLoUqz3fmOmcWFbTu7s7Mzo4R0HnfO+f/P75z5dub7CNfJRdcJBxZArrVJLkxkYSIOdaCkR4sBSnWta4PKnQxxN4AWALVMSEuM84KkX2TGyYaGqa/o0+F0KbWOdnTULKq81CkJbhfAaiL2EKiCwVPMOAvgB1lAaTwRHS5FzxBk3N+2XiK8BOBWI0EGkiB84B6IfEaA0Ivnnh45OXHmUTCegUT1RpoE/JiBvKtZ+fanYrEFQTTD+OTYyxKwETD7N83fVzNtWxqKpPLN4x3eZkmmt5hwpxHArPvMQiZp/zIlvI8A1svVBbnctbE3Qeg0ZZgXTIyzNaDNi0Phce3nVJf3JiGoH0BT2ZrgzxuV6E49GF2QRKBtC4DHyzXMyxuZytT1LkKiAhV1HxLoZquaEmhvoxI+MFdnHkiiy9cKlftBZh8n/RKZ+RBAi4nwkFWIbD6zCsFPuU+cHsnXmw/i934EotW2mF4WyYBZApFklyYzhz2h6PMFQeKBtWsI0j67DJ3UEeCNTUr0t5zHrIkkAmtfAaRHnCzANm1Cv3sgsr8ASNvHAG6zzcxBIWIacoXC2vste82eiL/tJAh1DvrbJs3MZzyh6MOFJnLaNienhZjj7lB0gy5I3O/9hoiqnK7BDn0Ghj1K5GldkGTAt4fBPjuMHNcgOuweCL+jD+L3PsFEVxaQ48VYMJAZWxpCka91QS523+ueTk8fBZFswcPxVAIujJ/7a8Mdw1e3DPPe7PGg9w1i6nK8GgsGLHDQczzSly8xD2Q84L1FYhy+ZqfC+LuypuqB+mNDk0VBtJvJgPc1Bl35j7bQPNtTGbTXU8rXr+acaG9fgpr0ERC5ba/EgiAxRhsvqI9RLDYzV6bgDnE8uK5dEmKXXZ/zFurPpWYyKvfeWGAPX3TPngr6XhTMT9pQhGUJAna7lMihQkJFQY70QO6Y8O4mov/1JcmgAY8S3lasG4anKKlu31I1zQeJsMJyW8sTGHFl6nppcHDaEkh28QfXtLCoPEAEV3m1lJvFf8xkRG/LYCxppGA4kZxAPOhbRYLfB2Gpkagd95l5QpbR2/hlVDusM7xKBtGUUn7f7QJiD4iWGCpbCCDmiQrC5vq8rayRnCmQqzDc59RktElUsXi2/njsV6Pi8++bBtGS4/evXympah/D3jXDjPMVpD7XoMR+NwOhxZYFkp1Mt2+5SGcns9ysqV48M0YZ9ELTvyeTZjXLBtGMxu65a1ltde27ZPYsd06VEjgmLlVtdZ86ddEsQC7eEogmwt0rqxMzDa8TECiziKOuSXWn3veTGT3LIFkYgOIB7yaJsQlEpWkyCyLqK/bZ8Z+D5Awnu7z3ZQR2aGe9RYtg/KkSbW9Wwt+ZKbZYbGndM+E2EWhdobL0NohWFUj7GbL6qvuL2DkTsoahtoPkrZutBDyYVwED/IlrUrxndT3oUTkCkjNKBr1+FrSdwRmQtMOjhIcMW1tmgKMgWk0TgdYbMplp1TM4PFVmjSWlOQ5SUhU2BC2A2NBEWyUWJmJrO20Q+wcY6J9CHHzXnQAAAABJRU5ErkJggg==">
          </cover-image>
        </cover-view>
        <cover-view class="singel_cs">
          <!-- <liveLike :count="canvasCount"></liveLike> -->
          <cover-image class="icon-dianzan" @click="clickCanvas2" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAE0klEQVRoQ+2YW2wUZRTH/2emdy6WdndbG8REIQZvCSnbhVRN092tKS9GY9F4jWlI8JIoBqOEJ0nw8mBEUkgNSBBjiBgTH+BBOwsVi7q7rNGYavqgpRID3UuLoUqz3fmOmcWFbTu7s7Mzo4R0HnfO+f/P75z5dub7CNfJRdcJBxZArrVJLkxkYSIOdaCkR4sBSnWta4PKnQxxN4AWALVMSEuM84KkX2TGyYaGqa/o0+F0KbWOdnTULKq81CkJbhfAaiL2EKiCwVPMOAvgB1lAaTwRHS5FzxBk3N+2XiK8BOBWI0EGkiB84B6IfEaA0Ivnnh45OXHmUTCegUT1RpoE/JiBvKtZ+fanYrEFQTTD+OTYyxKwETD7N83fVzNtWxqKpPLN4x3eZkmmt5hwpxHArPvMQiZp/zIlvI8A1svVBbnctbE3Qeg0ZZgXTIyzNaDNi0Phce3nVJf3JiGoH0BT2ZrgzxuV6E49GF2QRKBtC4DHyzXMyxuZytT1LkKiAhV1HxLoZquaEmhvoxI+MFdnHkiiy9cKlftBZh8n/RKZ+RBAi4nwkFWIbD6zCsFPuU+cHsnXmw/i934EotW2mF4WyYBZApFklyYzhz2h6PMFQeKBtWsI0j67DJ3UEeCNTUr0t5zHrIkkAmtfAaRHnCzANm1Cv3sgsr8ASNvHAG6zzcxBIWIacoXC2vste82eiL/tJAh1DvrbJs3MZzyh6MOFJnLaNienhZjj7lB0gy5I3O/9hoiqnK7BDn0Ghj1K5GldkGTAt4fBPjuMHNcgOuweCL+jD+L3PsFEVxaQ48VYMJAZWxpCka91QS523+ueTk8fBZFswcPxVAIujJ/7a8Mdw1e3DPPe7PGg9w1i6nK8GgsGLHDQczzSly8xD2Q84L1FYhy+ZqfC+LuypuqB+mNDk0VBtJvJgPc1Bl35j7bQPNtTGbTXU8rXr+acaG9fgpr0ERC5ba/EgiAxRhsvqI9RLDYzV6bgDnE8uK5dEmKXXZ/zFurPpWYyKvfeWGAPX3TPngr6XhTMT9pQhGUJAna7lMihQkJFQY70QO6Y8O4mov/1JcmgAY8S3lasG4anKKlu31I1zQeJsMJyW8sTGHFl6nppcHDaEkh28QfXtLCoPEAEV3m1lJvFf8xkRG/LYCxppGA4kZxAPOhbRYLfB2Gpkagd95l5QpbR2/hlVDusM7xKBtGUUn7f7QJiD4iWGCpbCCDmiQrC5vq8rayRnCmQqzDc59RktElUsXi2/njsV6Pi8++bBtGS4/evXympah/D3jXDjPMVpD7XoMR+NwOhxZYFkp1Mt2+5SGcns9ysqV48M0YZ9ELTvyeTZjXLBtGMxu65a1ltde27ZPYsd06VEjgmLlVtdZ86ddEsQC7eEogmwt0rqxMzDa8TECiziKOuSXWn3veTGT3LIFkYgOIB7yaJsQlEpWkyCyLqK/bZ8Z+D5Awnu7z3ZQR2aGe9RYtg/KkSbW9Wwt+ZKbZYbGndM+E2EWhdobL0NohWFUj7GbL6qvuL2DkTsoahtoPkrZutBDyYVwED/IlrUrxndT3oUTkCkjNKBr1+FrSdwRmQtMOjhIcMW1tmgKMgWk0TgdYbMplp1TM4PFVmjSWlOQ5SUhU2BC2A2NBEWyUWJmJrO20Q+wcY6J9CHHzXnQAAAABJRU5ErkJggg==">
          </cover-image>
        </cover-view>
        <cover-view class="singel_cs">
          <!-- <liveLike :count="canvasCount"></liveLike> -->
          <cover-image class="icon-dianzan" @click="clickCanvas3" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAE0klEQVRoQ+2YW2wUZRTH/2emdy6WdndbG8REIQZvCSnbhVRN092tKS9GY9F4jWlI8JIoBqOEJ0nw8mBEUkgNSBBjiBgTH+BBOwsVi7q7rNGYavqgpRID3UuLoUqz3fmOmcWFbTu7s7Mzo4R0HnfO+f/P75z5dub7CNfJRdcJBxZArrVJLkxkYSIOdaCkR4sBSnWta4PKnQxxN4AWALVMSEuM84KkX2TGyYaGqa/o0+F0KbWOdnTULKq81CkJbhfAaiL2EKiCwVPMOAvgB1lAaTwRHS5FzxBk3N+2XiK8BOBWI0EGkiB84B6IfEaA0Ivnnh45OXHmUTCegUT1RpoE/JiBvKtZ+fanYrEFQTTD+OTYyxKwETD7N83fVzNtWxqKpPLN4x3eZkmmt5hwpxHArPvMQiZp/zIlvI8A1svVBbnctbE3Qeg0ZZgXTIyzNaDNi0Phce3nVJf3JiGoH0BT2ZrgzxuV6E49GF2QRKBtC4DHyzXMyxuZytT1LkKiAhV1HxLoZquaEmhvoxI+MFdnHkiiy9cKlftBZh8n/RKZ+RBAi4nwkFWIbD6zCsFPuU+cHsnXmw/i934EotW2mF4WyYBZApFklyYzhz2h6PMFQeKBtWsI0j67DJ3UEeCNTUr0t5zHrIkkAmtfAaRHnCzANm1Cv3sgsr8ASNvHAG6zzcxBIWIacoXC2vste82eiL/tJAh1DvrbJs3MZzyh6MOFJnLaNienhZjj7lB0gy5I3O/9hoiqnK7BDn0Ghj1K5GldkGTAt4fBPjuMHNcgOuweCL+jD+L3PsFEVxaQ48VYMJAZWxpCka91QS523+ueTk8fBZFswcPxVAIujJ/7a8Mdw1e3DPPe7PGg9w1i6nK8GgsGLHDQczzSly8xD2Q84L1FYhy+ZqfC+LuypuqB+mNDk0VBtJvJgPc1Bl35j7bQPNtTGbTXU8rXr+acaG9fgpr0ERC5ba/EgiAxRhsvqI9RLDYzV6bgDnE8uK5dEmKXXZ/zFurPpWYyKvfeWGAPX3TPngr6XhTMT9pQhGUJAna7lMihQkJFQY70QO6Y8O4mov/1JcmgAY8S3lasG4anKKlu31I1zQeJsMJyW8sTGHFl6nppcHDaEkh28QfXtLCoPEAEV3m1lJvFf8xkRG/LYCxppGA4kZxAPOhbRYLfB2Gpkagd95l5QpbR2/hlVDusM7xKBtGUUn7f7QJiD4iWGCpbCCDmiQrC5vq8rayRnCmQqzDc59RktElUsXi2/njsV6Pi8++bBtGS4/evXympah/D3jXDjPMVpD7XoMR+NwOhxZYFkp1Mt2+5SGcns9ysqV48M0YZ9ELTvyeTZjXLBtGMxu65a1ltde27ZPYsd06VEjgmLlVtdZ86ddEsQC7eEogmwt0rqxMzDa8TECiziKOuSXWn3veTGT3LIFkYgOIB7yaJsQlEpWkyCyLqK/bZ8Z+D5Awnu7z3ZQR2aGe9RYtg/KkSbW9Wwt+ZKbZYbGndM+E2EWhdobL0NohWFUj7GbL6qvuL2DkTsoahtoPkrZutBDyYVwED/IlrUrxndT3oUTkCkjNKBr1+FrSdwRmQtMOjhIcMW1tmgKMgWk0TgdYbMplp1TM4PFVmjSWlOQ5SUhU2BC2A2NBEWyUWJmJrO20Q+wcY6J9CHHzXnQAAAABJRU5ErkJggg==">
          </cover-image>
        </cover-view>
        <cover-view class="singel_cs">
          <!-- <liveLike :count="canvasCount"></liveLike> -->
          <cover-image class="icon-dianzan" @click="clickCanvas4" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAE0klEQVRoQ+2YW2wUZRTH/2emdy6WdndbG8REIQZvCSnbhVRN092tKS9GY9F4jWlI8JIoBqOEJ0nw8mBEUkgNSBBjiBgTH+BBOwsVi7q7rNGYavqgpRID3UuLoUqz3fmOmcWFbTu7s7Mzo4R0HnfO+f/P75z5dub7CNfJRdcJBxZArrVJLkxkYSIOdaCkR4sBSnWta4PKnQxxN4AWALVMSEuM84KkX2TGyYaGqa/o0+F0KbWOdnTULKq81CkJbhfAaiL2EKiCwVPMOAvgB1lAaTwRHS5FzxBk3N+2XiK8BOBWI0EGkiB84B6IfEaA0Ivnnh45OXHmUTCegUT1RpoE/JiBvKtZ+fanYrEFQTTD+OTYyxKwETD7N83fVzNtWxqKpPLN4x3eZkmmt5hwpxHArPvMQiZp/zIlvI8A1svVBbnctbE3Qeg0ZZgXTIyzNaDNi0Phce3nVJf3JiGoH0BT2ZrgzxuV6E49GF2QRKBtC4DHyzXMyxuZytT1LkKiAhV1HxLoZquaEmhvoxI+MFdnHkiiy9cKlftBZh8n/RKZ+RBAi4nwkFWIbD6zCsFPuU+cHsnXmw/i934EotW2mF4WyYBZApFklyYzhz2h6PMFQeKBtWsI0j67DJ3UEeCNTUr0t5zHrIkkAmtfAaRHnCzANm1Cv3sgsr8ASNvHAG6zzcxBIWIacoXC2vste82eiL/tJAh1DvrbJs3MZzyh6MOFJnLaNienhZjj7lB0gy5I3O/9hoiqnK7BDn0Ghj1K5GldkGTAt4fBPjuMHNcgOuweCL+jD+L3PsFEVxaQ48VYMJAZWxpCka91QS523+ueTk8fBZFswcPxVAIujJ/7a8Mdw1e3DPPe7PGg9w1i6nK8GgsGLHDQczzSly8xD2Q84L1FYhy+ZqfC+LuypuqB+mNDk0VBtJvJgPc1Bl35j7bQPNtTGbTXU8rXr+acaG9fgpr0ERC5ba/EgiAxRhsvqI9RLDYzV6bgDnE8uK5dEmKXXZ/zFurPpWYyKvfeWGAPX3TPngr6XhTMT9pQhGUJAna7lMihQkJFQY70QO6Y8O4mov/1JcmgAY8S3lasG4anKKlu31I1zQeJsMJyW8sTGHFl6nppcHDaEkh28QfXtLCoPEAEV3m1lJvFf8xkRG/LYCxppGA4kZxAPOhbRYLfB2Gpkagd95l5QpbR2/hlVDusM7xKBtGUUn7f7QJiD4iWGCpbCCDmiQrC5vq8rayRnCmQqzDc59RktElUsXi2/njsV6Pi8++bBtGS4/evXympah/D3jXDjPMVpD7XoMR+NwOhxZYFkp1Mt2+5SGcns9ysqV48M0YZ9ELTvyeTZjXLBtGMxu65a1ltde27ZPYsd06VEjgmLlVtdZ86ddEsQC7eEogmwt0rqxMzDa8TECiziKOuSXWn3veTGT3LIFkYgOIB7yaJsQlEpWkyCyLqK/bZ8Z+D5Awnu7z3ZQR2aGe9RYtg/KkSbW9Wwt+ZKbZYbGndM+E2EWhdobL0NohWFUj7GbL6qvuL2DkTsoahtoPkrZutBDyYVwED/IlrUrxndT3oUTkCkjNKBr1+FrSdwRmQtMOjhIcMW1tmgKMgWk0TgdYbMplp1TM4PFVmjSWlOQ5SUhU2BC2A2NBEWyUWJmJrO20Q+wcY6J9CHHzXnQAAAABJRU5ErkJggg==">
          </cover-image>
        </cover-view>
        <cover-view class="singel_cs">
          <!-- <liveLike2 :count="canvasCount2"></liveLike2> -->
          <cover-image class="icon-dianzan" @click="clickCanvas5" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAE0klEQVRoQ+2YW2wUZRTH/2emdy6WdndbG8REIQZvCSnbhVRN092tKS9GY9F4jWlI8JIoBqOEJ0nw8mBEUkgNSBBjiBgTH+BBOwsVi7q7rNGYavqgpRID3UuLoUqz3fmOmcWFbTu7s7Mzo4R0HnfO+f/P75z5dub7CNfJRdcJBxZArrVJLkxkYSIOdaCkR4sBSnWta4PKnQxxN4AWALVMSEuM84KkX2TGyYaGqa/o0+F0KbWOdnTULKq81CkJbhfAaiL2EKiCwVPMOAvgB1lAaTwRHS5FzxBk3N+2XiK8BOBWI0EGkiB84B6IfEaA0Ivnnh45OXHmUTCegUT1RpoE/JiBvKtZ+fanYrEFQTTD+OTYyxKwETD7N83fVzNtWxqKpPLN4x3eZkmmt5hwpxHArPvMQiZp/zIlvI8A1svVBbnctbE3Qeg0ZZgXTIyzNaDNi0Phce3nVJf3JiGoH0BT2ZrgzxuV6E49GF2QRKBtC4DHyzXMyxuZytT1LkKiAhV1HxLoZquaEmhvoxI+MFdnHkiiy9cKlftBZh8n/RKZ+RBAi4nwkFWIbD6zCsFPuU+cHsnXmw/i934EotW2mF4WyYBZApFklyYzhz2h6PMFQeKBtWsI0j67DJ3UEeCNTUr0t5zHrIkkAmtfAaRHnCzANm1Cv3sgsr8ASNvHAG6zzcxBIWIacoXC2vste82eiL/tJAh1DvrbJs3MZzyh6MOFJnLaNienhZjj7lB0gy5I3O/9hoiqnK7BDn0Ghj1K5GldkGTAt4fBPjuMHNcgOuweCL+jD+L3PsFEVxaQ48VYMJAZWxpCka91QS523+ueTk8fBZFswcPxVAIujJ/7a8Mdw1e3DPPe7PGg9w1i6nK8GgsGLHDQczzSly8xD2Q84L1FYhy+ZqfC+LuypuqB+mNDk0VBtJvJgPc1Bl35j7bQPNtTGbTXU8rXr+acaG9fgpr0ERC5ba/EgiAxRhsvqI9RLDYzV6bgDnE8uK5dEmKXXZ/zFurPpWYyKvfeWGAPX3TPngr6XhTMT9pQhGUJAna7lMihQkJFQY70QO6Y8O4mov/1JcmgAY8S3lasG4anKKlu31I1zQeJsMJyW8sTGHFl6nppcHDaEkh28QfXtLCoPEAEV3m1lJvFf8xkRG/LYCxppGA4kZxAPOhbRYLfB2Gpkagd95l5QpbR2/hlVDusM7xKBtGUUn7f7QJiD4iWGCpbCCDmiQrC5vq8rayRnCmQqzDc59RktElUsXi2/njsV6Pi8++bBtGS4/evXympah/D3jXDjPMVpD7XoMR+NwOhxZYFkp1Mt2+5SGcns9ysqV48M0YZ9ELTvyeTZjXLBtGMxu65a1ltde27ZPYsd06VEjgmLlVtdZ86ddEsQC7eEogmwt0rqxMzDa8TECiziKOuSXWn3veTGT3LIFkYgOIB7yaJsQlEpWkyCyLqK/bZ8Z+D5Awnu7z3ZQR2aGe9RYtg/KkSbW9Wwt+ZKbZYbGndM+E2EWhdobL0NohWFUj7GbL6qvuL2DkTsoahtoPkrZutBDyYVwED/IlrUrxndT3oUTkCkjNKBr1+FrSdwRmQtMOjhIcMW1tmgKMgWk0TgdYbMplp1TM4PFVmjSWlOQ5SUhU2BC2A2NBEWyUWJmJrO20Q+wcY6J9CHHzXnQAAAABJRU5ErkJggg==">
          </cover-image>
        </cover-view>

      </cover-view>
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
.animatedA {
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
.canvas_content{
  width:100%;
  height:80rpx;
  position: fixed;
  bottom: 0px;
  display:flex;
  justify-content:space-around;
  align-items: flex-end;
  border:1rpx solid red;
  box-sizing: border-box;
}
.singel_cs{
  position:relative;
  background:#ccc;
  border:1rpx solid blue;
  overflow:hidden;
}
.icon-dianzan{
  width: 80rpx;
  height: 80rpx;
}
</style>
