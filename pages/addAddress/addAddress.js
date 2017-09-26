var commonCityData = require('../../utils/city.js');
var url = require('../../utils/url.js')

var app = getApp();
var name;
var phone;
var province;
var city;
var areainfo;
var street;
var postcode;
var adrs_id;
Page({
  data: {
    selProvince: '请选择',
    selCity: '请选择',
    selDistrict: '请选择',
    id:'',
    selProvinceIndex: 0,
    selCityIndex: 0,
    selDistrictIndex: 0
  },
  onLoad: function (options) {
    var that = this
    this.initCityData(1);
    adrs_id = options.id;
    wx.showLoading({
      title: '加载中',
    });
    that.setData({
      id: adrs_id
    })
    if (!adrs_id){
      wx.getStorage({
        key: 'u_id',
        success: function (res) {
          var u_id = res.data
          wx.request({
            url: url.URl + "address_add",
            data: { uid: u_id},
            method: 'get',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.hideLoading();
              that.setData({
                addressData:''

              })

            }
          })
        }
      })
    }else{
      wx.getStorage({
        key: 'u_id',
        success: function (res) {
          var u_id = res.data
          wx.request({
            url: url.URl + "address_update",
            data: { uid: u_id, adrs_id: adrs_id},
            method: 'get',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.hideLoading();
              that.setData({
                adrs_name: res.data.data.adrs_name,
                adrs_phone: res.data.data.adrs_phone,
                adrs_zip_code: res.data.data.adrs_zip_code,
                selDistrict: res.data.data.areainfo,
                selCity: res.data.data.city,
                selProvince: res.data.data.province,
                street: res.data.data.street,
                postcode: res.data.data.adrs_zip_code

              })



            }
          })
        }
      })
    }

  },
  bindSave: function (e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;
    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (this.data.selProvince == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    if (this.data.selCity == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    var cityId = commonCityData.cityData[that.data.selProvinceIndex].cityList[that.data.selCityIndex].name

    var districtId;
    if (that.data.selDistrict == "请选择") {
      districtId = cityId;
    } else {
      districtId = commonCityData.cityData[that.data.selProvinceIndex].cityList[that.data.selCityIndex].districtList[that.data.selDistrictIndex].name;
    }

    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel: false
      })
      return
    }

    var apiAddoRuPDATE = "add";
    var apiAddid = adrs_id;
    if (apiAddid) {
      apiAddoRuPDATE = "update";
    } else {
      apiAddid = 0;
    }
    //添加新地址和修改
    wx.getStorage({
      key: 'u_id',
      success: function (res) {
        var u_id = res.data

        wx.request({
          url: url.URl + 'address_add',
          data: {
            uid: u_id,
            adrs_id: apiAddid,
            province: commonCityData.cityData[that.data.selProvinceIndex].name,
            city: cityId,
            areainfo: districtId,
            name: linkMan,
            street: address,
            phone: mobile,
            postcode: code
          },
          success: function (res) {
            var message;
            wx.getStorage({
              key: "goodList",
              success: function (res) {
                if (apiAddid==0){
                  message=[];
                  var mes={};
                  mes.adrs_name = linkMan;
                  mes.adrs_addres = commonCityData.cityData[that.data.selProvinceIndex].name + cityId + districtId + address;
                  mes.adrs_phone = mobile;
                  mes.is_default = 1;
                  message.push(mes)
                  console.log(message)
                  wx.setStorage({
                    key: "goodList",
                    data: message
                  })
                  wx.navigateBack({})
                }
                else{
                  message = res.data
                  for (var i = 0; i < message.length; i++) {
                    if (message[i].adrs_id == apiAddid) {
                      message[i].adrs_name = linkMan;
                      message[i].adrs_addres = commonCityData.cityData[that.data.selProvinceIndex].name + cityId + districtId + address;
                      message[i].adrs_phone = mobile,
                        message[i].is_default = 1
                    }
                  }
                  wx.navigateBack({})

                  wx.setStorage({
                    key: "goodList",
                    data: message
                  })
                  
                }
                wx.showToast({
                  title: '保存成功',
                })
                
         
              }
            })
         
       

            if (res.data == 400) {
              // 登录错误 
              wx.hideLoading();
              wx.showModal({
                title: '失败',
                content: '请先授权登陆',
                showCancel: false
              })
              return;
            }
            if (res.data == 123) {
              wx.showToast({
                title: '添加地址成功',
                icon: 'success',
                duration: 3000
              })
            }
            // 跳转到结算页面



          }
        })
      }

    })

  },

  initCityData: function (level, obj) {
    if (level == 1) {
      var pinkArray = [];
      for (var i = 0; i < commonCityData.cityData.length; i++) {
        pinkArray.push(commonCityData.cityData[i].name);
      }
      this.setData({
        provinces: pinkArray
      });
    } else if (level == 2) {
      var pinkArray = [];
      var dataArray = obj.cityList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        citys: pinkArray
      });
    } else if (level == 3) {
      var pinkArray = [];
      var dataArray = obj.districtList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts: pinkArray
      });
    }

  },
  bindPickerProvinceChange: function (event) {
    var selIterm = commonCityData.cityData[event.detail.value];
    this.setData({
      selProvince: selIterm.name,
      selProvinceIndex: event.detail.value,
      selCity: '请选择',
      selDistrict: '请选择'
    })
    this.initCityData(2, selIterm)
  },
  bindPickerCityChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
    this.setData({
      selCity: selIterm.name,
      selCityIndex: event.detail.value,
      selDistrict: '请选择'
    })
    this.initCityData(3, selIterm)
  },
  bindPickerChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
    if (selIterm && selIterm.name && event.detail.value) {
      this.setData({
        selDistrict: selIterm.name,
        selDistrictIndex: event.detail.value
      })
    }
  },
 
  cancel:function(){
    wx.navigateBack();  
  },

  deleteAddress: function (e) {
    var that = this;
    var id = adrs_id;
    wx.getStorage({
      key: 'u_id',
      success: function (res) {
        var u_id = res.data
              wx.showModal({
                title: '提示',
                content: '确定要删除该收货地址吗？',
                success: function (res) {
                  if (res.confirm) {
                    wx.request({
                      url: url.URl + 'address_del',
                      data: {
                        adrs_id: id,
                        uid:u_id
                      },
                      success: function (res) {
                        wx.getStorage({
                          key: "goodList",
                          success: function (res) {
                           var message = res.data
                            for (var i = 0; i < message.length; i++) {
                              if (message[i].adrs_id == id) {
                                message.splice(i,1)
                              }
                            }
                            wx.setStorage({
                              key: "goodList",
                              data: message
                            })
                            wx.navigateBack({})

                          }
                        })

                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
      }
    })
  }
    
 
})
