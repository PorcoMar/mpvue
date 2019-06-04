<script>
import selecctPanel from '../../components/oratorSelePanel';
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            videoSrc: "https://appfiles.jojoread.tinman.cn/resource-file/content/v0/10004/subject_res/video/live_title_01.mp4",
            showAnswerPanel: false, //是否显示学习面板
        };
    },
    state: {
        videoContext: null, //video实例
        currentTime: 0, //当前播放位置
    },
    components: {
        'selecct-panel': selecctPanel
    },
    onLoad() {
       this.showAnswerPanel = true;
    },
    onShow() {
        
    },
    onReady() {
        this.$options.state.videoContext = wx.createVideoContext("video");
    },
    onHide () {
        this.isBackground = true;
        this.isplaying = false;
        console.log('--onHide--')
    },
    onUnload() {
    },
    watch: {
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
        clickVideo() {
            //竖屏且视频未播放时 不播放视频 ?bug
            // console.log(this.isHorizontal, this.isplaying);
            if (!this.isHorizontal) {
                this.$options.state.videoContext.pause();
            }
        },
       
    },
    
};
</script>

<template>
    <view>
        <selecct-panel :showPanel="showAnswerPanel" :isBackground="isBackground"></selecct-panel>
        <div class="video_content">
            <video
                id="video"
                class="video"
                :src="videoSrc"
                objectFit="cover"
                :initial-time="0"
                :controls="false"
                :show-progress="false"
                :show-fullscreen-btn="false"
                :show-play-btn="false"
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
            </video>
        </div>
    </view>
</template>

<style lang="less">
.video_content {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
}
.video {
    width: 100%;
    height: 100%;
    position: relative;
    z-index:1;
}
</style>
