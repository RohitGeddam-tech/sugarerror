(this["webpackJsonpsugarlogger-frontend"]=this["webpackJsonpsugarlogger-frontend"]||[]).push([[44],{1503:function(e,t,a){"use strict";a.r(t);var c=a(13),n=a(14),r=a.n(n),s=a(18),o=a(9),l=a(0),i=a.n(l),m=a(2),u=a(38),d=a(149),b=a(155),p=a(22),D=a(413),f=a(179),g=a.n(f),h=a(245),j=(a(246),a(247),[{labelAsIcon:m.n,accessKey:"checked",keyToCheck:"uuid",renderIcon:m.n,isCheckbox:!0,isMobile:!1},{label:"Date",dateFilter:{show:!0,selectDateRange:!0},selectsDateRange:!0,accessKey:"date"},{label:"Name",accessKey:"name"},{label:"Patients in the account",accessKey:"members",cellRenderer:function(e){return e.members+" members"}},{label:"Mobile No.",accessKey:"mobile"},{label:"Email ID",accessKey:"email"}]);t.default=function(){var e=Object(u.a)(),t=Object(o.a)(e,1)[0],a=Object(l.useState)({data:[],pagination:{}}),n=Object(o.a)(a,2),f=n[0],O=n[1],Y=Object(l.useState)({per_page:15,sort:[],current_page:1,date_from:g()().subtract(1,"year").format("YYYY-MM-DD"),date_to:g()().format("YYYY-MM-DD")}),E=Object(o.a)(Y,2),y=E[0],N=E[1],_=Object(l.useState)(!1),v=Object(o.a)(_,2),k=v[0],M=v[1],x=Object(l.useState)([]),w=Object(o.a)(x,2),S=w[0],P=w[1],C=Object(l.useState)({start:g()(),end:g()()}),K=Object(o.a)(C,2),L=(K[0],K[1]),F=Object(l.useCallback)((function(){M(!0);var e=y.per_page,t=void 0===e?15:e,a=y.current_page,c=y.search,n=y.date_from,o=y.date_to,l=y.sort;t&&Object(s.a)(r.a.mark((function e(){var s,i,m,u,d;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s="/super_admin/patients?per_page=".concat(t).concat(a?"&page=".concat(a):"").concat(c?"&search=".concat(c):"").concat(n?"&date_from=".concat(n):"").concat(o?"&date_to=".concat(o):"").concat(l&&l.length?l.map((function(e){return"&".concat(e.key,"=").concat(e.value)})):""),e.next=3,Object(p.fetchRequest)({url:s,method:"GET",isAuth:!0});case 3:if(!(i=e.sent)||200!==i.status){e.next=15;break}return M(!1),e.next=8,i.json();case 8:return m=e.sent,u=m.data,d=m.meta,O({data:u,pagination:d.pagination}),e.abrupt("return",u);case 15:M(!1);case 16:return e.abrupt("return");case 17:case"end":return e.stop()}}),e)})))()}),[y]);Object(l.useEffect)((function(){F()}),[y,F]);var R=Object(l.useCallback)((function(e){N((function(t){return Object(c.a)(Object(c.a)({},t),e)}))}),[]),I=Object(l.useCallback)((function(e){return P(e)}),[]),T=y.date_from&&g()(y.date_from).format("DD-MM-YYYY")+" to "+g()(y.date_to).format("DD-MM-YYYY"),A={Today:[g()().toDate(),g()().toDate()],Yesterday:[g()().subtract(1,"days").toDate(),g()().subtract(1,"days").toDate()],"This Month":[g()().startOf("month").toDate(),g()().endOf("month").toDate()],"Last 7 Days":[g()().subtract(6,"days").toDate(),g()().toDate()],"Last 30 Days":[g()().subtract(29,"days").toDate(),g()().toDate()],"Last 6 Months":[g()().subtract(6,"months").toDate(),g()().toDate()],"Last 1 Year":[g()().subtract(1,"year").toDate(),g()().toDate()]};return i.a.createElement("div",{className:"paper card list-patient-container list-container"},i.a.createElement("div",{className:"content-header"},i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-6 col-md-2"},i.a.createElement("p",{className:"semi-bold title"},"All Patients")),i.a.createElement("div",{className:"col-6 col-md-2"},i.a.createElement("div",{className:"form-group text-right"},i.a.createElement(D.a,{path:"/super_admin/patients_export",filter:y,selectedData:S}))),i.a.createElement("div",{className:"col-md-4 customDatePicker-wrapper"},i.a.createElement(h.a,{className:"customDatePicker",id:"customDatePicker",initialSettings:{maxDate:new Date,startDate:g()().subtract(1,"year").toDate(),endDate:g()().toDate(),ranges:A,autoUpdateInput:!0},onCallback:function(e,t){L({start:e,end:t}),N(Object(c.a)(Object(c.a)({},y),{},{date_from:g()(e._d).format("YYYY-MM-DD"),date_to:g()(t._d).format("YYYY-MM-DD"),current_page:1}))}},i.a.createElement("div",{className:"customDatePicker-innerwrapper"},i.a.createElement("span",{className:T?"range-value":"range-placeholder"},T||"Select Range"),i.a.createElement("label",{className:"table-icon d-inline"},m.i)))),i.a.createElement("div",{className:"push-4 col-md-4"},i.a.createElement(d.a,{setFilter:N,filter:y,placeholder:"Search by Name or Mobile No."}))),t<=768?i.a.createElement("div",{className:"d-flex justify-content-end mr-2 filter"},i.a.createElement("p",{className:"mr-1"},m.B)," ",i.a.createElement("p",null,"Filter")):i.a.createElement(i.a.Fragment,null)),i.a.createElement("div",{className:"content-body"},i.a.createElement(b.a,{columnDefs:j,tableData:f.data,pagination:Object(c.a)(Object(c.a)({},f.pagination),{},{getListPerPage:R}),isButtonCard:i.a.createElement("span",{className:"next-arrow"},m.x),setFilter:N,filter:y,isLoading:k,listName:"patients",getSelectedData:I})))}}}]);
//# sourceMappingURL=44.9957d2e8.chunk.js.map