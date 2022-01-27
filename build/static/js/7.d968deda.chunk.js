(this["webpackJsonpsugarlogger-frontend"]=this["webpackJsonpsugarlogger-frontend"]||[]).push([[7],{143:function(e,a,t){"use strict";var n=t(9),c=t(0),l=t.n(c),r=t(2);a.a=function(e){var a=e.type,t=e.placeholder,o=e.value,s=e.name,i=e.onChange,u=e.onBlur,m=e.error,d=e.disabled,b=void 0!==d&&d,p=e.icon,f=e.className,v=void 0===f?"":f,g=e.hasGrayBack,E=void 0!==g&&g,h=e.showPass,N=e.maxLength,j=e.ref,k=Object(c.useState)(!1),O=Object(n.a)(k,2),x=O[0],C=O[1],y=m?"has-error":"";v+=" form-control ";var w=Object(c.useRef)(null);return l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"input-group text-input ".concat(y," ").concat(E?"background-gray":"")},l.a.createElement("input",{type:(h?x?"text":"password":a)||"text",className:v,name:s,value:o,onChange:i,autoComplete:"off",ref:j||w,disabled:b,onBlur:u,maxLength:N}),l.a.createElement("label",{className:"input-placeholder"},t),p?l.a.createElement("span",{className:"input-icon"},p):l.a.createElement(l.a.Fragment,null),h?l.a.createElement("span",{className:"input-icon cursor-pointer",onClick:function(){return C(!x)}},x?r.ab:r.bb):l.a.createElement(l.a.Fragment,null),m?l.a.createElement("p",{className:"assistive-text error-text"},m):l.a.createElement("p",{className:"assistive-text"})))}},144:function(e,a,t){"use strict";var n=t(0),c=t.n(n),l=t(156);a.a=function(e){var a=e.className,t=void 0===a?"":a,r=e.options,o=void 0===r?[]:r,s=e.value,i=e.onChange,u=e.placeholder,m=e.error,d=e.hasGrayBack,b=void 0!==d&&d,p=e.isMulti,f=void 0!==p&&p,v=(e.hideSelectedOptions,e.isClearable),g=void 0===v||v,E=e.disabled,h=e.isLoading,N=e.hidePlaceholder,j=e.defaultValue,k=e.isSearchable,O=void 0!==k&&k,x="input-group select-control-input ".concat(m?"has-error":""," ").concat(b?"background-gray":""," ").concat(s&&s.value?"has-value":""," ").concat(N?"hide-placeholder":""," ").concat(E?"cursor-notAllowed":"");t+=" select-input ";var C=Object(n.useRef)(null);return c.a.createElement(c.a.Fragment,null,c.a.createElement("div",{className:x,ref:C},c.a.createElement(l.a,{value:s,onChange:i,options:o,className:t,classNamePrefix:"select-input",placeholder:c.a.createElement("div",null,""),onFocus:function(){return C.current.classList.add("select-focused")},onBlur:function(){return C.current.classList.remove("select-focused")},isClearable:g,isMulti:f,removeSelected:!1,defaultValue:j,isDisabled:E,isLoading:h,isSearchable:O}),c.a.createElement("label",{className:"select-placeholder"},u)),m?c.a.createElement("p",{className:"assistive-text error-text"},m):c.a.createElement("p",{className:"assistive-text"}))}},148:function(e,a,t){"use strict";var n=t(0),c=t.n(n),l=t(144),r=t(149);a.a=function(e){var a=e.title,t=e.children,n=e.list,o=void 0===n?[]:n,s=e.value,i=e.cardType,u=void 0===i?"table":i,m=e.centerHeader,d=void 0!==m&&m,b=e.cardName,p=void 0===b?"":b,f=e.className,v=void 0===f?"":f,g=e.searchBox,E=e.onSelectInputChange,h=e.isLoading,N=void 0!==h&&h,j=e.input;return c.a.createElement("div",{className:"paper paper-card ".concat("number"===u?"number-card":""," ").concat(p," ").concat(v)},c.a.createElement("div",{className:"content-header d-flex align-items-baseline ".concat(d?"justify-content-center":"justify-content-between")},c.a.createElement("p",{className:"title"},a),j||(o.length?c.a.createElement("div",{className:"select-wrapper"},c.a.createElement(l.a,{options:o,value:s,onChange:function(e){return E(e)},isClearable:!1,isSearchable:!1})):c.a.createElement(c.a.Fragment,null)),g?c.a.createElement(r.a,null):c.a.createElement(c.a.Fragment,null)),N?c.a.createElement("div",{className:"text-center"},c.a.createElement("div",{className:"spinner-border",role:"status"},c.a.createElement("span",{className:"sr-only"},"Loading..."))):"number"===u?c.a.createElement("div",{className:"count font-weight-bold"},t):t)}},149:function(e,a,t){"use strict";var n=t(13),c=t(9),l=t(0),r=t.n(l),o=t(2),s=function(e,a){var t=Object(l.useState)(e),n=Object(c.a)(t,2),r=n[0],o=n[1];return Object(l.useEffect)((function(){var t=setTimeout((function(){o(e)}),a);return function(){clearTimeout(t)}}),[e,a]),r},i=t(143);a.a=Object(l.memo)((function(e){var a=e.setFilter,t=e.filter,u=e.className,m=void 0===u?"":u,d=e.placeholder,b=Object(l.useState)(""),p=Object(c.a)(b,2),f=p[0],v=p[1],g=s(f,500);return Object(l.useEffect)((function(){a&&a(g?Object(n.a)(Object(n.a)({},t),{},{search:g,current_page:1}):Object(n.a)(Object(n.a)({},t),{},{search:"",current_page:1}))}),[g]),r.a.createElement("div",{className:"form-group search-input-wrapper ".concat(m)},r.a.createElement(i.a,{placeholder:d,value:f||"",onChange:function(e){return v(e.target.value)},icon:o.T,className:"search-input"}))}))},150:function(e,a,t){"use strict";t.d(a,"a",(function(){return n}));var n="\u20b9"},152:function(e,a,t){"use strict";var n=t(0),c=t.n(n),l=t(2);a.a=function(e){var a=e.name,t=e.label,n=e.value,r=e.checked,o=void 0!==r&&r,s=e.onClick,i=e.blue,u=(e.red,e.className),m=void 0===u?"":u,d=e.disabled,b=i?"blue":"red";return c.a.createElement("div",{className:"d-flex checkbox-input ".concat(m," pure-material-checkbox ").concat(d?"disabled":"")},c.a.createElement("input",{type:"checkbox",name:a,value:n,checked:o,disabled:d,onChange:s}),c.a.createElement("div",{className:"mr-3 checkbox-checked ".concat(b),onClick:function(){d||s()}},l.m),c.a.createElement("label",{dangerouslySetInnerHTML:{__html:t}}))}},155:function(e,a,t){"use strict";var n=t(13),c=t(6),l=t(9),r=t(0),o=t.n(r),s=t(144),i=t(160),u=t.n(i),m=t(17),d=Object(r.memo)((function(e){var a=Object(r.useContext)(m.a),t=a.profile,c=a.setProfileData,i=e.width,d=e.data,b=e.filter,p=e.listName,f=Object(r.useState)({data:[],perPageObj:{label:"15",value:15}}),v=Object(l.a)(f,2),g=v[0],E=v[1],h=Object(r.useState)({per_page:15,current_page:1}),N=Object(l.a)(h,2),j=N[0],k=N[1];Object(r.useEffect)((function(){E((function(e){return Object(n.a)(Object(n.a)({},e),d)}))}),[d]);var O=g.total_pages,x=g.total,C=g.perPageObj,y=j.current_page,w=j.per_page;Object(r.useEffect)((function(){1===b.current_page&&k((function(e){return Object(n.a)(Object(n.a)({},e),{},{current_page:1})}))}),[b]),Object(r.useEffect)((function(){y&&w&&d.getListPerPage(Object(n.a)(Object(n.a)({},b),{},{current_page:y,per_page:w}))}),[y,w]);var _=Object(r.useCallback)((function(e){var a=e.selected+1;k(Object(n.a)(Object(n.a)({},j),{},{current_page:a}))}),[j]),F=Object(r.useCallback)((function(e){E(Object(n.a)(Object(n.a)({},g),{},{perPageObj:e})),k({current_page:1,per_page:e?e.value:g.per_page}),c(Object(n.a)(Object(n.a)({},t),{},{perPageData:e?e.value:g.per_page,perPageValue:e})),localStorage.setItem("perPageData",e?e.value:g.per_page)}),[t,g]);return o.a.createElement("div",{className:"paginate-container d-flex"},i>768?o.a.createElement("div",{className:"per-page-wrapper d-flex"},o.a.createElement("div",null,"Rows per page :"),o.a.createElement("div",{className:"form-group "},o.a.createElement(s.a,{className:"per-page-select",value:C,onChange:F,options:[{label:"15",value:15},{label:"50",value:50},{label:"100",value:100},{label:"150",value:150}],isClearable:!1}))):o.a.createElement(o.a.Fragment,null),o.a.createElement("div",{className:"d-flex flex-column flex-md-row w-100 align-items-md-center justify-content-md-between"},o.a.createElement("div",{className:"order-md-2 text-right page-count"},o.a.createElement("p",null,"".concat((y-1)*w+1,"-").concat(y*w<x?y*w:x," of ").concat(x," ").concat(p))),o.a.createElement("div",{className:"page-numbers-listing"},o.a.createElement(u.a,{previousLabel:"Prev",nextLabel:"Next",breakLabel:"...",breakClassName:"break-me",pageCount:O,marginPagesDisplayed:1,pageRangeDisplayed:1,onPageChange:_,containerClassName:"pagination",subContainerClassName:"pages pagination",activeClassName:"active",previousLinkClassName:O<2?"disabled":"",nextLinkClassName:O<2?"disabled":"",forcePage:y-1}))))})),b=t(10),p=t(38),f=t(150),v=t(148),g=t(28),E={data:null,isModalOpen:!1},h=function(e){var a=e.actionObject,t=void 0===a?E:a,n=e.MobileCardComponent,c=t.columnDefs,s=t.tableData,i=t.isModalOpen,u=Object(r.useState)(i),m=Object(l.a)(u,2),d=m[0],b=m[1];return Object(r.useEffect)((function(){b(i)}),[t,i]),o.a.createElement(g.a,{className:"table-card-modal",modalIsOpen:d,closeModal:b,backdropClose:!0},o.a.createElement(g.b,{className:"my-4 text-center"},n?o.a.createElement(n,{columnDefs:c,tableData:s}):o.a.createElement(v.a,{title:"Test Visit Details"},c&&c.length&&c.map((function(e,a){var t=e.label,n=e.accessKey,c=e.renderIcon,l=e.classes,r=void 0===l?"":l,i=e.cellRenderer,u=e.defaultValue,m=e.isAmount,d=void 0!==m&&m,b=n?n.split(".")||[]:null,p=Array.isArray(b)?b.length>1?s["".concat(b[0])]["".concat(b[1])]:s["".concat(b[0])]:null;return o.a.createElement(o.a.Fragment,{key:a},!c&&o.a.createElement("div",{className:"d-flex card-row"},o.a.createElement("div",{className:"label"},"".concat(t," : ")),i?o.a.createElement("div",{className:"value ".concat(r)},i(s,a)):p||u?o.a.createElement("div",{className:"value ".concat(r)},d?f.a+" ":"",p||u):null))})))))},N=t(152),j=function(e){var a=e.setFilter,t=e.renderFilterIcon,s=e.filter,i=Object(r.useState)("desc"),u=Object(l.a)(i,2),m=u[0],d=u[1],b=Object(r.useCallback)((function(){var e="desc"===m?"asc":"desc";d(e);var l=Object(c.a)(s.sort);l.some((function(e){return e.key===t.key}))?l=l.map((function(a){return a.key===t.key?{key:t.key,value:e}:a})):l.push({key:t.key,value:e}),a(Object(n.a)(Object(n.a)({},s),{},{sort:l}))}),[m,s]),p=s&&s.sort&&s.sort.findIndex((function(e){return e.key===t.key})),f=-1!==p;return o.a.createElement("p",{className:"table-icon d-inline ".concat(f?"is-sorted "+(s&&s.sort&&s.sort[p].value)||!1:""),onClick:b},t.icon)};a.a=function(e){var a=e.title,t=e.columnDefs,n=e.tableData,s=e.selectedFilters,i=e.openFilterAction,u=e.pagination,m=e.footerLink,v=e.renderCheckbox,g=e.isButtonCard,E=(e.getListData,e.setFilter),k=e.filter,O=e.blankDataMessage,x=void 0===O?"No Records Found !":O,C=e.isLoading,y=void 0!==C&&C,w=e.listName,_=void 0===w?"":w,F=e.getSelectedData,L=e.tableClassName,S=void 0===L?"":L,D=e.MobileCardComponent,M=Object(p.a)(),P=Object(l.a)(M,1)[0],I=Object(r.useState)(),A=Object(l.a)(I,2),B=A[0],R=A[1],T=Object(r.useState)(!1),V=Object(l.a)(T,2),H=(V[0],V[1],Object(r.useState)([])),G=Object(l.a)(H,2),K=G[0],J=G[1],U=Object(r.useState)(!1),q=Object(l.a)(U,2),z=q[0],W=q[1];Object(r.useEffect)((function(){(z||K.length)&&F(z||K)}),[z,K,F]);var Z=Object(r.useCallback)((function(e){var a=Object(c.a)(K);a.some((function(a){return a===e}))?a=a.filter((function(a){return a!==e})):a.push(e),J(Object(c.a)(a)),a.length>=0&&a.length!==n.length?W(!1):W(!0)}),[K]),Q=Object(r.useCallback)((function(){var e=n.map((function(e){return e.uuid}));J(z?[]:e),W(!z)}),[z]);return o.a.createElement(o.a.Fragment,null,P>768?o.a.createElement("table",{className:"custom-table ".concat(S)},o.a.createElement("thead",null,o.a.createElement("tr",null,t.map((function(e,a){var t=e.label,n=e.cursor,c=e.labelAsIcon,l=e.renderFilterIcon,r=e.width,u=e.dateFilter,m=e.isCheckbox;e.keyToCheck;return o.a.createElement("th",{key:a,width:r},t?s&&s.includes(t)?o.a.createElement("span",{onClick:function(){return i(!0,t)},style:{backgroundColor:"rgba(166, 219, 252, 0.3)",fontSize:12,padding:5,borderRadius:5,cursor:"pointer"}},t," ",o.a.createElement("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},o.a.createElement("path",{d:"M0.833452 1.74002C2.18012 3.46669 4.66679 6.66669 4.66679 6.66669V10.6667C4.66679 11.0334 4.96678 11.3334 5.33345 11.3334H6.66679C7.03345 11.3334 7.33345 11.0334 7.33345 10.6667V6.66669C7.33345 6.66669 9.81345 3.46669 11.1601 1.74002C11.5001 1.30002 11.1868 0.666687 10.6335 0.666687H1.36012C0.806785 0.666687 0.493452 1.30002 0.833452 1.74002Z",fill:"#B7B7B7"}))):o.a.createElement("span",{style:{cursor:n||""},onClick:function(){return i?i(!0,t):""}},t):m?o.a.createElement(N.a,{checked:z,value:z,blue:!0,className:!z&&K.length>0?"checkbox-some-checked":"",onClick:function(){return Q()}}):o.a.createElement("p",null,c)," ",l?o.a.createElement(j,{filter:k,setFilter:E,renderFilterIcon:l}):"",(null===u||void 0===u?void 0:u.show)?o.a.createElement("label",null):"")})))),o.a.createElement("tbody",null,y?o.a.createElement("tr",null,o.a.createElement("td",{colSpan:t.length,className:"text-center mb-4"},o.a.createElement("div",{className:"spinner-border",role:"status"},o.a.createElement("span",{className:"sr-only"},"Loading...")))):n&&n.length?n.map((function(e,a){return o.a.createElement("tr",{key:Math.random()},t.map((function(t){var n=t.accessKey,c=t.renderIcon,l=t.cellRenderer,r=t.defaultValue,s=t.isAmount,i=void 0!==s&&s,u=t.isCheckbox,m=t.keyToCheck,d=n?n.split(".")||[]:null,b=Array.isArray(d)?d.length>1?e["".concat(d[0])]["".concat(d[1])]:e["".concat(d[0])]:null;return l?o.a.createElement("td",{key:Math.random()},l(e,a)):b||r?o.a.createElement("td",{key:Math.random()},i?f.a+" ":"",b||r):u?o.a.createElement("td",{key:Math.random()},o.a.createElement(N.a,{checked:z||K.some((function(a){return a===e[m]})),value:z||K.some((function(a){return a===e[m]})),blue:!0,onClick:function(){return Z(e[m])}})):c?o.a.createElement("td",{key:Math.random()},o.a.createElement("p",{className:"table-icon"},c)):o.a.createElement("td",{key:Math.random()},"-")})))})):o.a.createElement("tr",null,o.a.createElement("td",{colSpan:t.length,className:"text-center"},x)))):o.a.createElement("div",{className:"table-mobile"},y?o.a.createElement("div",{className:"text-center mb-4"},o.a.createElement("div",{className:"spinner-border",role:"status"},o.a.createElement("span",{className:"sr-only"},"Loading..."))):n&&n.length?n.map((function(e,a){return o.a.createElement("div",{key:a,className:"data-card d-flex align-items-center",onClick:function(){return g&&R({columnDefs:t,tableData:e,isModalOpen:!0})}},v?o.a.createElement("p",{className:"table-icon card-mobile-checkbox mr-4"},v):o.a.createElement(o.a.Fragment,null),o.a.createElement("div",{className:"w-100"},t.map((function(a,t){var n=a.label,c=a.cellRenderer,l=a.accessKey,r=a.renderIcon,s=a.renderIconText,i=void 0===s?"":s,u=a.classes,m=void 0===u?"":u,d=a.isMobile,b=void 0===d||d,p=a.isCheckbox,v=void 0!==p&&p,g=a.defaultValue,E=a.isAmount,h=void 0!==E&&E,N=l?l.split(".")||[]:null,j=Array.isArray(N)?N.length>1?e["".concat(N[0])]["".concat(N[1])]:e["".concat(N[0])]:null;return o.a.createElement(o.a.Fragment,{key:t},!r&&b?o.a.createElement("ul",{className:"card-row single-detail"},o.a.createElement("li",{className:"label"},"".concat(n," : ")),c?o.a.createElement("li",{className:"value ".concat(m)},c(e,t)):j||g?o.a.createElement("li",{className:"value ".concat(m)},h?f.a+" ":"",j||g):null):r&&!v&&b?o.a.createElement("div",{className:"data-card-action pt-2 mt-3"},o.a.createElement("p",{className:"table-icon d-flex justify-content-center align-items-center"},r," ",i?o.a.createElement("p",{className:"icon-text"},i):"")):null)}))),g?o.a.createElement("p",{className:"table-icon card-mobile-button ml-auto modal-link"},g):o.a.createElement(o.a.Fragment,null))})):o.a.createElement("table",null,o.a.createElement("tbody",null,o.a.createElement("tr",null,o.a.createElement("td",{colSpan:t.length,className:"text-center"},x))))),u&&u.total?o.a.createElement(d,{width:P,data:u,filter:k,listName:_}):o.a.createElement(o.a.Fragment,null),m&&n&&n.length?o.a.createElement("div",{className:"d-flex justify-content-center table-footer"},o.a.createElement(b.TextButton,{blue:!0,withIcon:!0,className:"semi-bold",link:!0,to:{pathname:m,title:a},title:a},"VIEW ALL")):"",o.a.createElement(h,{actionObject:B,MobileCardComponent:D}))}},413:function(e,a,t){"use strict";var n=t(14),c=t.n(n),l=t(18),r=t(0),o=t.n(r),s=t(22).fetchRequest,i=t(10).OutlinedButton;a.a=function(e){var a=e.path,t=e.filter,n=e.selectedData,u=Object(r.useCallback)((function(){var e=t.per_page,r=void 0===e?15:e,o=t.current_page,i=t.search,u=t.date,m=t.date_from,d=t.date_to,b=t.sort;Object(l.a)(c.a.mark((function e(){var t,l,p,f,v,g,E;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="".concat(a,"?per_page=").concat(r).concat(o?"&page=".concat(o):"").concat(i?"&search=".concat(i):"").concat(u?"&date=".concat(u):"").concat(m?"&date_from=".concat(m):"").concat(d?"&date_to=".concat(d):"").concat(b&&b.length?b.map((function(e){return"&".concat(e.key,"=").concat(e.value)})).join(""):"").concat("boolean"===typeof n||n.length?"&select=".concat("boolean"===typeof n?"all":n.length&&n.join()):""),e.next=3,s({url:t,method:"GET",isAuth:!0});case 3:if(!(l=e.sent)||200!==l.status){e.next=16;break}return e.next=7,l.blob();case 7:return p=e.sent,f=new Blob([p],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;"}),v=URL.createObjectURL(f),g=document.createElement("a"),E="".concat(a,".xlsx"),g.href=v,g.download=E,g.click(),e.abrupt("return",p);case 16:return e.abrupt("return");case 17:case"end":return e.stop()}}),e)})))()}),[a,t,n]);return o.a.createElement(i,{className:"export-excel",onClick:u},"Export Excel")}}}]);
//# sourceMappingURL=7.d968deda.chunk.js.map