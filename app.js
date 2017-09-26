//app.js
var url = require("utils/url.js")
var nickName;
var openId;
var gender;
var avatarUrl;
App({
  onLaunch: function () {
    var that = this;
  },
  onUnload:function(){
    wx.clearStorage()

  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
          console.log(that.globalData.userInfo);
          avatarUrl = that.globalData.userInfo.avatarUrl;
          nickName = that.globalData.userInfo.nickName;
          gender = that.globalData.userInfo.gender;
          console.log('成功获取信息')
          that.login();


        },
        fail: function () {
          // 调用微信弹窗接口
          wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权，请10分钟后再次点击授权',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      })
    }
  },
  login: function () {
    var that = this;
    var token = that.globalData.token;
    if (!token) {
      wx.login({
        success: function (res) {
          console.log(avatarUrl);
          console.log(999999);
          //获得code后需要用code换区session_key和open_id
          console.log(res.code);
          //把code传到服务器中，再由服务器传值到微信api换取session_key和open_id
          wx.request({
            url: url.URl + 'wxlogin',
            data: {
              code: res.code, avatarUrl: avatarUrl, nickName: nickName, gender: gender
            },
            //  data: {
            //   code: res.code
            // },

            success: function (res) {
              console.log('登录成功')
              openId = res.data;
              var u_id = res.data.data
              console.log(u_id)
              wx.setStorage({
                key: "u_id",
                data: u_id
              })
              // 登录错误 
              if (res.data.data == '' || res.data.user_name == '') {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '无法登录，请重试',
                  showCancel: false
                })
                return;
              }
              //修改登陆状态
              if (res.data.data != '' && res.data.user_name != '') {
                that.globalData.token = res.data;
              }
              // 去注册
              if (res.data == false) {
                that.registerUser();
                return;
              }
            }
          })
        }
      })
    }
  },
  //新用户注册函数
  //需要客户授权
  registerUser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        //console.log(res);
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            // 下面开始调用注册接口
            wx.request({
              url: '',
              data: {
                name: res.userInfo.nickName,
                code: code
              }, // 设置请求的 参数
              success: (res) => {
                wx.hideLoading();
                //更改状态
                that.globalData.token = res.data.userinfo;
                that.login();
              }
            })
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null
  }
})