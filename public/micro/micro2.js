let root;
// 以下其实可以是 React 框架或者 Vue 框架生成的 Document 元素，这里只是做一个简单的示例
root = document.createElement("h1");
root.textContent = "微应用2";
// 约定往空的 iframe 的 body 下挂载微应用
document.body.appendChild(root);

this.a = 333;
console.log('a: ', a);
console.log('a: ', window.a);

var b = 444;
console.log('b: ', b);
console.log('b: ', window.b);