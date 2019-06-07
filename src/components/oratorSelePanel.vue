<template>
    <view :class="[showPanel ? 'fadeInUpBig' : '', 'animated', 'showPanel']" v-if="showPanel">
        <image class="header_image" :src="isHeadImage" v-if="isHeadImage"></image>
        <view class="question_content">
            <view class="page_idx_cont">
                <view class="page_idx" v-if="question_id">第 {{question_id}} 题</view>
                <image class="skipBtn" v-if="isLearningDone" :src="skipImage" @click="skipHandle"></image>
            </view>
            <view :class="['question_title', !isHeadImage ? 'bigTextSesc' : '']" v-if="isHeadText">{{isHeadText}}</view>
        </view>
        <!-- answer为录音题 -->
        <view class="courserecord-footer" v-if="requestDataQuestion.answer_type == 1">
            <view class="imgCont">
                <image :src="playingSrc" :class="recordUrl ? '' : 'visiblity_hidden'" mode="widthFix" @click="playRecord"></image>
                <image
                    :src="microphone"
                    :class="['pulse loop', !recordUrl ? 'animated' : '']"
                    mode="widthFix"
                    @touchstart="recordTouchstart"
                    @touchcancel="recordTouchcancel"
                    @touchend="recordTouchend"
                ></image>
                <image :src="next" :class="['pulse animated loop']" v-if="recordUrl" mode="widthFix" @click="nextPage"></image>
            </view>
            <view class="tipRecording">长按说话</view>
        </view>
        <!-- answer为文字 -->
        <view v-if="requestDataQuestion.answer_type == 2">
            <!-- 文字2个答案 单选-->
            <view class="answer_area_2" v-if="requestDataQuestion.answers.length == 2">
                <view class="select_area">
                    <view v-for="(e, i) in requestDataQuestion.answers" :key="i" @click="singelChooseActiveFn(e, i)">
                        <view v-if="showAnswer" :class="['everyBtn', e.correct ? 'btnChoiceStyleRight' : 'btnChoiceStyleWrong']">
                            <view class="point_text">
                                <image :src="e.correct ? right : wrong"></image>
                            </view>
                            <view class="idx_text">{{e.data}}</view>
                        </view>
                        <view v-else :class="['everyBtn', e.chooseActive ? 'btnChoiceStyle_2' : '']">
                            <view class="idx_title">{{i + 1}}</view>
                            <view class="idx_text">{{e.data}}</view>
                        </view>
                    </view>
                </view>
                <image :src="next" v-if="isNextLight" class="nextpage_image" @click="submitNextPage"></image>
                <image :src="nextGray" v-else class="nextpage_image"></image>
            </view>
            <!-- 文字4个、6个答案 注：4道文字题可能是单选也可能是多选 6道文字题必为多选-->
            <view class="answer_area" v-else>
                <view class="select_area">
                    <view v-for="(e, i) in requestDataQuestion.answers" :key="i" :class="['everyBtn', 'btnW' + requestDataQuestion.answers.length, e.chooseActive ? 'btnChoiceStyle' : '']" @click="requestDataQuestion.correct_count == 1 ? singelChooseActiveFn(e, i) : multipleChooseActiveFn(e, i)">
                        <image :src="e.correct ? right : wrong" v-if="showAnswer" class="point_text"></image>
                        <image :src="calc_radius" v-else class="point_text"></image>
                        {{e.data}}
                    </view>
                </view>
                <image :src="next" v-if="isNextLight" class="nextpage_image" @click="submitNextPage"></image>
                <image :src="nextGray" v-else class="nextpage_image"></image>
            </view>
        </view>
        <!-- 答案是2张图片 单选 -->
        <view class="answer_area_image" v-if="requestDataQuestion.answer_type == 3">
            <view class="choose_cont">
                <view v-for="(e, i) in requestDataQuestion.answers" :key="i" :class="['commonBtn']" @click="singelChooseActiveFn(e, i)">
                    <view v-if="showAnswer" :class="['mainImg', e.correct ? 'btnImgChoiceRight' : 'btnImgChoiceWrong']">
                        <image :src="e.data"></image>
                    </view>
                    <view v-else :class="['mainImg', e.chooseActive ? 'btnImgChoiceStyle' : '']">
                        <image :src="e.data"></image>
                    </view>
                    <image class="correctAnswer" v-if="showAnswer" :src="e.correct ? right : wrong"></image>
                    <view class="serialNumber" v-else>{{i + 1}}</view>
                </view>
            </view>
            <image :src="next" v-if="isNextLight" class="nextpage_image" @click="submitNextPage"></image>
            <image :src="nextGray" v-else class="nextpage_image"></image>
        </view>
    </view>
