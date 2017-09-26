// purchase.js
var wxpay = require('../../utils/pay.js')
var url = require('../../utils/url.js')
var app = getApp();
var page = 1;
var last_page = 0;
var type;
var u_id;
var loadMore = function (that) {
  wx.showLoading({
      title: '加载中',
    });
  if (page < last_page || page == last_page) {

    wx.request({
      url: url.URl + "order",
      data: { page: page, uid: u_id,type: type},
      method: 'get',
      success: function (res) {
        wx.hideLoading();
        console.log(res.data)
        that.setData({
          carts: that.data.carts.concat(res.data.data.data)
        });
        page++;
      }

    });
  } else {
    wx.hideLoading();
    that.setData({
      nodata: false,
      skill: true      
    })
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部', '待付款', '待发货', '待收货','已完成'],
    currentTab: 0,
    status:0,
    totalPrice:0,
    nodata:true
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },


  

 
  navbarTap: function (e) {
    var curType = e.currentTarget.dataset.idx;
    this.data.currentTab = curType
    this.setData({
      currentTab: curType
    });
    this.onShow();
  },
  onShow: function () {
   type=1;
   page=1;
    // 获取订单列表
    
    var that = this;

    if (that.data.currentTab == 0) {
      type = 1
      that.setData({
        status: 0,
        nodata: true,
        skill: false
      })
    }
    if (that.data.currentTab == 1) {
      type = 2
      that.setData({
        status: 1,
        nodata: true,
        skill: false
      })
     
    }
    if (that.data.currentTab == 2) {
      type = 3
      that.setData({
        status: 2,
        nodata: true,
        skill: false
      })
    }
    if (that.data.currentTab == 3) {
      type = 4
      that.setData({
        status: 3,
        nodata: true,
        skill: false
      })
    }
    if (that.data.currentTab == 4) {
      type = 5
      that.setData({
        status: 4,
        nodata: true,
        skill: false
      })
    }
    //this.getOrderStatistics();

    var that = this
    wx.getStorage({
      key: 'u_id',
      success: function (res) {
        u_id = res.data
        wx.showLoading({
          title: '加载中',
        });
        wx.request({
          url: url.URl + "order",
          data: { type: type, uid: u_id, page: page},
          method: 'get',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            page += 1
            wx.hideLoading();
            if (res.data.data == null) {
              that.setData({
                index: 0,
                nodata:true,
                skill:false
              })
            }else{
              last_page=res.data.data.last_page
              console.log(last_page)
              that.setData({
                index: 1,
                carts: res.data.data.data
              })
            }
      
          }
        })

      }
    })


  },

  //取消订单
  cancelOrderTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          });
          wx.request({
            url: url.URl + 'order_cancel',
            data: {
              //token: app.globalData.token,
              order_id: orderId
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data != 0) {
                that.onShow();
              }
            }
          })
        }
      }
    })
  },

  toPayTap: function (e) {
    var orderId = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    wxpay.wxpay(app, money, orderId, "/pages/purchase/purchase");
  },

  receipt:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: url.URl + 'order_confirm',
      data: {
        //token: app.globalData.token,
        order_id: orderId
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data != 0) {
          console.log(res.data )
          that.onShow();
        }else{
          console.log(9241027909090909090909090)
        }
      }
    })
    
  },

  returns:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要申请退货吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          });
          wx.request({
            url: url.URl + 'order_apply',
            data: {
              //token: app.globalData.token,
              order_id: orderId
            },
            success: (res) => {
              console.log(res.data)
              wx.hideLoading();
              if(res.data.data==null){
                that.setData({
                  index:0
                })
              }
              if (res.data != 0) {
                that.onShow();
              }
              
            }
          })
        }
      }
    })
  },
  seeLog:function(){
    wx.navigateTo({
      url: '/pages/logistics/logistics',
    })

  },
  onPullDownRefresh: function () {
    page = 1
    var that = this;
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.setData({
      carts: []
    })
    that.onShow();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  onReachBottom: function () {
    var that = this;
    loadMore(that)
  },
  onUnload: function () {
    page = 1
  }
})