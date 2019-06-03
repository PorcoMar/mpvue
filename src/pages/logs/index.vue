<template>
  <div>
    <ul class="container log-list">
      <li v-for="(log, index) in logs" :class="{ red: aa }" :key="index" class="log-item">
        <card :text="(index + 1) + ' . ' + log"></card>
      </li>
    </ul>
    <div class="select">
      <p>1</p>
      <p>2</p>
      <p>3</p>
      <p>4</p>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'
import card from '@/components/card'
import { setTimeout } from 'timers';

export default {
  components: {
    card
  },

  data () {
    return {
      logs: [],
      idx: 1,
      forList: [{key: 1}, {key: 2}, {key: 3}],
      forListObj: {'read': {'name': 'AAA', 'age': 10}, 'game': {'name': 'BBB', 'age': 20}, 'record': {'name': 'CCC', 'age': 30}, 'deleteObj': {'name': 'deleted'}},
      convert: {11: 'read', 22: 'game', 33: 'record'},
      arg: [1, 2, 3, 4, '5'],
      imgUrl: require('../../../static/aaa.png')
    }
  },

  created () {
    const logs = (wx.getStorageSync('logs') || [])
    this.logs = logs.map(log => formatTime(new Date(log)))

    // this.testPromise();
    // this.testAwait();
    // this.testForEach();
    // this.objList();
    // this.testReg()
    // this.testArr()
    // this.testJS()
    // this.Parmas.apply(this, this.arg)
    // this.Parmas.call(this, 1, 2)
    // this.objFn()
    // this.setFn()
    // this.mapFn()
    // this.calefor()
    // this.zi()
    // this.assign()
    // this.find()
    // this.getter()
    //一下三个可以一起执行
    // this.asyncAwait() //共需3s
    // this.async_no_await() //共需2s
    // this.promiseall() //共需2s
    this.tryCatch();
  },
  methods: {
      
      tryCatch () {
        //   try {
        //     let val = this.getFnTest(4).name
        //     console.error(val)
        //   } catch (e) {
        //       console.log('error提示=====> ', e)
        //       if (e) {
        //           console.error('哈哈哈报错了')
        //       }
        //   }
      },
      getFnTest (v) {
          let convert = {
              1: {name: 'one'},
              2: {name: 'two'},
              3: {name: 'three'},
          }
          return convert[v]
      },
      async asyncAwait () { //总耗时3S,先await再调用，相当于同步，效率很慢 不建议这样写
          let twos = await this.twoS()
          console.dir(twos) //第2s后执行
          let ones = await this.oneS()
          console.dir(ones) //第3s后执行
          //如果把console.dir(twos)移下来到这里执行则两个都会在第三秒后一起执行
      },
      async async_no_await () { //总耗时2s,和上面的区别在于先执行函数再await，异步执行，花费时间等于所有请求里最大个体请求时间，效果等同于promise.all()
          let twos = this.twoS()
          let ones = this.oneS()
          console.error(await twos) //第2s时同时执行
          console.error(await ones) //第2s时同时执行
      },
      promiseall () { //总耗时2s
          Promise.all([this.oneS(), this.twoS()]).then(res => {
              console.warn(res)
          })
      },
      oneS () {
          return new Promise(resolve => {
              setTimeout(() => {
                  resolve('1s')
              }, 1000)
          })
      },
      twoS () {
          return new Promise(resolve => {
              setTimeout(() => {
                  resolve('2s')
              }, 2000)
          })
      },
      getter () {
          let obj = {
              arr:[1, 2, 3, 4],
              get fn () {
                  if (this.arr.length === 0) {
                      return 0
                  }
                return this.arr[this.arr.length - 1]
              },
              get sex () {
                  return 'male'
              },
              get name () {
                  if (this.n) {
                      return this.n
                  } else {
                      return '哈哈哈'
                  }
              },
              set name (v) {
                  this.n = v;
              }
          }
            console.error(obj.fn)
            console.log("sex:", obj.sex)
            obj.name = 'porco'
            console.log('name:', obj.name)
      },
      find () {
        let a = [1,2,-3,4,5]
        let arr = {a: {name:'a',age:1}, b:{name:'b',age:-3}}
        let itemA = a.find((item, i) => {
            return item < 0
        })
        let itemB = a.findIndex((item, i) => {
            return item < 0
        })
        let name;
        Object.values(arr).forEach(item => {
            if (itemA === item.age) {
                name = item.name
            } 
        })
        console.log(itemA, itemB, name)

      },
      assign () {
          let name = 'porco'
          let obj = {
              name,
              age: 10,
              fn () {
                  console.log('assign.age: ',this.age)
              }
          }
          let obj1 = {
              age: 30
          }
        let key = 1;
        let newObj = Object.assign({key, name: 'a'}, obj, obj1)
        newObj.fn()
        console.log(newObj)
        console.log('assign.arr: ', Object.assign([1, 2, 3], [4, 5]))
      },
    zi () {
      let str = '这是课程2#这是课程22222'
      let str2 = str.replace("#", '\n')
      console.error(str2)
    },
    calefor() {
      let arr = ['111','',''] || []
      let cot = 0;
      arr.map((item, i) => {
        if (item.length > 0) {
          for(let itm of item) {
            cot ++;
          }
        }
      })
      console.error(cot)
    },
    mapFn() {
      let m = new Map()
      let c = new Object()
      m.set('a', 'aa')
      m.set('b', {'bb': '333'})
      m.set(c, m)
      console.log(m.size)
      console.log(m.get('b').bb)
      console.log(m.get(c).get('b'))
      for (let [key, value] of m.entries())
        console.dir(!value.bb ? key + '--' + value : key + '--' + value.bb)
    },
    setFn () {
      let s = new Set();
      s.add('aaa').add('bbb').add('aaa').add('ccc')
      console.log([...s]) //set转数组的第一种方法
      console.error(s.has('aaa'))
      s.delete('bbb') //删除某一项
      console.dir(s.size) //length
      console.log(Array.from(s)) //set转数组的第二种方法
      for(let key of s.values()) { //循环set 由于set的健和健名一致 所以values() 和 keys()是一样的
        console.dir(key)
      }
        let arr1 = [1,2];
        let arr2 = [2,3];
        let newSet = new Set([...arr1, ...arr2]) //数组去重
        for (let key of newSet.keys()) {
            console.dir(key)
        }
    },
    objFn(){
      [1, 2, 3].map((item ,i) => {
        ({
          11: function (...step) {
            this.Parmas(step)
          },
          22: function (...step) {
            this.Parmas(step)
          },
          33: function (...step) {
            this.Parmas(step)
          }
        }[item + '' + (i + 1)]).apply(this, [item, i])
      })
    },
    Parmas (...arg) {
      let filt, arr = 0;
      console.warn(arg)
      if (Array.isArray(arg)) {
        filt = arg[0].filter(v => {
          return typeof v == 'number'
        })
      }
      for(let item of filt) {
        arr += item
      }
      console.error(arr);
    },
    async testAwait () {
      console.log(await this.promiseAwait(this.idx))
      console.log(await this.promiseAwait(this.idx))
      console.log(await this.promiseAwait(this.idx))
    },
    promiseAwait(i) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('key = ' + i)
          this.idx ++;
        }, 1000)
      })
    },
    async testPromise () {
      Promise.all([this.time2(), this.time3()]).then(res => {
        console.log(res)
      })
      let a = await new Promise(resolve => {
        setTimeout(() => {
          resolve('2s reutrn')
        }, 1000)
      })
      console.info(a)
      try {
        let b = await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve('right')
          }, 1000)
          // reject('error') /*reject会执行catch*/
        })
        console.log(b)
      } catch (e) {
        console.log('--e--')
        console.log(e)
      }
    },
    time3 () {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('time3')
        }, 3000)
      })
    },
    time2 () {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('time2')
        }, 1000)
        resolve('----')
      })
    },
    testForEach () {
      let arr = this.forList.map((item, idx) => {
        // return item.key * 2  /* [2, 4, 6] */
        item.key *= 2;
      })
      console.log(this.forList)
    },
    objList () {
      for(let i in this.forListObj) {
        console.log(i)
        if (i == 'deleteObj') delete this.forListObj[i]
      }
      console.dir(this.forListObj)
      this.forList.map((item, idx) => {
        let {name, age} = this.forListObj[this.convert[item.key + '' + (idx + 1)]]
        console.info(name)
      })
      this.forList.map((item, idx) => {
        let {name, age} = this.forListObj[this.convertData(item.key + '' + (idx + 1))]
        console.info(age)
      })
    },
    convertData (i) {
      return {
        11: 'read',
        22: 'game',
        33: 'record'
      }[i]
    },
    testReg () {
      let str = 'hello hi,lucy your name is lucy?'
      console.log(str.search(/\bHi\b/i) || -1) //3 search寻找匹配的索引 \b单词的开头或结尾  /i忽略大小写 /g /i /ig /gi都可以 也可以不写
      console.log(str.match(/\bHi\b.*\bLucY\b/gi) || null ) // 'hi,lucy your name is lucy'. 匹配除换行符外的所有字符 *不限出现次数 没有就是null
      console.log(str.match(/\bhi\b.?\blucy\b/ig)) // 'hi,lucy' ?最多（只）出现一次 ?等于{0,1}
      console.log(str.match(/\bhi\b.+\bAAA\b/ig)) // null 至少出现一次 这里如果匹配lucy结果就和*一样了

      let str1 = 'tel:18580598391'
      console.log(str1.match(/[3-8]{2}/g)) // ['85', '83'] {2}至少有两个连着的满足限定条件的字符
      console.log(str1.match(/\d[3-9]{3}/g)) // ['858', '598'] {3}至少有3个连着的满足限定条件的字符
    },
    testArr() {
      let arr = [1, '2', 2, 'porco', 3, '4']
      console.dir(arr.includes('porco')) //数组也可以用includes true
      console.log(arr.find(n => typeof n === 'string')) //2 //寻找满足条件的第一项的值
      console.log(arr.findIndex(n => n === 2), arr.findIndex(n => n === '2')) // 2 1 //寻找满足条件的第一项的索引
      arr.fill('last', 5, arr.length) //fill(value, startIdx, endIdx) 替换数组中的某一项
      console.log(arr) //[1, '2', 2, 'porco', 3, 'last']

    },
    testJS() {
      let date = new Date()
      console.log(date)
      console.log(date.getTime())
    },
  },


}
</script>

<style>
.log-list {
  display: flex;
  flex-direction: column;
  padding: 40rpx;
}

.log-item {
  margin: 10rpx;
}
</style>
