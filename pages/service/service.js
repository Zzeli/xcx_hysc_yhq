// service.js
var url = require('../../utils/url.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  
  callmeTap: function () {
    var that=this;
    wx.request({
      url: url.URl + "company",
      data: { sys_id:3},
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var phone=res.data.data.seller_phone
        console.log(phone)
        wx.makePhoneCall({
          phoneNumber: phone
        })
      }
    })

   
  }
})