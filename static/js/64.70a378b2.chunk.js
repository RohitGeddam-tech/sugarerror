(this["webpackJsonpsugarlogger-frontend"]=this["webpackJsonpsugarlogger-frontend"]||[]).push([[64],{143:function(e,a,t){"use strict";var n=t(9),s=t(0),r=t.n(s),c=t(2);a.a=function(e){var a=e.type,t=e.placeholder,o=e.value,i=e.name,l=e.onChange,m=e.onBlur,u=e.error,d=e.disabled,p=void 0!==d&&d,b=e.icon,f=e.className,v=void 0===f?"":f,E=e.hasGrayBack,w=void 0!==E&&E,g=e.showPass,O=e.maxLength,N=e.ref,h=Object(s.useState)(!1),x=Object(n.a)(h,2),j=x[0],k=x[1],T=u?"has-error":"";v+=" form-control ";var y=Object(s.useRef)(null);return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"input-group text-input ".concat(T," ").concat(w?"background-gray":"")},r.a.createElement("input",{type:(g?j?"text":"password":a)||"text",className:v,name:i,value:o,onChange:l,autoComplete:"off",ref:N||y,disabled:p,onBlur:m,maxLength:O}),r.a.createElement("label",{className:"input-placeholder"},t),b?r.a.createElement("span",{className:"input-icon"},b):r.a.createElement(r.a.Fragment,null),g?r.a.createElement("span",{className:"input-icon cursor-pointer",onClick:function(){return k(!j)}},j?c.ab:c.bb):r.a.createElement(r.a.Fragment,null),u?r.a.createElement("p",{className:"assistive-text error-text"},u):r.a.createElement("p",{className:"assistive-text"})))}},147:function(e,a,t){"use strict";var n=t(0),s=t.n(n),r=t(158);t(157);a.a=function(e){var a=e.message,t=e.type,c=e.callback,o=Object(n.useCallback)((function(e){switch(e){case"success":r.b.success(a,{position:r.b.POSITION.BOTTOM_RIGHT}),setTimeout((function(){c&&c()}),1500);break;case"error":r.b.error(a,{position:r.b.POSITION.BOTTOM_RIGHT});break;case"info":r.b.info(a,{position:r.b.POSITION.BOTTOM_RIGHT});break;case"warn":r.b.warn(a,{position:r.b.POSITION.BOTTOM_RIGHT})}}),[c,a]);return Object(n.useEffect)((function(){a&&t&&o(t)}),[a,o,t]),s.a.createElement("div",null,s.a.createElement(r.a,null))}},1531:function(e,a,t){"use strict";t.r(a);var n=t(14),s=t.n(n),r=t(18),c=t(13),o=t(9),i=t(0),l=t.n(i),m=t(147),u=t(10),d=t(143),p=t(182),b=t(22),f=t(4),v=t(2),E={password:"",confirm_password:""};a.default=function(e){var a=Object(f.i)().tokenId,t=Object(i.useState)(E),n=Object(o.a)(t,2),w=n[0],g=n[1],O=Object(i.useState)(),N=Object(o.a)(O,2),h=N[0],x=N[1],j=Object(i.useState)(!1),k=Object(o.a)(j,2),T=k[0],y=k[1],P=Object(i.useState)({show:!1,message:"",type:""}),S=Object(o.a)(P,2),I=S[0],C=S[1],_=Object(i.useState)([{minimunLength:!1},{containMix:!1},{containNumber:!1}]),M=Object(o.a)(_,2),B=M[0],L=M[1],R=function(e,a){var t=Object(c.a)({},w);t[a]=e,"password"===a&&G(e),g(Object(c.a)({},t))},G=function(e){var a=Object(c.a)({},B);a.minimunLength=e.length>=8,a.containMix=!!/(?=.*[a-z])(?=.*[A-Z])/.test(e),a.containNumber=!!/(?=.*\d)/.test(e),L(a)},H=function(){var t=Object(r.a)(s.a.mark((function t(n){var r,c,o,i,l,m,u,d,p;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n.preventDefault(),y(!0),x({}),r=w.password,c=w.confirm_password,t.next=6,Object(b.fetchRequest)({url:"/create_password/".concat(a),method:"POST",body:{password:r||"",confirm_password:c||""}});case 6:if(o=t.sent,y(!1),!o||200!==o.status){t.next=17;break}return t.next=11,o.json();case 11:i=t.sent,(l=i.message)&&C({show:!1,message:l,type:"success"}),setTimeout((function(){e.history.push("/sign-in")}),2e3),t.next=31;break;case 17:if(!o||422!==o.status){t.next=25;break}return t.next=20,o.json();case 20:m=t.sent,u=m.errors,x(u),t.next=31;break;case 25:if(!o||400!==o.status){t.next=31;break}return t.next=28,o.json();case 28:d=t.sent,(p=d.message)&&C({show:!1,message:p,type:"error"});case 31:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),A=w.password,F=w.confirm_password;return l.a.createElement(p.a,{sectionClass:"sign-in"},l.a.createElement(m.a,I),l.a.createElement("div",{className:"col-md-12"},l.a.createElement("div",{className:"content-wrapper"},l.a.createElement("span",{className:"black-heading"},"Set Your New Password"),l.a.createElement("form",{onSubmit:H,className:"sign-in-form mt-4 text-center"},l.a.createElement("div",{className:"form-group mb-3"},l.a.createElement(d.a,{placeholder:"Enter Password",value:A,type:"password",onChange:function(e){return R(e.target.value,"password")},error:h&&h.password,showPass:!0})),l.a.createElement("div",{className:"form-group mb-4"},l.a.createElement(d.a,{placeholder:"Confirm Password",value:F,type:"password",onChange:function(e){return R(e.target.value,"confirm_password")},error:h&&h.confirm_password,showPass:!0})),l.a.createElement("div",{className:"ml-1 mb-4 text-left password-validation"},"Password should contain :",l.a.createElement("ul",null,l.a.createElement("li",{className:"d-flex ".concat(B.minimunLength?"validated":"")},l.a.createElement("p",{className:"validation-icon"},v.o),l.a.createElement("p",{className:"validation-text"},"Minimum 8 Digits")),l.a.createElement("li",{className:"d-flex ".concat(B.containMix?"validated":"")},l.a.createElement("p",{className:"validation-icon"},v.o),l.a.createElement("p",{className:"validation-text"},"Mix of UPPERCASE and lowercase")),l.a.createElement("li",{className:"d-flex ".concat(B.containNumber?"validated":"")},l.a.createElement("p",{className:"validation-icon"},v.o),l.a.createElement("p",{className:"validation-text"},"A number (0-9)")))),l.a.createElement("div",{className:"form-group mb-4"},l.a.createElement(u.ContainedButton,{type:"submit",black:!0,className:"login-btn",disabled:T||!(B.minimunLength&&B.containMix&&B.containNumber)},T?l.a.createElement("div",{class:"spinner-border",role:"status"},l.a.createElement("span",{class:"sr-only"},"Loading...")):l.a.createElement("span",null,"Set Password")))))))}},182:function(e,a,t){"use strict";t.d(a,"a",(function(){return r}));var n=t(0),s=t(20),r=function(e){var a=e.children,t=e.sectionClass;return n.createElement("section",{className:"section-wrapper ".concat(t,"-section")},n.createElement(s.a,null,n.createElement("div",{className:"row section-content-wrapper"},a)))}}}]);
//# sourceMappingURL=64.70a378b2.chunk.js.map