<template>
  <div>
    <canvas class="canvas_c1" canvas-id="bubble"></canvas>
    <canvas class="canvas_c1" canvas-id="bubble2"></canvas>
    <canvas class="canvas_c1" canvas-id="bubble3"></canvas>
    <canvas class="canvas_c1" canvas-id="bubble4"></canvas>
    <canvas class="canvas_c1" canvas-id="bubble5"></canvas>
  </div>
</template>

<script>
const queue = {};
let timer = 0;
let ctx1 = null;
let ctx2 = null;
let ctx3 = null;
let ctx4 = null;
let ctx5 = null;
export default {
  props: {
    count: {
      default: 0
    },
    count2: {
      default: 0
    },
    count3: {
      default: 0
    },
    count4: {
      default: 0
    },
    count5: {
      default: 0
    },
  },
  data(){
  	return {
      sessionValue: 0,
  	}
  },
  onLoad(){
    ctx1 = wx.createCanvasContext("bubble", this);
    ctx2 = wx.createCanvasContext("bubble2", this);
    ctx3 = wx.createCanvasContext("bubble3", this);
    ctx4 = wx.createCanvasContext("bubble4", this);
    ctx5 = wx.createCanvasContext("bubble5", this);
  },
  watch: {
    count (n, o) {
        if (n > o) {
          this.likeClick(1);
        }
    },
    count2 (n, o) {
      if (n > o) {
        this.likeClick(2);
      }
    },
    count3 (n, o) {
      if (n > o) {
        this.likeClick(3);
      }
    },
    count4 (n, o) {
      if (n > o) {
        this.likeClick(4);
      }
    },
    count5 (n, o) {
      if (n > o) {
        this.likeClick(5);
      }
    },
  },
  detached() {
    if (timer) {
      clearTimeout(timer);
    }
  },
  methods: {
    likeClick(v) {
    //   const image1 = require("./images/1.png");
    //   const image2 = require("./images/2.png");
    //   const image3 = require("./images/3.png");
    //   const image4 = require("./images/4.png");
    //   const image5 = require("./images/5.png");
      const anmationData = {
          id: new Date().getTime(),
          timer: 0,
          opacity: 0,
          pathData: this.generatePathData(),
          image: [],
          imageIndex:Math.floor(Math.random() * (4 - 0 + 1)) + 0,
          factor: {
              speed: 0.03, // 运动速度，值越小越慢
              t: 0 //  贝塞尔函数系数
          }
      };

      if (this.sessionValue === v) {
        if (Object.keys(queue).length > 0) {
            queue[anmationData.id] = anmationData;
        } else {
            queue[anmationData.id] = anmationData;
            this.bubbleAnimate(v);
        }
      } else {
        if (!Object.keys(queue).length) {
          queue[anmationData.id] = anmationData;
          this.bubbleAnimate(v);
        }
      }
    },

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    generatePathData() {
      const {px, py} = {px: 20, py: 50}
      const p0 = { x: px, y: py };
      const p1 = {
        x: this.getRandom(px * .5, py * .75), y: this.getRandom(py * .5, py * .75)
      };
      const p2 = {
        x: this.getRandom(0, px * 2), y: this.getRandom(py * .25, py * .5)
      };
      const p3 = {
        x: this.getRandom(0, px * 2), y: this.getRandom(0, py * .1)
      };
      return [p0, p1, p2, p3];
    },
    updatePath(data, factor) {
      const p0 = data[0]; // 三阶贝塞尔曲线起点坐标值
      const p1 = data[1]; // 三阶贝塞尔曲线第一个控制点坐标值
      const p2 = data[2]; // 三阶贝塞尔曲线第二个控制点坐标值
      const p3 = data[3]; // 三阶贝塞尔曲线终点坐标值

      const t = factor.t;

      /*计算多项式系数*/
      const cx1 = 3 * (p1.x - p0.x);
      const bx1 = 3 * (p2.x - p1.x) - cx1;
      const ax1 = p3.x - p0.x - cx1 - bx1;

      const cy1 = 3 * (p1.y - p0.y);
      const by1 = 3 * (p2.y - p1.y) - cy1;
      const ay1 = p3.y - p0.y - cy1 - by1;

      /*计算xt yt的值 */
      const x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x;
      const y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y;
      return {
        x,
        y
      };
    },
    ctxIndex(v) {
      return {
        1: ctx1,
        2: ctx2,
        3: ctx3,
        4: ctx4,
        5: ctx5,
      }[v]
    },
    bubbleAnimate(v) {
      Object.keys(queue).forEach(key => {
        const anmationData = queue[+key];
        const { x, y } = this.updatePath(anmationData.pathData, anmationData.factor);
        const speed = anmationData.factor.speed;
        anmationData.factor.t += speed;
        // console.log('imageIndex=>', anmationData.imageIndex);
        this.ctxIndex(v).drawImage(anmationData.image[anmationData.imageIndex], x, y, 40, 40);
        if (anmationData.factor.t > 1) {
          delete queue[anmationData.id];
        }
      });
      this.ctxIndex(v).draw();
      this.sessionValue = v;
      if (Object.keys(queue).length > 0) {
        timer = setTimeout(() => {
          this.bubbleAnimate(v);
        }, 20);
      } else {
        clearTimeout(timer);
        this.ctxIndex(v).draw(); // 清空画面
      }
    }
  },
}
</script>
<style>
.canvas_c1 {
  width:20vw;
  height:180rpx;
  float:left;
  border:1px solid yellow;
  box-sizing: border-box;
}
</style>
