var app = new Vue({
    el: '#app',
    data: {
        answer: [],
        triedList: [],
        currentValue: "",
        error: "",
        isFinished: false
    },
    methods: {
        start: function () {
            this.isFinished = false;
            this.triedList = [];
            this.answer = [];
            //不重複取四個數字
            let pool = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            for (let i = 0; i < 4; i++) {
                let index = Math.floor(Math.random() * (pool.length));
                this.answer.push(pool[index]);
                pool.splice(index, 1);
            };
            console.log(this.answer);
        },
        check: function () {
            if (isNaN(new Number(this.currentValue)) || this.currentValue.split("").length != 4) {
                this.error = "you should input a four digit number";
                return;
            }
            this.error = "";
            this.calc();
        },
        calc: function () {
            let a = 0;
            let b = 0;
            this.currentValue.split("").forEach((val, id) => {
                let index = this.answer.indexOf(val);
                if (index != -1) {
                    if (index == id) {
                        a++
                    } else {
                        b++;
                    }
                }
            })

            this.triedList.push({
                result: this.currentValue,
                hint: `${a}A${b}B`
            });
            this.currentValue = "";

            //4A0B 結束遊戲
            if (a == 4) {
                this.isFinished = true;
            }
        },
        help: function () {
            let robot = new Robot(this);
            robot.generatePool();
            robot.execute();
        }
    }
})