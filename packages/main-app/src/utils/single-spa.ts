// 这里使用 npm link 进行连接调试
import { start, registerApplication } from "single-spa/src/single-spa";
import { RegisterApplicationConfig } from "single-spa";

// 对 single-spa 的 registerApplication 进行二次封装，使其可以接收一个数组，批量注册子应用
export function registerMicroApps(apps: RegisterApplicationConfig[]) {
  // @ts-ignore
  window.__DEV__ = true;

  apps.forEach(registerApplication);
  // apps.forEach((item) => {
  //   let { name, activeWhen, customProps } = item;
  //   // single-spa 提供了两种调用方式：registerApplication({ name, app, activeWhen, customProps }) 和 registerApplication(name, app, activeWhen, customProps)
  //   // 详见 https://single-spa.js.org/docs/configuration#registering-applications
  //   registerApplication({
  //     name,
  //     // app 参数可以是一个对象，也可以是一个函数

  //     // 如果 app 参数是对象，那么对象其实是一个包含了生命周期函数的对象，例如：{ bootstrap: async () => {}, mount, unmount }
  //     // 详见 https://single-spa.js.org/docs/configuration#application-as-second-argument

  //     // 如果 app 参数是函数，那么函数的返回值是一个包含了生命周期函数的对象，例如：() => Promise.resolve({ bootstrap: async () => {}, mount, unmount })
  //     // 详见 https://single-spa.js.org/docs/configuration/#activity-function

  //     // 可以查看 TypeScript 定义
  //     app: item.app,
  //     activeWhen,
  //     customProps,
  //   });
  // });
  start();
}

// app 的定义如下所示：
// export type AppProps = {
//   name: string;
//   singleSpa: any;
// };

// type LifeCycleFn<ExtraProps> = (config: ExtraProps & AppProps) => Promise<any>;
// export type LifeCycles<ExtraProps = {}> = {
//   bootstrap: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
//   mount: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
//   unmount: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
//   update?: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
// };

// // 从上面的定义可以看出，app 可以是一个对象，也可以是一个函数，如果是一个函数，那么函数的返回值是一个对象
// // 也就是说，app 的类型可以是 LifeCycles<ExtraProps>，也可以是 (config: ExtraProps & AppProps) => Promise<LifeCycles<ExtraProps>>，这两种类型是等价的
// type Application<ExtraProps = {}> =
//   | LifeCycles<ExtraProps>
//   | ((config: ExtraProps & AppProps) => Promise<LifeCycles<ExtraProps>>);

// export function getAppLifeCycles(res) {
//   let lifeCycles = {}
//   Object.keys(res).forEach((key) => {
//     const lifecycle = res[key];
//     if(lifecycle && typeof lifecycle === 'function') {
//       // 将子应用的所有 lifeCycle 函数进行包装，包装成返回 Promise 的
//       lifeCycles[key] = async (...args) => {
//         console.log(`[main-app] ${key} start`);
//         await lifecycle(...args);
//         console.log(`[main-app] ${key} end`);
//       }
//     }
//   });
//   return lifeCycles;
// }

