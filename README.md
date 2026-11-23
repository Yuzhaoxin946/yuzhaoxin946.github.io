# 余昭昕的学术主页

双击 `index.html` 即可浏览。编辑文件后保存，刷新浏览器即可看到修改。部署时上传整个目录。

## 修改论文

每篇论文位于 `assets/publications/<论文文件夹>/`。编辑 `paper.js` 可以修改标题、作者顺序、共同一作、发表信息、论文链接和中英文 TL;DR。`figure` 指向同目录的原色主图，灰度和悬停效果由 CSS 控制。

例如，ICML 2026 论文在 `assets/publications/physlogic/`。作者名按展示顺序写入 `authors`，共一作者名写入 `equalFirstAuthors`，姓名拼写须与作者列表一致。

## 新增、排序或移除论文

1. 在 `assets/publications/` 下复制一篇已有论文的文件夹，用新的英文简称命名。
2. 修改其中的 `paper.js`，换上对应主图。图片可使用 PNG、JPEG 或 WebP；若文件名改变，同时更新 `figure`。分类 `topic` 可选 `sci`（科学推理）、`ttr`（测试时推理）、`psy`（计算心理学）或 `other`（其他）。
3. 在 `assets/publications/list.js` 的数组中加入新文件夹名。数组顺序就是页面顺序，筛选计数自动计算。移除数组里的名字即可将该论文撤下。

## 其他内容

- `index.html` 保存中英文简介、研究方向、近况、履历和联系方式。
- `assets/images/portrait.jpg` 是个人照片。
- `assets/style.css` 控制桌面和手机布局；`assets/fonts/` 保存英文字体和许可证。
- `assets/site.js` 负责论文展示、中英文切换和分类筛选。