</template>
<script>
import { setTimeout } from 'timers';
import { animation } from '../utils/uiUtils';
export default {
    props: {
        showPanel: {
            default: false
        },
        requestDataQuestion: {
            default: []
        },
        recordUrl: {
            default: ''
        },
        isLearningDone: {
            default: false
        }
    },
    data () {
        return {
            showAnswer: false, //点提交后显示答案且不允许再选题
            isNextLight: false, //是否亮起下一步按钮
            isHeadImage: false, //是否有顶部图片
            isHeadText: false, //是否有title
            question_id: 0, //第id题
            right: require('../images/icon-true.png'),
            wrong: require('../images/icon-wrong.png'),
            skipImage: require('../images/AAA/skip_text.png'),
            nextGray: require('../images/AAA/next_gray.png'),
            next: require('../images/AAA/next.png'),
            calc_radius: require('../images/AAA/cale-radius.png'),
            microphone: require('../images/AAA/microphone.png'),
            playingSrc: require('../images/AAA/play-0.png'),
            playingSrc1: require('../images/AAA/play-1.png'),
            playingSrc2: require('../images/AAA/play-2.png'),

            chooseAnswerRandom: [], //选择的随机答案
        }
    },
    state: {
        playingAnimation: null, //播放录音动画实例
        voiceContext: null, //播放录音音频实例
    },
    onLoad () {
        console.warn(this.requestDataQuestion)
        console.warn('recordUrl:', this.recordUrl)
        this.playingSrc0 = this.playingSrc;
        const {answer_type, image = '', text = '', id = 0} = this.requestDataQuestion;
        this.isHeadImage = image;
        this.isHeadText = text;
        this.question_id = id;
    },
    onShow () {
        
    },
    watch: {
        requestDataQuestion (value) {
           console.error(value)
           if (value) {
               const {answer_type, image = '', text = '', id = 0} = value;
               this.isHeadImage = image;
               this.isHeadText = text;
               this.question_id = id;
           }
       }
    },
    onUnload () {

    },
    methods: {
        /* 播放录音 */
        playRecord () {
            if (!this.$options.state.playingAnimation) {
                this.$options.state.playingAnimation = animation({
                    files: [this.playingSrc, this.playingSrc1, this.playingSrc2].reverse(),
                    context: this,
                    fps: 7,
                    data: ['playingSrc']
                });
            } else {
                this.$options.state.playingAnimation.play();
            }
            this.$options.state.voiceContext = playVoice(this.recordUrl, () => {
                this.stopPlayingAni();
            });
        },
        /* 停止动画 */
        stopPlayingAni() {
            if (this.$options.state.playingAnimation) {
                this.$options.state.playingAnimation.stop(() => {
                    this.playingSrc = this.playingSrc0;
                });
            }
        },
        /*单选题事件 */
        singelChooseActiveFn (e, i) {
            console.log('单选事件')
            let chooseAnswerRandom = [];
            if (this.showAnswer) return; //点提交以后不允许选题了
            this.requestDataQuestion.answers.forEach((ex, idx) => {
                if (idx === i) {
                    this.$set(ex, `chooseActive`, ex.chooseActive ? false : true)
                } else {
                    this.$set(ex, `chooseActive`, false)
                }
                chooseAnswerRandom.push(ex.chooseActive || false);
            })
            this.isNextLight = chooseAnswerRandom.includes(true) ? true : false;
            this.chooseAnswerRandom = chooseAnswerRandom;
        },
        /*多选题选择事件 */
        multipleChooseActiveFn (e, i) {
            console.log('多选事件')
            let chooseAnswerRandom = [];
            if (this.showAnswer) return; //点提交以后不允许选题了
            this.requestDataQuestion.answers.forEach((ex, idx) => {
                if (idx === i) {
                    this.$set(ex, `chooseActive`, ex.chooseActive ? false : true)
                }
                chooseAnswerRandom.push(ex.chooseActive || false);
            })
            this.isNextLight = chooseAnswerRandom.includes(true) ? true : false;
            this.chooseAnswerRandom = chooseAnswerRandom;
        },
        /* 提交 单多选 */
        submitNextPage () {
            this.showAnswer = true;
            this.isNextLight = false; //下一步按钮灰掉
            console.log(this.filterChoiceAnswer());
            setTimeout(() => {//两秒后下一题
                this.$emit('submitNextPage');
                // 恢复默认状态
                this.showAnswer = false;
                this.requestDataQuestion.answers.forEach((ex, idx) => {
                    this.$set(ex, `chooseActive`, false)
                })
            }, 2000)
        },
        /* 跳过 */
        skipHandle () {
            this.$emit('submitNextPage');
        },
        /* 录音下一页 */
        nextPage () {
            this.$emit('submitNextPage');
        },
        /**筛选出选择的答案 */
        filterChoiceAnswer () {
            let chooseAnswer = [];
            this.chooseAnswerRandom.forEach((item, idx) => {
               if (item) chooseAnswer.push({data: this.requestDataQuestion.answers[idx].data});
            })
            return chooseAnswer;
        }
    }
}
</script>

