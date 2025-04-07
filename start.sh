#!/bin/bash

# 获取脚本所在目录
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 启动 Node.js 服务器
cd "$DIR"
node server.js &

# 等待服务器启动
sleep 2

# 启动 NW.js 应用
nw . 