// splash.js
var url = require('../../utils/url.js');
var flag=true;
var go;
function countdown(that) {
  if(flag==false){
    return;
  }
    var second = that.data.second
    if (second == 0) {
      return;
    }
    var time = setTimeout(function () {
      that.setData({
        second: second - 1
      });
      countdown(that);
    }, 1000)

 
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 5,
    splash:false,
    img:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    flag=true
    var that=this
    wx.request({
      url: url.URl + "startup",
      data: {},
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          img: res.data.data.ads_img
        })
        countdown(that)
        go = setTimeout(function () {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 5000)
      }
    })
  },

  onUnload: function () {
    clearTimeout(go)
  },


  goIndex: function () {
    clearTimeout(go)
    flag=false
    wx.reLaunch({
      url: '/pages/index/index'
    })

  },
})