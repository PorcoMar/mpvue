<script>
import Modal from '../../components/modal';
import answerPanel from '../../components/answerPanel';
export default {
    data() {
        return {
            videoSrc: "https://appfiles.jojoread.tinman.cn/resource-file/content/v0/10004/subject_res/video/live_title_01.mp4",
            isHorizontal: false, //是否是横屏
            isplaying: false, //视频是否正在播放
            initialTime: 0, //初始播放位置
            showControls: false, //显示进度条
            duration: 0, //总时长
            isBackground: false, //是否退出程序
            showModal: false, //显示续播modal
            isWorkDone: false, //是否学完过
        };
    },
    state: {
        videoContext: null, //video实例
        currentTime: 0, //当前播放位置
    },
    components: {
        'modal': Modal
    },
    onLoad() {
        this.isworkDone = false;
    },
    onShow() {
        console.log('----onShow----isBackground:', this.isBackground)
        if (this.isBackground) {
            this.isBackground = false;
            this.$options.state.videoContext.pause(); //系统默认播放时退出回来会继续播放
            setTimeout(() => {
                console.log('---onShow1秒后---')
                console.warn(this.$options.state.currentTime, this.isplaying)
                if (this.$options.state.currentTime && !this.isplaying && this.isHorizontal) { //播放过且横屏且没有播放
                    this.showModal = true;
                }
            }, 1000)
        }
    },
    onReady() {
        this.$options.state.videoContext = wx.createVideoContext("video");
    },
    mounted() {
        wx.onWindowResize(res => {
            console.log(res.deviceOrientation);
            if (res.deviceOrientation === "landscape") {
                console.error('横屏触发')
                this.isHorizontal = true;
                if (!this.$options.state.currentTime) this.$options.state.videoContext.play(); //第一次横屏直接播放
                if (this.$options.state.currentTime && !this.isplaying) {
                    this.$options.state.videoContext.pause();
                    this.showModal = true;
                }
            } else {
                this.isHorizontal = false;
                this.$options.state.videoContext.pause();
                this.showModal = false; //隐藏续播弹窗
            }
        });
    },
    onHide () {
        this.isBackground = true;
        this.isplaying = false;
        console.log('--onHide--')
        // this.$options.state.videoContext.pause();
    },
    onUnload() {
        this.$options.state.currentTime = 0;
        //所有参数回归初始设置
    },
    watch: {
        isplaying(val) {
            console.log('isPlaying:', val)
        }
    },
    methods: {
        videoPlay() {
            this.isplaying = true;
        },
        videoPause() {
            this.isplaying = false;
        },
        videoEnded() {
            this.isplaying = false;
        },
        videoTimeupdate(e) {
            const { currentTime, duration } = e.mp.detail;
            console.log(currentTime)
            if (!this.duration) this.duration = duration;
            this.$options.state.currentTime = currentTime;
        },
        goBackPrevious() {
            wx.navigateBack({
                dalta: 1
            });
        },
        clickVideo() {
            //竖屏且视频未播放时 不播放视频 ?bug
            // console.log(this.isHorizontal, this.isplaying);
            if (!this.isHorizontal) {
                this.$options.state.videoContext.pause();
            }
        },
        modalCancel () {
            this.$options.state.currentTime = 0;
            this.$options.state.videoContext.seek(0);
            this.showModal = false;
            this.$options.state.videoContext.play();
        },
        modalConfirm () {
            this.$options.state.videoContext.seek(this.$options.state.currentTime);
            this.showModal = false;
            this.$options.state.videoContext.play();
        }
    },
    
};
</script>

<template>
    <view>
        <view class="backBtn" @click="goBackPrevious"></view>
        <div class="contebt-box1">
            <video
                id="video"
                class="video"
                :src="videoSrc"
                objectFit="cover"
                :initial-time="initialTime"
                :controls="isHorizontal"
                :show-progress="true"
                :show-fullscreen-btn="false"
                :show-play-btn="true"
                :show-center-play-btn="false"
                :enable-progress-gesture="false"
                :direction="0"
                :loop="false"
                :autoplay="false"
                :custom-cache="false"
                @play="videoPlay"
                @pause="videoPause"
                @ended="videoEnded"
                @timeupdate="videoTimeupdate"
                @waiting="videoWaiting"
                @error="videoError"
                @touchstart="clickVideo"
            >
                <view class="waiting fs17" v-if="!hiddenWaiting">视频正在加载,请保持网络通畅</view>
                <view class="attention-text">请在横屏使用</view>
            </video>
        </div>
        <modal :show="showModal" :contentText="'你需要继续播放吗？'" :confirmText="'续播'" :cancelText="'重播'" @cancel="modalCancel" @confirm="modalConfirm"></modal>
    </view>
</template>

<style lang="less">
.backBtn {
    width: 50rpx;
    height: 50rpx;
    z-index: 4;
    background: red;
    position: fixed;
    top: 40rpx;
    left: 40rpx;
}
.contebt-box1 {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
.video {
    width: 100%;
    height: 100%;
    position: relative;
    z-index:1;
    /* transform:rotate(90deg);
    transform-origin:0 0; */
}
.attention-text {
    width: 100vw;
    height:100vh;
    line-height: 100vh;
    text-align: center;
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    z-index:3;
}
@media screen and (orientation: portrait) {
    .attention-text {
        display: block;
    }
}
@media screen and (orientation: landscape) {
    .attention-text {
        display: none;
    }
}
</style>
