<script>
import selecctPanel from '../../components/oratorSelePanel';
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            videoSrc: "https://appfiles.jojoread.tinman.cn/resource-file/content/v0/10004/subject_res/video/live_title_01.mp4",
            showAnswerPanel: false, //是否显示学习面板
            requestDataQuestion: [], //处理过后的requestData.questions
            pageIndex: 0, //当前题目数
            updataTime: [], //暂停时间表
            pauseTime: 0,
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
                        "show_time": 4, 
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
                        "id": 1, 
                        "image": "https://pic.qqtn.com/up/2019-6/2019060409305094440.jpg", 
                        "need_pause": 1, 
                        "note_text": null, 
                        "show_time": 6, 
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
                        "id": 3, 
                        "image": null, 
                        "need_pause": 1, 
                        "note_text": null, 
                        "show_time": 8, 
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
                        "id": 3, 
                        "image": "https://pic.qqtn.com/up/2019-6/2019060409305094440.jpg", 
                        "need_pause": 1, 
                        "note_text": null, 
                        "show_time": 9, 
                        "text": "为了保护美丽的地球，你还愿意做什么事情呢？"
                    }
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
        'selecct-panel': selecctPanel
    },
    onLoad() {
        this.requestDataQuestion = this.dealWithAnswerRandom(this.requestData.questions);
        this.updataTime = this.updateTimeFilter(this.requestData.questions)
        console.log(this.updataTime)
        // setTimeout(() => {
        //     this.showAnswerPanel = true;
        // }, 500)
        // setTimeout(() => {
        //     this.showAnswerPanel = true;
        // }, 10000)
        
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
        submitNextPage () {
            this.showAnswerPanel = false;
            this.pageIndex ++;
            this.$options.state.videoContext.play();
        },
        updateTimeFilter(requestDataQuestion) {
            return requestDataQuestion.map(e => {
                return e.show_time;
            })
        },
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
        clickVideo() {
          
        },
       
    },
    
};
</script>

<template>
    <view>
        <!--showAnswerPanel是否显示面板；isBackground是否退出过；requestDataQuestion问题和回答的数据；-->
        <selecct-panel :showPanel="showAnswerPanel" :isBackground="isBackground" :requestDataQuestion="requestDataQuestion[pageIndex]" @submitNextPage="submitNextPage"></selecct-panel>
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
                :autoplay="true"
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
