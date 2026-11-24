import{lr as s}from"./index-Z_o9v4Jf.js";import{ls as c,lt as x,lu as y,lv as g,f3 as v,lw as j}from"./index-Z_o9v4Jf.js";function u(n){let{options:e,value:r}=n;return typeof e[r]=="number"}function p(n){let e="";for(let r in n){let t=n[r];if(typeof t=="boolean")t&&(e+=`#define ${r}
`);else if(typeof t=="number")e+=`#define ${r} ${t.toFixed()}
`;else if(typeof t=="object")if(u(t)){let{value:o,options:f,namespace:a}=t,i=a?`${a}_`:"";for(let l in f)e+=`#define ${i}${l} ${f[l].toFixed()}
`;e+=`#define ${r} ${i}${o}
`}else{let o=t.options,f=0;for(let a in o)e+=`#define ${o[a]} ${(f++).toFixed()}
`;e+=`#define ${r} ${o[t.value]}
`}}return e}function d(n,e,r,t=""){return new s(n,t+e.vertexShader,t+e.fragmentShader,r)}export{c as BufferObject,s as DisposableProgram,x as FramebufferObject,y as ProgramCache,g as Renderbuffer,v as Texture,j as VertexArrayObject,d as createProgram,p as glslifyDefineMap};
