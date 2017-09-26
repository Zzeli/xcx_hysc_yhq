// pages/coupon/coupon.js
var url = require('../../utils/url.js');
var cou_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text_get:'立即领取',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
   cou_id = options.id;

   wx.getStorage({
     key: 'u_id',
     success: function (res) {
       var u_id = res.data
   wx.request({
     url: url.URl + "coupon",
     data: { uid: u_id,cou_id: cou_id},
     method: 'get',
     header: {
       'content-type': 'application/json'
     },
     success: function (res) {
       console.log(res.data)
       wx.hideLoading()
       if (res.data.code==200){
         that.setData({
           cou_money: res.data.data.cou_money,
           endtime: res.data.data.endtime,
           startime: res.data.data.startime,
           got:0,
           text_get: '点击领取',
         })
       } else if (res.data.code == 201){
         that.setData({
           cou_money: res.data.data.couponuse.cou_money,
           endtime: res.data.data.couponuse.endtime,
           startime: res.data.data.couponuse.startime,
           logo:res.data.logo,
           got:1,
           text_get: '已领取',
         })
         console.log(res.data.logo)
       }
     
     }
   })
    
     }
   })
    
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  get:function(options){
    var that=this;
    console.log(cou_id)    
    wx.getStorage({
      key: 'u_id',
      success: function (res) {
        var u_id = res.data
        wx.showLoading({
          title: '加载中',
        });
        wx.request({
          url: url.URl + "coupon/get",
          data: { uid: u_id, cou_id: cou_id },
          method: 'get',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.hideLoading()
            that.setData({
              got: 1,
              text_get: '已领取'
            })
            wx.showToast({
              title: "领取成功",
            })
           
          }
        })

      }
    })
  
  }
})