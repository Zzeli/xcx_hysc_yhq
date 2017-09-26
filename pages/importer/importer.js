// importer.js
var app = getApp();
var url = require('../../utils/url.js')
var page = 1;
var last_page = 5;
var gcate_id;
var nav_url;
var nav_model;
var position_id;
var loadMore = function (that) {
  var nav_id = gcate_id;
  that.setData({
    hidden: false
  });
  if (page < last_page || page == last_page) {
    wx.request({
      url: url.URl+ "nav",
      data: { page: page, position_id: position_id, nav_model: nav_model, nav_url},
      success: function (res) {
        page++;
        that.setData({
          list: that.data.list.concat(res.data.data.data)
        });
        
        that.setData({
          hidden: true
        });
        return;
      }
    });
  }else{
    that.setData({
      hidden: true,
      nodata: false
    })
  }

}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skill:false,
    sign: '￥',
    hidden: false,
    list: [],
    nodata: true,
    nodes: [{
      name: 'hr',
      attrs: {
        class: 'hr_class',  
        style: 'line-height: 60px;border-bottom:none;'
      }
    }],
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    gcate_id = options.id;
    position_id = options.id;
    nav_model = options.nav_model
    nav_url = options.nav_url
    
    
    var that = this;
    wx.request({
      url: url.URl + "nav",
      data: { page: page, position_id: position_id, nav_model: nav_model, nav_url},
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        last_page = res.data.data.last_page
        that.setData({
          list: res.data.data.data,
          hidden: true
        })
        page++;
        
      }
    })  


  },

  onPullDownRefresh: function () {
    page=1
    var that=this
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
      that.setData({
        list:[],
      })
    　　wx.request({
        url: url.URl + "nav",
        data: { page: page, position_id: position_id, nav_model: nav_model, nav_url},
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        last_page = res.data.data.last_page
        that.setData({
          list: res.data.data.data,
          hidden: true
        })
        page++;
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  onUnload: function () {
    page = 1
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    this.setData({
      hidden: false
    })
    loadMore(that)
    this.setData({
      skill:true
    })
  },


})