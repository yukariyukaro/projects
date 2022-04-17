const app = getApp();
var Channel = require('../../../utils/Channel.js');
const { schoolToColor } = require('../../../utils/constants');
const { deletePm } = require('../utils/utils');
Component({
  properties: {
    type: String,
    pm_id: Number,
    pm_date:String,
    sender_serial: String,
    sender_avatar: String,
    receiver_serial: String,
    pm_msg : String,
    pm_id: String,
    pm_is_read: String,
    post_id: String,
  },

  data: {
    color: '',
  },

  observers: {

  },

  methods: {
    toDetail() {
      const detail = {
        type: this.properties.type,
        pm_date:this.properties.pm_date,
        sender_serial: this.properties.sender_serial,
        sender_avatar: this.properties.sender_avatar,
        receiver_serial: this.properties.receiver_serial,
        pm_msg : this.properties.pm_msg,
        pm_id: this.properties.pm_id,
        pm_is_read: this.properties.pm_is_read,
        post_id: this.properties.post_id
      };
      Channel.setChannel('object', detail);
      wx.navigateTo({
        url: '/pages/func1-pm/pmDetail/pmDetail',
        events: {
          delete: (data) => {
            this.triggerEvent('delete', data);
          },
        },
      })
    }
  },
});
