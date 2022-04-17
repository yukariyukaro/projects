var app = getApp();
Component({
  properties: {
    exist: Boolean,
    comment_id: Number,
    comment_order: Number,
    comment_msg: String,
    comment_date: String,
    is_author: Boolean,
    is_anonymous: Boolean,
    post_is_author: Boolean,
    comment_alias: String,
    user_avatar: String,
    post_serial: String,
    user_serial: String,
  },

  data: {
    preURL: 'https://i.boatonland.com/avatar/',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    visitUser: function () {
      if (this.properties.is_anonymous){
        wx.navigateTo({
          url: "/pages/visitProfile/visitProfile?is_anonymous=true&user_serial=NA&post_id=" + this.properties.post_serial + "&comment_order=" + this.properties.comment_order
        })
      }else{
        wx.navigateTo({
          url: "/pages/visitProfile/visitProfile?&user_serial=" + this.properties.user_serial + "&post_id=" + this.properties.post_serial + "&comment_order=" + this.properties.comment_order
        })
      }
    },
    reportComment: function () {
      this.triggerEvent('reportComment', {
        comment_msg: this.data.comment_msg,
        comment_index: this.data.comment_order,
        comment_id: this.data.comment_id,
      });
    },
    deleteComment: function () {
      var that = this
      wx.showModal({
        title:"确认删除？",
        content:"删除后将无法恢复",
        success(res){
          if(res.confirm){
            var comment_id = that.properties.comment_id;
            that.triggerEvent('deleteComment', comment_id);
          }
        }
      })
      
    },
    goToComment: function () {
      wx.navigateTo({
        url: '/pages/writeComment/writeComment?post_id=' + this.data.post_serial +'&is_author=' + this.data.post_is_author + '&comment_id=' + this.data.comment_id + '&comment_order=' + this.data.comment_order,
      });
    }
  },
  
});
