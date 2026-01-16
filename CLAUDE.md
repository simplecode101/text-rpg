# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 React + TypeScript + Vite 的文字 RPG 游戏网页应用。游戏核心玩法包括刷怪、升级、获得装备、技能等。

## 技术栈

- **前端框架**: React 19.2.0 + TypeScript
- **构建工具**: Vite 7.2.4
- **样式方案**: Tailwind CSS 4.1.18 (使用 Vite 插件)
- **包管理器**: pnpm
- **代码检查**: ESLint (Flat Config 格式)

## 常用命令

### 开发
```bash
pnpm dev          # 启动开发服务器
```

### 构建
```bash
pnpm build        # 构建生产版本 (先执行 TypeScript 编译，再执行 Vite 构建)
pnpm preview      # 预览生产构建
```

### 代码检查
```bash
pnpm lint         # 运行 ESLint 检查
```

## 架构说明

### 项目结构

项目采用标准的 Vite + React 单页应用架构：
- 入口: `index.html` → `src/main.tsx` → `src/App.tsx`
- 使用 React 19 的 createRoot API + StrictMode
- 单一根节点: `<div id="root">`

### TypeScript 配置

项目使用 TypeScript 多配置文件结构：
- `tsconfig.json` - 根配置，引用其他配置
- `tsconfig.app.json` - 应用代码配置
- `tsconfig.node.json` - Node.js 工具代码配置

关键编译选项：
- 目标: ES2022
- 模块系统: ESNext (bundler 解析策略)
- 严格模式: 启用所有严格检查
- 不允许未使用的参数
- verbatimModuleSyntax: 严格模块语法

### 样式方案

使用 Tailwind CSS v4 + Vite 插件（最新版本），通过 `@tailwindcss/vite` 插件集成。

### ESLint 配置

使用 Flat Config 格式（`eslint.config.js`），包含：
- React Hooks 规则
- React Refresh 插件
- TypeScript 支持

## 开发注意事项

### TypeScript 严格模式

项目启用了严格的 TypeScript 配置，包括：
- `noUnusedLocals`: 不允许未使用的局部变量
- `noUnusedParameters`: 不允许未使用的参数
- `noFallthroughCasesInSwitch`: switch 语句必须有 break 或 return
- `noUncheckedIndexedAccess`: 索引访问可能返回 undefined

### React 19 特性

项目使用 React 19 最新版本，可以使用最新的 React 特性和 API。

### 模块系统

- 使用 ES Modules (`"type": "module"`)
- 导入路径使用 bundler 解析策略，支持各种导入扩展名

## 状态

项目目前处于初始状态，已完成基础设施搭建，但游戏核心功能尚未实现。
