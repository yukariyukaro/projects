const fs = require('fs');
const path = require('path');
module.exports = (opts = {}) => {
  const output = {
    light: {
      ...opts.defaults?.light,
    },
    dark: {
      ...opts.defaults?.dark,
    },
  }
  const keyMap = opts.keyMap || {};
  const jsonPath = opts.jsonPath || 'theme.json';
  const jsPath = opts.jsPath || 'theme.js';
  return {
    postcssPlugin: 'postcss-wxss-to-theme',
    prepare (result) {
      const postcssPath = result.opts.from;
      const tempResult = { light: {}, dark: {} };
      return {
        Declaration (decl) {
          if (!decl.variable) return;
          const mediaNode = decl.parent.parent;
          let colorScheme;
          if (mediaNode.type === 'root') {
            colorScheme = 'light';
          } else if (mediaNode.type === 'atrule' || mediaNode.name === 'media') {
            colorScheme = /prefers-color-scheme:\s*(light|dark)/.exec(mediaNode.params)?.[1];
          }
          if (!colorScheme) return;
          const key = decl.prop.replace(/^--/, '');
          const value = decl.value;
          tempResult[colorScheme][key] = value;
        },
        OnceExit () {
          Object.keys(keyMap).forEach(themeKey => {
            output.light[themeKey] = tempResult.light[keyMap[themeKey]]
            output.dark[themeKey] = tempResult.dark[keyMap[themeKey]]
          })
          const outputJsonPath = path.resolve(path.dirname(postcssPath), jsonPath)
          const outputJsPath = path.resolve(path.dirname(postcssPath), jsPath)
          fs.writeFileSync(outputJsonPath, JSON.stringify(output, null, 2))
          fs.writeFileSync(outputJsPath, 'module.exports=' + JSON.stringify(output, null, 2))
        },
      }
    }
  }
}
module.exports.postcss = true