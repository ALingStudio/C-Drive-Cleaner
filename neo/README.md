# C Drive Cleaner neo 1.0 — 交付包

## 内容

- `C-Drive-Cleaner-neo-1.0-Win64.exe` — 主程序（单文件便携版，8.8 MB，需管理员权限，内置 16 国语言）
- `source/` — 完整源代码（Go + Wails v2 + 原生 HTML/CSS/JS 前端）

## 技术架构

- 后端：Go 1.22 + Wails v2.9.2（Windows 系统原生 WebView2 渲染，不捆绑 Chromium）
- 清理功能：运行时解析内置的原版 `C Drive Cleaner v2.9.bat`，清理命令逐字取自原脚本执行（SHA-256: 9b989067…8c93d9，零改动）
- 大文件查找：neo 原生高速引擎（Go 并发遍历 + top-20 最小堆），替代旧版 PowerShell 方案，带实时进度条
- 多语言：16 种语言，跟随系统语言 + 手动切换持久化

## 构建方法

```
# 依赖：Go 1.22+、Wails CLI v2.9.2、mingw-w64（交叉编译用）
wails build -platform windows/amd64 -o C-Drive-Cleaner-neo-1.0-Win64.exe
```

## 已执行的测试

1. 解析器/运行器单元测试：原脚本结构解析、命令逐字校验、布局控制流校验（全部通过）
2. 高速扫描器单元测试：阈值匹配、top-N 堆、进度回调、取消、空目录（全部通过）
3. 界面截图验证：9 个界面场景
4. Windows 真机行为以用户实测为准（构建环境为 Linux，无法运行 Windows 图形界面）
