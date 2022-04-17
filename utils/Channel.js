


class Channel {
  static myData = null
  static myType = null

  static setChannel(t, data) {
    if(!t) return false
    if(data == null) return false

    this.myType = t
    if(t === 'string' || t === 'boolean' || t === 'number') {
      this.myData = data
    }
    else if(t === 'object') {
      this.myData = JSON.parse(JSON.stringify(data))
    }
    else if(t === 'array') {
      this.myData = [...data]
    }
    return true
  }

  static getChannel() {
    let t = this.myType
    if (t === 'string' || t === 'boolean' || t === 'number') {
      return this.myData
    }
    else if(t === 'object') {
      return JSON.parse(JSON.stringify(this.myData))
    }
    else if(t === 'array') {
      return [...this.myData]
    }
    return null
  }

  static set0() {
    this.myData = null
    this.myType = null
  }
}

module.exports = Channel;
