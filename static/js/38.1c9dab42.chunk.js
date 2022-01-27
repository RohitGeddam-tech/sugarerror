(this["webpackJsonpsugarlogger-frontend"]=this["webpackJsonpsugarlogger-frontend"]||[]).push([[38],{143:function(e,a,t){"use strict";var r=t(9),c=t(0),n=t.n(c),s=t(2);a.a=function(e){var a=e.type,t=e.placeholder,l=e.value,o=e.name,i=e.onChange,u=e.onBlur,m=e.error,d=e.disabled,p=void 0!==d&&d,g=e.icon,v=e.className,b=void 0===v?"":v,f=e.hasGrayBack,h=void 0!==f&&f,E=e.showPass,y=e.maxLength,N=e.ref,k=Object(c.useState)(!1),O=Object(r.a)(k,2),x=O[0],j=O[1],w=m?"has-error":"";b+=" form-control ";var C=Object(c.useRef)(null);return n.a.createElement(n.a.Fragment,null,n.a.createElement("div",{className:"input-group text-input ".concat(w," ").concat(h?"background-gray":"")},n.a.createElement("input",{type:(E?x?"text":"password":a)||"text",className:b,name:o,value:l,onChange:i,autoComplete:"off",ref:N||C,disabled:p,onBlur:u,maxLength:y}),n.a.createElement("label",{className:"input-placeholder"},t),g?n.a.createElement("span",{className:"input-icon"},g):n.a.createElement(n.a.Fragment,null),E?n.a.createElement("span",{className:"input-icon cursor-pointer",onClick:function(){return j(!x)}},x?s.ab:s.bb):n.a.createElement(n.a.Fragment,null),m?n.a.createElement("p",{className:"assistive-text error-text"},m):n.a.createElement("p",{className:"assistive-text"})))}},144:function(e,a,t){"use strict";var r=t(0),c=t.n(r),n=t(156);a.a=function(e){var a=e.className,t=void 0===a?"":a,s=e.options,l=void 0===s?[]:s,o=e.value,i=e.onChange,u=e.placeholder,m=e.error,d=e.hasGrayBack,p=void 0!==d&&d,g=e.isMulti,v=void 0!==g&&g,b=(e.hideSelectedOptions,e.isClearable),f=void 0===b||b,h=e.disabled,E=e.isLoading,y=e.hidePlaceholder,N=e.defaultValue,k=e.isSearchable,O=void 0!==k&&k,x="input-group select-control-input ".concat(m?"has-error":""," ").concat(p?"background-gray":""," ").concat(o&&o.value?"has-value":""," ").concat(y?"hide-placeholder":""," ").concat(h?"cursor-notAllowed":"");t+=" select-input ";var j=Object(r.useRef)(null);return c.a.createElement(c.a.Fragment,null,c.a.createElement("div",{className:x,ref:j},c.a.createElement(n.a,{value:o,onChange:i,options:l,className:t,classNamePrefix:"select-input",placeholder:c.a.createElement("div",null,""),onFocus:function(){return j.current.classList.add("select-focused")},onBlur:function(){return j.current.classList.remove("select-focused")},isClearable:f,isMulti:v,removeSelected:!1,defaultValue:N,isDisabled:h,isLoading:E,isSearchable:O}),c.a.createElement("label",{className:"select-placeholder"},u)),m?c.a.createElement("p",{className:"assistive-text error-text"},m):c.a.createElement("p",{className:"assistive-text"}))}},147:function(e,a,t){"use strict";var r=t(0),c=t.n(r),n=t(158);t(157);a.a=function(e){var a=e.message,t=e.type,s=e.callback,l=Object(r.useCallback)((function(e){switch(e){case"success":n.b.success(a,{position:n.b.POSITION.BOTTOM_RIGHT}),setTimeout((function(){s&&s()}),1500);break;case"error":n.b.error(a,{position:n.b.POSITION.BOTTOM_RIGHT});break;case"info":n.b.info(a,{position:n.b.POSITION.BOTTOM_RIGHT});break;case"warn":n.b.warn(a,{position:n.b.POSITION.BOTTOM_RIGHT})}}),[s,a]);return Object(r.useEffect)((function(){a&&t&&l(t)}),[a,l,t]),c.a.createElement("div",null,c.a.createElement(n.a,null))}},1501:function(e,a,t){"use strict";t.r(a);var r=t(14),c=t.n(r),n=t(13),s=t(18),l=t(9),o=t(0),i=t.n(o),u=t(144),m=t(143),d=t(184),p=t(197),g=t(10),v=t(22),b=t(152),f=t(147),h={category:{},type:{},name:"",description:"",credits:"",amount:"",renewable:!0,trial_package:!1};a.default=function(e){var a=Object(o.useState)({categories:[],types:[]}),t=Object(l.a)(a,2),r=t[0],E=t[1],y=Object(o.useState)(h),N=Object(l.a)(y,2),k=N[0],O=N[1],x=Object(o.useState)({}),j=Object(l.a)(x,2),w=j[0],C=j[1],_=Object(o.useState)({show:!1,message:"",type:""}),T=Object(l.a)(_,2),S=T[0],B=T[1],I=Object(o.useState)(!1),P=Object(l.a)(I,2),L=P[0],R=P[1];Object(o.useEffect)((function(){r.categories.length||Object(s.a)(c.a.mark((function e(){var a,t,r,s,l;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(v.fetchRequest)({url:"/super_admin/package_type_and_category",method:"GET",isAuth:!0});case 2:if((a=e.sent)&&R(!1),!a||200!==a.status){e.next=14;break}return e.next=7,a.json();case 7:return t=e.sent,r=t.data,[],[],s=r.categories.map((function(e){return Object(n.a)({label:e.formatted_category,value:e.category},e)})),l=r.types.map((function(e){return{label:e.formatted_type,value:e.type}})),E({categories:s,types:l}),e.abrupt("return",r);case 14:return e.abrupt("return");case 15:case"end":return e.stop()}}),e)})))()}),[r.categories.length]),Object(o.useEffect)((function(){O((function(e){return Object(n.a)(Object(n.a)({},e),{},{category:r.categories.length?r.categories[0]:{},type:r.types.length?r.types[0]:{}})}))}),[r]);var G=function(e,a){var t=Object(n.a)({},k);t[a]=e,"trial_package"===a&&(t.amount=0),O(Object(n.a)({},t))},F=function(){var a=Object(s.a)(c.a.mark((function a(t){var r,s,l,o;return c.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return C({}),R(!0),B({show:!1,message:"",type:""}),t.preventDefault(),r=Object(n.a)(Object(n.a)({},k),{},{category:k.category.category,type:k.type.value}),a.next=7,Object(v.fetchRequest)({url:"/super_admin/package",method:"POST",isAuth:!0,body:r});case 7:if(s=a.sent,R(!1),!s||200!==s.status){a.next=17;break}return a.next=12,s.json();case 12:(l=a.sent).success&&l.message&&B({show:!0,message:l.message,type:"success"}),setTimeout((function(){return e.history.push("/".concat(localStorage.getItem("loginAs"),"/packages/list"))}),2e3),a.next=22;break;case 17:return a.next=19,s.json();case 19:o=a.sent,C(Object(n.a)({},o.errors)),422!==s.status&&!Object.keys(o.error?o.error:{}).length&&o.message&&B({show:!0,message:o.message,type:"error"});case 22:return a.abrupt("return");case 23:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}(),M=r.categories,H=r.types,q=k.category,A=k.type,D=k.description,J=k.validity,V=k.credits,U=k.amount,z=k.renewable,K=k.trial_package;return i.a.createElement("div",{className:"add-package-container"},i.a.createElement(f.a,S),i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-md-7 mr-3"},i.a.createElement("form",{onSubmit:F},i.a.createElement("div",{className:"paper"},i.a.createElement("p",{className:"semi-bold title mb-3"},"Enter the required details"),i.a.createElement("div",{className:"row mb-4"},i.a.createElement("div",{className:"form-group col-md-6 col-12"},i.a.createElement(u.a,{placeholder:"Category",options:M,value:q,onChange:function(e){return G(e,"category")},error:w&&w.category,isClearable:!1})),q.has_types&&i.a.createElement("div",{className:"form-group col-md-6 col-12"},i.a.createElement(u.a,{placeholder:"Package Type",options:H,value:A,onChange:function(e){return G(e,"type")},error:w&&w.type}))),i.a.createElement("div",{className:"row mb-4"},i.a.createElement("div",{className:"form-group col-md-6 col-12"},i.a.createElement(m.a,{placeholder:"Price (\u20b9)",value:U||"",onChange:function(e){return G(e.target.value,"amount")},error:w&&w.amount,disabled:K})),i.a.createElement("div",{className:"form-group col-md-6 col-12"},i.a.createElement(m.a,{placeholder:"Patients",value:V||"",onChange:function(e){return G(e.target.value,"credits")},error:w&&w.credits}))),i.a.createElement("div",{className:"row"},!q.has_types&&i.a.createElement("div",{className:"form-group col-md-5 col-12 mb-4"},i.a.createElement(m.a,{placeholder:"Duration (in days)",value:J||"",onChange:function(e){return G(e.target.value,"validity")},error:w&&w.validity}))),i.a.createElement("div",{className:"row mb-4"},i.a.createElement("div",{className:"form-group col-md-8 col-12"},i.a.createElement(d.a,{placeholder:"Description",maxLength:60,value:D||"",onChange:function(e){return G(e.target.value,"description")},error:w&&w.description}))),i.a.createElement("div",{className:"row mb-4"},i.a.createElement("div",{className:"form-group col-md-5 col-12"},i.a.createElement(b.a,{name:"renewable",label:"Renewable Package",checked:z,value:z,blue:!0,onClick:function(){return G(!z,"renewable")}})),i.a.createElement("div",{className:"form-group col-md-6 col-12"},i.a.createElement(b.a,{name:"trial_package",label:"Trial Package",checked:K,blue:!0,value:K,onClick:function(){return G(!K,"trial_package")}}))),i.a.createElement("div",{className:"row mt-5 mb-4"},i.a.createElement("div",{className:"col-12"},i.a.createElement("div",{className:"w-100 d-flex justify-content-center"},i.a.createElement(g.OutlinedButton,{className:"mr-2",red:!0,onClick:function(){return O(h)||C({})},disabled:L},"Cancel"),i.a.createElement(g.OutlinedButton,{className:"",blue:!0,type:"submit",disabled:L,loading:L},"Create"))))))),i.a.createElement("div",{className:"col-md-3"},i.a.createElement(p.a,{data:{name:U?"\u20b9 ".concat(U):"-",expiary:"custom"===q.value?J:A?A.value:"",patients:V,details:D,isCustom:"custom"===q.value},className:"",showBtn:!1}))))}},152:function(e,a,t){"use strict";var r=t(0),c=t.n(r),n=t(2);a.a=function(e){var a=e.name,t=e.label,r=e.value,s=e.checked,l=void 0!==s&&s,o=e.onClick,i=e.blue,u=(e.red,e.className),m=void 0===u?"":u,d=e.disabled,p=i?"blue":"red";return c.a.createElement("div",{className:"d-flex checkbox-input ".concat(m," pure-material-checkbox ").concat(d?"disabled":"")},c.a.createElement("input",{type:"checkbox",name:a,value:r,checked:l,disabled:d,onChange:o}),c.a.createElement("div",{className:"mr-3 checkbox-checked ".concat(p),onClick:function(){d||o()}},n.m),c.a.createElement("label",{dangerouslySetInnerHTML:{__html:t}}))}},184:function(e,a,t){"use strict";var r=t(0),c=t.n(r);a.a=function(e){var a=e.placeholder,t=e.rows,r=void 0===t?2:t,n=e.value,s=(e.name,e.onChange),l=e.error,o=(e.disabled,e.icon),i=e.className,u=void 0===i?"":i,m=e.maxLength,d=e.hasGrayBack,p=l?"has-error":"";return u+=" form-control ".concat(n?"has-value":""," ").concat(d?"background-gray":""),c.a.createElement(c.a.Fragment,null,c.a.createElement("div",{className:"input-group text-area ".concat(p)},c.a.createElement("textarea",{className:u,value:n,rows:r,onChange:s,maxLength:m}),c.a.createElement("label",null,a),o?c.a.createElement("span",{className:"input-icon"},o):c.a.createElement(c.a.Fragment,null)),l?c.a.createElement("p",{className:"assistive-text error-text"},l):c.a.createElement("p",{className:"assistive-text"}))}},197:function(e,a,t){"use strict";var r=t(0),c=t.n(r),n=t(10);a.a=function(e){var a=e.data,t=e.className,r=void 0===t?"":t,s=e.showBtn,l=e.BtnFooter,o=e.showInfoIcon;r="".concat(r," ").concat(a.isCustom?"custom-package":""," ").concat(a.isRed?"red-content":"");var i=""!==a.expiary?("monthly_package"===a.expiary?"for 1 month":"quarterly_package"===a.expiary&&"for 3 months")||"half_yearly_package"===a.expiary&&"for 6 months"||"yearly_package"===a.expiary&&"for 1 year"||a.isCustom&&"for ".concat(a.expiary||"x"," days"):"-";return c.a.createElement("div",{className:"card package-card text-center ".concat(r)},c.a.createElement("div",{className:"card-head"},c.a.createElement("span",{className:"package-status"},a.status),c.a.createElement("p",{className:"red-heading package-name"},a.name?a.name:"-"),c.a.createElement("p",{className:"package-expiary"},i||"-"),c.a.createElement("div",{className:"package-patients d-flex justify-content-center"},c.a.createElement("p",null,a.patients?a.patients:"0"," patients"),o&&c.a.createElement("p",{className:"i-btn-icon ml-2"}))),c.a.createElement("div",{className:"card-body text-center"},c.a.createElement("p",null,a.details?a.details:"---")),l?c.a.createElement(l,null):s&&c.a.createElement("div",{className:"card-foot"},a.isCustom?c.a.createElement(n.ContainedButton,{darkBlue:!0,link:!0,to:"/contact"},"Contact Us"):c.a.createElement(n.ContainedButton,{link:!0,to:"/register",black:!0},"Get Started")))}}}]);
//# sourceMappingURL=38.1c9dab42.chunk.js.map