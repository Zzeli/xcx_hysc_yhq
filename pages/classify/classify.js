// classify.js
var app = getApp();
var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    skill:false,
    inputShowed: false,
    inputVal: "",
    active:1, 
    hidden: false,
    noClass: false,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    searchList:[{id:1,name:'龙鱼'}, { id: 2, name: '虎鱼' }, { id: 3, name: '虎鱼' }, { id: 4, name: '虎鱼' }, { id: 5, name: '虎鱼' }, { id: 6, name: '虎鱼' }]
  
  },
  showInput: function () {
    this.setData({
      inputShowed: true,
      active:1
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      active:1
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: url.URl + "category",
      data: {},
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.data == null) {
          that.setData({
            noClass: false,
            hidden: true,
            show: true,
          })
        } else {
                var list = res.data.data
                // var perpage=res.data.data
                wx.getSystemInfo({
                  success: function (res) {
                    that.setData({
                      list: list,
                      hidden:true,
                      noClass:true
                    });
                  }
                });
          
              }
      }
    }) 
  
  },
  onPullDownRefresh: function () {
    var that = this;
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.request({
      url:url.URl + "classification",
      data: {},
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          list: res.data.data,
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    }) 
  },
  hotSearch:function(hot){
     this.setData({
       inputVal:hot
     })
  },
  hot:function(e){
    this.hotSearch(e.currentTarget.dataset.text);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    that.setData({
      skill: true
    })
  }
})