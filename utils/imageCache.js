let getImageCache = ( key,url ) =>{
  return new Promise((resolve,reject) => {
      const cache = wx.getStorageSync ( key )
      if ( cache && cache.src === url ) {
        wx.getFileSystemManager().access({
          path: cache.localPath,
          success () {
            resolve ( cache.localPath )
          },
          fail () {
            try {
              wx.removeStorageSync(key)
            } catch (e) {
              // Do something when catch error
              console.log(e)
            } finally {
              reject("file not found")
            } 
          }
        })
      } else {
        const fs = wx.getFileSystemManager ()
        if (cache && cache.src !== url){
          fs.removeSavedFile({
            filePath: cache.localPath,
            complete(){
              wx.downloadFile ( {
                url : url,
                success : function ( res ) {
                    if ( res.statusCode === 200 ) {
                        // console.log ( '图片下载成功')
                        wx.compressImage({
                          src: res.tempFilePath,
                          compressedHeight: 500,
                          success: function (res) {
                            fs.saveFile ( {
                              tempFilePath : res.tempFilePath,
                              success ( res ) {
                                  // console.log ( '图片缓存成功')
                                  wx.setStorageSync ( key, {localPath: res.savedFilePath, src: url} )
                                  resolve( res.savedFilePath)
                              }
                          } )
                          },
                          fail: function () {
                            fs.saveFile ( {
                              tempFilePath : res.tempFilePath,
                              success ( res ) {
                                  // console.log ( '图片缓存成功')
                                  wx.setStorageSync ( key, {localPath: res.savedFilePath, src: url} )
                                  resolve( res.savedFilePath)
                              }
                          } )
                          }
                        })
                    } else {
                        reject(res.statusCode)
                    }
                }
            } )
            }
          })
        }
          wx.downloadFile ( {
              url : url,
              success : function ( res ) {
                  if ( res.statusCode === 200 ) {
                      // console.log ( '图片下载成功')
                      wx.compressImage({
                        src: res.tempFilePath,
                        compressedWidth: 500,
                        success: function (res) {
                          fs.saveFile ( {
                            tempFilePath : res.tempFilePath,
                            success ( res ) {
                                // console.log ( '图片缓存成功')
                                wx.setStorageSync ( key, {localPath: res.savedFilePath, src: url} )
                                resolve( res.savedFilePath)
                            }
                        } )
                        },
                        fail: function () {
                          fs.saveFile ( {
                            tempFilePath : res.tempFilePath,
                            success ( res ) {
                                // console.log ( '图片缓存成功')
                                wx.setStorageSync ( key, {localPath: res.savedFilePath, src: url} )
                                resolve( res.savedFilePath)
                            }
                        } )
                        }
                      })
                  } else {
                      reject(res.statusCode)
                  }
              }
          } )
      }
  })
}

module.exports = {
  getImageCache
}