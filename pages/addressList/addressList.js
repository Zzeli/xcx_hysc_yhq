// pages/addressList/addressList.js
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
    var that=this
    wx.showLoading({
      title: '加载中',
    });
    wx.getStorage({
      key: 'u_id',
      success: function (res) {
        var u_id = res.data
        wx.request({
          url: url.URl + "address_list",
          data: {uid: u_id},
          method: 'get',
          header: {
            'content-type': 'application/json'
          },
      success: function (res) {
        wx.hideLoading();
        var message = res.data.data;
        if (message.length==1){
          message[0].is_default = 1
          that.setData({
            message: message
          })
        }else{
          for (var i = 0; i < message.length; i++) {
            var moren = [];
            moren.push(message[i].is_default);
            for (var j = 0; j < moren.length; j++) {
              if (moren[j] == 1) {
                message[0].is_default = 0
                that.setData({
                  message: message
                })
              } else {

                message[i].is_default = 0
                message[0].is_default = 1
                that.setData({
                  message: message
                })
              }

            }
          }
          
        }
   
        
        wx.setStorage({
          key: "goodList",
          data: message
        })

      }
    })
      }
    })

  },
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    let message = this.data.message;          // 获取购物车列表
    const is_default = message[index].is_default;     // 获取当前商品的选中状态    

    for(var i=0; i<message.length;i++){
      message[i].is_default=0;
      message[index].is_default = 1;       // 改变状态
    }
    this.setData({
      message: message
    });
    wx.setStorage({
      key: "goodList",
      data: message,
      success: function (res) {
        console.log(res.data);
      }
    })

    wx.getStorage({
      key: 'u_id',
      success: function (res) {
        var u_id = res.data
        wx.request({
          url: url.URl + "address_default",
          data: { uid: u_id, adrs_id:id},
          method: 'get',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.navigateBack({})            
          }
        })
      }
    })



  },
  add:function(){
    wx.redirectTo({
      url: '/pages/addAddress/addAddress'
    })

  }

})