<style lang="less">
    .abs(@top:0, @left:0, @x:0, @y:0) {
        position:absolute;
        top:@top;
        left:@left;
        transform: translate(@x, @y);
    }
   .showPanel{
       width:100vw;
       height:100vh;
       position: fixed;
       top:0;
       left:0;
       z-index:2;
       background:#fff;
       margin:0 auto;
       image{
           display:block;
       }
   }
   .header_image{
       width:100%;
       height:386rpx;
   }
   .timeCountdownProgressBar{
        width:100vw;
        display:flex;
        .abs(386rpx);
        .progressBar{
            width:50vw;
        }
    }
    .question_content{
        height:70rpx + 136rpx;
        // background:#ccc;
        padding:30rpx 30rpx 0 30rpx;
        .page_idx_cont{
            height:68rpx;
            display:flex;
            align-items:center;
            margin-bottom:2rpx;
            .page_idx{
                padding:0 24rpx;
                height:54rpx;
                background:rgba(255,149,0,1);
                border-radius:32rpx;
                text-align:center;
                line-height:54rpx;
                font-size:28rpx;
                font-weight:500;
                color:rgba(255,255,255,1);
                margin-right:10rpx;
            }
            .skipBtn{
                width:258rpx;
                height:68rpx;
            }
        }
        .question_title{
            height:136rpx;
            font-size:44rpx;
            font-weight:500;
            color:rgba(0,0,0,1);
            line-height:60rpx;
        }
        .bigTextSesc{
            font-size:54rpx;
            line-height:76rpx;
        }
    }
    .courserecord-footer{
        @baseW:216rpx;
        width:@baseW*3;
        height:@baseW + 50rpx;
        position: absolute;
        bottom:60rpx;
        left:50%;
        transform: translateX(-50%);
        .imgCont{
            width:100%;
            height:@baseW;
            display:flex;
            image{
                width:@baseW;
                height:@baseW;
            }
        }
        .tipRecording{
            width:100%;
            height:40rpx;
            line-height:40rpx;
            margin-top:10rpx;
            text-align:center;
            color:rgba(143,174,190,1);
            font-size:28rpx;
        }
    }
    .answer_area{
        width:698rpx;
        height:352rpx;
        padding:0 26rpx 40rpx 26rpx;
        // background:#ccc;
        position:absolute;
        bottom:0;
        left:0;
        .select_area{
            height:180rpx;
            display:flex;
            justify-content: space-between;
            flex-wrap: wrap;
            align-content:flex-start;
            overflow:hidden;
            .everyBtn{
                margin-bottom:20rpx;
                width:220rpx;
                height:80rpx;
                line-height:80rpx;
                box-sizing: border-box;
                background:#FFF9DA;
                border:4rpx solid rgba(255,215,56,1);
                border-radius:61rpx;
                display:flex;
                align-items: center;
                font-size:32rpx;
                color:rgba(101,70,0,1);
                position: relative;
                .point_text{
                    width:36rpx;
                    height:36rpx;
                    display: block;
                    margin-left:16rpx;
                    margin-right:12rpx;
                }
            }
            .btnW2{
                width:670rpx;
                height:157rpx;
                border-radius:78rpx;
                border:3px solid rgba(179,200,211,0.5);
                background:rgba(255,255,255,1);
            }
            .btnW4{
                width:326rpx;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .btnW6{
                width:220rpx;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .btnChoiceStyle{
                background: #FFD738;
            }
        }
    }
    .answer_area_2{
        width:670rpx;
        height:525rpx;
        // background:#ccc;
        position:absolute;
        bottom:0;
        left:50%;
        transform: translateX(-50%);
        .select_area{
            height:344rpx;
            overflow:hidden;
            .everyBtn{
                margin-bottom:30rpx;
                width:670rpx;
                height:157rpx;
                line-height:38rpx;
                box-sizing: border-box;
                background:#fff;
                border:3rpx solid rgba(179,200,211,0.5);
                border-radius:78rpx;
                display:flex;
                align-items: center;
                font-size:27rpx;
                color:rgba(0,0,0,1);
                position: relative;
                .point_text{
                    width:106rpx;
                    height:36rpx;
                    image{
                        width:36rpx;
                        height:36rpx;
                        margin:0 auto;
                    }
                }
                .idx_title{
                    width:106rpx;
                    height:38rpx;
                    text-align:center;
                }
                .idx_text{
                    width:530rpx;
                    overflow:hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                }
            }
            .btnChoiceStyle_2{
                border:3rpx solid #FFD738;
            }
            .btnChoiceStyleRight{
                background:#4CD964;
                border:3rpx solid #4CD964;
            }
            .btnChoiceStyleWrong{
                background:#FF7870;
                border:3rpx solid #FF7870;
            }
        }
    }
    .nextpage_image{
        width:172rpx;
        height:172rpx;
        display: block;
        margin:0 auto;
    }
    .answer_area_image{
        width:423rpx;
        height:570rpx;
        // background: red;
        position: absolute;
        bottom:0;
        left:50%;
        transform: translateX(-50%);
        .choose_cont{
            width:100%;
            height:394rpx;
            .commonBtn{
                width:100%;
                height:184rpx; 
                margin-bottom:26rpx;
                position: relative;
                .serialNumber{
                    .abs();
                    width:48rpx;
                    height:48rpx;
                    font-size:35rpx;
                    background:#4C4C4C;
                    color:rgba(255,255,255,1);
                    line-height:48rpx;
                    text-align:center;
                    border-radius:100%;
                }
                .correctAnswer{
                    .abs();
                    width:48rpx;
                    height:48rpx;
                }
                .mainImg{
                    width:100%;
                    height:100%;
                    border-radius:62rpx;
                    position: absolute;
                    border:3rpx solid rgba(179,200,211,0.5);
                    box-sizing: border-box;
                    overflow: hidden;
                    image{
                        width:100%;
                        height:100%;
                    }
                }
                .btnImgChoiceStyle{
                    border:6rpx solid #FFD738;
                }
                .btnImgChoiceRight{
                    border:6rpx solid #4CD964;
                }
                .btnImgChoiceWrong{
                    border:6rpx solid #FF7870;
                }
            }
        }
    }

    @-webkit-keyframes fadeInUpBig {
        from {
            opacity: 0;
            -webkit-transform: translate3d(0, 2000px, 0);
            transform: translate3d(0, 2000px, 0);
        }

        to {
            opacity: 1;
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }
        }

        @keyframes fadeInUpBig {
        from {
            opacity: 0;
            -webkit-transform: translate3d(0, 2000px, 0);
            transform: translate3d(0, 2000px, 0);
        }

        to {
            opacity: 1;
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }
        }

        .fadeInUpBig {
        -webkit-animation-name: fadeInUpBig;
        animation-name: fadeInUpBig;
        }
        .animated {
        -webkit-animation-duration: 1s;
        animation-duration: 1s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        }

        @-webkit-keyframes fadeOutDownBig {
            from {
                opacity: 1;
            }

            to {
                opacity: 0;
                -webkit-transform: translate3d(0, 2000px, 0);
                transform: translate3d(0, 2000px, 0);
            }
        }

        @keyframes fadeOutDownBig {
            from {
                opacity: 1;
            }

            to {
                opacity: 0;
                -webkit-transform: translate3d(0, 2000px, 0);
                transform: translate3d(0, 2000px, 0);
            }
    }

    .fadeOutDownBig {
        -webkit-animation-name: fadeOutDownBig;
        animation-name: fadeOutDownBig;
    }
    .visiblity_hidden{
        visibility:hidden;
    }
    @media(min-width:480px) {
        .question_content{
            height:126rpx;
            width:420rpx;
            padding:30rpx 0 0 0;
            margin:0 auto;
            .page_idx_cont{
                height:42rpx;
                margin-bottom:1rpx;
                .page_idx{
                    padding:0 15rpx;
                    height:33rpx;
                    border-radius:20rpx;
                    line-height:33rpx;
                    font-size:17rpx;
                    margin-right:4rpx;
                }
                .skipBtn{
                    width:160rpx;
                    height:42rpx;
                }
            }
            .question_title{
                height:83rpx;
                font-size:27rpx;
                line-height:37rpx;
            }
            .bigTextSesc{
                font-size:33rpx;
                line-height:46rpx;
            }
        }
        .courserecord-footer{
            @baseW:132rpx;
            width:@baseW*3;
            height:@baseW + 30rpx;
            bottom:30rpx;
            .imgCont{
                height:@baseW;
                image{
                    width:@baseW;
                    height:@baseW;
                }
            }
            .tipRecording{
                height:24rpx;
                line-height:24rpx;
                margin-top:6rpx;
                font-size:17rpx;
            }
        }
        .answer_area{
            width:420rpx;
            height:240rpx;
            padding:0;
            bottom:0;
            left:50%;
            transform: translateX(-50%);
            .select_area{
                height:113rpx;
                .everyBtn{
                    width:134rpx;
                    margin-bottom:13rpx;
                    height:49rpx;
                    line-height:49rpx;
                    border:2rpx solid rgba(255,215,56,1);
                    border-radius:37rpx;
                    font-size:20rpx;
                    .point_text{
                        width:22rpx;
                        height:22rpx;
                        margin-left:10rpx;
                        margin-right:7rpx;
                    }
                }
                .btnW2{
                    width:199rpx;
                }
                .btnW4{
                    width:199rpx;
                }
                .btnW6{
                    width:134rpx;
                }
                .btnChoiceStyle{
                    background: #FFD738;
                }
            }
        }
        .nextpage_image{
            width:105rpx;
            height:105rpx;
        }
        .answer_area_image{
            width:324rpx;
            height:438rpx;
            .choose_cont{
                height:303rpx;
                .commonBtn{
                    height:141rpx; 
                    margin-bottom:21rpx;
                    .serialNumber{
                        width:35rpx;
                        height:35rpx;
                        line-height:35rpx;
                        font-size:27rpx;
                    }
                    .correctAnswer{
                        width:35rpx;
                        height:35rpx;
                    }
                    .mainImg{
                        border-radius:42rpx;
                        border:2rpx solid rgba(179,200,211,0.5);
                    }
                    .btnImgChoiceStyle{
                        border:4rpx solid #FFD738;
                    }
                    .btnImgChoiceRight{
                        border:4rpx solid #4CD964;
                    }
                    .btnImgChoiceWrong{
                        border:4rpx solid #FF7870;
                    }
                }
            }
        }
        .answer_area_2{
            width:409rpx;
            height:350rpx;
            .select_area{
                height:210rpx;
                .everyBtn{
                    margin-bottom:18rpx;
                    width:409rpx;
                    height:96rpx;
                    line-height:23rpx;
                    border:2rpx solid rgba(179,200,211,0.5);
                    border-radius:48rpx;
                    font-size:17rpx;
                    .point_text{
                        width:64rpx;
                    }
                    .idx_title{
                        width:64rpx;
                        height:23rpx;
                    }
                    .idx_text{
                        width:328rpx;
                    }
                }
                .btnChoiceStyle_2{
                    border:2rpx solid #FFD738;
                }
                .btnChoiceStyleRight{
                    background:#4CD964;
                    border:2rpx solid #4CD964;
                }
                .btnChoiceStyleWrong{
                    background:#FF7870;
                    border:2rpx solid #FF7870;
                }
            }
        }
    }
</style>

