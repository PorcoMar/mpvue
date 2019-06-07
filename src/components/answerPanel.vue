<template>
    <view :class="[showPanel ? 'fadeInUpBig' : '', 'animated', 'showPanel']" v-if="showPanel">
        <view class="question_content">
            <view class="page_idx_cont">
                <view class="page_idx" v-if="question_id">第 {{question_id}} 题</view>
                <image class="skipBtn" v-if="isLearningDone" :src="skipImage" @click="skipHandle"></image>
            </view>
            <view :class="['question_title', !isHeadImage ? 'bigTextSesc' : '']" v-if="isHeadText">{{isHeadText}}</view>
        </view>
        <image class="header_image" :src="isHeadImage" v-if="isHeadImage"></image>
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
            next: require('../images/AAA/next.png'),
            nextGray: require('../images/AAA/next_gray.png'),
            skipImage: require('../images/AAA/skip_text.png'),
            calc_radius: require('../images/AAA/cale-radius.png'),
            microphone: require('../images/AAA/microphone.png'),
            playingSrc: require('../images/AAA/play-0.png'),
            playingSrc1: require('../images/AAA/play-1.png'),
            playingSrc2: require('../images/AAA/play-2.png'),

            chooseAnswerRandom: [], //选择的随机答案
        }
    },
    state: {
        countdownTimer: null,
        videoContext: null
    },
    onLoad () {
        console.warn(this.requestDataQuestion)
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
        clearInterval(this.$options.state.countdownTimer);
    },
    methods: {
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
    @vh:319;
    .abs(@top:0, @left:0, @x:0, @y:0) {
        position:absolute;
        top:@top;
        left:@left;
        transform: translate(@x, @y);
    }
   .showPanel{
       @w:568/@vh*100vh;
       width:@w;
       height:264/@vh*100vh;
       position: fixed;
       bottom:0;
       left:50%;
       margin-left:-@w/2;
       z-index:2;
       background:rgba(255,255,255,1);
       box-shadow:0px 9rpx 11px 0px rgba(10,31,68,0.1),0px 0px 1rpx 0px rgba(10,31,68,0.08);
       border-radius:22rpx 22rpx 0px 0px;
       overflow: hidden;
       image{
           display:block;
       }
   }
   .header_image{
       width:170/@vh*100vh;
       height:128/@vh*100vh;
       border-radius:14/@vh*100vh;
       margin-top:13/@vh*100vh;
       margin-left:34/@vh*100vh;
   }
    .question_content{
        width:215/@vh*100vh;
        min-height:71/@vh*100vh;
        margin-left:34/@vh*100vh;
        margin-top:23/@vh*100vh;
        .page_idx_cont{
            height:29/@vh*100vh;
            display:flex;
            align-items:center;
            .page_idx{
                padding:0 10/@vh*100vh;
                height:23/@vh*100vh;
                background:rgba(255,149,0,1);
                border-radius:14/@vh*100vh;
                text-align:center;
                line-height:23/@vh*100vh;
                font-size:12/@vh*100vh;
                font-weight:500;
                color:rgba(255,255,255,1);
                margin-right:4/@vh*100vh;
            }
            .skipBtn{
                width:110/@vh*100vh;
                height:29/@vh*100vh;
            }
        }
        .question_title{
            width:100%;
            height:41/@vh*100vh;
            font-size:14/@vh*100vh;
            font-weight:500;
            color:rgba(0,0,0,1);
            line-height:20/@vh*100vh;
            margin-top:2/@vh*100vh;
        }
        .bigTextSesc{
            font-size:20/@vh*100vh;
            line-height:27/@vh*100vh;
            margin-top:8/@vh*100vh;
        }
    }
    .courserecord-footer{
        @baseW:92/@vh*100vh;
        width:@baseW*3;
        height:@baseW + 21/@vh*100vh;
        position: absolute;
        bottom:26/@vh*100vh;
        right:13/@vh*100vh;
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
            height:17/@vh*100vh;
            line-height:17/@vh*100vh;
            margin-top:4/@vh*100vh;
            text-align:center;
            color:rgba(143,174,190,1);
            font-size:12/@vh*100vh;
        }
    }
    .answer_area{
        width:313/@vh*100vh;
        height:150/@vh*100vh;
        position:absolute;
        bottom:0;
        right:0;
        .select_area{
            height:77/@vh*100vh;
            display:flex;
            flex-wrap: wrap;
            align-content:flex-start;
            overflow:hidden;
            .everyBtn{
                margin-bottom:9/@vh*100vh;
                height:34/@vh*100vh;
                line-height:34/@vh*100vh;
                box-sizing: border-box;
                background:#FFF9DA;
                border:4rpx solid rgba(255,215,56,1);
                border-radius:26/@vh*100vh;
                display:flex;
                align-items: center;
                font-size:14/@vh*100vh;
                color:rgba(101,70,0,1);
                position: relative;
                .point_text{
                    @w:15/@vh*100vh;
                    width:@w;
                    height:@w;
                    margin-left:7/@vh*100vh;
                    margin-right:9/@vh*100vh;
                }
            }
            .btnW4{
                width:139/@vh*100vh;
                margin-right:14/@vh*100vh;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .btnW6{
                width:94/@vh*100vh;
                margin-right:9/@vh*100vh;
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
        width:285/@vh*100vh;
        height:224/@vh*100vh;
        position:absolute;
        bottom:0;
        right:26/@vh*100vh;
        .select_area{
            height:147/@vh*100vh;
            overflow:hidden;
            .everyBtn{
                margin-bottom:13/@vh*100vh;
                width:285/@vh*100vh;
                height:67/@vh*100vh;
                line-height:16/@vh*100vh;
                box-sizing: border-box;
                background:#fff;
                border:3rpx solid rgba(179,200,211,0.5);
                border-radius:33/@vh*100vh;
                display:flex;
                align-items: center;
                font-size:12/@vh*100vh;
                color:rgba(0,0,0,1);
                position: relative;
                .point_text{
                    width:45/@vh*100vh;
                    height:16/@vh*100vh;
                    image{
                        width:16/@vh*100vh;
                        height:16/@vh*100vh;
                        margin:0 auto;
                    }
                }
                .idx_title{
                    width:45/@vh*100vh;
                    height:16/@vh*100vh;
                    text-align:center;
                }
                .idx_text{
                    width:229/@vh*100vh;
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
        width:73/@vh*100vh;
        height:73/@vh*100vh;
        margin-left: 113/@vh*100vh;
    }
    .answer_area_image{
        width:161/@vh*100vh;
        height:226/@vh*100vh;
        position: absolute;
        bottom:0;
        right:74/@vh*100vh;
        .choose_cont{
            width:100%;
            height:153/@vh*100vh;
            .commonBtn{
                width:100%;
                height:70/@vh*100vh; 
                margin-bottom:13/@vh*100vh;
                position: relative;
                @wh: 17/@vh*100vh;
                .serialNumber{
                    .abs();
                    width:@wh;
                    height:@wh;
                    line-height:@wh;
                    font-size:13/@vh*100vh;
                    background:#4C4C4C;
                    color:rgba(255,255,255,1);
                    text-align:center;
                    border-radius:100%;
                }
                .correctAnswer{
                    .abs();
                    width:@wh;
                    height:@wh;
                }
                .mainImg{
                    width:100%;
                    height:100%;
                    border-radius:21/@vh*100vh;
                    position: absolute;
                    border:2rpx solid rgba(179,200,211,0.5);
                    box-sizing: border-box;
                    overflow: hidden;
                    image{
                        width:100%;
                        height:100%;
                    }
                }
                .btnImgChoiceStyle{
                    border:4rpx solid #FFD738;
                    border-radius:23/@vh*100vh;
                }
                .btnImgChoiceRight{
                    border:4rpx solid #4CD964;
                }
                .btnImgChoiceWrong{
                    border:4rpx solid #FF7870;
                }
            }
        }
        .nextpage_image{
            width:73/@vh*100vh;
            height:73/@vh*100vh;
            margin:0 auto;
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
    @media(min-height:480px) {
        @vh:426;
        .showPanel{
            @w:568/@vh*100vh;
            width:@w;
            height:391/@vh*100vh;
            margin-left:-@w/2;
            box-shadow:0px 7rpx 9rpx 0px rgba(10,31,68,0.1),0px 0px 1px 0px rgba(10,31,68,0.08);
            border-radius:17rpx 17rpx 0px 0px;
        }
        .header_image{
            width:170/@vh*100vh;
            height:128/@vh*100vh;
            border-radius:14/@vh*100vh;
            margin-top:13/@vh*100vh;
            margin-left:34/@vh*100vh;
        }
        .question_content{
            width:215/@vh*100vh;
            min-height:71/@vh*100vh;
            margin-left:34/@vh*100vh;
            margin-top:90/@vh*100vh;
            .page_idx_cont{
                height:24/@vh*100vh;
                .page_idx{
                    padding:0 11/@vh*100vh;
                    height:24/@vh*100vh;
                    border-radius:14/@vh*100vh;
                    line-height:24/@vh*100vh;
                    margin-right:7/@vh*100vh;
                    font-size:12/@vh*100vh;
                }
                .skipBtn{
                    width:89/@vh*100vh;
                    height:24/@vh*100vh;
                }
            }
            .question_title{
                font-size:14/@vh*100vh;
                line-height:21/@vh*100vh;
                margin-top:3/@vh*100vh;
            }
            .bigTextSesc{
                font-size:23/@vh*100vh;
                line-height:33/@vh*100vh;
                margin-top:8/@vh*100vh;
            }
        }
        .courserecord-footer{
            @baseW:94/@vh*100vh;
            width:@baseW*3;
            height:@baseW + 21/@vh*100vh;
            bottom:105/@vh*100vh;
            right:9/@vh*100vh;
            .imgCont{
                height:@baseW;
                image{
                    width:@baseW;
                    height:@baseW;
                }
            }
            .tipRecording{
                width:100%;
                height:17/@vh*100vh;
                line-height:17/@vh*100vh;
                margin-top:4/@vh*100vh;
                font-size:12/@vh*100vh;
            }
        }
        .answer_area{
            width:313/@vh*100vh;
            height:150/@vh*100vh;
            bottom:97/@vh*100vh;
            .select_area{
                height:78/@vh*100vh;
                .everyBtn{
                    margin-bottom:8/@vh*100vh;
                    height:35/@vh*100vh;
                    line-height:35/@vh*100vh;
                    border:3rpx solid rgba(255,215,56,1);
                    border-radius:26/@vh*100vh;
                    font-size:14/@vh*100vh;
                    .point_text{
                        @w:16/@vh*100vh;
                        width:@w;
                        height:@w;
                        margin-left:7/@vh*100vh;
                        margin-right:9/@vh*100vh;
                    }
                }
                .btnW4{
                    width:141/@vh*100vh;
                    margin-right:14/@vh*100vh;
                }
                .btnW6{
                    width:94/@vh*100vh;
                    margin-right:8/@vh*100vh;
                }
            }
        }
        .answer_area_2{
            width:291/@vh*100vh;
            height:228/@vh*100vh;
            bottom:82/@vh*100vh;
            right:21/@vh*100vh;
            .select_area{
                height:149/@vh*100vh;
                .everyBtn{
                    margin-bottom:13/@vh*100vh;
                    width:291/@vh*100vh;
                    height:67/@vh*100vh;
                    line-height:17/@vh*100vh;
                    border:2rpx solid rgba(179,200,211,0.5);
                    border-radius:34/@vh*100vh;
                    font-size:12/@vh*100vh;
                    .point_text{
                        width:46/@vh*100vh;
                        height:17/@vh*100vh;
                        image{
                            width:17/@vh*100vh;
                            height:17/@vh*100vh;
                        }
                    }
                    .idx_title{
                        width:46/@vh*100vh;
                        height:17/@vh*100vh;
                    }
                    .idx_text{
                        width:233/@vh*100vh;
                    }
                }
                .btnChoiceStyle_2{
                    border:2rpx solid #FFD738;
                }
                .btnChoiceStyleRight{
                    border:2rpx solid #4CD964;
                }
                .btnChoiceStyleWrong{
                    border:2rpx solid #FF7870;
                }
            }
        }
        .nextpage_image{
            width:75/@vh*100vh;
            height:75/@vh*100vh;
            margin-left: 114/@vh*100vh;
        }
        .answer_area_image{
            width:164/@vh*100vh;
            height:229/@vh*100vh;
            bottom:65/@vh*100vh;
            right:66/@vh*100vh;
            .choose_cont{
                height:155/@vh*100vh;
                .commonBtn{
                    height:71/@vh*100vh; 
                    margin-bottom:13/@vh*100vh;
                    @wh: 17/@vh*100vh;
                    .serialNumber{
                        width:@wh;
                        height:@wh;
                        line-height:@wh;
                        font-size:14/@vh*100vh;
                    }
                    .correctAnswer{
                        width:@wh;
                        height:@wh;
                    }
                    .mainImg{
                        border-radius:21/@vh*100vh;
                        border:2rpx solid rgba(179,200,211,0.5);
                    }
                    .btnImgChoiceStyle{
                        border:3rpx solid #FFD738;
                        border-radius:23/@vh*100vh;
                    }
                    .btnImgChoiceRight{
                        border:3rpx solid #4CD964;
                    }
                    .btnImgChoiceWrong{
                        border:3rpx solid #FF7870;
                    }
                }
            }
            .nextpage_image{
                width:75/@vh*100vh;
                height:75/@vh*100vh;
                margin:0 auto;
            }
        }
    }
</style>

