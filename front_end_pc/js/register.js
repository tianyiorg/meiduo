var vm = new Vue({
    el: '#app',
    data: {
        error_name: false,
        error_password: false,
        error_check_password: false,
        error_phone: false,
        error_allow: false,
        error_image_code: false,
        error_sms_code: false,

        username: '',
        password: '',
        password2: '',
        mobile: '',
        image_code: '',
        sms_code: '',
        allow: false,
        image_code_id: '',
        image_code_url: '',
        send_flag: false,
        error_image_code_message: '请填写图片验证码',
        sms_code_tip:'获取短信验证码'
    },
    mounted: function () {
        this.image_code_id = this.generate_uuid()
        // 发起请求，请求图片验证码
        // axios.get("http://127.0.0.1:8000/image_codes/" + this.image_code_id + "/")
        //     .then(response => {
        //
        //     })
        //     .catch(error => {
        //
        //     })
        // this.image_code_url = "http://127.0.0.1:8000/image_codes/" + this.image_code_id + "/"
        this.generate_image_code()
    },
    methods: {
        // 生成uuid
        generate_uuid: function () {
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now == "function") {
                d += performance.now();
            }
            var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },
        generate_image_code: function () {
            //生成一个编号
            this.image_code_id = this.generate_uuid()
            // 设置页面中图片验证码img标签的src属性
            this.image_code_url = "http://127.0.0.1:8000/image_codes/" + this.image_code_id + "/"
        },
        check_username: function () {
            var len = this.username.length;
            if (len < 5 || len > 20) {
                this.error_name = true;
            } else {
                this.error_name = false;
            }
        },
        check_pwd: function () {
            var len = this.password.length;
            if (len < 8 || len > 20) {
                this.error_password = true;
            } else {
                this.error_password = false;
            }
        },
        check_cpwd: function () {
            if (this.password != this.password2) {
                this.error_check_password = true;
            } else {
                this.error_check_password = false;
            }
        },
        check_phone: function () {
            var re = /^1[345789]\d{9}$/;
            if (re.test(this.mobile)) {
                this.error_phone = false;
            } else {
                this.error_phone = true;
            }
        },
        check_image_code: function () {
            if (!this.image_code) {
                this.error_image_code = true;
            } else {
                this.error_image_code = false;
            }
        },
        check_sms_code: function () {
            if (!this.sms_code) {
                this.error_sms_code = true;
            } else {
                this.error_sms_code = false;
            }
        },
        check_allow: function () {
            if (!this.allow) {
                this.error_allow = true;
            } else {
                this.error_allow = false;
            }
        },
        // 注册
        on_submit: function () {
            this.check_username();
            this.check_pwd();
            this.check_cpwd();
            this.check_phone();
            this.check_sms_code();
            this.check_allow();
        },
        //发送短信验证码
        send_sms_code: function () {
            if (this.send_flag == true) {
                return;
            }
            this.send_flag = true;
            // 校验参数，保证输入框有数据填写
            this.check_phone();
            this.check_image_code();
            if (this.error_phone == true || this.error_image_code == true) {
                this.send_flag = false;
                return;
            }
            //向后端接口发送请求，让后端发送短信验证码
            axios.get('http://127.0.0.1:8000/sms_codes/' + this.mobile + '/?text=' + this.image_code + '&image_code_id=' + this.image_code_id, {
                responseType: 'json'
            })
                .then(response => {
                    //表示后端发送短信成功
                    //倒计时60秒，60秒后运行用户再次点击发送按钮
                    var num = 60;
                    // 设置一个计时器
                    var t = setInterval(() => {
                        if (num == 1) {
                            //如果计时器到最后，清除计时器对象
                            clearInterval();
                            //将点击获取验证码的按钮展示的文本恢复成原始文本
                            this.sms_code_tip = '发送短信验证码';
                            //将点击按钮的onclick事件函数恢复回去
                            this.send_flag = false;
                        } else {
                            num -= 1;
                            // 展示倒计时信息
                            this.sms_code_tip = num + '秒';
                        }
                    }, 1000, 60)
                })
                .catch(error => {
                    if (error.response.status == 400) {
                        this.error_image_code_message = '图片验证码有误';
                        this.error_image_code = true;
                    } else {
                        console.log(error.reponse.data);
                    }
                    this.send_flag = false;
                })
        }
    }
});
