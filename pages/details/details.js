// details.js
var WxParse = require('../../wxParse/wxParse.js');
var url = require('../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
   skill:false,
   hidden:false,
    cartTatol:0,
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    nodetails:true,
    show:true,
    shaow:true,
    overflow:0,
    gcate_id:0,
    nodes: [{
      name: 'hr',
      attrs: {
        class: 'hr_class',
        style: 'line-height: 60px;border-bottom:none;'
      }
    }],

    content: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 60px; color: red;'
      }
    }],
    items: [
      {num: 1}]
  
  },

  // 立即购买
  immeBuy(e) {
    this.setData({
      shaow:false,
      overflow:1
    })
    
  },
  toPayOrder:function(e){
    wx.navigateTo({
          url: '/pages/pay/pay?id='+e.currentTarget.dataset.id
        })
  },
  close:function(){
    this.setData({
      shaow: true,
      overflow: 0
    })

  },
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let items = this.data.items;
    let num = items[index].num;
    num = num + 1;
    items[index].num = num;
    this.setData({
      items: items
    });
    wx.setStorage({
      key: "payNum",
      data: num
    })

  },
  // 减少数量
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let items = this.data.items;
    let num = items[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    items[index].num = num;
    this.setData({
      items: items
    });
    wx.setStorage({
      key: "payNum",
      data: num
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var self=this
    var gcate_id = options.id
    wx.setStorage({
      key: "payNum",
      data: 1
    })
    wx.request({
      url: url.URl +"goods",
      data: {goods_id: gcate_id},
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 201) {
          that.setData({
            nodetails: false,
            hidden: true,
            show:true,
          })
          return ;
        }else{

          var img = res.data.data.goods_imgs;
          var list = []
          for (var i = 0; i < img.length; i++) {
            list.push(img[i]);
          }
              that.setData({
                show:false,
                goods_name: res.data.data.goods_name,
                goods_price: res.data.data.goods_price,
                goods_storage: res.data.data.goods_storage,
                goods_freight: res.data.data.goods_freight,
                goods_market_price: res.data.data.goods_market_price,
                goods_imgs: res.data.data.goods_imgs,
                goods_thumb: res.data.data.thumb,
                hidden: true,
                gcate_id: gcate_id          
              })
              console.log(res.data.data)
              var data = res.data.data;
              var imgInfoArr = res.data.data.goods_content;
              

              //替换标签中特殊字符
              var infoFlg = "<!--SPINFO#0-->";
              var imgFlg = "<!--IMG#";
            
              var content = "<div style=\" line-height:25px; font-weight:200; font-size:17px; color:black; word-break:normal\">" + res.data.data.goods_content + "</div>";

              //替换标签中特殊字符
              var infoFlg = "<!--SPINFO#0-->";
              if (content.indexOf(infoFlg) > 0) {
                content = content.replace(/<!--SPINFO#0-->/, "");
              }

              var imgFlg = "<!--IMG#";
              //图片数量
              var imgCount = (content.split(imgFlg)).length - 1;
              if (imgCount > 0) {

                for (var i = 0; i < imgCount; i++) {
                  var imgStr = "<!--IMG#" + i + "-->";
                  var imgSrc = "\"" + imgInfoArr[i].src + "\"";
                  var imgHTML = "<div> <img style=\"width:100%\" src=" + imgSrc + "> </div>";
                  content = content.replace(imgStr, imgHTML);
                }
              }

              var article =content;
              WxParse.wxParse('article', 'html', article, self, imgCount);


              setTimeout(function () {
                self.setData({
                  hide: true
                })
              }, 500)


          
        }

       
      }
    }) 
  
  },
  imageLoad: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    var viewWidth = 718,           //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 718 / ratio;    //计算的高度值
    var image = this.data.content_img;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },
    onReachBottom: function () {

    this.setData({
      skill: true
    })
  },
    callmeTap: function () {
      var that = this;
      wx.request({
        url: url.URl + "company",
        data: { sys_id:3},
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var phone = res.data.data.seller_phone
          wx.makePhoneCall({
            phoneNumber: phone
          })
        }
      })


    }

 
})