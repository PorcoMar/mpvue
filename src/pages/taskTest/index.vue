<script>
import card from "@/components/card";
import { setTimeout } from 'timers';
let count = 1;
export default {
    data() {
        return {
            arrayCont: [0],
            isLoad: true,
            showLoading: true,
            scrollTopY: 0,
            setScrollTop: 0,
        };
    },
    created() {},
    onLoad() {
        this.pushCont();
    },
    onShow() {
        this.pushCont();
    },
    mounted() {},
    computed: {},
    watch: {
        isLoad (val) {
            console.log('isLoad:', val)
        },
        scrollTopY(val) {
            console.log(val)
        }
    },
    components: {},
    methods: {
        async pushCont() {
            count ++;
            return new Promise((resolve) => {
                if (count > 8) {
                    this.showLoading = false;
                    resolve('');
                } else {
                    setTimeout(() => {
                        let p = this.arrayCont[this.arrayCont.length - 1];
                        for (let i = p + 1; i <= p + 10; i++) {
                            this.arrayCont.push(i);
                        }
                        console.log(this.arrayCont);
                        resolve('delay');
                    }, 2000)
                }
            })
        },
        async scrollToBttom(e) {
            console.log('触底')
            // console.log('setScrollTop', this.setScrollTop)
            if (this.isLoad) {
                this.isLoad = false;
                let result = await this.pushCont();
                if (result === 'delay') {
                    setTimeout(() => {
                        this.isLoad = true;
                    }, 50)
                }
            }
        },
        scrollTop (e) {
            this.scrollTopY = e.target.scrollTop;
            // console.log(this.scrollTopY)
        }
    }
};
</script>

<template>
    <div class="container">
        <scroll-view class="scropContent" scroll-y @scrolltolower="scrollToBttom" @scroll="scrollTop">
            <view class="singelCont" v-for="(e,i) in arrayCont" :key="i">
                <p>{{e}}</p>
            </view>
            <image v-if="showLoading" src="http://www.sucaijishi.com/uploadfile/2013/0527/20130527034923893.gif" style="display:block;margin:0 auto;width:50px;height:50px;"></image>
            <view v-else style="text-align:center;">--没有更多了--</view>
        </scroll-view>
    </div>
</template>

<style scope>
.container {
    width: 100vw;
    height: 100vh;
    background: #ccc;
    position: relative;
}
.scropContent {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 80%;
    border: 1rpx solid red;
}
.singelCont {
    text-align: center;
    border-bottom: 1rpx solid blue;
}
</style>
