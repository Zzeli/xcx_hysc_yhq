//index.js
//获取应用实例
var app = getApp()
var page = 1;

var last_page = 5;
var url = require('../../utils/url.js')

var nav;
// 请求数据
var loadMore = function (that) {
  that.setData({
    hidden: false
  });

  if (page < last_page || page == last_page){
    wx.request({
      url: url.URl+"index/goods",
      data: { page: page},
      method: 'get',
      success: function (res) {
        last_page = res.data.data.last_page
          that.setData({
            details: that.data.details.concat(res.data.data.data)
          });
        page++;
        that.setData({
          hidden: true
        });
      }
    
    });
  }else{
    that.setData({
      hidden: true,
      nodata:false
    })
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:false,
    splash:false,
    skill:false,
    phone: '',
    active:0,
    second:5,
    banner: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    nav:[],
    index_ads: [],
    sign: '￥',
    details: [],
    nodata:true,
    nodes: [{
      name: 'hr',
      attrs: {
        class: 'hr_class',
        style: 'line-height: 60px;border-bottom:none;'
      }
    }],
  },
  onLoad: function (options) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              app.getUserInfo();
            }
          })
        }
      }
    })
    var that = this;
    wx.request({
      url: url.URl+"index", 
      data: {},
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
      if(res.data.code==300){
        var phone = res.data.data
        wx.showModal({
          title: res.data.message,
          content: res.data.data,
          success: function (res) {
            if (res.confirm) {
              wx.makePhoneCall({
                phoneNumber: phone
              })
            }
          }
        })
      }
        that.setData({
          banner: res.data.data.banner,
          nav:res.data.data.nav,
          index_ads: res.data.data.index_ads,
          hidden:true,
          coupon: res.data.data.coupon
        })
        wx.setStorage({
          key: 'coupon',
          data: res.data.data.coupon,
        })
        nav = res.data.data.nav
        

        
      }
    })
    
    loadMore(that);
    
  },


  optionClick:function(e){
    var id = e.currentTarget.dataset.id
    var position_id = nav[id].position_id
    var nav_model=nav[id].nav_model
    var nav_url = nav[id].nav_url

    wx.navigateTo({
      url: "/pages/importer/importer?id=" + position_id + "&nav_model= " + nav_model + "& nav_url=" + nav_url,
      success: function (res) {
      }
    })
  },
  alone:function(e){
    var id = e.currentTarget.dataset.id
    var position_id = nav[id].position_id
    var nav_model = nav[id].nav_model
    var nav_url = nav[id].nav_url
    var nav_name = nav[id].nav_name
    var that = this;
    console.log("/pages/about/about?id=" + position_id + "&nav_model= " + nav_model + "& nav_url=" + nav_url + "&nav_name=" + nav_name)
    wx.navigateTo({
        url: "/pages/about/about?id=" + position_id + "&nav_model= " + nav_model + "&nav_url=" + nav_url + "&nav_name=" + nav_name,
        success: function (res) {
        }
      })



    // if (e.currentTarget.dataset.id==7){
    //   wx.request({
    //     url:  url.URl + "company",
    //     data: {},
    //     method: 'get',
    //     header: {
    //       'content-type': 'application/json'
    //     },
    //     success: function (res) {
    //       var lat = parseFloat(res.data.data.location.lat)
    //       console.log(lat)
    //       var lng = parseFloat(res.data.data.location.lng)
    //       console.log(lng)

    //       var address = res.data.data.seller_address
    //       var name = res.data.data.seller_company
    //       wx.openLocation({
    //         latitude: lat,
    //         longitude: lng,
    //         scale: 0,
    //         name: name,
    //         address: address
    //       })
    //     }
    //   });
    // }
    // if (e.currentTarget.dataset.id == 8) {
    //   var that=this;
    //   wx.request({
    //     url: url.URl + "company",
    //     data: {},
    //     method: 'get',
    //     header: {
    //       'content-type': 'application/json'
    //     },
    //     success: function (res) {
    //       var phone = res.data.data.seller_phone
    //       that.setData({
    //         phone: res.data.data.seller_phone
    //       })
    //     }
    //   })
    //   this.setData({
    //     active: 1
    //   })
    // }
    // if (e.currentTarget.dataset.id == 1) {
    //   var that = this;
    //   wx.navigateTo({
    //     url: "/pages/about/about",
    //     success: function (res) {
    //     }
    //   })
      
    // }
   
  },
  onPullDownRefresh: function () {
    page=1
    var that = this;
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.setData({
      banner: [],
      nav: [],
      index_ads: [],
      details:[]
    })
    wx.request({
      url: url.URl+"index",
      data: {},
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          banner: res.data.data.banner,
          nav: res.data.data.nav,
          index_ads: res.data.data.index_ads,
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
    loadMore(that); 
  },

  deselect: function () {
    this.setData({
      active: ''

    })
  },

  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  callmeTap: function (){
     var that=this
    wx.makePhoneCall({
      phoneNumber: that.data.phone
    })
  },
  onUnload: function () {
    page = 1
  },
 
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {  
    var that=this;
    loadMore(that)
    this.setData({
      skill: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: '鱼中乐',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/index/index'
    }
  },
  got:function(e){
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    console.log('/pages/coupon/coupon?id=' + id + '&?index=' + index)
    wx.navigateTo({
      url: '/pages/coupon/coupon?id=' +id+ '&index='+index,
    })
   
  }
})