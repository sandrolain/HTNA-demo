import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import html from "rollup-plugin-html";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "umd"
    }
  ],
  plugins: [
    typescript({
      typescript: require("typescript")
    }),
    resolve(),
    html({
      include: "src/**/*.html"
    }),
    postcss({
      extract: false,
      modules: false,
      inject: false,
      minimize: true,
      use: ["sass"]
    })
  ]
};
