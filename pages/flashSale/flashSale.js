// pages/flashSale/flashSale.js
var type;
var url = require('../../utils/url.js');
var endtime=[];
function getRTime(that) {
  var EndTime = new Date(that.data.aa); //截止时间 
  var NowTime = new Date();
  var t = EndTime.getTime() - NowTime.getTime();
  var d = Math.floor(t / 1000 / 60 / 60 / 24);
  var h = Math.floor(t / 1000 / 60 / 60 % 24);
  var m = Math.floor(t / 1000 / 60 % 60);
  var s = Math.floor(t / 1000 % 60);
   that.setData({
    s: s,
    h:h,
    m:m,
    d:d,
   })
} 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['10:00', '14:00', '20:00', '10:00', '14:00'],
    navbarText: ["已"],
    aa: ['2017/09/26/20:00:00'],
    nodes: [{
      name: 'hr',
      attrs: {
        class: 'hr_class',
        style: 'line-height: 60px;border-bottom:none;'
      }
    }],
    id: '',
    result: [],
    clock: '',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url.URl +'panic_index',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.data.timeslot)
        that.setData({
          common: res.data, //一维数组，全部数据
          endtime: res.data.end_time, //项目截止时间，时间戳，单位毫秒,
          navbar: res.data.data.timeslot,
          goods: res.data.data.goods
        })
        console.log(res.data.data.goods)
        var nav = res.data.data.timeslot;
   
        for(var i=0;i<nav.length;i++){
          endtime.push(nav[i].endtime)
          console.log(endtime)
          if(nav[i].now==1){
            var i = i
            var navbarText = that.data.navbarText
            navbarText.splice(i,1,"抢购中")
            that.setData({
              currentTab: i,

            })
            that.onShow();
          } else if (nav[i].now == -1){
            var navbarText = that.data.navbarText
            navbarText.splice(i, 1, "已开抢")
          } else if (nav[i].now == 0){
            console.log(nav[i].now)
            var navbarText = that.data.navbarText
            console.log(navbarText)
            navbarText.splice(i, 1, "即将开枪")
          }
          that.setData({
            navbarText: navbarText
          })
        }
        console.log(that.data.common);
        console.log('结束时间：' + that.data.endtime);
      }
    })
      //调用上面定义的递归函数，一秒一刷新时间
      // countdown(that);

    setInterval(function(){
      getRTime(that)
    }, 1000); 
  
  },
  navbarTap: function (e) {
    var aa=[
      '2017/09/26/20:00:00',
      '2017/09/28/20:00:00',
      '2017/09/29/20:00:00',
      '2017/09/27/20:00:00'
    ]

    var page;
    var last_page;
    var that=this;
    var curType = e.currentTarget.dataset.index;
    this.setData({
      aa: aa[curType]
    })
    var t_id = e.currentTarget.dataset.id
    this.data.currentTab = curType
    this.setData({
      currentTab: curType,
    });
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url.URl + "click_time",
      data: { page: page=1, t_id: t_id},
      method: 'get',
      success: function (res) {
        wx.hideLoading();
        last_page = res.data.data.last_page
        console.log(res.data.data)
        that.setData({
          goods: res.data.data
        });
        page++;
        that.setData({
          hidden: true
        });
      }

    });
    // this.onShow();
  },
  flash_details:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '/pages/flash_details/flash_details?id=' +id,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  }
})