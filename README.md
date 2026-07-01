# 南京包车网站

域名：`nanjingbaoche.com`

## 本地运行

```bash
npm install
npm run dev
```

正式构建：

```bash
npm run build
```

构建结果位于 `dist`。

## Cloudflare Pages

- 构建命令：`npm run build`
- 输出目录：`dist`
- Node.js：`22`
- 根目录：仓库根目录

将 Cloudflare Pages 连接到 GitHub 仓库后，每次 GitHub push 都会自动重新部署。

首次推送仓库后建议在本地或 GitHub 中执行一次 `npm install` 并提交生成的锁文件，后续部署会更稳定。

## 每日自动发布

工作流位于 `.github/workflows/daily-content.yml`，每天北京时间 09:30 执行，在博客和线路之间轮换，一天发布一份内容。

在 GitHub 仓库的 `Settings > Secrets and variables > Actions` 中新增：

- Secret：`OPENAI_API_KEY`
- Variable（可选）：`OPENAI_MODEL`，默认使用 `gpt-5.4-mini`

密钥不要写入 `.env.example`、源码或提交记录。工作流会先生成内容，再执行构建检查；只有构建成功才会提交并触发 Cloudflare 部署。

## 联系信息

- 电话：400-858-0518
- 手机：152 5096 9678
- 邮箱：932168783@qq.com
