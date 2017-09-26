
var url = require('url.js')
var prepay_id;
function wxpay(app, money, orderId, redirectUrl, cou_id) {
  wx.request({
    url: url.URl + 'pay',
    data: {
      // token:app.globalData.token.user_id,
      // money:money,
      order_id: orderId,
      cou_id: cou_id
      // payName:"在线支付",
      // nextAction:{type:0, id:orderId}
    },
    //method:'POST',
    success: function(res){
      wx.hideLoading();
      console.log(res.data);
      if(res.data.code==203){
         wx.showModal({
                  title: res.data.message,
                  success: function (res) {
                      wx.navigateBack({})
                  }
                })
        return;
      }
      if(res.data != 0){
        prepay_id = res.data.data.prepay_id;
        console.log(prepay_id);
        // 发起支付
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType:'MD5',
          paySign: res.data.data.paySign,
          prepay_id: res.data.data.prepay_id,
          fail:function (aaa) {
            wx.showToast({title: '支付失败:' + aaa})
            wx.reLaunch({
              url: '/pages/purchase/purchase',
            })
          },
          success:function (res) {
  
              wx.showToast({ title: '支付成功' })
              console.log(prepay_id)
              wx.request({
                url: url.URl + 'notify',
                data: {
                  order_id: orderId, prepay_id: prepay_id, cou_id: cou_id
                },
              })
            
            wx.reLaunch({
              url: redirectUrl
            });
          }
        })
      } else {
        wx.showToast({title: '服务器忙' + res.data.code})
      }
    }
  })
}

module.exports = {
  wxpay: wxpay
}
