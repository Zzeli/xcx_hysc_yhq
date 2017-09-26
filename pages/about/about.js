// about.js
var url = require('../../utils/url.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_title:[],
    content:[],
    images: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nav_url = options.nav_url
    console.log(nav_url)
    var that=this
    var self=this
    
      wx.request({
        url: url.URl + "page",
        data: { page_id: nav_url },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          var data = res.data.data;
          var imgInfoArr = res.data.data.page_content;


          //替换标签中特殊字符
          var infoFlg = "<!--SPINFO#0-->";
          var imgFlg = "<!--IMG#";

          var content = "<div style=\" line-height:25px; font-weight:200; font-size:17px; color:black; word-break:normal\">" + res.data.data.page_content + "</div>";

          //替换标签中特殊字符
          var infoFlg = "<!--SPINFO#0-->";
          if (content.indexOf(infoFlg) > 0) {
            content = content.replace(/<!--SPINFO#0-->/, "");
          }

          var imgFlg = "<!--IMG#";
          //图片数量
          var imgCount = (content.split(imgFlg)).length - 1;
          if (imgCount > 0) {
            console.log("有dd" + imgCount + "张图片");

            for (var i = 0; i < imgCount; i++) {
              var imgStr = "<!--IMG#" + i + "-->";
              var imgSrc = "\"" + imgInfoArr[i].src + "\"";
              var imgHTML = "<div> <img style=\"width:100%\" src=" + imgSrc + "> </div>";
              content = content.replace(imgStr, imgHTML);
            }
          }

          var article = content;
          WxParse.wxParse('article', 'html', article, self, imgCount);


          setTimeout(function () {
            self.setData({
              hide: true
            })
          }, 500)
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
  
  }
})