export function getAppLifeCycles() {
  // 注意动态加载的本质是创建 script 标签进行加载，因此本质上就是动态 script 方案
  // 这里也可以使用 script 标签进行处理

  // 由于使用 UMD 进行子应用的构建，并且将其挂载到了全局变量上，并且挂载全局变量的动作是在内部子应用执行完毕之后，因此这里通过遍历属性顺序拿到子应用的全局变量
  // 这里的顺序是根据子应用的 webpack 配置中的 output.library 属性进行的
  // 需要注意的是这里是在微任务中执行的，因此并不是最佳的实践方案，如果是通过 eval 执行，那么获取的顺序是可靠的

  // Object.keys 可以获取到对象的属性
  // 对象自身属性的返回顺序查看 ECMAScript 2015 标准：
  // https://262.ecma-international.org/6.0/?_gl=1*1tycd0l*_ga*NDQ5NTkxOTguMTcwMTc0MzUwMg..*_ga_TDCK4DWEPP*MTcwMTc0MzUwMS4xLjEuMTcwMTc0MzcxMy4wLjAuMA..&_ga=2.173157030.426159955.1701743502-44959198.1701743502#sec-ordinary-object-internal-methods-and-internal-slots-ownpropertykeys

  //     按照这个规范，Object.keys()的返回顺序如下：

  // 数字键（整数索引），按照升序排列。
  // 字符串键，按照它们被添加到对象的顺序。
  // 符号键，按照它们被添加到对象的顺序。
  // 由于Object.keys()只返回字符串键，因此只需要关心数字键和字符串键。数字键会被视为数组索引并按照数值升序排列，而字符串键则会按照它们创建时的顺序排列。符号键不会被Object.keys()返回，但如果要获取它们，可以使用Object.getOwnPropertySymbols()。

  // 注意，这里的“数字键”指的是那些可被转换为32位无符号整数的字符串键，它们属于数组索引的范围，即在0到2^32-1之间的整数。对于这些数字键，即使它们是作为对象的属性添加的，它们也会被当作数组索引并按照数值排序。其他非数字的字符串键则按照它们添加到对象的顺序进行枚举。

  // 需要注意和 for...in 的区别，for...in 还能遍历原型链上的属性

  // for...in
  // https://262.ecma-international.org/6.0/?_gl=1*1tycd0l*_ga*NDQ5NTkxOTguMTcwMTc0MzUwMg..*_ga_TDCK4DWEPP*MTcwMTc0MzUwMS4xLjEuMTcwMTc0MzcxMy4wLjAuMA..&_ga=2.173157030.426159955.1701743502-44959198.1701743502#sec-for-in-and-for-of-statements-static-semantics-early-errors
  // 并没有提及遍历属性的顺序，因此 for...in 的遍历顺序是不可靠的，但是大部分浏览器的处理方式 Object.keys 是一致的
  const keys = Object.keys(window);
  const app = window[keys[keys.length - 1]];
  let lifeCycles = {};
  Object.keys(app).forEach((key) => {
    const lifecycle = app[key];
    if (lifecycle && typeof lifecycle === "function") {
      // 将子应用的所有 lifeCycle 函数进行包装，包装成返回 Promise 的
      lifeCycles[key] = async (...args) => {
        console.log(`[main-app] ${key} start`);
        await lifecycle(...args);
        console.log(`[main-app] ${key} end`);
      };
    }
  });
  return lifeCycles;
}

export async function fetchApp(url: string) {
  const res = await window.fetch(url);
  const text = await res.text();
  // 执行获取的脚本
  // eval(script);

  // 为什么 qiankun 更加推荐使用 eval 而不是 script 呢？
  // 错误处理：(0, eval) 执行的代码若出现错误，可以通过 try-catch 语句捕获异常进行处理，而 script 标签注入的代码需要通过监听 error 事件来处理异常。
  // 执行时机：使用 script.textContent 插入并执行代码的时机可以被精确控制，因为它发生在你将 script 元素添加到 DOM 的那一刻。而使用 (0, eval) 执行的代码通常是立即执行的，一旦调用，代码就会运行。
  // 性能: 对于大型应用，qiankun 需要动态加载和卸载子应用，script 标签的插入和删除可能会导致性能问题，而 (0, eval) 可以更容易地控制这些操作。
  // 安全性: 使用 script 标签可能会导致某些安全性问题，比如内容安全策略（CSP）的违反，而 (0, eval) 可以更容易地遵守这些策略。
  // 兼容性: 在某些老旧浏览器中，动态插入 script 标签可能会遇到兼容性问题，使用 (0, eval) 可以提供更一致的跨浏览器行为。
  // 调试: <script> 标签内的代码或通过其src属性加载的外部脚本在浏览器的开发者工具中通常有更好的调试体验，可以提供源代码映射。
  // (0, eval) 执行的代码在调试时可能更加困难，特别是如果执行的是压缩或动态生成的代码字符串，那么可能难以找到代码出错的具体位置。

  // 使用 <script> 标签插入内联代码可能会遇到 CSP 限制，因为 CSP 可以禁止执行页面上的内联脚本作为一种安全措施。

  // 现在Chrome开发工具可以调试eval()内的代码，但是有一个问题是，你必须等代码执行一次后才出现在源面板中。

  // 在 webpack 编译后的产物，__webpack_modules__中的路径代码，为什么需要使用 eval 执行
  const script = document.createElement("script");
  script.textContent = text;
  document.head.appendChild(script);

  return getAppLifeCycles();
}
