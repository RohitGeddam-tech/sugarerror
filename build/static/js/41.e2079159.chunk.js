(this["webpackJsonpsugarlogger-frontend"]=this["webpackJsonpsugarlogger-frontend"]||[]).push([[41],{144:function(e,t,a){"use strict";var n=a(0),c=a.n(n),r=a(156);t.a=function(e){var t=e.className,a=void 0===t?"":t,s=e.options,o=void 0===s?[]:s,l=e.value,i=e.onChange,u=e.placeholder,d=e.error,m=e.hasGrayBack,p=void 0!==m&&m,f=e.isMulti,g=void 0!==f&&f,b=(e.hideSelectedOptions,e.isClearable),h=void 0===b||b,y=e.disabled,v=e.isLoading,k=e.hidePlaceholder,E=e.defaultValue,j=e.isSearchable,O=void 0!==j&&j,x="input-group select-control-input ".concat(d?"has-error":""," ").concat(p?"background-gray":""," ").concat(l&&l.value?"has-value":""," ").concat(k?"hide-placeholder":""," ").concat(y?"cursor-notAllowed":"");a+=" select-input ";var N=Object(n.useRef)(null);return c.a.createElement(c.a.Fragment,null,c.a.createElement("div",{className:x,ref:N},c.a.createElement(r.a,{value:l,onChange:i,options:o,className:a,classNamePrefix:"select-input",placeholder:c.a.createElement("div",null,""),onFocus:function(){return N.current.classList.add("select-focused")},onBlur:function(){return N.current.classList.remove("select-focused")},isClearable:h,isMulti:g,removeSelected:!1,defaultValue:E,isDisabled:y,isLoading:v,isSearchable:O}),c.a.createElement("label",{className:"select-placeholder"},u)),d?c.a.createElement("p",{className:"assistive-text error-text"},d):c.a.createElement("p",{className:"assistive-text"}))}},1502:function(e,t,a){"use strict";a.r(t);var n=a(14),c=a.n(n),r=a(13),s=a(18),o=a(9),l=a(0),i=a.n(l),u=a(144),d=a(22),m=a(197),p=a(10),f=a(165),g={category:{},type:{}};t.default=function(){var e=Object(l.useState)([]),t=Object(o.a)(e,2),a=t[0],n=t[1],b=Object(l.useState)({}),h=Object(o.a)(b,2),y=h[0],v=h[1],k=Object(l.useState)({categories:[],types:[]}),E=Object(o.a)(k,2),j=E[0],O=E[1],x=Object(l.useState)(g),N=Object(o.a)(x,2),C=N[0],w=N[1],A=Object(l.useState)(!1),B=Object(o.a)(A,2),_=B[0],S=B[1];Object(l.useEffect)((function(){j.categories.length||Object(s.a)(c.a.mark((function e(){var t,a,n,s,o;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(d.fetchRequest)({url:"/super_admin/package_type_and_category",method:"GET",isAuth:!0});case 2:if(!(t=e.sent)||200!==t.status){e.next=13;break}return e.next=6,t.json();case 6:return a=e.sent,n=a.data,[],[],s=n.categories.map((function(e){return Object(r.a)({label:e.formatted_category,value:e.category},e)})),o=n.types.map((function(e){return{label:e.formatted_type,value:e.type}})),O({categories:s,types:o}),e.abrupt("return",n);case 13:return e.abrupt("return");case 14:case"end":return e.stop()}}),e)})))()}),[j.categories.length]),Object(l.useEffect)((function(){j.categories.length&&j.types.length&&w((function(e){return Object(r.a)(Object(r.a)({},e),{},{category:j.categories[0],type:j.types[0]})}))}),[j]),Object(l.useEffect)((function(){C.category&&C.type&&M()}),[C]);var M=function(){var e=Object(s.a)(c.a.mark((function e(){var t,a,r,s,o,l;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(S(!0),!C.category&&!C.type){e.next=17;break}if(t=C.category.value,a=C.type.value,r="/super_admin/package".concat("default"===t?"?category=".concat(t).concat(a?"&type=".concat(a):""):"?category=".concat(t)),!t){e.next=16;break}return e.next=7,Object(d.fetchRequest)({url:r,method:"GET",isAuth:!0});case 7:if(s=e.sent,S(!1),!s||200!==s.status){e.next=16;break}return e.next=12,s.json();case 12:return o=e.sent,l=o.data,n(l),e.abrupt("return",l);case 16:return e.abrupt("return");case 17:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),T=function(){var e=Object(s.a)(c.a.mark((function e(t,a){var n,r,s;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={active:t},e.next=3,Object(d.fetchRequest)({url:"/super_admin/package/".concat(a),method:"PUT",isAuth:!0,body:n});case 3:if(!(r=e.sent)||200!==r.status){e.next=11;break}return e.next=7,r.json();case 7:e.sent.success&&M(),e.next=15;break;case 11:return e.next=13,r.json();case 13:s=e.sent,v({title:"Invalid Action",msg:s.message?s.message:"You cannot activate more than 4 packages. Inorder to activate this kindly de-activate any one active pack.",cancelAction:"Go Back",isModalOpen:!0});case 15:return e.abrupt("return");case 16:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),I=function(e,t){var a=Object(r.a)({},C);a[t]=e,w(Object(r.a)({},a))},D=j.categories,G=j.types,L=C.category,P=C.type;return i.a.createElement("div",{className:"package-container"},i.a.createElement("div",{className:"row mb-3"},i.a.createElement("div",{className:"col-md-2"},i.a.createElement(u.a,{placeholder:"Category",options:D,value:L,onChange:function(e){return I(e,"category")},isClearable:!1,hidePlaceholder:!0,isSearchable:!1})),L.has_types&&i.a.createElement("div",{className:"col-md-3"},i.a.createElement(u.a,{placeholder:"Package Type",options:G,value:P,onChange:function(e){return I(e,"type")},isClearable:!1,hidePlaceholder:!0,isSearchable:!1}))),i.a.createElement("div",{className:"d-flex flex-wrap package-card-wrapper"},_?i.a.createElement("div",{className:"spinner-border",role:"status"},i.a.createElement("span",{className:"sr-only"},"Loading...")):a.length?a.map((function(e,t){return i.a.createElement("div",{key:t,className:"package-card-container"},i.a.createElement(m.a,{data:{name:e.trial_package?"Free trial":"\u20b9 ".concat(e.amount),expiary:e.type||e.validity,patients:e.credits,details:e.description,isRed:e.trial_package,status:e.active?"ACTIVE":"",isCustom:"custom"===e.category},showBtn:!0,BtnFooter:function(){return t=e.active,a=e.uuid,i.a.createElement("div",{className:"d-flex justify-content-center mb-3"},!t&&i.a.createElement(p.OutlinedButton,{red:!0,className:"delete-btn",onClick:function(){v({title:"Confirmation",msg:"Are you sure you want to delete this package? It will be erased completely and you cannot undo it.",cancelAction:"Go Back",confirmAction:"Delete",method:"DELETE",url:"/super_admin/package/".concat(a),handleSuccess:M,isModalOpen:!0})}},"Delete"),C.category&&"default"===C.category.value&&(t?i.a.createElement(p.OutlinedButton,{className:"ml-2",onClick:function(){v({title:"Confirmation",msg:"Are you sure you want to de-activate this package? It will still be in your records.",cancelAction:"Go Back",confirmAction:"Yes, De-ctivate",method:"PUT",data:{active:!1},url:"/super_admin/package/".concat(a),handleSuccess:M,isModalOpen:!0})}},"De-Activate"):i.a.createElement(p.ContainedButton,{className:"ml-2",black:!0,onClick:function(){return T(!0,a)}},"Activate")));var t,a}}))})):i.a.createElement(i.a.Fragment,null)),i.a.createElement(f.a,{actionObject:y}))}},165:function(e,t,a){"use strict";var n=a(39),c=a(14),r=a.n(c),s=a(18),o=a(9),l=a(0),i=a.n(l),u=a(10),d=a(28),m=a(22),p={title:"",msg:"",cancelAction:"",confirmAction:"",method:"",data:null,url:"",handleSuccess:"",isModalOpen:!1,isThankYouModal:!1};t.a=function(e){var t=e.actionObject,a=void 0===t?p:t,c=a.title,f=a.msg,g=a.cancelAction,b=a.confirmAction,h=a.method,y=a.data,v=a.url,k=a.handleSuccess,E=a.isModalOpen,j=a.redirect,O=a.history,x=a.setNotification,N=a.isThankYouModal,C=Object(l.useState)(E),w=Object(o.a)(C,2),A=w[0],B=w[1];Object(l.useEffect)((function(){B(E)}),[a,E]);var _=function(){var e=Object(s.a)(r.a.mark((function e(){var t,a,n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!j){e.next=3;break}return O.push(j),e.abrupt("return");case 3:return e.next=5,Object(m.fetchRequest)({url:v,method:h,isAuth:!0,body:y});case 5:if(!(t=e.sent)||200!==t.status){e.next=13;break}return e.next=9,t.json();case 9:(a=e.sent).success&&(B(!1),k(a)),e.next=19;break;case 13:return e.next=15,t.json();case 15:n=e.sent,x&&x({show:!1,message:"",type:""}),422!==t.status&&!Object.keys(n.error?n.error:{}).length&&n.message&&x&&x({show:!0,message:n.message,type:"error"}),B(!1);case 19:return e.abrupt("return");case 20:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),S="DELETE"===h?"red":"black";return i.a.createElement(d.a,{className:"confirmation-modal",modalIsOpen:A,closeModal:B},i.a.createElement(d.d,{className:"justify-content-center"},i.a.createElement("h2",{className:"black-heading"},c)),i.a.createElement(d.b,{className:"mb-4 text-center"},i.a.createElement("p",null,f)),i.a.createElement(d.c,{className:"justify-content-center"},N?i.a.createElement(u.ContainedButton,{red:!0,onClick:function(){return B(!1)}},g):i.a.createElement(u.OutlinedButton,{className:"close-modal-btn mr-2",onClick:function(){return B(!1)}},g),b&&i.a.createElement(u.ContainedButton,Object.assign({onClick:_},Object(n.a)({},S,!0)),b)))}},197:function(e,t,a){"use strict";var n=a(0),c=a.n(n),r=a(10);t.a=function(e){var t=e.data,a=e.className,n=void 0===a?"":a,s=e.showBtn,o=e.BtnFooter,l=e.showInfoIcon;n="".concat(n," ").concat(t.isCustom?"custom-package":""," ").concat(t.isRed?"red-content":"");var i=""!==t.expiary?("monthly_package"===t.expiary?"for 1 month":"quarterly_package"===t.expiary&&"for 3 months")||"half_yearly_package"===t.expiary&&"for 6 months"||"yearly_package"===t.expiary&&"for 1 year"||t.isCustom&&"for ".concat(t.expiary||"x"," days"):"-";return c.a.createElement("div",{className:"card package-card text-center ".concat(n)},c.a.createElement("div",{className:"card-head"},c.a.createElement("span",{className:"package-status"},t.status),c.a.createElement("p",{className:"red-heading package-name"},t.name?t.name:"-"),c.a.createElement("p",{className:"package-expiary"},i||"-"),c.a.createElement("div",{className:"package-patients d-flex justify-content-center"},c.a.createElement("p",null,t.patients?t.patients:"0"," patients"),l&&c.a.createElement("p",{className:"i-btn-icon ml-2"}))),c.a.createElement("div",{className:"card-body text-center"},c.a.createElement("p",null,t.details?t.details:"---")),o?c.a.createElement(o,null):s&&c.a.createElement("div",{className:"card-foot"},t.isCustom?c.a.createElement(r.ContainedButton,{darkBlue:!0,link:!0,to:"/contact"},"Contact Us"):c.a.createElement(r.ContainedButton,{link:!0,to:"/register",black:!0},"Get Started")))}}}]);
//# sourceMappingURL=41.e2079159.chunk.js.map