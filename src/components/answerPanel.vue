<template>
    <view class="showAnswerPanel" v-if="showAnswerPanel">
        <view class="question_area"></view>
        <view class="multiple_choice_area">
            <view v-for="(e, i) in multiple_answer" :key="i" :class="['everyBtn', e.chooseActive ? 'btnChoiceStyle' : '']" @click="multipleChooseActiveFn(e, i)">
                <view>{{e.text}}</view>
                <image class="showCorrect" v-if="e.correct && showAnswer" :src="right"></image>
            </view>
            <button @click="submitMultiple">提交</button>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        showAnswerPanel: {
            default: false
        }

    },
    data () {
        return {
            showAnswer: false, //点提交后显示
            right: require('../images/icon-true.png'),
            wrong: require('../images/icon-wrong.png'),
            multiple_answer: [
                {text: '一一一', correct: 1},
                {text: '二二二', correct: 0},
                {text: '三三三', correct: 1},
                {text: '四四四', correct: 0},
                {text: '五五五', correct: 1},
                {text: '六六六', correct: 0},
            ]
        }
    },
    computed () {

    },
    methods: {
        multipleChooseActiveFn (e, i) {
            this.multiple_answer.forEach((ex, idx) => {
                 this.$set(ex, `chooseActive`, idx === i ? true :  ex.chooseActive)
            })
            
        },
        submitMultiple () {
            this.showAnswer = true;
        }
    }
}
</script>

<style lang="less">
   .showAnswerPanel{
       width:100vw;
       height:100vh;
       position: absolute;
       top:0;
       left:0;
       z-index:2;
       background:rgba(0,0,0,.5);
       display: flex;
       justify-content: space-between;
       align-items:center;
   }
   .question_area{
       width:400rpx;
       height:300rpx;
       background:#fff;
   }
   .multiple_choice_area{
       width:300rpx;
       height:300rpx;
       background:#fff;
       display:flex;
       justify-content: space-between;
       flex-wrap: wrap;
       align-content:flex-start;
       .everyBtn{
           width:120rpx;
           height:50rpx;
           line-height:50rpx;
           background:#ccc;
           border-radius:25rpx;
           font-size:20rpx;
           text-align:center;
           position: relative;
            .showCorrect{
                position: absolute;
                width:20rpx;
                height:20rpx;
                bottom:0;
                right:0;
            }
       }
        .btnChoiceStyle{
            background:orange;
        }
   }
</style>

