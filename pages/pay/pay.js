// pages/pay/pay.js
var wxpay = require('../../utils/pay.js')
var url = require('../../utils/url.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noaddress:0,
    total:0,
    carriage:0,
    final:0,
    list: [
      {
        id: 'view',
        name: '视图容器',
        open: false,
        pages: ['10元优惠券 ', '50元优惠券', '100元优惠券 ']
      }],
    cou_money:0
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var goods_num;
    var goods_id=options.id;
    console.log(options.id)
    wx.showLoading({
      title: '加载中',
    });    
    that.setData({
      goods_id: goods_id
    })
    console.log(goods_id);
    wx.getStorage({
      key: 'payNum',
      success: function (res) {
        goods_num=res.data
      }
    })
  
    wx.getStorage({
      key: 'u_id',
      success: function (res) {

        var u_id=res.data
        console.log(u_id)
        console.log(u_id);
          wx.request({
            url: url.URl + "place_order",
            data: { goods_id: goods_id, goods_num: goods_num, uid: u_id},
            method: 'get',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.hideLoading();              
              if (res.data.code == 203) {
                wx.showModal({
                  title: res.data.message,
                  success: function (res) {
                      wx.navigateBack({})
                  }
                })
              } else{

                console.log(res.data)
                that.setData({
                  address: res.data.data.address,
                  goods_name: res.data.data.goods.goods_name,
                  goods_thumb: res.data.data.goods.goods_thumb,
                  goods_price: res.data.data.goods.goods_price,
                  goods_num: res.data.data.goods.goods_num,
                  total_fee: res.data.data.goods.total_fee,
                  goods_freight: res.data.data.goods.goods_freight,
                  hasList: true,    // 既然有数据了，那设为true吧,
                  order_id: res.data.data.goods.order_id,
                  coupons: res.data.data.coupons
                })
                wx.setStorage({
                  key: 'coupons',
                  data: res.data.data.coupons,
                })
                if (res.data.data.address == null) {
                  that.setData({
                    noaddress: 1
                  })

                } else {
                  that.setData({
                    noaddress: 0,
                    adrs_name: res.data.data.address.adrs_name,
                    adrs_phone: res.data.data.address.adrs_phone,
                    adrs_addres: res.data.data.address.adrs_addres

                  })

                }

                that.total();
              }
             
              



            }
          })
          
      }
    })
  },
  total() {
    let total_fee = this.data.total_fee;         // 获取购物车列表
    var goods_freight = this.data.goods_freight;
    var coupon = this.data.cou_money;
    let total = 0;
    let final = parseFloat(total_fee) + parseFloat(goods_freight) - parseFloat(coupon);
    this.setData({                // 最后赋值到data中渲染到页面
      final: final.toFixed(2)
    });
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },

  requestPayment: function (e) {
    var coupon = this.data.cou_money;
    var final = this.data.final;
    console.log(final)
    console.log(coupon)
    
    if (final < coupon){
      wx.showModal({
        title: '不能使用优惠券'
      })
    }else{
      var flag = this.data.noaddress;
      if (flag == 0) {
        wx.showLoading({
          title: '正在支付',
        })
        var orderId = this.data.order_id;
        var cou_id = this.data.cou_id;
        var money = e.currentTarget.dataset.money;
        wxpay.wxpay(app, money, orderId, "/pages/purchase/purchase", cou_id);

      } else {
        wx.showModal({
          title: '请填写物流地址',
          content: '',
        })
      }
      
    }

   

   
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
    var that=this
    wx.getStorage({
      key: "goodList",
      success: function (res) {  
        var message = res.data
        console.log(131864912482648624)
        
        console.log(message)
        console.log(131864912482648624)
        
        if (message.length == 0) {
          that.setData({
            noaddress: 1
          })
        } else if (message.length == 1){
          that.setData({
            noaddress: 0,
            adrs_name: message[0].adrs_name,
            adrs_phone: message[0].adrs_phone,
            adrs_addres: message[0].adrs_addres,
            is_default: message[0].is_default
          })
        } else{
          for (var i = 0; i < message.length; i++) {
            if (message[i].is_default == 1) {
              that.setData({
                noaddress: 0,
                adrs_name: message[i].adrs_name,
                adrs_phone: message[i].adrs_phone,
                adrs_addres: message[i].adrs_addres,
                is_default: message[i].is_default
              })
            }
          }

        }
    
      }
    })
  
  },
  selectList(e) {
    var that=this
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    if (index =="noindex"){
      that.setData({
        cou_money:0,
        cou_id: '',
        nocou_id:''      
      })
      that.total();
    }else{
      wx.getStorage({
        key: 'coupons',
        success: function (res) {
          console.log(res.data)
          that.setData({
            cou_money: res.data[index].cou_money,
            cou_id: id,
            
          })
          that.total();
          
        },
      })
    }
    


  },
})