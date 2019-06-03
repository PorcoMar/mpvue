<template>
  <div>
    <p class="card">
      {{text}},{{text2}}
    </p>
  </div>
</template>

<script>
export default {
  props: ['text','text2'],
  data(){
  	return {
  		a:'a'
  	}
  },
  onLoad(){

  },
  onShow(){

  },
  mounted(){
  	setTimeout(()=>{
  		this.text2 += '|' 
  	}, 10)
  },
  watch:{
  	text2(val){
  		console.log(val)
  		this.$emit('AAA', this.text2)
  	}
  }
}
</script>

<style>
.card {
  padding: 10px;
}
</style>
