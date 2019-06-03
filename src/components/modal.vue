<template>
    <view class="modal" v-if="show">
        <view class="modal-content tac">
            <view class="modal-header fs18" v-if="title">{{title}}</view>
            <view class="modal-body fs14">{{ contentText }}</view>
            <view class="modal-footer">
                <view class="btn gray touch-acitve fs16" @click="cancel">{{cancelText}}</view>
                <view class="btn green touch-acitve fs16" @click="confirm">{{confirmText}}</view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        show: {
            default: false
        },
        title: {
            default: ''
        },
        contentText: {
            default: ''
        },
        confirmText: {
            default: '确定'
        },
        cancelText: {
            default: '取消'
        }

    },
    methods: {
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm')
        }
    }
}
</script>

<style lang="less">
    .modal{
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, .5);
    }
    .modal-content{
        width: 50%;
        background-color: #fff;
        border-radius: 16rpx;
        overflow: hidden;
    }
    .modal-header{
        padding: 36rpx 0;
        text-align:center;
    }
    .modal-body{
        padding: 30rpx 0;
        text-align:center;
    }
    .modal-footer{
        border-top: 2rpx solid #E5E5E5;
        display: flex;
        .btn{
            height:50rpx;
            line-height:50rpx;
            text-align:center;
            width:50%;
            box-sizing: border-box;
            background-color: #fff;
            border-radius: 0;
            border:0;
        }
        .green{
            border-left: 2rpx solid #E5E5E5;
        }
    }
</style>

