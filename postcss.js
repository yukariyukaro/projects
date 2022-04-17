const fs = require('fs/promises')
const postcss = require('postcss')
const themeConfig = require('./theme-config.json')
const toTheme = require('./postcss/postcss-wxss-to-theme')(themeConfig)

const PATH = 'app.wxss'

fs.readFile(PATH).then((css) => {
  return postcss([toTheme])
    .process(css, { from: PATH, to: PATH, map: false })
    .then(() => {
      console.log('Fuck you WXSS')
    })
})