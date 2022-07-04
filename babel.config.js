module.exports = {
  presets: [
    "@babel/preset-typescript",
    ["@babel/preset-env", { targets: { node: "current" }, loose: false }],
  ],
  plugins: [
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: false }],
    [
      "module-resolver", { alias: { 
        "@helpers": "./src/helpers",
        "@infra": "./src/infra",
        "@handlers": "./src/handlers",
        "@middlewares": "./src/middlewares",
        "@config": "./src/config",
        "@providers": "./src/providers",
        "@models": "./src/models",
        "@routes": "./src/routes",
        "@containers": "./src/containers",
        "@common": "./src/common",
      }}
    ],
  ],
  ignore: ["**/*.spec.ts"],
};