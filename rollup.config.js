
import PluginAlias from 'rollup-plugin-alias'
import PluginBabelMinify from 'rollup-plugin-babel-minify'
import PluginCommonJS from 'rollup-plugin-commonjs'
import PluginJSON from 'rollup-plugin-json'
import PluginNodeBuiltins from 'rollup-plugin-node-builtins'
import PluginNodeGlobals from 'rollup-plugin-node-globals'
import PluginNodeResolve from 'rollup-plugin-node-resolve'
import PluginVue from 'rollup-plugin-vue'

const env = process.env.NODE_ENV || 'development'

const plugins = [
  PluginAlias(),
  PluginCommonJS(),
  PluginJSON(),
  PluginNodeBuiltins(),
  PluginNodeGlobals(),
  PluginNodeResolve({
    mainFields: [ 'module', 'browser', 'main' ]
  }),
  PluginVue()
]

if (env !== 'development') {
  plugins.push(PluginBabelMinify({ comments: false }))
}

export default {
  input: 'index.js',
  output: {
    file: 'public/index.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: plugins
}
