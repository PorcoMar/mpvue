<script>
import card from '@/components/card'

export default {
  data () {
    return {
      motto: 'second',
      userInfo: {},
      aaa:'this is text2 fro porco',
      img:require('../../../static/aaa.png'),
      inputVal: '',
      waitTime:'',
      isBoolean:false,
      title1: '',
      reg: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
      list:[{name:'red',img:require('../../../static/aaa.png')},{name:'blue',img:require('../../../static/aaa.png')},{name:'yellow',img:require('../../../static/aaa.png')},{name:'orange',img:require('../../../static/aaa.png')}]
    }
  },
  created () {
    // 调用应用实例的方法获取全局数据
    console.log('-created-')
    this.waitData()
    this.controlTime()
    this.testReg()
  },
  onLoad(){
  	console.log('-onLoad-')
    console.log("b`s value is b&b")
  },
  onShow(){
  	console.log('-onShow-')
  },
  mounted (){
  	console.log('-mounted-')
  },
  computed:{
  },
  watch: {
  	inputVal(newVal, oldVal) {
  		console.log(newVal, oldVal)
  	}
  },
  components: {
    Card1:card,
    Card2:card,
  },
  methods: {
    bindViewTap () {
      const url = '../index/main?name='+this.motto
      wx.navigateTo({ url })
    },
    testReg () {
      console.log('reg.test :' + this.reg.test(17580698391))
    },
    async waitData () {
    	let time = await this.sleep()
    	if (time) {
    		this.waitTime = time.name
    	}
    },
    sleep(){
    	return new Promise((resolve) => {
    		setTimeout(()=>{
    			resolve({name:'wake up'})
    		}, 3000)
    	})
    },
    title(val){
    	console.log(val)
    },
    testHandle(val,e) {
    	console.log(val,e)
    },
    controlTime(){
	  	let i = 0;
	  	let timer = setInterval(() => {
	  		if (i > 6) {
	  			clearInterval(timer)
	  		} else {
		  		this.isBoolean = !this.isBoolean
		  		i ++;
	  		}
	  	}, 1000)
  	}
  }
}
</script>

<template>
  <div class="container" >
	<span @click="bindViewTap">bindViewTap</span>
  	<img src="../../../static/aaa.png"/>
  	<img :src="img"/>
  	<input type="text" v-model.lazy="inputVal"/>
  	<span>inputVal:{{inputVal}}</span>
  	<span v-if="waitTime">waitTime:{{waitTime}}</span>
  	<Card1 :text="motto" :text2="waitTime" v-on:AAA="title"></Card1>
	<div v-for="(item,i) in list" wx:key="item.name">
  		<p @click="testHandle(i,$event)" :style="{color: item.name, fontSize: true ? '20px' : '10px'}" :class="['center',isBoolean ? 'bg'+i : 'bg'+(3-i),'border'+i]">{{item.name}}</p>
  		<img :src="item.img" :class="{image: isBoolean, wid: !isBoolean}"/>
  	</div>
    <view :id="title1 == '趣味阅读' ? 'readStep' : title1 == '脑力大比拼' ? 'gameStep' : 'recordStep'">-----------</view>
  </div>
</template>

<style scope>
input{
	border:1px solid gray;
}
img{
	display:inline-block;
	width:20px;
	height:20px;
}
.border0{
	border:1px solid red;
}
.border1{
	border:1px solid blue;
}
.border2{
	border:1px solid yellow;
}
.border3{
	border:1px solid orange;
}
.center{
	text-align:center;
}
.bg0{
	width:50px;
}
.bg1{
	width:80px;
}
.bg2{
	width:110px;}
.bg3{
	width:140px;
}
.image{
	border:1px dashed gold;
}
.wid{
	width:50px;
	height:50px;
}
</style>
