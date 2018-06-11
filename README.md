

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

## build with appveyor
```bash

## 确保master是最新的，并且package.json已经升了版本号
git co master
git pull

## delete old release branch
git delete-branch release

## create new release
git create-branch release


## 创建release 到https://github.com/zxdong262/wxj-livescreen-client2/releases/new
## 注意标题和Tag version为 v1.x.x 注意要与package.json版本号一致
## 先保存草稿 savedraft,
## 到 https://ci.appveyor.com/project/zxdong262/wxj-livescreen-client2 查看构建进度
## 等构建完毕，刷新，会看到下面多了构建好的资源 wxj-livescreen-client2-1.x.x-win.tar.gz
## 点击publish release即可发布
```