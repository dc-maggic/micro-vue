var singleTag = "br hr img input";//单闭合标签白名单

var startTagOpen = /<(\/)?([a-zA-Z]*)[^>\/]*(\/)?>/;
var attribute = /^\s*([^\s=]*)=(["'\w\s(),]*"|')/; //考虑兼容l-for指令的一些情况
var startTagClose = /^\s*(\/?)>/;
var mutationsTag = /(\{\{[a-zA-Z-_]\}\})/;


var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

// var isHTMLTag = makeMap(
//   'html,body,base,head,link,meta,style,title,' +
//   'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
//   'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
//   'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
//   's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
//   'embed,object,param,source,canvas,script,noscript,del,ins,' +
//   'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
//   'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
//   'output,progress,select,textarea,' +
//   'details,dialog,menu,menuitem,summary,' +
//   'content,element,shadow,template,blockquote,iframe,tfoot'
// );

function parseHtml(html, Vnode = createVnode()) {
  if (!html) {
    return Vnode;
  }
  let textLength = html.indexOf("<"),
    data = null;
  if (textLength !== 0) {
    data = parseText(textLength, html, Vnode);
  } else {
    data = parseDom(html, Vnode);
  }
  parseHtml(data.html.trim(), data.target);
  return Vnode;
}

function parseText(textLength, html, Vnode) {
  if (textLength === -1) {
    textLength = 0;
  }
  var text = html.slice(0, textLength);
  Vnode.tag = " ";
  Vnode.type = 3;
  Vnode.text = text;
  return {
    html: forward(html, text.length).trim(),
    target: stackAdd(Vnode)
  };
}

function parseDom(html, Vnode) {
  var result = html.match(startTagOpen),
    target = null;
  if (result[0] == html) {
    //整个html解析结束
    Vnode.parent.children.pop(); //删除当前无用节点
    return { html: "" };
  } else if (result[1]) {
    //如果是结束标签</div>，则当前的vnode一定是div标签的子元素
    var parent = Vnode.parent.parent, //拿到div标签的父元素，给div设置下一个兄弟元素
      children = parent.children,
      index = children.length;
    Vnode.parent.children.pop(); //删除当前无用节点
    children[index] = createVnode();
    target = children[index];
    target.parent = parent;
    html = forward(html, result[0].length);
  } else {
    //如果不是结束标签
    Vnode.tag = result[2];
    Vnode.type = 1;
    var reg = new RegExp(`\\b${result[2]}\\b`);
    if (!result[3] && !singleTag.match(reg)) {
      //如果不是类似input之类的单闭合标签
      Vnode.children[0] = createVnode();
      target = Vnode.children[0];
      target.parent = Vnode;
    } else {
      //如果是单闭合标签
      target = stackAdd(Vnode);
    }
    html = forward(html, result[2].length + 1);
    html = parseProps(html, Vnode);
    html = parseEnd(html, Vnode);
  }
  return {
    html,
    target
  };
}

function stackAdd(Vnode) {
  var children = Vnode.parent.children,
    index = children.length,
    target = null;
  children[index] = createVnode();
  target = children[index];
  target.parent = children[0].parent;
  return target;
}

function parseProps(html, Vnode) {
  var result = null;
  while ((result = html.match(attribute))) {
    const attr = result[0].trim().split("=");
    const attrName = attr[0], attrValue = attr[1].replace(/'|"/g, "");
    Vnode.attrs.push({ name: attrName, value: attrValue });
    Vnode.attrsMap[attrName] = attrValue
    Vnode.attrString += result[0];
    html = forward(html, result[0].length);
  }
  return html;
}

function parseEnd(html, Vnode) {
  var result = html.match(startTagClose);
  html = forward(html, result[0].length);
  return html;
}

function createVnode() {
  return {
    attrs: [],
    attrString: "",
    children: [],
    parent: null,
    tag: "",
    text: "",
    type: 1,
    attrsMap: {}
  };
}

function cloneVnode(Vnode) {
  let node = createVnode();
  node.attrString = Vnode.attrString;
  node.attrs = Vnode.attrs.concat();
  node.parent = Vnode.parent;
  node.tag = Vnode.tag;
  node.text = Vnode.text;
  cloneChildren(Vnode.children, node);
  return node;
}

function cloneChildren(children, node) {
  let nodeChildren = node.children;
  children.forEach(item => {
    let child = cloneVnode(item);
    child.parent = node;
    nodeChildren.push(child);
  });
}

function forward(temp, length) {
  console.log(temp)
  return temp.slice(length);
}

