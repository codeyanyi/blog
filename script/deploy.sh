

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist


git init
git add -A
git commit -m 'feat(blog):Update blog content'


git push -f git@github.com:GitLuoSiyu/GitLuosiyu.github.io.git


cd -