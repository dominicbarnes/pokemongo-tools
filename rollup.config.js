
// rollup plugins
import PluginCommonJS from 'rollup-plugin-commonjs'
import PluginJSON from 'rollup-plugin-json'
import PluginNodeBuiltins from 'rollup-plugin-node-builtins'
import PluginNodeGlobals from 'rollup-plugin-node-globals'
import PluginNodeResolve from 'rollup-plugin-node-resolve'
import PluginPostCSS from 'rollup-plugin-postcss'
import PluginReplace from 'rollup-plugin-replace'
import { terser as PluginTerser } from 'rollup-plugin-terser'
import PluginVue from 'rollup-plugin-vue'

// postcss plugins
import PostCSSImport from 'postcss-import'
import PostCSSURL from 'postcss-url'

const env = process.env.NODE_ENV || 'development'
const stage = process.env.UP_STAGE || 'development'

const plugins = [
  PluginReplace({
    'process.env.NODE_ENV': JSON.stringify(env),
    'process.env.UP_STAGE': JSON.stringify(stage)
  }),
  PluginCommonJS(),
  PluginJSON(),
  PluginNodeBuiltins(),
  PluginNodeGlobals(),
  PluginNodeResolve({
    mainFields: [ 'module', 'browser', 'main' ]
  }),
  PluginVue(),
  PluginPostCSS({
    extract: true,
    sourceMap: true,
    minimize: env !== 'development',
    plugins: [
      PostCSSImport(),
      PostCSSURL({
        url: 'copy',
        assetsPath: 'assets',
        useHash: true
      })
    ]
  })
]

if (env !== 'development') {
  plugins.push(PluginTerser())
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
