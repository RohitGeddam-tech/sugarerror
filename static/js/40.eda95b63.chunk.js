(this["webpackJsonpsugarlogger-frontend"]=this["webpackJsonpsugarlogger-frontend"]||[]).push([[40],{1085:function(e,t){},1087:function(e,t){},1117:function(e,t){},1118:function(e,t){},1201:function(e,t){},152:function(e,t,a){"use strict";var n=a(0),l=a.n(n),r=a(2);t.a=function(e){var t=e.name,a=e.label,n=e.value,i=e.checked,o=void 0!==i&&i,c=e.onClick,m=e.blue,d=(e.red,e.className),s=void 0===d?"":d,u=e.disabled,g=m?"blue":"red";return l.a.createElement("div",{className:"d-flex checkbox-input ".concat(s," pure-material-checkbox ").concat(u?"disabled":"")},l.a.createElement("input",{type:"checkbox",name:t,value:n,checked:o,disabled:u,onChange:c}),l.a.createElement("div",{className:"mr-3 checkbox-checked ".concat(g),onClick:function(){u||c()}},r.m),l.a.createElement("label",{dangerouslySetInnerHTML:{__html:a}}))}},1545:function(e,t,a){"use strict";a.r(t);var n=a(14),l=a.n(n),r=a(13),i=a(18),o=a(9),c=a(0),m=a.n(c),d=a(4),s=a(10),u=a(152),g=a(17),p=a(22),f=a(348),h=a(19),b=a(1348),x=a.n(b),_=f.StyleSheet.create({page:{fontFamily:"Helvetica",backgroundColor:"#ffffff",fontSize:12,lineHeight:1.5,width:595,height:845},body:{flex:1,padding:"0 42 0"},header:{top:30},headerTop:{height:125},customLetterheadImage:{height:110,width:"100%",flexDirection:"column"},defaultLetterheadWrapper:{padding:"0 0 0",margin:"0 42"},defaultLetterheadLogo:{maxHeight:"3cm",maxWidth:"5.5cm"},labDetails:{flexDirection:"column",flexGrow:6,textAlign:"right",marginLeft:"1cm"},labName:{color:"#282C36",fontSize:16},labAddress:{marginLeft:"2.5cm",color:"#282C36",lineHeight:1.2,marginBottom:8},patientDetails:{flexDirection:"row",alignItems:"stretch",flexWrap:"wrap",borderTop:"1px solid #55575c",borderBottom:"1px solid #55575c",margin:"0 42 10",paddingTop:10,height:60},patientInfo:{minWidth:250,marginBottom:"0.3cm"},testSection:{position:"relative",minHeight:400,marginTop:30},testName:{fontSize:14,display:"block",textAlign:"center"},table:{lineHeight:2},tableHeadRow:{flexDirection:"row",alignItems:"stretch",marginBottom:5,marginTop:10},tableDataRow:{color:"#55575C"},firstCol:{width:"30%",color:"#55575C"},secondCol:{width:"45%",textAlign:"left",color:"#282C36"},thirdCol:{width:"25%",textAlign:"right",color:"#55575C"},groupTestName:{color:"#55575C"},moreInfoWrapper:{marginTop:20},moreInfo:{marginBottom:15},labelText:{color:"#282C36",marginBottom:5},valueText:{color:"#55575C",whiteSpace:"nowrap",overflow:"auto"},endOfReport:{textAlign:"center",marginBottom:20},technicianSign:{justifySelf:"flex-end",width:"6cm",alignItems:"flex-end"},footer:{minHeight:52,width:"100%",marginTop:20},customFooterImage:{height:70,width:"100%"},flexRow:{flexDirection:"row",justifyContent:"space-between"},flexColumn:{flexDirection:"column"},boldText:{fontFamily:"Helvetica-Bold"},tableHead:{color:"#282C36",fontFamily:"Helvetica-Bold"},highlight:{color:"#282C36",fontFamily:"Helvetica-Bold"}}),v=function(e){e=e.replace(/<figure/gim,"<div ").replace(/\/figure>/gim,"/div>");var t='<body>\n  <style>\n  *{\n    margin: 0;\n    padding: 0;\n    font-size: 12px;\n    line-height: 1.5;\n    color: #282C36;\n    font-family: Helvetica;\n  }\n  ul, ol{\n    margin: 0 16px 0 -20px;\n  }\n  li{\n    margin-bottom: 5px;\n  }\n  strong {\n    font-family: Helvetica-Bold;\n  }\n  .table {\n    overflow-x: scroll;\n    padding-top: 10px;\n  }\n  table{\n    margin: 10px 0;\n    width : 100%;\n    height : 100%;\n  }\n  table, th, td {\n    border: 1px solid #282C36;\n  }\n  td{\n    padding: 3px 5px;\n  }\n  </style>\n  <div class="editor-content">'.concat(e,"</div>\n  </body>");return m.a.createElement(x.a,null,t)},y=function(e){var t=e.value,a=e.rangeTest,n=e.abnormal,l=e.reportType,r=a&&Object(h.g)(a,t);return"Pre-Defined Test Result"==l?m.a.createElement(f.View,{style:_.secondCol},v(t)):m.a.createElement(f.Text,{style:[_.secondCol,(r||n)&&_.highlight]},t instanceof Object?t.label:t)},E=function(e,t){var a=e.data,n=a.tests,l=void 0===n?[]:n,r=a.reportData,i=void 0===r?{}:r,o=a.patient,c=void 0===o?{}:o,d=i.letterhead_type,s=i.letterhead,u=i.footer,g=i.logo,p=i.techniciansSign,h=p.print_technician_sign,b=p.imgPath,x=p.technician_name,E=p.technician_degree,w=i.doctorsSign,T=w.print_doctor_sign,C=w.imgPath,j=w.doctor_name,O=w.doctor_degree,S=i.formatted_lab_name,V=i.address_line_one,k=i.address_line_two,I=i.city,R=i.state,P=i.pincode,N=i.mobile,H=i.email,D=c.full_name,B=c.gender,A=c.age,L=c.referred_by,W=c.formatted_created_at;return m.a.createElement(f.Document,{style:_.document},m.a.createElement(f.Page,{size:"A4",style:_.page,wrap:!0},m.a.createElement(f.View,{style:_.header,fixed:!0},m.a.createElement(f.View,{style:_.headerTop},"custom"===d&&s.print_letterhead?s.imagePreviewUrl||s.imgPath?m.a.createElement(f.Image,{src:s.imagePreviewUrl||s.imgPath,style:_.customLetterheadImage}):null:"default"===d?m.a.createElement(f.View,{style:[_.defaultLetterheadWrapper,_.flexRow]},g.imagePreviewUrl||g.imgPath?m.a.createElement(f.Image,{src:g.imagePreviewUrl||g.imgPath,style:_.defaultLetterheadLogo}):null,m.a.createElement(f.View,{style:_.labDetails},m.a.createElement(f.Text,{style:[_.labName,_.boldText]},S||""),m.a.createElement(f.View,{style:[_.labAddress,_.flexColumn]},m.a.createElement(f.Text,null,V?"".concat(V,", "):"-"),m.a.createElement(f.Text,null,k?"".concat(k,", "):"-"),m.a.createElement(f.Text,null,"".concat(I||"-",", ").concat(R||"-",", ").concat(P||"-"))),m.a.createElement(f.Text,{style:_.boldText},N||"-"," | ",H||"-"))):null),m.a.createElement(f.View,{style:_.patientDetails},m.a.createElement(f.Text,{style:_.patientInfo},m.a.createElement(f.Text,{style:_.boldText},"Patient Name : "),D),m.a.createElement(f.Text,{style:_.patientInfo},m.a.createElement(f.Text,{style:_.boldText},"Age / Sex : "),"".concat(A," / ").concat(B)),m.a.createElement(f.Text,{style:_.patientInfo},m.a.createElement(f.Text,{style:_.boldText},"Referred Doctor : "),(null===L||void 0===L?void 0:L.full_name)||"Self"),m.a.createElement(f.Text,{style:_.patientInfo},m.a.createElement(f.Text,{style:_.boldText},"Date : "),W))),m.a.createElement(f.View,{style:_.body,wrap:!0},l.map((function(e,t){var a=e.value,n=e.appt_sub_tests,l=e.name,r=e.report_type,i=e.interpretation,o=void 0===i?"":i,c=e.technique,d=void 0===c?"":c,s=e.method,u=void 0===s?"":s,g=e.test_remark,p=void 0===g?"":g,w=e.remark,S=void 0===w?"":w,V=e.test_validation,k=e.unit,I=e.showRangeColumn,R=e.abnormal,P=e.note;return m.a.createElement(f.View,{break:t>0,style:_.testSection},m.a.createElement(f.Text,{style:[_.testName,_.boldText]},l),m.a.createElement(f.View,{style:_.table},m.a.createElement(f.View,{style:[_.tableHeadRow,_.boldText]},m.a.createElement(f.Text,{style:[_.firstCol,_.tableHead]},"Test"),m.a.createElement(f.Text,{style:[_.secondCol,_.tableHead]},"Result"),I?m.a.createElement(f.Text,{style:[_.thirdCol,_.tableHead]},"Normal Range"):null),(null===n||void 0===n?void 0:n.length)?n.map((function(e){var t,a=e.unit,n=e.report_type,l=e.test_validation;return m.a.createElement(m.a.Fragment,null,"group"===e.test_type?m.a.createElement(f.Text,{style:[_.groupTestName,_.boldText,{marginBottom:3}]},e.name):m.a.createElement(m.a.Fragment,null),(null===e||void 0===e||null===(t=e.appt_sub_tests)||void 0===t?void 0:t.length)?e.appt_sub_tests.map((function(t,a){var n=t.unit,l=t.report_type,r=t.test_validation,i=e.appt_sub_tests.length;return m.a.createElement(f.View,{style:[_.tableDataRow,_.flexRow,{marginBottom:a===i-1?10:4,paddingLeft:10}]},m.a.createElement(f.Text,{style:_.firstCol},t.name),m.a.createElement(y,{value:t.value,rangeTest:"Range"===l.name?r:null,abnormal:t.abnormal,reportType:l.name}),m.a.createElement(f.Text,{style:_.thirdCol},"Range"===l.name?"".concat((null===r||void 0===r?void 0:r.range_from)?r.range_from:"NA"," - ").concat((null===r||void 0===r?void 0:r.range_to)?r.range_to:"NA"," ").concat((null===n||void 0===n?void 0:n.name)?n.name:""):""))})):m.a.createElement(f.View,{style:[_.tableDataRow,_.flexRow,{marginBottom:10}]},m.a.createElement(f.Text,{style:_.firstCol},e.name),m.a.createElement(y,{value:e.value,rangeTest:"Range"===n.name?l:null,abnormal:e.abnormal,reportType:n.name}),m.a.createElement(f.Text,{style:_.thirdCol},"Range"===n.name?"".concat((null===l||void 0===l?void 0:l.range_from)?l.range_from:"NA"," - ").concat((null===l||void 0===l?void 0:l.range_to)?l.range_to:"NA"," ").concat((null===a||void 0===a?void 0:a.name)?a.name:""):"")))})):m.a.createElement(f.View,{style:[_.tableDataRow,_.flexRow,{marginBottom:10}]},m.a.createElement(f.Text,{style:_.firstCol},l),m.a.createElement(y,{value:(null===r||void 0===r?void 0:r.format.presentation.result)?a instanceof Object?a.label:a:"-",rangeTest:"Range"===r.name?V:null,abnormal:R,reportType:r.name}),m.a.createElement(f.Text,{style:_.thirdCol},(null===r||void 0===r?void 0:r.format.presentation.normal_range)?"".concat((null===V||void 0===V?void 0:V.range_from)?V.range_from:"NA"," - ").concat((null===V||void 0===V?void 0:V.range_to)?V.range_to:"NA"," ").concat((null===k||void 0===k?void 0:k.name)?k.name:""):""))),m.a.createElement(f.View,{style:_.moreInfoWrapper,wrap:!0},o?m.a.createElement(f.View,{style:[_.flexColumn,_.moreInfo],wrap:!0},m.a.createElement(f.Text,{style:[_.labelText,_.boldText]},"Interpretation : "),m.a.createElement(f.View,{style:_.valueText},v(o))):null,u?m.a.createElement(f.View,{style:[_.flexColumn,_.moreInfo],wrap:!0},m.a.createElement(f.Text,{style:[_.labelText,_.boldText]},"Method : "),m.a.createElement(f.View,{style:_.valueText},v(u))):null,d?m.a.createElement(f.View,{style:[_.flexColumn,_.moreInfo],wrap:!0},m.a.createElement(f.Text,{style:[_.labelText,_.boldText]},"Technique : "),m.a.createElement(f.View,{style:_.valueText},v(d))):null,P?m.a.createElement(f.View,{style:[_.flexColumn,_.moreInfo],wrap:!0},m.a.createElement(f.Text,{style:[_.labelText,_.boldText]},"Note : "),m.a.createElement(f.View,{style:_.valueText},v(P))):null,p?m.a.createElement(f.View,{style:[_.flexColumn,_.moreInfo],wrap:!0},m.a.createElement(f.Text,{style:[_.labelText,_.boldText]},"Remark : "),m.a.createElement(f.View,{style:_.valueText},v(p))):null,S?m.a.createElement(f.View,{style:[_.flexColumn,_.moreInfo],wrap:!0},m.a.createElement(f.Text,{style:[_.labelText,_.boldText]},"Lab Remarks : "),m.a.createElement(f.View,{style:_.valueText},m.a.createElement(f.Text,null,S))):null),m.a.createElement(f.Text,{style:[_.boldText,_.endOfReport]},"--------- End Of Report ---------"),m.a.createElement(f.View,{style:[_.flexRow,{marginBottom:10}],wrap:!0},m.a.createElement(f.View,{style:_.flexColumn},m.a.createElement(f.View,{style:{order:1,minHeight:"2cm"}},h&&b?m.a.createElement(f.Image,{src:b,style:{width:"3.5cm",height:"2cm"}}):null),m.a.createElement(f.Text,{style:(_.boldText,{order:2,fontFamily:"Helvetica-Bold",marginTop:14})},x),m.a.createElement(f.Text,{style:{order:3,marginTop:5}},E)),m.a.createElement(f.View,{style:[_.flexColumn,_.technicianSign]},m.a.createElement(f.View,{style:{order:1,minHeight:"2cm"}},T&&C?m.a.createElement(f.Image,{src:C,style:{width:"3.5cm",height:"2cm"}}):null),m.a.createElement(f.Text,{style:[_.boldText,{order:2,marginTop:14}]},j),m.a.createElement(f.Text,{style:{order:3,marginTop:5}},O))))}))),m.a.createElement(f.View,{style:_.footer,fixed:!0},"default"!==d&&s.print_letterhead&&u?m.a.createElement("div",{className:"report-footer"},u.imagePreviewUrl||u.imgPath?m.a.createElement(f.Image,{src:u.imagePreviewUrl||u.imgPath,style:_.customFooterImage}):null):m.a.createElement(f.View,{style:{borderTop:"1px solid #55575c",margin:"0 42"}}))))};t.default=function(){var e=localStorage.getItem("loginAs"),t=Object(d.g)(),a=t.location.state?t.location.state:{},n=Object(c.useContext)(g.a).profile,b=Object(c.useState)({}),x=Object(o.a)(b,2),_=x[0],v=x[1],y=Object(c.useState)({letterhead_type:"default",logo:{imagePreviewUrl:""},letterhead:{},footer:{},print_letterhead:!1,techniciansSign:{technician_name:"",technician_degree:"",print_technician_sign:!1},doctorsSign:{doctor_name:"",doctor_degree:"",print_doctor_sign:!1}}),w=Object(o.a)(y,2),T=w[0],C=w[1],j=a.patientId,O=a.labId,S=a.testIds,V=Object(c.useCallback)(Object(i.a)(l.a.mark((function e(){var t,n,i,o;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!j||!O){e.next=14;break}return e.next=3,Object(p.fetchRequest)({url:"/lab/".concat(O,"/patient_entry/").concat(j),method:"GET",isAuth:!0});case 3:if(!(t=e.sent)||200!==t.status){e.next=13;break}return e.next=7,t.json();case 7:return n=e.sent,(i=n.data)&&(o=i.appointment_test.filter((function(e){return S.includes(e.uuid)})),v(Object(r.a)(Object(r.a)(Object(r.a)({},_),a),{},{tests:Object(h.b)(i,o),patient:i.patient}))),e.abrupt("return",i);case 13:return e.abrupt("return");case 14:case"end":return e.stop()}}),e)}))),[j,O,_,a]);Object(c.useEffect)((function(){V()}),[]),Object(c.useEffect)((function(){v(a)}),[a]);var k=Object(c.useCallback)((function(e){Object(i.a)(l.a.mark((function t(){var a,n,i,o,c,m,d,s,u,g,f,h,b,x,_,v,y;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(p.fetchRequest)({url:e,method:"GET",isAuth:!0});case 2:if(!(a=t.sent)||200!==a.status){t.next=11;break}return t.next=6,a.json();case 6:return n=t.sent,i=n.data,o=i.technician_name,c=i.technician_degree,m=i.print_technician_sign,d=i.technician_sign,s=i.doctor_name,u=i.doctor_degree,g=i.doctor_sign,f=i.print_doctor_sign,h=i.logo,b=i.footer,x=i.print_letterhead,_=i.letterhead,v=i.letterhead_type,y=i.email,C(Object(r.a)(Object(r.a)(Object(r.a)({},T),i),{},{logo:{imgPath:h},footer:{imgPath:b},letterhead:{imgPath:_,print_letterhead:x},print_letterhead:x,letterhead_type:v,techniciansSign:{technician_name:o,technician_degree:c,print_technician_sign:m,imgPath:d},doctorsSign:{imgPath:g,doctor_name:s,doctor_degree:u,print_doctor_sign:f},email:y})),t.abrupt("return",i);case 11:return t.abrupt("return");case 12:case"end":return t.stop()}}),t)})))()}),[null===n||void 0===n?void 0:n.selectedRole,T]);Object(c.useEffect)((function(){if(_){var t,a=null;"lab-admin"===e&&(null===(t=_.lab)||void 0===t?void 0:t.uuid)?a="/lab_group/".concat(n.selectedRole.uuid,"/lab/").concat(_.lab.uuid):"lab"===e&&(a="/lab/".concat(n.selectedRole.uuid)),a&&k(a)}}),[_]);var I=Object(c.useState)(!0),R=Object(o.a)(I,2),P=(R[0],R[1],T.letterhead_type),N=T.letterhead,H=T.techniciansSign,D=T.doctorsSign,B=T.print_letterhead,A=(T.formatted_lab_name,T.print_doctor_sign),L=T.print_technician_sign,W=_.tests,F=_.patient,U=_.formatted_created_at,z=B,q=A,G=L;return m.a.createElement("div",{className:"report-card"},m.a.createElement("div",{className:"row ml-5 mt-2 mb-4 align-items-center"},m.a.createElement("div",{className:"col-10 d-flex report-preview-options"},"custom"===P&&m.a.createElement(u.a,{className:"mr-4",name:"registerWithSameDetails",label:"".concat(z?"Hide":"Show"," Letterhead and footer"),checked:z?!1===N.print_letterhead:!0===N.print_letterhead,value:z?!1===N.print_letterhead:!0===N.print_letterhead,onClick:function(){return C(Object(r.a)(Object(r.a)({},T),{},{letterhead:Object(r.a)(Object(r.a)({},N),{},{print_letterhead:!N.print_letterhead})}))},blue:!0}),(null===H||void 0===H?void 0:H.imgPath)&&m.a.createElement(u.a,{className:"mr-4",name:"registerWithSameDetails",label:"".concat(G?"Hide":"Show"," Technician\u2019s Signature"),checked:G?!1===H.print_technician_sign:!0===H.print_technician_sign,value:G?!1===H.print_technician_sign:!0===H.print_technician_sign,onClick:function(){return C(Object(r.a)(Object(r.a)({},T),{},{techniciansSign:Object(r.a)(Object(r.a)({},H),{},{print_technician_sign:!H.print_technician_sign})}))},blue:!0}),(null===D||void 0===D?void 0:D.imgPath)&&m.a.createElement(u.a,{className:"mr-5",name:"registerWithSameDetails",label:"".concat(q?"Hide":"Show"," Doctor\u2019s Signature"),value:q?!1===D.print_doctor_sign:!0===D.print_doctor_sign,checked:q?!1===D.print_doctor_sign:!0===D.print_doctor_sign,onClick:function(){return C(Object(r.a)(Object(r.a)({},T),{},{doctorsSign:Object(r.a)(Object(r.a)({},D),{},{print_doctor_sign:!D.print_doctor_sign})}))},blue:!0}),m.a.createElement("div",{className:"d-flex justify-content-end mb-3 ml-5"},m.a.createElement(s.ContainedButton,{lightBlue:!0,onClick:function(){window.frames["my-frame"]&&window.frames["my-frame"].print()}},"Print"))),m.a.createElement(f.BlobProvider,{document:m.a.createElement(E,{data:{tests:W,reportData:T,patient:Object(r.a)(Object(r.a)({},F),{},{formatted_created_at:U})}})},(function(e){var t=e.url;return m.a.createElement("iframe",{name:"my-frame",id:"my-frame",title:"my-frame",style:{width:595,height:845},src:t})}))))}}}]);
//# sourceMappingURL=40.eda95b63.chunk.js.map