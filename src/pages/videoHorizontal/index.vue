<template>
    <view>
        <image class="backBtn" @click="goBackPrevious" :src="backBtn"></image>
        <div class="video_content">
            <video
                id="video"
                class="video"
                :src="videoSrc"
                objectFit="cover"
                :initial-time="initialTime"
                :controls="isHorizontal && isLearningDone"
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
            </video>
            <!--showAnswerPanel是否显示面板；requestDataQuestion问题和回答的数据；recordUrl录音文件；isLearningDone是否学完过-->
            <answer-panel
                :showPanel="showAnswerPanel" 
                :requestDataQuestion="requestDataQuestion[pageIndex]"
                :recordUrl="recordUrl"
                :isLearningDone="isLearningDone"
                @submitNextPage="submitNextPage"
            ></answer-panel>
            <view class="attention-text"><image :src="horizontalAttentionImg"></image></view>
        </div>
        <modal :show="showModal" :contentText="'你需要继续播放吗？'" :confirmText="'续播'" :cancelText="'重播'" @cancel="modalCancel" @confirm="modalConfirm"></modal>
    </view>
</template>
<script>
import Modal from '../../components/modal';
import answerPanel from '../../components/answerPanel';
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            videoSrc: "https://appfiles.jojoread.tinman.cn/resource-file/content/v0/10004/subject_res/video/live_title_01.mp4",
            horizontalAttentionImg: require('../../images/AAA/horizontal-atention.png'),
            backBtn: require('../../images/AAA/back-white.png'),
            isHorizontal: false, //是否是横屏
            isplaying: false, //视频是否正在播放
            initialTime: 0, //初始播放位置
            duration: 0, //总时长
            isBackground: false, //是否退出程序
            showModal: false, //显示续播modal
            showAnswerPanel: false, //是否显示学习面板
            requestDataQuestion: [], //处理过后的requestData.questions
            pageIndex: 0, //当前题目数
            updataTime: [], //暂停时间表
            pauseTime: 0, //赋值暂停时间
            isLearningDone: false, //是否学完过

            recordUrl: '',
            requestData: {
                "entrance": {
                    "endAudio": "/10101/subject_res/audio/end_12.mp3", 
                    "endImage": "/10101/subject_res/image/end_01.png", 
                    "entranceAudio": "/10101/subject_res/audio/cover_12.mp3", 
                    "entranceImage": "/10101/subject_res/image/cover_12.png"
                }, 
                "live_intro": null, 
                "live_video": null, 
                "questions": [
                    {
                        "answer_type": 2, // idx: 0 4道题 单选 
                        "answers": [
                            {"data": "1 right"}, 
                            {"data": "2222"},
                            {"data": "3333"},
                            {"data": "4444"},
                        ], 
                        "begin_time": 42, 
                        "correct_count": 1,
                        "duration": 30, 
                        "id": 1, 
                        "image": "https://pic.qqtn.com/up/2019-6/2019060409305094440.jpg", 
                        "need_pause": 1, 
                        "note_text": null, 
                        "show_time": 1, 
                        "text": "是谁开辟了天地，创造了美好的世界？"
                    },
                    {
                        "answer_type": 2, // idx:1 2道题 单选 
                        "answers": [
                            {"data": 'right 1111群群群群群群群群群群群群群群群群群群群群群群群群群群群群群群群群'},
                            {"data": '凄凄切切群群群群群群群群群群群群群群群群群群群群群群群群群群群群群群群群'},
                        ], 
                        "begin_time": 72, 
                        "correct_count": 1, 
                        "duration": 30, 
                        "id": 2, 
                        "image": null, 
                        "need_pause": 1, 
                        "note_text": null, 
                        "show_time": 3, 
                        "text": "你能做到保护地球吗？"
                    },
                    {
                        "answer_type": 2, // idx: 2 4道题 多选 
                        "answers": [
                            {"data": "1 right"}, 
                            {"data": "2 right"},
                            {"data": "3 wrong"},
                            {"data": "4 wrong"},
                        ], 
                        "begin_time": 42, 
                        "correct_count": 2,
                        "duration": 30, 
                        "id": 3, 
                        "image": "https://pic.qqtn.com/up/2019-6/2019060409305094440.jpg", 
                        "need_pause": 1, 
                        "note_text": null, 
                        "show_time": 5, 
                        "text": "是谁开辟了天地，创造了美好的世界？"
                    },
                    {
                        "answer_type": 2, // idx: 3 6道题 多选 
                        "answers": [
                            {"data": "1 right"}, 
                            {"data": "2 right"},
                            {"data": "3 right"},
                            {"data": "4 right"},
                            {"data": "5555"},
                            {"data": "6666"},
                        ], 
                        "begin_time": 84, 
                        "correct_count": 4, 
                        "duration": 30, 
                        "id": 4, 
                        "image": null, 
                        "need_pause": 1, 
                        "note_text": null, 
                        "show_time": 6, 
                        "text": "为了保护美丽的地球，你还愿意做什么事情呢？"
                    },
                    {
                        "answer_type": 3, // idx: 4 2道图片题 单选 
                        "answers": [
                            {"data": "https://pic.qqtn.com/up/2019-5/2019052907541954443.jpg"}, 
                            {"data": "https://pic.qqtn.com/up/2019-6/2019060409305094440.jpg"}
                        ], 
                        "begin_time": 84, 
                        "correct_count": 1, 
                        "duration": 30, 
                        "id": 5, 
                        "image": "https://pic.qqtn.com/up/2019-6/2019060409305094440.jpg", 
                        "need_pause": 1, 
                        "note_text": null, 
                        "show_time": 7, 
                        "text": "为了保护美丽的地球，你还愿意做什么事情呢？"
                    },
                    {
                        "answer_type": 1, // idx: 5 录音题
                        "answers": [],
                        "begin_time": 84,
                        "correct_count": 1,
                        "duration": 30,
                        "id": 6,
                        "image": "https://pic.qqtn.com/up/2019-6/2019060409305094440.jpg",
                        "need_pause": 1,
                        "note_text": null,
                        "show_time": 9,
                        "text": "你好，这是一个录音题，看你能不能答对？"
                    },

                ], 
                "screen_type": 1
            },
        };
    },
    state: {
        videoContext: null, //video实例
        currentTime: 0, //当前播放位置
    },
    components: {
        'modal': Modal,
        'answer-panel': answerPanel
    },
    onLoad() {
        this.isLearningDone = true;
        this.requestDataQuestion = this.dealWithAnswerRandom(this.requestData.questions);
        this.updataTime = this.updateTimeFilter(this.requestData.questions)
        this.recordUrl = 'http://tmp/wx1fbbaa6654693d53.o6zAJs4vJ_VjqtRsYTbpkWYLsyik.rYWomOpjOonb336f4f5baed095bb869f72167c317e8e.durationTime=2487.mp3';

    },
    onShow() {
        console.log('----onShow----isBackground:', this.isBackground)
        if (this.isBackground) {
            this.isBackground = false;
            this.$options.state.videoContext.pause(); //系统默认播放时退出回来会继续播放
            setTimeout(() => {
                console.log('---onShow1秒后---')
                console.warn(this.$options.state.currentTime, this.isplaying)
                if (this.$options.state.currentTime && !this.isplaying && this.isHorizontal && !this.showAnswerPanel) { //播放过且横屏且没有播放且未出现答题面板
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
                if (this.$options.state.currentTime && !this.isplaying && !this.showAnswerPanel) { //续播时机：非第一次横屏&&未出现答题面板
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
        /* 组件穿回来下一页的操作 */
        submitNextPage () {
            this.showAnswerPanel = false;
            this.pageIndex ++;
            this.$options.state.videoContext.play();
        },
         /* 将数组里的暂停时间组成一个数组 */
        updateTimeFilter(requestDataQuestion) {
            return requestDataQuestion.map(e => {
                return e.show_time;
            })
        },
         /* 将答案随机打乱顺序 */
        dealWithAnswerRandom (requestDataQuestion) {
            requestDataQuestion.forEach(item => {
                item.answers.forEach((e, i) => {
                    e.correct = i < item.correct_count ? 1 : 0; //correct_count正确1 不正确0
                    e.idx = i; //后面会打乱顺序 先给每个item索引值
                })
                // 随机排序
                item.answers.sort(() => {return Math.random() - 0.5});
            })
            return requestDataQuestion;
        },
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
            if (!this.duration) this.duration = duration;
            this.$options.state.currentTime = currentTime;
            
            this.updataTime.forEach(e => {
                const differenceValue = currentTime - e;
                // console.warn(currentTime, e, this.pauseTime);
                if (this.pauseTime === e) return;
                if (differenceValue > 0  && differenceValue < 1) {
                    this.pauseTime = e;
                    this.$options.state.videoContext.pause();
                    this.showAnswerPanel = true;
                }
            })
            console.log(currentTime)
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
        /*重播 */
        modalCancel () {
            this.showModal = false;
            this.$options.state.currentTime = 0;
            this.$options.state.videoContext.seek(0);
            this.$options.state.videoContext.play();
        },
        /*续播 */
        modalConfirm () {
            this.showModal = false;
            this.$options.state.videoContext.seek(this.$options.state.currentTime);
            this.$options.state.videoContext.play();
        }
    },
    
};
</script>



<style lang="less">
@vh:319;
// 层级：video为1 answerPanel为2 横屏提示3 返回键4 续播提示5
image{
    display: block;
}
.backBtn {
    width: 37/@vh*100vh;
    height: 37/@vh*100vh;
    position: fixed;
    top: 16/@vh*100vh;
    left: 0;
    z-index: 4;
}
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
    /* transform:rotate(90deg);
    transform-origin:0 0; */
}
.attention-text {
    width: 100vw;
    height:100vh;
    position: absolute;
    top:0;
    left:0;
    background: rgba(0, 0, 0, 0.5);
    z-index:3;
    image{
        width:500rpx;
        height:500rpx;
        position: absolute;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
    }
}
@media screen and (orientation: portrait) {
    .attention-text {
        display: block;
    }
    .backBtn {
        width: 70rpx;
        height: 70rpx;
        position: fixed;
        z-index: 4;
        top: 45rpx;
    }
}
@media screen and (orientation: landscape) {
    .attention-text {
        display: none;
    }
}
</style>
