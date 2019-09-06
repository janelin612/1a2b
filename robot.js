const Robot = function (vueInstance) {
    this._app = vueInstance;
    this._pool = [];
}
Robot.prototype = {
    /**
     * 生成所有候選答案的總表
     */
    generatePool: function () {
        for (let i = 0; i < 10000; i++) {
            let item = this._stringify(i).split("");
            if (this._isVaild(item)) {
                this._pool.push(item);
            }
        }
    },
    /**
     * 執行猜題
     */
    execute: function (times) {
        if (typeof times == "undefined") {
            times = 0;
        }
        if(times==0){
            //首次執行的話先將之前手動猜過的結果餵進去
            this._app.triedList.forEach((item)=>{
                let hint=item.hint.split("");
                this._filter(item.result,new Number(hint[0]),new Number(hint[2]));
                times++;
            })
        }
        setTimeout(() => {
            let guess;
            //前兩次猜固定的 再來隨機選答案
            if (times == 0) {
                guess = ["1", "2", "3", "4"];
            } else if (times == 1) {
                guess = ["5", "6", "7", "8"];
            } else {
                guess = this._pool[Math.floor(Math.random() * (this._pool.length))];
            }

            //餵進去vue的實體內
            this._app.currentValue = guess.reduce((sum, item) => sum + item);
            this._app.check();
            this._app.$forceUpdate();
            //取回結果
            let hint = this._app.triedList[this._app.triedList.length - 1].hint.split("");
            if (hint[0] != 4) {
                this._filter(guess, new Number(hint[0]), new Number(hint[2]));
                this.execute(times + 1);
            }
        }, 40); //每次暫停40ms 營造一種程式在努力運算的假象
    },
    /**
     * 由猜過的答案過濾表格
     */
    _filter: function (ans, a, b) {
        let _c = this._checker;

        if (a == 3) {
            //當3A時，則留下與猜的答案有3個一樣的且不能有4個一樣的 後面依此類推
            this._pool = this._pool.filter((val) => {
                return _c.fix3(val, ans) && !_c.fix4(val, ans);
            })
        } else if (a == 2) {
            this._pool = this._pool.filter((val) => {
                return _c.fix2(val, ans) && !_c.fix3(val, ans);
            })
        } else if (a == 1) {
            this._pool = this._pool.filter((val) => {
                return _c.fix1(val, ans) && !_c.fix2(val, ans);
            })
        } else if (a == 0) {
            this._pool = this._pool.filter((val) => {
                return !_c.fix1(val, ans);
            })
        }

        if (a + b == 4) {
            this._pool = this._pool.filter((val) => {
                return _c.any4(val, ans);
            })
        } else if (a + b == 3) {
            this._pool = this._pool.filter((val) => {
                return _c.any3(val, ans) && !_c.any4(val, ans);
            })
        } else if (a + b == 2) {
            this._pool = this._pool.filter((val) => {
                return _c.any2(val, ans) && !_c.any3(val, ans);
            })
        } else if (a + b == 1) {
            this._pool = this._pool.filter((val) => {
                return _c.any1(val, ans) && !_c.any2(val, ans);
            })
        } else if (a + b == 0) {
            this._pool = this._pool.filter((val) => {
                return !_c.any1(val, ans);
            })
        }
        console.log(`pool.length=${this._pool.length}`);
    },
    /**
    * 將整數補齊成4位數並輸出成字串
    */
    _stringify: function (int) {
        if (int >= 1000) {
            return "" + int;
        }
        if (int >= 100) {
            return "0" + int;
        }
        if (int >= 10) {
            return "00" + int;
        }
        return "000" + int;
    },
    /**
    * 判斷生成的結果是否為合法的答案(四位數字不重複)
    */
    _isVaild: function (arr) {
        //自原始陣列提取不重複的值成為新陣列 若新舊長度不同表示原陣列內含重複的值
        let newArr = Array.from(new Set(arr));
        return newArr.length == arr.length;
    },
    _checker: {
        fix1: function (val, ans) {
            return (
                (val[0] == ans[0]) ||
                (val[1] == ans[1]) ||
                (val[2] == ans[2]) ||
                (val[3] == ans[3])
            );
        },
        fix2: function (val, ans) {
            return (
                (val[0] == ans[0] && val[1] == ans[1]) ||
                (val[0] == ans[0] && val[2] == ans[2]) ||
                (val[0] == ans[0] && val[3] == ans[3]) ||
                (val[1] == ans[1] && val[2] == ans[2]) ||
                (val[1] == ans[1] && val[3] == ans[3]) ||
                (val[2] == ans[2] && val[3] == ans[3])
            );
        },
        fix3: function (val, ans) {
            return (
                (val[0] == ans[0] && val[1] == ans[1] && val[2] == ans[2]) ||
                (val[0] == ans[0] && val[1] == ans[1] && val[3] == ans[3]) ||
                (val[0] == ans[0] && val[2] == ans[2] && val[3] == ans[3]) ||
                (val[1] == ans[1] && val[2] == ans[2] && val[3] == ans[3])
            );
        },
        fix4: function (val, ans) {
            return (
                (val[0] == ans[0] && val[1] == ans[1] && val[2] == ans[2] && val[3] == ans[3])
            );
        },
        any1: function (val, ans) {
            return (
                val.indexOf(ans[0]) != -1 ||
                val.indexOf(ans[1]) != -1 ||
                val.indexOf(ans[2]) != -1 ||
                val.indexOf(ans[3]) != -1
            );
        },
        any2: function (val, ans) {
            return (
                (val.indexOf(ans[0]) != -1 && val.indexOf(ans[1]) != -1) ||
                (val.indexOf(ans[0]) != -1 && val.indexOf(ans[2]) != -1) ||
                (val.indexOf(ans[0]) != -1 && val.indexOf(ans[3]) != -1) ||
                (val.indexOf(ans[1]) != -1 && val.indexOf(ans[2]) != -1) ||
                (val.indexOf(ans[1]) != -1 && val.indexOf(ans[3]) != -1) ||
                (val.indexOf(ans[2]) != -1 && val.indexOf(ans[3]) != -1)
            );
        },
        any3: function (val, ans) {
            return (
                (val.indexOf(ans[0]) != -1 && val.indexOf(ans[1]) != -1 && val.indexOf(ans[2]) != -1) ||
                (val.indexOf(ans[0]) != -1 && val.indexOf(ans[1]) != -1 && val.indexOf(ans[3]) != -1) ||
                (val.indexOf(ans[0]) != -1 && val.indexOf(ans[2]) != -1 && val.indexOf(ans[3]) != -1) ||
                (val.indexOf(ans[1]) != -1 && val.indexOf(ans[2]) != -1 && val.indexOf(ans[3]) != -1)
            );
        },
        any4: function (val, ans) {
            return (
                (val.indexOf(ans[0]) != -1 && val.indexOf(ans[1]) != -1 && val.indexOf(ans[2]) != -1 && val.indexOf(ans[3]) != -1)
            );
        }
    }
}