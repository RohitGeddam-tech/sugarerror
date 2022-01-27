(this["webpackJsonpsugarlogger-frontend"]=this["webpackJsonpsugarlogger-frontend"]||[]).push([[53],{143:function(e,a,t){"use strict";var n=t(9),r=t(0),c=t.n(r),s=t(2);a.a=function(e){var a=e.type,t=e.placeholder,l=e.value,o=e.name,i=e.onChange,u=e.onBlur,m=e.error,d=e.disabled,b=void 0!==d&&d,f=e.icon,p=e.className,v=void 0===p?"":p,h=e.hasGrayBack,g=void 0!==h&&h,E=e.showPass,O=e.maxLength,j=e.ref,N=Object(r.useState)(!1),y=Object(n.a)(N,2),x=y[0],k=y[1],w=m?"has-error":"";v+=" form-control ";var C=Object(r.useRef)(null);return c.a.createElement(c.a.Fragment,null,c.a.createElement("div",{className:"input-group text-input ".concat(w," ").concat(g?"background-gray":"")},c.a.createElement("input",{type:(E?x?"text":"password":a)||"text",className:v,name:o,value:l,onChange:i,autoComplete:"off",ref:j||C,disabled:b,onBlur:u,maxLength:O}),c.a.createElement("label",{className:"input-placeholder"},t),f?c.a.createElement("span",{className:"input-icon"},f):c.a.createElement(c.a.Fragment,null),E?c.a.createElement("span",{className:"input-icon cursor-pointer",onClick:function(){return k(!x)}},x?s.ab:s.bb):c.a.createElement(c.a.Fragment,null),m?c.a.createElement("p",{className:"assistive-text error-text"},m):c.a.createElement("p",{className:"assistive-text"})))}},144:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(156);a.a=function(e){var a=e.className,t=void 0===a?"":a,s=e.options,l=void 0===s?[]:s,o=e.value,i=e.onChange,u=e.placeholder,m=e.error,d=e.hasGrayBack,b=void 0!==d&&d,f=e.isMulti,p=void 0!==f&&f,v=(e.hideSelectedOptions,e.isClearable),h=void 0===v||v,g=e.disabled,E=e.isLoading,O=e.hidePlaceholder,j=e.defaultValue,N=e.isSearchable,y=void 0!==N&&N,x="input-group select-control-input ".concat(m?"has-error":""," ").concat(b?"background-gray":""," ").concat(o&&o.value?"has-value":""," ").concat(O?"hide-placeholder":""," ").concat(g?"cursor-notAllowed":"");t+=" select-input ";var k=Object(n.useRef)(null);return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:x,ref:k},r.a.createElement(c.a,{value:o,onChange:i,options:l,className:t,classNamePrefix:"select-input",placeholder:r.a.createElement("div",null,""),onFocus:function(){return k.current.classList.add("select-focused")},onBlur:function(){return k.current.classList.remove("select-focused")},isClearable:h,isMulti:p,removeSelected:!1,defaultValue:j,isDisabled:g,isLoading:E,isSearchable:y}),r.a.createElement("label",{className:"select-placeholder"},u)),m?r.a.createElement("p",{className:"assistive-text error-text"},m):r.a.createElement("p",{className:"assistive-text"}))}},147:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(158);t(157);a.a=function(e){var a=e.message,t=e.type,s=e.callback,l=Object(n.useCallback)((function(e){switch(e){case"success":c.b.success(a,{position:c.b.POSITION.BOTTOM_RIGHT}),setTimeout((function(){s&&s()}),1500);break;case"error":c.b.error(a,{position:c.b.POSITION.BOTTOM_RIGHT});break;case"info":c.b.info(a,{position:c.b.POSITION.BOTTOM_RIGHT});break;case"warn":c.b.warn(a,{position:c.b.POSITION.BOTTOM_RIGHT})}}),[s,a]);return Object(n.useEffect)((function(){a&&t&&l(t)}),[a,l,t]),r.a.createElement("div",null,r.a.createElement(c.a,null))}},148:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(144),s=t(149);a.a=function(e){var a=e.title,t=e.children,n=e.list,l=void 0===n?[]:n,o=e.value,i=e.cardType,u=void 0===i?"table":i,m=e.centerHeader,d=void 0!==m&&m,b=e.cardName,f=void 0===b?"":b,p=e.className,v=void 0===p?"":p,h=e.searchBox,g=e.onSelectInputChange,E=e.isLoading,O=void 0!==E&&E,j=e.input;return r.a.createElement("div",{className:"paper paper-card ".concat("number"===u?"number-card":""," ").concat(f," ").concat(v)},r.a.createElement("div",{className:"content-header d-flex align-items-baseline ".concat(d?"justify-content-center":"justify-content-between")},r.a.createElement("p",{className:"title"},a),j||(l.length?r.a.createElement("div",{className:"select-wrapper"},r.a.createElement(c.a,{options:l,value:o,onChange:function(e){return g(e)},isClearable:!1,isSearchable:!1})):r.a.createElement(r.a.Fragment,null)),h?r.a.createElement(s.a,null):r.a.createElement(r.a.Fragment,null)),O?r.a.createElement("div",{className:"text-center"},r.a.createElement("div",{className:"spinner-border",role:"status"},r.a.createElement("span",{className:"sr-only"},"Loading..."))):"number"===u?r.a.createElement("div",{className:"count font-weight-bold"},t):t)}},149:function(e,a,t){"use strict";var n=t(13),r=t(9),c=t(0),s=t.n(c),l=t(2),o=function(e,a){var t=Object(c.useState)(e),n=Object(r.a)(t,2),s=n[0],l=n[1];return Object(c.useEffect)((function(){var t=setTimeout((function(){l(e)}),a);return function(){clearTimeout(t)}}),[e,a]),s},i=t(143);a.a=Object(c.memo)((function(e){var a=e.setFilter,t=e.filter,u=e.className,m=void 0===u?"":u,d=e.placeholder,b=Object(c.useState)(""),f=Object(r.a)(b,2),p=f[0],v=f[1],h=o(p,500);return Object(c.useEffect)((function(){a&&a(h?Object(n.a)(Object(n.a)({},t),{},{search:h,current_page:1}):Object(n.a)(Object(n.a)({},t),{},{search:"",current_page:1}))}),[h]),s.a.createElement("div",{className:"form-group search-input-wrapper ".concat(m)},s.a.createElement(i.a,{placeholder:d,value:p||"",onChange:function(e){return v(e.target.value)},icon:l.T,className:"search-input"}))}))},1520:function(e,a,t){"use strict";t.r(a);var n=t(14),r=t.n(n),c=t(18),s=t(13),l=t(9),o=t(0),i=t.n(o),u=t(148),m=t(143),d=t(10),b=t(2),f=t(22),p=t(17),v=t(165),h=t(201),g=t(147),E=t(19),O={name:"",address_line_one:"",address_line_two:"",pincode:"",city:"",state:"",mobile:"",email:""};a.default=function(e){var a=Object(o.useContext)(p.a),t=a.profile,n=a.setProfileData,j=Object(o.useState)(),N=Object(l.a)(j,2),y=N[0],x=N[1],k=Object(o.useState)({}),w=Object(l.a)(k,2),C=w[0],S=w[1],T=Object(o.useState)(Object(s.a)({},O)),_=Object(l.a)(T,2),B=_[0],I=_[1],R=Object(o.useState)(Object(s.a)({},O)),A=Object(l.a)(R,2),M=A[0],L=A[1],P=Object(o.useState)({}),F=Object(l.a)(P,2),G=F[0],H=F[1],Y=Object(o.useState)(!1),q=Object(l.a)(Y,2),D=q[0],J=q[1],U=Object(o.useState)(!1),V=Object(l.a)(U,2),z=V[0],K=V[1],Q=Object(o.useState)({show:!1,message:"",type:""}),W=Object(l.a)(Q,2),X=W[0],Z=W[1],$=Object(o.useCallback)(function(){var e=Object(c.a)(r.a.mark((function e(a){var t,n,c;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return K(!0),e.next=3,Object(f.fetchRequest)({url:"/lab_group/".concat(a),method:"GET",isAuth:!0});case 3:if(!(t=e.sent)||200!==t.status){e.next=13;break}return K(!1),e.next=8,t.json();case 8:return n=e.sent,c=n.data,I(c),L(c),e.abrupt("return",c);case 13:return e.abrupt("return");case 14:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}(),[]);Object(o.useEffect)((function(){var e;!y&&(null===t||void 0===t||null===(e=t.selectedRole)||void 0===e?void 0:e.uuid)&&(x(t.selectedRole.uuid),$(t.selectedRole.uuid))}),[t,y,$,x]);var ee=function(e,a){var t=Object(s.a)({},B);if(t[a]=e,G[a]&&G[a].length){var n=Object(s.a)({},G);n[a]=null,H(n)}I(Object(s.a)({},t))},ae=function(){var a=Object(c.a)(r.a.mark((function a(){var c,l,o,i,u,m,d;return r.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return J(!0),Z({show:!1,message:"",type:""}),c=Object(s.a)({},B),a.next=5,Object(f.fetchRequest)({url:"/lab_group/".concat(y),method:"PUT",isAuth:!0,body:c});case 5:if((l=a.sent)&&J(!1),!l||200!==l.status){a.next=22;break}return a.next=10,l.json();case 10:return o=a.sent,i=o.data,u=o.message,a.next=15,Object(E.f)(t.selectedRole.uuid);case 15:return m=a.sent,n({selectedRole:m}),localStorage.setItem("selectedRole",JSON.stringify(m)),Z({show:!0,message:u,type:"success",callback:function(){e.history.push("/lab-admin/setting/lab-details/main-office-details")}}),a.abrupt("return",i);case 22:if(!l||422!==l.status){a.next=28;break}return a.next=25,l.json();case 25:d=a.sent,H(Object(s.a)({},d.errors)),422!==l.status&&!Object.keys(d.error?d.error:{}).length&&d.message&&Z({show:!0,message:d.message,type:"error"});case 28:case"end":return a.stop()}}),a)})));return function(){return a.apply(this,arguments)}}(),te=Object(o.useCallback)((function(){M!==B?S(Object(s.a)({title:"Unsaved Changes",msg:"You have not saved the changes made. Are you sure you want to discard the changes?",cancelAction:"Close",confirmAction:"Yes, discard changes",redirect:"/lab-admin/setting/lab-details/main-office-details",isModalOpen:!0},e)):e.history.push("/lab-admin/setting/lab-details/main-office-details")}),[]),ne=B.name,re=B.address_line_one,ce=B.address_line_two,se=B.pincode,le=B.city,oe=B.state,ie=B.mobile,ue=B.email;return i.a.createElement("div",{className:"add-branch-wrapper"},i.a.createElement(h.a,{loading:z}),i.a.createElement(g.a,X),!z&&i.a.createElement(i.a.Fragment,null,i.a.createElement(u.a,{cardName:"add-branch-card"},i.a.createElement("form",null,i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"form-group col-5 mb-3"},i.a.createElement(m.a,{value:ne||"",onChange:function(e){return ee(e.target.value,"name")},error:G&&G.name,placeholder:"Office Name*"}))),i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"form-group col-6 mb-3"},i.a.createElement(m.a,{value:re||"",onChange:function(e){return ee(e.target.value,"address_line_one")},error:G&&G.address_line_one,placeholder:"Address Line 1*"})),i.a.createElement("div",{className:"form-group col-6 mb-3"},i.a.createElement(m.a,{value:ce||"",onChange:function(e){return ee(e.target.value,"address_line_two")},error:G&&G.address_line_two,placeholder:"Address Line 2*"}))),i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"form-group col-4 mb-3"},i.a.createElement(m.a,{value:se||"",onChange:function(e){return ee(e.target.value,"pincode")},error:G&&G.pincode,placeholder:"Pincode*"})),i.a.createElement("div",{className:"form-group col-4 mb-3"},i.a.createElement(m.a,{value:le||"",onChange:function(e){return ee(e.target.value,"city")},error:G&&G.city,placeholder:"City*"})),i.a.createElement("div",{className:"form-group col-4 mb-3"},i.a.createElement(m.a,{value:oe||"",onChange:function(e){return ee(e.target.value,"state")},error:G&&G.state,placeholder:"State*"}))),i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"form-group col-4 mb-3"},i.a.createElement(m.a,{value:ie||"",onChange:function(e){return ee(e.target.value,"mobile")},error:G&&G.mobile,placeholder:"Mobile No*"})),i.a.createElement("div",{className:"form-group col-4 mb-3"},i.a.createElement(m.a,{value:ue||"",onChange:function(e){return ee(e.target.value,"email")},error:G&&G.email,placeholder:"Email*"}))))),i.a.createElement("div",{className:"d-flex justify-content-center"},i.a.createElement(d.OutlinedButton,{onClick:te,disabled:D},i.a.createElement("div",{className:"d-flex align-items-center"},b.H,i.a.createElement("p",{className:"ml-1"},"Go Back"))),i.a.createElement(d.ContainedButton,{darkBlue:!0,className:"ml-3",onClick:ae,disabled:D,loading:D},"Save"))),i.a.createElement(v.a,{actionObject:C}))}},165:function(e,a,t){"use strict";var n=t(39),r=t(14),c=t.n(r),s=t(18),l=t(9),o=t(0),i=t.n(o),u=t(10),m=t(28),d=t(22),b={title:"",msg:"",cancelAction:"",confirmAction:"",method:"",data:null,url:"",handleSuccess:"",isModalOpen:!1,isThankYouModal:!1};a.a=function(e){var a=e.actionObject,t=void 0===a?b:a,r=t.title,f=t.msg,p=t.cancelAction,v=t.confirmAction,h=t.method,g=t.data,E=t.url,O=t.handleSuccess,j=t.isModalOpen,N=t.redirect,y=t.history,x=t.setNotification,k=t.isThankYouModal,w=Object(o.useState)(j),C=Object(l.a)(w,2),S=C[0],T=C[1];Object(o.useEffect)((function(){T(j)}),[t,j]);var _=function(){var e=Object(s.a)(c.a.mark((function e(){var a,t,n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!N){e.next=3;break}return y.push(N),e.abrupt("return");case 3:return e.next=5,Object(d.fetchRequest)({url:E,method:h,isAuth:!0,body:g});case 5:if(!(a=e.sent)||200!==a.status){e.next=13;break}return e.next=9,a.json();case 9:(t=e.sent).success&&(T(!1),O(t)),e.next=19;break;case 13:return e.next=15,a.json();case 15:n=e.sent,x&&x({show:!1,message:"",type:""}),422!==a.status&&!Object.keys(n.error?n.error:{}).length&&n.message&&x&&x({show:!0,message:n.message,type:"error"}),T(!1);case 19:return e.abrupt("return");case 20:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),B="DELETE"===h?"red":"black";return i.a.createElement(m.a,{className:"confirmation-modal",modalIsOpen:S,closeModal:T},i.a.createElement(m.d,{className:"justify-content-center"},i.a.createElement("h2",{className:"black-heading"},r)),i.a.createElement(m.b,{className:"mb-4 text-center"},i.a.createElement("p",null,f)),i.a.createElement(m.c,{className:"justify-content-center"},k?i.a.createElement(u.ContainedButton,{red:!0,onClick:function(){return T(!1)}},p):i.a.createElement(u.OutlinedButton,{className:"close-modal-btn mr-2",onClick:function(){return T(!1)}},p),v&&i.a.createElement(u.ContainedButton,Object.assign({onClick:_},Object(n.a)({},B,!0)),v)))}},201:function(e,a,t){"use strict";var n=t(0),r=t.n(n);a.a=function(e){var a=e.loading;return void 0!==a&&a&&r.a.createElement("div",{className:"loader-wrapper d-flex justify-content-center w-100"},r.a.createElement("div",{className:"spinner-border",role:"status"},r.a.createElement("span",{className:"sr-only"},"Loading...")))}}}]);
//# sourceMappingURL=53.1833cf7e.chunk.js.map