

# wxj-livescreen-client2

无限极产品大屏专用客户端

[![Build status](https://ci.appveyor.com/api/projects/status/x3fsu946hys7p5gp?svg=true)](https://ci.appveyor.com/project/zxdong262/wxj-livescreen-client2)

## 下载
https://github.com/zxdong262/wxj-livescreen-client2/releases

```

## 开发
```bash
# tested on ubuntu16.04 only
# with node 8.6+

git clone git@github.com:zxdong262/wxj-livescreen-client2.git
cd wxj-livescreen-client2
npm i

# server
npm run s

# client
npm run c

# app
npm run dev
```

## test build
```bash
# tested only in ubuntu 16.04 x64
# install yarn first(to do yarn autoclean)
# see https://yarnpkg.com/en/docs/install

# build linux only with -l
npm run release -l
# visit dist/
```
