<template>
    <div class="box">
        <ul class="puzzle-wrap">
            <li 
                :class="{'puzzle': true, 'puzzle-empty': !puzzle}" 
                v-for="puzzle in puzzles" 
                v-text="puzzle"
                @click="moveFn($index)"
            ></li>
        </ul>
        <button class="btn btn-warning btn-block btn-reset" @click="render">重置游戏</button>
        <button class="btn btn-warning btn-block btn-reset" @click="recover">一键还原演示</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data () {
        return {
            puzzles: []
        }
    },
    methods: {

        // 重置渲染
        render () {
            let puzzleArr = [],
                i = 1
            // 生成包含1 ~ 15数字的数组
            for (i = 0; i < 9; i++) {
                puzzleArr.push(i)
            }
            do {
                // 随机打乱数组
                puzzleArr = puzzleArr.sort(() => {
                    return Math.random() - 0.5
                });
            } while(!this.check(puzzleArr))
            for (i = 0; i < 9; i++) {
                if (puzzleArr[i] == 0)
                    puzzleArr[i] = '';
            }
            // 页面显示
            this.puzzles = puzzleArr
        },

        recover() {
            var dataStr = ""
            for(var i = 0; i < 9; i++) {
                if (this.puzzles[i] == '')
                    dataStr += '0';
                else
                    dataStr += this.puzzles[i]
            }
            var postData = {
                "data": dataStr
            }
            axios({
                method: "POST",
                url: 'http://localhost:3000/puzzle',
                data: postData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                var data = res["data"].data;
                var list = data.split("\r\n")
                list.pop();
                for (var i = 0; i < list.length; i++) {
                    const that = this;
                    (function(str) {
                        setTimeout(function() {
                            that.move(str);
                        }, 500*(i+1));
                    })(list[i])// i是参数 对应着a
                }
            });
        },

        move(str) {
            for (var i = 0; i < 9; i++) {
                if (str[i] == '0')
                    this.puzzles.$set(i, '')
                else
                    this.puzzles.$set(i, parseInt(str[i]))
            }
        },

        check(list) {
            var count_a = 0, count_b = 0;
            var final = "123804765"
            for(var i = 0; i < 9; i++) {
                for(var j = 0; j < i; j++) {        // 判断八数码问题是否有解
                    if(list[j] != 0) {
                        if(list[j] < list[i])
                        count_a++;
                    }
                    if(final[j] != '0') {
                        if(final[j] < final[i])
                        count_b++;
                    }
                }
            }
            if((count_a+count_b)%2==1) {
                return false;
            }
            return true;
        },

        // 点击方块
        moveFn (index) {

            // 获取点击位置及其上下左右的值
            let curNum = this.puzzles[index],
                leftNum = this.puzzles[index - 1],
                rightNum = this.puzzles[index + 1],
                topNum = this.puzzles[index - 3],
                bottomNum = this.puzzles[index + 3]

            // 和为空的位置交换数值
            if (leftNum === '' && index % 3) {
                this.puzzles.$set(index - 1, curNum)
                this.puzzles.$set(index, '')
            } else if (rightNum === '' && 2 !== index % 3) {
                this.puzzles.$set(index + 1, curNum)
                this.puzzles.$set(index, '')
            } else if (topNum === '') {
                this.puzzles.$set(index - 3, curNum)
                this.puzzles.$set(index, '')
            } else if (bottomNum === '') {
                this.puzzles.$set(index + 3, curNum)
                this.puzzles.$set(index, '')
            }

            this.passFn()
        },

        // 校验是否过关
        passFn () {
            if (this.puzzles[8] === '') {
                const newPuzzles = this.puzzles.slice(0, 8)

                const isPass = newPuzzles.every((e, i) => e === i + 1)

                if (isPass) {
                    alert ('恭喜，闯关成功！')
                }
            }
        }
    },
    ready () {
        this.render()
    }
}
</script>

<style>
@import url('./assets/css/bootstrap.min.css');

body {
    font-family: Arial, "Microsoft YaHei"; 
}

.box {
    width: 300px;
    margin: 50px auto 0;
}

.puzzle-wrap {
    width: 300px;
    height: 300px;
    margin-bottom: 40px;
    padding: 0;
    background: #ccc;
    list-style: none;
}

.puzzle {
    float: left;
    width: 100px;
    height: 100px;
    font-size: 20px;
    background: #f92;
    text-align: center;
    line-height: 100px;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 4px;
    text-shadow: 1px 1px 1px #B9B4B4;
    cursor: pointer;
}

.puzzle-empty {
    background: #ccc;
    box-shadow: inset 2px 2px 18px;
}

.btn-reset {
    box-shadow: inset 2px 2px 18px;
}
</style>