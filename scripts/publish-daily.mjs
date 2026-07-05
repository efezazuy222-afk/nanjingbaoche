import { mkdir, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiKey = process.env.DEEPSEEK_API_KEY;
const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
if (!apiKey) throw new Error("缺少 DEEPSEEK_API_KEY，请在 GitHub Secrets 中配置。");

const today = new Date().toISOString().slice(0, 10);
const blogDir = path.join(root, "src", "content", "blog");
const tourDir = path.join(root, "src", "content", "tours");
await Promise.all([mkdir(blogDir, { recursive: true }), mkdir(tourDir, { recursive: true })]);
const [blogs, tours] = await Promise.all([readdir(blogDir), readdir(tourDir)]);
const type = (blogs.length + tours.length) % 2 === 0 ? "blog" : "tour";
const targetDir = type === "blog" ? blogDir : tourDir;
const filename = `${today}-${type === "blog" ? "nanjing-guide" : "nanjing-route"}.mdx`;
if ((await readdir(targetDir)).includes(filename)) {
  console.log(`今天的${type === "blog" ? "攻略" : "线路"}已经存在：${filename}`);
  process.exit(0);
}

const blogTopics = [
  "南京两天一夜如何减少来回折返",
  "南京南站到主要景区的行程安排思路",
  "雨天游南京的室内与轻步行方案",
  "南京秋季家庭包车的路线取舍",
  "从南京出发去扬州一日游如何安排",
  "商务客人到南京的接送与用车清单",
  "带大件行李在南京换酒店的注意事项",
  "南京夜游结束后如何安排返程车辆",
];
const tourTopics = [
  "南京城南文化一日包车参考路线",
  "钟山风景区深度半日包车参考路线",
  "南京到镇江一日包车参考路线",
  "南京到溧阳休闲包车参考路线",
  "南京民国建筑主题包车参考路线",
  "南京亲子场馆一日包车参考路线",
  "南京美食与老城慢游包车参考路线",
  "南京企业接待多点用车参考方案",
];
const images = [
  "https://images.pexels.com/photos/23379690/pexels-photo-23379690.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/36892230/pexels-photo-36892230.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/37278720/pexels-photo-37278720.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/36354915/pexels-photo-36354915.jpeg?auto=compress&cs=tinysrgb&w=1400",
];
const dayNumber = Math.floor(Date.now() / 86400000);
const topic = (type === "blog" ? blogTopics : tourTopics)[dayNumber % 8];
const cover = images[dayNumber % images.length];

const sharedRules = `
你是南京本地旅游网站的中文编辑。写作自然、可信、具体，帮助家庭游客和商务客人做决定。
严禁虚构客户评价、司机资质、服务价格、景区票价、精确开放时间或实时政策。
涉及预约、开放、交通管制时，必须提醒读者出行前查看官方最新信息。
不要使用夸张承诺，不写“全网最低”“100%满意”等措辞。正文600至900个汉字。
只返回完整MDX文件，不要使用Markdown代码围栏，不要解释。
日期为 ${today}，封面图必须原样使用：${cover}。
`;

const prompt = type === "blog"
  ? `${sharedRules}\n主题：${topic}\nfrontmatter必须严格包含：title、cover、date、category、tags（中文字符串数组）、readTime（整数）、description。frontmatter后写有2至4个二级标题的实用正文。`
  : `${sharedRules}\n主题：${topic}\nfrontmatter必须严格包含：title、category、description、cover、duration、location、group、highlights（3项中文字符串数组）、featured: false。frontmatter后写建议行程、适合人群和温馨提示，不把参考路线写成固定承诺。`;

const response = await fetch("https://api.deepseek.com/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
  body: JSON.stringify({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 3200,
    temperature: 0.7,
  }),
});
if (!response.ok) throw new Error(`DeepSeek API 请求失败：${response.status} ${await response.text()}`);
const payload = await response.json();
let text = payload.choices?.[0]?.message?.content;
if (!text) throw new Error("API 没有返回正文。");
text = text.trim().replace(/^```(?:mdx|markdown)?\s*/i, "").replace(/\s*```$/, "").trim();
if (!text.startsWith("---") || !text.includes("\n---")) throw new Error("生成内容缺少有效 frontmatter。");
if (!text.includes(`cover: "${cover}"`) && !text.includes(`cover: '${cover}'`)) throw new Error("生成内容没有使用指定封面图。");
await writeFile(path.join(targetDir, filename), `${text}\n`, "utf8");
console.log(`已生成：${path.relative(root, path.join(targetDir, filename))}`);
