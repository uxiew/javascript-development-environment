/**
 * @description 该文件将检测 package.json5 与 package.json 文件之间互相转化
 */
const path = require('path');
const fs = require('fs');
const md5 = require('md5');
const json5 = require('json5');
require('json5/lib/register');

// 变量
let preveMd5 = null,
  fsWait = false;
const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg5Path = pkgPath + 5;

console.log(`=== 正在监听 ${pkgPath} 与 ${pkg5Path} ===`);
// console.log(pkg5);

// pkg5 => pkg

function ConvertToPkg() {
  // const pkg5 = require(pkg5Path);
  let pkg = fs.readFileSync(pkg5Path, 'utf8');
  pkg = json5.stringify(
    json5.parse(pkg),
    null,
   2
  );

  console.log(pkg);

  // 处理 JSON 引号
  // pkg = JSON.parse('{' + pkg.split(/'\{|\}'/)[1].replace(/\\\\"/g, "'") + '}');

  // 最后写入
  fs.writeFileSync(pkgPath, pkg);
}

// pkg => pkg5

function ConvertToPkg5() {
  let pkgStr = fs.readFileSync(pkgPath, 'utf8');
  console.log(pkgStr);

  // 最后写入
  fs.writeFileSync(pkg5Path, pkgStr);
}

// 生成 pkg5 文件
ConvertToPkg();
// 第二检测  package.json 文件改动， 更新 package.json5
// ...

console.log(
  md5(fs.readFileSync(path.resolve(__dirname, '..', 'package.json5'))),

  md5(fs.readFileSync(path.resolve(__dirname, '..', 'package.json')))
);

fs.watch(pkg5Path, (event, filename) => {
  if (filename) {
    if (fsWait) return;
    fsWait = setTimeout(() => {
      fsWait = false;
    }, 100);
    var currentMd5 = md5(fs.readFileSync(pkg5Path));
    if (currentMd5 == preveMd5) {
      return;
    }
    preveMd5 = currentMd5;
    console.log(`${pkg5Path}文件发生更新`);

    // todo...
  }
});
