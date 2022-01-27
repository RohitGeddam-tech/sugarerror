(this["webpackJsonpsugarlogger-frontend"]=this["webpackJsonpsugarlogger-frontend"]||[]).push([[52],{143:function(e,a,t){"use strict";var n=t(9),r=t(0),c=t.n(r),l=t(2);a.a=function(e){var a=e.type,t=e.placeholder,i=e.value,o=e.name,s=e.onChange,m=e.onBlur,d=e.error,u=e.disabled,g=void 0!==u&&u,h=e.icon,p=e.className,b=void 0===p?"":p,v=e.hasGrayBack,f=void 0!==v&&v,_=e.showPass,E=e.maxLength,O=e.ref,j=Object(r.useState)(!1),N=Object(n.a)(j,2),w=N[0],x=N[1],k=d?"has-error":"";b+=" form-control ";var P=Object(r.useRef)(null);return c.a.createElement(c.a.Fragment,null,c.a.createElement("div",{className:"input-group text-input ".concat(k," ").concat(f?"background-gray":"")},c.a.createElement("input",{type:(_?w?"text":"password":a)||"text",className:b,name:o,value:i,onChange:s,autoComplete:"off",ref:O||P,disabled:g,onBlur:m,maxLength:E}),c.a.createElement("label",{className:"input-placeholder"},t),h?c.a.createElement("span",{className:"input-icon"},h):c.a.createElement(c.a.Fragment,null),_?c.a.createElement("span",{className:"input-icon cursor-pointer",onClick:function(){return x(!w)}},w?l.ab:l.bb):c.a.createElement(c.a.Fragment,null),d?c.a.createElement("p",{className:"assistive-text error-text"},d):c.a.createElement("p",{className:"assistive-text"})))}},144:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(156);a.a=function(e){var a=e.className,t=void 0===a?"":a,l=e.options,i=void 0===l?[]:l,o=e.value,s=e.onChange,m=e.placeholder,d=e.error,u=e.hasGrayBack,g=void 0!==u&&u,h=e.isMulti,p=void 0!==h&&h,b=(e.hideSelectedOptions,e.isClearable),v=void 0===b||b,f=e.disabled,_=e.isLoading,E=e.hidePlaceholder,O=e.defaultValue,j=e.isSearchable,N=void 0!==j&&j,w="input-group select-control-input ".concat(d?"has-error":""," ").concat(g?"background-gray":""," ").concat(o&&o.value?"has-value":""," ").concat(E?"hide-placeholder":""," ").concat(f?"cursor-notAllowed":"");t+=" select-input ";var x=Object(n.useRef)(null);return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:w,ref:x},r.a.createElement(c.a,{value:o,onChange:s,options:i,className:t,classNamePrefix:"select-input",placeholder:r.a.createElement("div",null,""),onFocus:function(){return x.current.classList.add("select-focused")},onBlur:function(){return x.current.classList.remove("select-focused")},isClearable:v,isMulti:p,removeSelected:!1,defaultValue:O,isDisabled:f,isLoading:_,isSearchable:N}),r.a.createElement("label",{className:"select-placeholder"},m)),d?r.a.createElement("p",{className:"assistive-text error-text"},d):r.a.createElement("p",{className:"assistive-text"}))}},147:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(158);t(157);a.a=function(e){var a=e.message,t=e.type,l=e.callback,i=Object(n.useCallback)((function(e){switch(e){case"success":c.b.success(a,{position:c.b.POSITION.BOTTOM_RIGHT}),setTimeout((function(){l&&l()}),1500);break;case"error":c.b.error(a,{position:c.b.POSITION.BOTTOM_RIGHT});break;case"info":c.b.info(a,{position:c.b.POSITION.BOTTOM_RIGHT});break;case"warn":c.b.warn(a,{position:c.b.POSITION.BOTTOM_RIGHT})}}),[l,a]);return Object(n.useEffect)((function(){a&&t&&i(t)}),[a,i,t]),r.a.createElement("div",null,r.a.createElement(c.a,null))}},148:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(144),l=t(149);a.a=function(e){var a=e.title,t=e.children,n=e.list,i=void 0===n?[]:n,o=e.value,s=e.cardType,m=void 0===s?"table":s,d=e.centerHeader,u=void 0!==d&&d,g=e.cardName,h=void 0===g?"":g,p=e.className,b=void 0===p?"":p,v=e.searchBox,f=e.onSelectInputChange,_=e.isLoading,E=void 0!==_&&_,O=e.input;return r.a.createElement("div",{className:"paper paper-card ".concat("number"===m?"number-card":""," ").concat(h," ").concat(b)},r.a.createElement("div",{className:"content-header d-flex align-items-baseline ".concat(u?"justify-content-center":"justify-content-between")},r.a.createElement("p",{className:"title"},a),O||(i.length?r.a.createElement("div",{className:"select-wrapper"},r.a.createElement(c.a,{options:i,value:o,onChange:function(e){return f(e)},isClearable:!1,isSearchable:!1})):r.a.createElement(r.a.Fragment,null)),v?r.a.createElement(l.a,null):r.a.createElement(r.a.Fragment,null)),E?r.a.createElement("div",{className:"text-center"},r.a.createElement("div",{className:"spinner-border",role:"status"},r.a.createElement("span",{className:"sr-only"},"Loading..."))):"number"===m?r.a.createElement("div",{className:"count font-weight-bold"},t):t)}},149:function(e,a,t){"use strict";var n=t(13),r=t(9),c=t(0),l=t.n(c),i=t(2),o=function(e,a){var t=Object(c.useState)(e),n=Object(r.a)(t,2),l=n[0],i=n[1];return Object(c.useEffect)((function(){var t=setTimeout((function(){i(e)}),a);return function(){clearTimeout(t)}}),[e,a]),l},s=t(143);a.a=Object(c.memo)((function(e){var a=e.setFilter,t=e.filter,m=e.className,d=void 0===m?"":m,u=e.placeholder,g=Object(c.useState)(""),h=Object(r.a)(g,2),p=h[0],b=h[1],v=o(p,500);return Object(c.useEffect)((function(){a&&a(v?Object(n.a)(Object(n.a)({},t),{},{search:v,current_page:1}):Object(n.a)(Object(n.a)({},t),{},{search:"",current_page:1}))}),[v]),l.a.createElement("div",{className:"form-group search-input-wrapper ".concat(d)},l.a.createElement(s.a,{placeholder:u,value:p||"",onChange:function(e){return b(e.target.value)},icon:i.T,className:"search-input"}))}))},152:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(2);a.a=function(e){var a=e.name,t=e.label,n=e.value,l=e.checked,i=void 0!==l&&l,o=e.onClick,s=e.blue,m=(e.red,e.className),d=void 0===m?"":m,u=e.disabled,g=s?"blue":"red";return r.a.createElement("div",{className:"d-flex checkbox-input ".concat(d," pure-material-checkbox ").concat(u?"disabled":"")},r.a.createElement("input",{type:"checkbox",name:a,value:n,checked:i,disabled:u,onChange:o}),r.a.createElement("div",{className:"mr-3 checkbox-checked ".concat(g),onClick:function(){u||o()}},c.m),r.a.createElement("label",{dangerouslySetInnerHTML:{__html:t}}))}},201:function(e,a,t){"use strict";var n=t(0),r=t.n(n);a.a=function(e){var a=e.loading;return void 0!==a&&a&&r.a.createElement("div",{className:"loader-wrapper d-flex justify-content-center w-100"},r.a.createElement("div",{className:"spinner-border",role:"status"},r.a.createElement("span",{className:"sr-only"},"Loading...")))}},789:function(e,a,t){"use strict";t.r(a);var n=t(14),r=t.n(n),c=t(18),l=t(13),i=t(9),o=t(0),s=t.n(o),m=t(148),d=t(32),u=t(10),g=t(152),h=t(2);var p=function(e){var a,t,n=e.label,r=e.className,c=void 0===r?"":r,l=e.showCancelBtn,m=e.showRemoveBtn,d=e.showSaveChangeBtn,p=e.imageObj,b=e.onChange,v=e.handleSubmit,f=e.checkboxObj,_=e.error,E=e.deleteImage,O=e.imgClass,j=e.emptyText,N=Object(o.useRef)(null),w=Object(o.useState)({}),x=Object(i.a)(w,2),k=x[0],P=x[1],S=Object(o.useState)(!1),y=Object(i.a)(S,2),C=y[0],T=y[1],U=Object(o.useState)(!1),R=Object(i.a)(U,2),B=R[0],F=R[1],I=Object(o.useState)(!1),L=Object(i.a)(I,2),D=L[0],H=L[1];Object(o.useEffect)((function(){k&&b(k)}),[k]);var M=Object(o.useCallback)((function(e){e.preventDefault(),H(!1);var a=N.current.files,t=new FileReader,n=a[0];n&&(t.onloadend=function(){P({file:n,imagePreviewUrl:t.result})},t.readAsDataURL(n))}),[N]),A=Object(o.useCallback)((function(){P({file:"",imagePreviewUrl:{value:null}}),E&&E(),H(!0)}),[]),G=Object(o.useMemo)((function(){return B?C:null===f||void 0===f?void 0:f.checked}),[B,C,f]);return s.a.createElement("div",{className:"upload-img ".concat(c)},n&&s.a.createElement("label",{className:"label"},n),s.a.createElement("div",{className:"img-wrapper d-block mb-3 w-100"},((null===k||void 0===k?void 0:k.imagePreviewUrl)?k.imagePreviewUrl:null===p||void 0===p?void 0:p.imgPath)?s.a.createElement("img",{className:O,src:(null===k||void 0===k?void 0:k.imagePreviewUrl)?k.imagePreviewUrl:(null===p||void 0===p?void 0:p.imgPath)?p.imgPath:"",alt:""}):s.a.createElement("div",{className:"empty-image-div"},j)),_?s.a.createElement("p",{className:"assistive-text error-text"},_):s.a.createElement("p",{className:"assistive-text"}),s.a.createElement("div",{className:"d-flex align-items-center justify-content-end"},l||m&&((null===k||void 0===k||null===(a=k.imagePreviewUrl)||void 0===a?void 0:a.value)||(null===p||void 0===p?void 0:p.imgPath))&&s.a.createElement(u.OutlinedButton,{red:!0,className:"mr-2",onClick:A},m?"Remove":"Cancel"),s.a.createElement("label",{className:"btn btn-outline blue-outline d-block mt-2"},(null===k||void 0===k||null===(t=k.imagePreviewUrl)||void 0===t?void 0:t.value)||(null===p||void 0===p?void 0:p.imgPath)?"Change":s.a.createElement(s.a.Fragment,null,h.h," Select a file"),s.a.createElement("input",{type:"file",size:"",accept:".png,.jpeg,.jpg",ref:N,style:{display:"none"},onChange:M}))),f&&f.show&&s.a.createElement(g.a,{name:"registerWithSameDetails",label:f.label,checked:G,value:f.key,blue:!0,onClick:function(){return T(!G)||F(!0)}}),d&&s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"divider my-2 mx-5"}),s.a.createElement("div",{className:"d-flex align-items-center justify-content-center "},s.a.createElement(u.ContainedButton,{lightBlue:!0,color:"primary",withIcon:!0,onClick:function(){return v({image:k,checked:C,remove:D})}},"Save Changes"))))},b=t(143),v=t(22),f=t(17),_=t(147),E=t(4),O=t(201),j={letterhead_type:"default",logo:{imagePreviewUrl:d.i},letterhead:{},footer:{},print_letterhead:!1,techniciansSign:{technician_name:"",technician_degree:"",print_technician_sign:!1},doctorsSign:{doctor_name:"",doctor_degree:"",print_doctor_sign:!1}};a.default=function(){var e=localStorage.getItem("loginAs"),a=Object(o.useContext)(f.a).profile,t=Object(E.i)().branchId,n=Object(o.useState)(Object(l.a)({},j)),d=Object(i.a)(n,2),u=d[0],g=d[1],h=Object(o.useState)({}),N=Object(i.a)(h,2),w=N[0],x=N[1],k=Object(o.useState)({show:!1,message:"",type:""}),P=Object(i.a)(k,2),S=P[0],y=P[1],C=Object(o.useState)(!0),T=Object(i.a)(C,2),U=T[0],R=T[1],B=Object(o.useCallback)((function(){var n=null;a&&"lab"===e?n="/lab/".concat(a.selectedRole.uuid):"lab-admin"===e&&t&&(n="/lab_group/".concat(a.selectedRole.uuid,"/lab/").concat(t)),n&&Object(c.a)(r.a.mark((function e(){var a,t,c,i,o,s,m,d,h,p,b,f,_,E,O,j,N;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return R(!0),e.next=3,Object(v.fetchRequest)({url:n,method:"GET",isAuth:!0});case 3:if((a=e.sent)&&R(!1),!a||200!==a.status){e.next=13;break}return e.next=8,a.json();case 8:return t=e.sent,c=t.data,i=c.technician_name,o=c.technician_degree,s=c.print_technician_sign,m=c.technician_sign,d=c.doctor_name,h=c.doctor_degree,p=c.doctor_sign,b=c.print_doctor_sign,f=c.logo,_=c.footer,E=c.print_letterhead,O=c.letterhead,j=c.letterhead_type,N=c.email,g(Object(l.a)(Object(l.a)(Object(l.a)({},u),c),{},{logo:{imgPath:f},footer:{imgPath:_},letterhead:{imgPath:O},print_letterhead:!E,letterhead_type:j,techniciansSign:{technician_name:i,technician_degree:o,print_technician_sign:!s,imgPath:m},doctorsSign:{imgPath:p,doctor_name:d,doctor_degree:h,print_doctor_sign:!b},email:N})),e.abrupt("return",c);case 13:return e.abrupt("return");case 14:case"end":return e.stop()}}),e)})))()}),[a,e,t]);Object(o.useEffect)((function(){B()}),[B]);var F=function(e,a){var t=Object(l.a)({},u);t[a]=Object(l.a)(Object(l.a)({},t[a]),e),g(Object(l.a)({},t))},I=function(n){var i=n.image,o=n.checked,s=n.remove;x({}),y({show:!1,message:"",type:""});var m=new FormData;m.append("letterhead_type",L),"default"===L?(s&&m.append("delete_logo",!0),m.append("logo",i.file?i.file:"")):"custom"===L&&(s&&m.append("delete_footer",!0),m.append("letterhead",D.file?D.file:""),m.append("footer",H.file?H.file:""),m.append("print_letterhead",!o)),Object(c.a)(r.a.mark((function n(){var c,i,o,s,d,h,p,b,f,_;return r.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return c=null,a&&"lab"===e?c="/lab/".concat(a.selectedRole.uuid,"/report_setup_letterhead"):"lab-admin"===e&&(c="/lab/".concat(t,"/report_setup_letterhead")),n.next=4,Object(v.fetchRequest)({url:c,method:"POST",body:m,isAuth:!0,isFormData:!0});case 4:if(!(i=n.sent)||200!==i.status){n.next=16;break}return n.next=8,i.json();case 8:o=n.sent,s=o.data,(d=o.message)&&y({show:!0,message:d,type:"success"}),h=s.logo,p=s.footer,b=s.print_letterhead,f=s.letterhead,g(Object(l.a)(Object(l.a)({},u),{},{logo:{imgPath:h},footer:{imgPath:p},letterhead:{imgPath:f},print_letterhead:!b})),n.next=21;break;case 16:return n.next=18,i.json();case 18:_=n.sent,x(Object(l.a)(Object(l.a)({},w),_.errors)),422!==i.status&&!Object.keys(_.error?_.error:{}).length&&_.message&&y({show:!0,message:_.message,type:"error"});case 21:return n.abrupt("return");case 22:case"end":return n.stop()}}),n)})))()},L=u.letterhead_type,D=u.letterhead,H=u.footer,M=u.logo,A=u.techniciansSign,G=u.doctorsSign,q=u.print_letterhead,J=u.formatted_lab_name,Q=u.address_line_one,V=u.address_line_two,z=u.city,W=u.state,K=u.pincode,X=u.mobile,Y=u.email;return s.a.createElement(s.a.Fragment,null,s.a.createElement(O.a,{loading:U}),!U&&s.a.createElement("div",{className:"report-container w-100"},s.a.createElement(_.a,S),s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-md-6 mr-auto"},s.a.createElement(m.a,{className:"report-main"},"custom"===L?s.a.createElement("div",{className:"report-header-custom"},(D.imagePreviewUrl?D.imagePreviewUrl:D.imgPath)?s.a.createElement("img",{src:D.imagePreviewUrl?D.imagePreviewUrl:D.imgPath,alt:"Header Banner"}):s.a.createElement("div",{className:"empty-header"})):"default"===L?s.a.createElement("div",{className:"d-flex justify-content-between report-header"},(M.imagePreviewUrl?M.imagePreviewUrl:M.imgPath)?s.a.createElement("img",{src:M.imagePreviewUrl?M.imagePreviewUrl:M.imgPath,className:"report-logo",alt:"Logo"}):s.a.createElement("div",{className:"report-logo"}),s.a.createElement("div",{className:"lab-details"},s.a.createElement("div",{className:"name"},s.a.createElement("p",null,J||"-")),s.a.createElement("div",{className:"address"},s.a.createElement("address",null,Q?"".concat(Q,", "):"",s.a.createElement("br",null)," ",V?"".concat(V,","):""," ",s.a.createElement("br",null),z||W||K?"".concat(z,", ").concat(W,", ").concat(K):"")),s.a.createElement("div",{className:"other-details"},s.a.createElement("p",null,X||"-"," | ",Y||"-")))):null,s.a.createElement("div",{className:"report-content"},s.a.createElement("div",{className:"watermark"},"REPORT")),s.a.createElement("div",{className:"signature"},s.a.createElement("div",{className:"d-flex justify-content-between"},s.a.createElement("div",{className:"sign-1"},A.imagePreviewUrl||A.imgPath?s.a.createElement("img",{src:A.imagePreviewUrl?A.imagePreviewUrl:A.imgPath,className:"signature-img",alt:"Signature"}):s.a.createElement("div",{className:"signature-img"}),s.a.createElement("p",{className:"name"},A.technician_name?A.technician_name:""),s.a.createElement("p",{className:"qualification"},A.technician_degree?A.technician_degree:"")),s.a.createElement("div",{className:"sign-2"},G.imagePreviewUrl||G.imgPath?s.a.createElement("img",{src:G.imagePreviewUrl?G.imagePreviewUrl:G.imgPath,className:"signature-img",alt:"Signature"}):s.a.createElement("div",{className:"signature-img"}),s.a.createElement("p",{className:"name"},G.doctor_name?G.doctor_name:""),s.a.createElement("p",{className:"qualification"},G.doctor_degree?G.doctor_degree:"")))),s.a.createElement("div",{className:"report-footer"},"custom"===L&&H&&(H.imagePreviewUrl||H.imgPath)?s.a.createElement("img",{src:H.imagePreviewUrl?H.imagePreviewUrl:H.imgPath,className:"report-footer-image",alt:"Footer Logo"}):s.a.createElement("div",{className:"d-flex note"})))),s.a.createElement("div",{className:"col-md-5"},s.a.createElement(m.a,{title:"Report Letterhead"},s.a.createElement("div",{className:"report-letter-head"},s.a.createElement("div",{className:"d-flex align-items-center ml-3"},s.a.createElement("input",{type:"radio",id:"default",name:"letterhead",checked:"default"===L,value:L,onChange:function(){return g(Object(l.a)(Object(l.a)({},u),{},{letterhead_type:"default"}))}}),s.a.createElement("p",{className:"pl-2 report-letter-head-checkbox"},"Use Sugarlogger default letter head & footer")),s.a.createElement("div",{className:"d-flex align-items-center ml-3"},s.a.createElement("input",{type:"radio",id:"custom",name:"letterhead",checked:"custom"===L,value:L,onChange:function(){return g(Object(l.a)(Object(l.a)({},u),{},{letterhead_type:"custom"}))}}),s.a.createElement("p",{className:"pl-2 report-letter-head-checkbox"},"Use custom letter head & footer")),"default"===L&&s.a.createElement(p,{label:"Upload a logo image :",imageObj:M,onChange:function(e){return F(e,"logo")},showRemoveBtn:!0,showSaveChangeBtn:!0,handleSubmit:I,error:w&&w.logo,imgClass:"h-auto",emptyText:"Logo"}),"custom"===L&&s.a.createElement(s.a.Fragment,null,s.a.createElement(p,{label:"Letter Head :",imageObj:D,onChange:function(e){return F(e,"letterhead")},error:w&&w.letterhead,emptyText:"Letter Head"}),s.a.createElement(p,{label:"Footer (Optional):",showRemoveBtn:!0,showSaveChangeBtn:!0,imageObj:H,onChange:function(e){return F(e,"footer")},handleSubmit:I,deleteImage:function(){return F(!0,"delete_footer")},checkboxObj:{show:!0,label:"Hide Letterhead and footer on Print",key:"print_letterhead",checked:q},error:w&&w.footer,emptyText:"Footer"})))))),s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-md-4 sign-carts"},s.a.createElement(m.a,{title:"Technician\u2019s Name & Signature"},s.a.createElement("div",{className:"form-group mb-3"},s.a.createElement(b.a,{value:A.technician_name||"",onChange:function(e){return F({technician_name:e.target.value},"techniciansSign")},error:w&&w.technician_name,placeholder:"Full Name"})),s.a.createElement("div",{className:"form-group mb-3"},s.a.createElement(b.a,{value:A.technician_degree||"",onChange:function(e){return F({technician_degree:e.target.value},"techniciansSign")},error:w&&w.technician_degree,placeholder:"Qualification"})),s.a.createElement(p,{showRemoveBtn:!0,showSaveChangeBtn:!0,imageObj:A,onChange:function(e){return F(Object(l.a)(Object(l.a)({},e),{},{techniciansSign:A}),"techniciansSign")},checkboxObj:{show:!0,label:"Hide Signature on Print",key:"print_technician_sign",checked:A.print_technician_sign},handleSubmit:function(n){var i=n.image,o=n.checked,s=n.remove;x({}),y({show:!1,message:"",type:""});var m=new FormData;m.append("technician_name",A.technician_name||""),m.append("technician_degree",A.technician_degree||""),s&&m.append("delete_sign",!0),m.append("technician_sign",i.file?i.file:""),m.append("print_technician_sign",!o),Object(c.a)(r.a.mark((function n(){var c,i,o,s,d,h,p,b,f,_;return r.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return c=null,a&&"lab"===e?c="/lab/".concat(a.selectedRole.uuid,"/report_setup_technician"):"lab-admin"===e&&(c="/lab/".concat(t,"/report_setup_technician")),n.next=4,Object(v.fetchRequest)({url:c,method:"POST",body:m,isAuth:!0,isFormData:!0});case 4:if(!(i=n.sent)||200!==i.status){n.next=16;break}return n.next=8,i.json();case 8:o=n.sent,s=o.data,(d=o.message)&&y({show:!0,message:d,type:"success"}),h=s.technician_name,p=s.technician_degree,b=s.print_technician_sign,f=s.technician_sign,g(Object(l.a)(Object(l.a)({},u),{},{techniciansSign:{technician_name:h,technician_degree:p,print_technician_sign:b,imgPath:f}})),n.next=21;break;case 16:return n.next=18,i.json();case 18:_=n.sent,x(Object(l.a)(Object(l.a)({},w),_.errors)),422!==i.status&&!Object.keys(_.error?_.error:{}).length&&_.message&&y({show:!0,message:_.message,type:"error"});case 21:return n.abrupt("return");case 22:case"end":return n.stop()}}),n)})))()},error:w&&w.technician_sign,emptyText:"Technician\u2019s Sign",name:"tech"}))),s.a.createElement("div",{className:"col-md-4 sign-carts"},s.a.createElement(m.a,{title:"Doctor\u2019s Name & Signature*"},s.a.createElement("div",{className:"form-group mb-3"},s.a.createElement(b.a,{value:G.doctor_name||"",onChange:function(e){return F({doctor_name:e.target.value},"doctorsSign")},error:w&&w.doctor_name,placeholder:"Full Name*"})),s.a.createElement("div",{className:"form-group mb-3"},s.a.createElement(b.a,{value:G.doctor_degree||"",onChange:function(e){return F({doctor_degree:e.target.value},"doctorsSign")},error:w&&w.doctor_degree,placeholder:"Qualification*"})),s.a.createElement(p,{showSaveChangeBtn:!0,imageObj:G,onChange:function(e){return F(Object(l.a)(Object(l.a)({},e),{},{doctorsSign:G}),"doctorsSign")},checkboxObj:{show:!0,label:"Hide Signature on Print",key:"print_doctor_sign",checked:G.print_doctor_sign},handleSubmit:function(n){var i=n.image,o=n.checked;x({}),y({show:!1,message:"",type:""});var s=new FormData;s.append("doctor_name",G.doctor_name||""),s.append("doctor_degree",G.doctor_degree||""),s.append("doctor_sign",i.file?i.file:""),s.append("print_doctor_sign",!o),Object(c.a)(r.a.mark((function n(){var c,i,o,m,d,h,p,b,f,_;return r.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return c=null,a&&"lab"===e?c="/lab/".concat(a.selectedRole.uuid,"/report_setup_doctor"):"lab-admin"===e&&(c="/lab/".concat(t,"/report_setup_doctor")),n.next=4,Object(v.fetchRequest)({url:c,method:"POST",body:s,isAuth:!0,isFormData:!0});case 4:if(!(i=n.sent)||200!==i.status){n.next=16;break}return n.next=8,i.json();case 8:o=n.sent,m=o.data,(d=o.message)&&y({show:!0,message:d,type:"success"}),h=m.doctor_name,p=m.doctor_degree,b=m.doctor_sign,f=m.print_doctor_sign,g(Object(l.a)(Object(l.a)({},u),{},{doctorsSign:{imgPath:b,doctor_name:h,doctor_degree:p,print_doctor_sign:f}})),n.next=21;break;case 16:return n.next=18,i.json();case 18:_=n.sent,x(Object(l.a)(Object(l.a)({},w),_.errors)),422!==i.status&&!Object.keys(_.error?_.error:{}).length&&_.message&&y({show:!0,message:_.message,type:"error"});case 21:return n.abrupt("return");case 22:case"end":return n.stop()}}),n)})))()},error:w&&w.doctor_sign,emptyText:"Doctor's Sign"}))))))}}}]);
//# sourceMappingURL=52.6696b3d6.chunk.js.map