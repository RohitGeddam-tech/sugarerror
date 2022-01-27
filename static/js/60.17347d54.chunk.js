(this["webpackJsonpsugarlogger-frontend"]=this["webpackJsonpsugarlogger-frontend"]||[]).push([[60],{144:function(e,a,t){"use strict";var n=t(0),c=t.n(n),l=t(156);a.a=function(e){var a=e.className,t=void 0===a?"":a,r=e.options,s=void 0===r?[]:r,o=e.value,i=e.onChange,m=e.placeholder,u=e.error,d=e.hasGrayBack,p=void 0!==d&&d,f=e.isMulti,E=void 0!==f&&f,g=(e.hideSelectedOptions,e.isClearable),v=void 0===g||g,h=e.disabled,N=e.isLoading,b=e.hidePlaceholder,k=e.defaultValue,y=e.isSearchable,x=void 0!==y&&y,w="input-group select-control-input ".concat(u?"has-error":""," ").concat(p?"background-gray":""," ").concat(o&&o.value?"has-value":""," ").concat(b?"hide-placeholder":""," ").concat(h?"cursor-notAllowed":"");t+=" select-input ";var C=Object(n.useRef)(null);return c.a.createElement(c.a.Fragment,null,c.a.createElement("div",{className:w,ref:C},c.a.createElement(l.a,{value:o,onChange:i,options:s,className:t,classNamePrefix:"select-input",placeholder:c.a.createElement("div",null,""),onFocus:function(){return C.current.classList.add("select-focused")},onBlur:function(){return C.current.classList.remove("select-focused")},isClearable:v,isMulti:E,removeSelected:!1,defaultValue:k,isDisabled:h,isLoading:N,isSearchable:x}),c.a.createElement("label",{className:"select-placeholder"},m)),u?c.a.createElement("p",{className:"assistive-text error-text"},u):c.a.createElement("p",{className:"assistive-text"}))}},1529:function(e,a,t){"use strict";t.r(a);var n=t(13),c=t(14),l=t.n(c),r=t(18),s=t(9),o=t(0),i=t.n(o),m=t(20),u=t(144),d=t(304),p=t(10),f=t(32),E=t(182),g=t(197),v=t(38),h=t(22),N=[{value:"monthly_package",label:"Monthly Packs",formatted_label:"for 1 month"},{value:"quarterly_package",label:"Quarterly Packs",formatted_label:"for 3 months"},{value:"half_yearly_package",label:"Half-Yearly Packs",formatted_label:"for 6 months"},{value:"yearly_package",label:"Yearly Packs",formatted_label:"for 1 year"}];a.default=function(e){var a=Object(v.a)(),t=Object(s.a)(a,1)[0],c=Object(o.useState)({value:"monthly_package",label:"Monthly Packs"}),b=Object(s.a)(c,2),k=b[0],y=b[1],x=Object(o.useState)([]),w=Object(s.a)(x,2),C=w[0],S=w[1];Object(o.useEffect)((function(){window.scrollTo(0,0),Object(r.a)(l.a.mark((function e(){var a,t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(h.fetchRequest)({url:"/packages",method:"GET",isAuth:!1});case 2:if(!(a=e.sent)||200!==a.status){e.next=9;break}return e.next=6,a.json();case 6:return t=e.sent,S(t),e.abrupt("return",t);case 9:return e.abrupt("return");case 10:case"end":return e.stop()}}),e)})))()}),[]);var _=function(e){return i.a.createElement(i.a.Fragment,null,e.length?e.map((function(e){return e.type===k.value&&e.packages.length?e.packages.map((function(e,a){return i.a.createElement(g.a,{key:a,data:{name:e.trial_package?"Free trial":"\u20b9 ".concat(e.amount),expiary:e.type,patients:e.credits,details:e.description,isRed:e.trial_package},showBtn:!0,BtnFooter:function(){return i.a.createElement("div",{className:"d-flex justify-content-center mb-3"},i.a.createElement(p.ContainedButton,{link:!0,to:{pathname:"/register",state:Object(n.a)({},e)},black:!0},"Get Started"))}})})):null})):i.a.createElement(i.a.Fragment,null))};return i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:"package-section"},i.a.createElement("div",{className:"clip-image-wrapper our-packages-wrapper"},i.a.createElement("div",{className:"package-container-headings"},i.a.createElement(m.a,null,i.a.createElement("h2",{className:"black-heading text-uppercase pt-5 pb-3"},"Our Packages"),i.a.createElement("h3",{className:"red-heading pb-4"},"Find a plan according to your requirement"))),i.a.createElement("div",{className:"package-container-content"},i.a.createElement(m.a,null,i.a.createElement("div",{className:"package-header"},t<=767?i.a.createElement("div",{className:"form-group"},i.a.createElement(u.a,{options:N,value:k,onChange:function(e){return y(e)}})):i.a.createElement("ul",{className:"nav package-nav mb-4"},N.map((function(e,a){return i.a.createElement("li",{className:"nav-item ".concat(k.value===e.value?"active":""),key:a,onClick:function(){return y(e)}},i.a.createElement("span",{className:"nav-link","data-active":e.value},e.label),i.a.createElement("span",{className:"nav-border"}))})))),i.a.createElement("div",{className:"package-body"},t<=767?i.a.createElement(i.a.Fragment,null,i.a.createElement(d.a,null,_(C))):i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:"d-flex package-card-wrapper"},_(C))))))),i.a.createElement("div",{className:"features-wrapper text-center mx"},i.a.createElement(m.a,null,i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-md-6 col-lg-3"},i.a.createElement("div",{className:"flex feature"},i.a.createElement("img",{src:f.a,alt:"Cloud Storage",className:"feature-img mt-4 mb-4"}),i.a.createElement("p",{className:"feature-name"},"Unlimited Storage"))),i.a.createElement("div",{className:"col-md-6 col-lg-3"},i.a.createElement("div",{className:"flex feature"},i.a.createElement("img",{src:f.g,alt:"Online Share",className:"feature-img mb-3"}),i.a.createElement("p",{className:"feature-name"},"Share reports & bills completely online"))),i.a.createElement("div",{className:"col-md-6 col-lg-3"},i.a.createElement("div",{className:"flex feature"},i.a.createElement("img",{src:f.c,alt:"Efficient Lab Management",className:"feature-img mb-3"}),i.a.createElement("p",{className:"feature-name"},"Efficient Lab Management"))),i.a.createElement("div",{className:"col-md-6 col-lg-3"},i.a.createElement("div",{className:"flex feature"},i.a.createElement("img",{src:f.b,alt:"Easy to Use",className:"feature-img mb-3"}),i.a.createElement("p",{className:"feature-name"},"Easy to Use")))))),i.a.createElement(E.a,{sectionClass:"contact-us"},i.a.createElement("div",{className:"col-md-12"},i.a.createElement("div",{className:"contact-us"},i.a.createElement("div",{className:"text-content-wrapper text-center"},i.a.createElement("p",{className:"section-top-hr mx-auto"}),i.a.createElement("h3",{className:"content-heading white-heading mb-4"},"Not sure about the right plan?")),i.a.createElement("div",{className:"btn-wrapper text-center"},i.a.createElement(p.ContainedButton,{red:!0,link:!0,to:"/contact"},"Contact Us")))))))}},182:function(e,a,t){"use strict";t.d(a,"a",(function(){return l}));var n=t(0),c=t(20),l=function(e){var a=e.children,t=e.sectionClass;return n.createElement("section",{className:"section-wrapper ".concat(t,"-section")},n.createElement(c.a,null,n.createElement("div",{className:"row section-content-wrapper"},a)))}},197:function(e,a,t){"use strict";var n=t(0),c=t.n(n),l=t(10);a.a=function(e){var a=e.data,t=e.className,n=void 0===t?"":t,r=e.showBtn,s=e.BtnFooter,o=e.showInfoIcon;n="".concat(n," ").concat(a.isCustom?"custom-package":""," ").concat(a.isRed?"red-content":"");var i=""!==a.expiary?("monthly_package"===a.expiary?"for 1 month":"quarterly_package"===a.expiary&&"for 3 months")||"half_yearly_package"===a.expiary&&"for 6 months"||"yearly_package"===a.expiary&&"for 1 year"||a.isCustom&&"for ".concat(a.expiary||"x"," days"):"-";return c.a.createElement("div",{className:"card package-card text-center ".concat(n)},c.a.createElement("div",{className:"card-head"},c.a.createElement("span",{className:"package-status"},a.status),c.a.createElement("p",{className:"red-heading package-name"},a.name?a.name:"-"),c.a.createElement("p",{className:"package-expiary"},i||"-"),c.a.createElement("div",{className:"package-patients d-flex justify-content-center"},c.a.createElement("p",null,a.patients?a.patients:"0"," patients"),o&&c.a.createElement("p",{className:"i-btn-icon ml-2"}))),c.a.createElement("div",{className:"card-body text-center"},c.a.createElement("p",null,a.details?a.details:"---")),s?c.a.createElement(s,null):r&&c.a.createElement("div",{className:"card-foot"},a.isCustom?c.a.createElement(l.ContainedButton,{darkBlue:!0,link:!0,to:"/contact"},"Contact Us"):c.a.createElement(l.ContainedButton,{link:!0,to:"/register",black:!0},"Get Started")))}},304:function(e,a,t){"use strict";t.d(a,"a",(function(){return s}));var n=t(0),c=t.n(n),l=t(410),r=t.n(l);function s(e){var a=e.children;return c.a.createElement(r.a,{dots:!0,centerMode:!0,slidesToShow:3,slidesToScroll:3,speed:500,className:"center",infinite:!0,centerPadding:"60px",responsive:[{breakpoint:768,settings:{centerMode:!0,slidesToShow:3,slidesToScroll:3}},{breakpoint:767,settings:{centerMode:!1,slidesToShow:1,slidesToScroll:1,variableWidth:!1}}]},a)}}}]);
//# sourceMappingURL=60.17347d54.chunk.js.map