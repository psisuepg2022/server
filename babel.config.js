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
        "@middlewares": "./src/infra/http/middlewares",
        "@config": "./src/infra/config",
        "@providers": "./src/providers",
        "@models": "./src/models",
        "@routes": "./src/infra/http/routes",
        "@containers": "./src/infra/containers",
        "@common": "./src/common",
        "@controllers": "./src/infra/http/controllers",
        "@services": "./src/services",
        "@repositories": "./src/infra/database/repositories",
      }}
    ],
  ],
  ignore: ["**/*.spec.ts"],
};