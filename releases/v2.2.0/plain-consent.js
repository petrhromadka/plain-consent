/*!
 * Plain Consent 2.2.0, https://github.com/petrhromadka/plain-consent
 *
 * MIT License
 *
 * Copyright (c) 2026 Petr Hromádka (Socionet, https://socionet.cz)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * ---
 *
 * Includes vanilla-cookieconsent 3.1.0 (https://github.com/orestbida/cookieconsent):
 *
 * MIT License
 *
 * Copyright (c) 2020-2025 Orest Bida
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function () {
"use strict";
var module = { exports: {} };
var exports = module.exports;
/*!
* CookieConsent 3.1.0
* https://github.com/orestbida/cookieconsent
* Author Orest Bida
* Released under the MIT License
*/
var e,t;e=this,t=function(e){'use strict';const t='opt-in',o='opt-out',n='show--consent',s='show--preferences',a='disable--interaction',c='data-category',r='div',i='button',l='aria-hidden',d='btn-group',f='click',_='data-role',u='consentModal',p='preferencesModal';class g{constructor(){this.t={mode:t,revision:0,autoShow:!0,lazyHtmlGeneration:!0,autoClearCookies:!0,manageScriptTags:!0,hideFromBots:!0,cookie:{name:'cc_cookie',expiresAfterDays:182,domain:'',path:'/',secure:!0,sameSite:'Lax'}},this.o={i:{},l:'',_:{},u:{},p:{},m:[],v:!1,h:null,C:null,S:null,M:'',T:!0,D:!1,k:!1,A:!1,N:!1,H:[],V:!1,j:!0,I:[],L:!1,F:'',P:!1,O:[],R:[],B:[],$:[],G:!1,J:!1,U:!1,q:[],K:[],W:[],X:{},Y:{},Z:{},ee:{},te:{},oe:[]},this.ne={se:{},ae:{}},this.ce={},this.re={ie:'cc:onFirstConsent',le:'cc:onConsent',de:'cc:onChange',fe:'cc:onModalShow',_e:'cc:onModalHide',ue:'cc:onModalReady'}}}const m=new g,b=(e,t)=>e.indexOf(t),v=(e,t)=>-1!==b(e,t),y=e=>Array.isArray(e),h=e=>'string'==typeof e,C=e=>!!e&&'object'==typeof e&&!y(e),w=e=>'function'==typeof e,S=e=>Object.keys(e),x=e=>Array.from(new Set(e)),M=()=>document.activeElement,T=e=>e.preventDefault(),D=(e,t)=>e.querySelectorAll(t),k=e=>e.dispatchEvent(new Event('change')),E=e=>{const t=document.createElement(e);return e===i&&(t.type=e),t},A=(e,t,o)=>e.setAttribute(t,o),N=(e,t,o)=>{e.removeAttribute(o?'data-'+t:t)},H=(e,t,o)=>e.getAttribute(o?'data-'+t:t),V=(e,t)=>e.appendChild(t),j=(e,t)=>e.classList.add(t),I=(e,t)=>j(e,'cm__'+t),L=(e,t)=>j(e,'pm__'+t),F=(e,t)=>e.classList.remove(t),P=e=>{if('object'!=typeof e)return e;if(e instanceof Date)return new Date(e.getTime());let t=Array.isArray(e)?[]:{};for(let o in e){let n=e[o];t[o]=P(n)}return t},O=()=>{const e={},{O:t,X:o,Y:n}=m.o;for(const s of t)e[s]=G(n[s],S(o[s]));return e},R=(e,t)=>dispatchEvent(new CustomEvent(e,{detail:t})),B=(e,t,o,n)=>{e.addEventListener(t,o),n&&m.o.m.push({pe:e,ge:t,me:o})},$=()=>{const e=m.t.cookie.expiresAfterDays;return w(e)?e(m.o.F):e},G=(e,t)=>{const o=e||[],n=t||[];return o.filter((e=>!v(n,e))).concat(n.filter((e=>!v(o,e))))},J=e=>{m.o.R=x(e),m.o.F=(()=>{let e='custom';const{R:t,O:o,B:n}=m.o,s=t.length;return s===o.length?e='all':s===n.length&&(e='necessary'),e})()},U=(e,t,o,n)=>{const s='accept-',{show:a,showPreferences:c,hide:r,hidePreferences:i,acceptCategory:l}=t,d=e||document,_=e=>D(d,`[data-cc="${e}"]`),u=(e,t)=>{T(e),l(t),i(),r()},p=_('show-preferencesModal'),g=_('show-consentModal'),b=_(s+'all'),v=_(s+'necessary'),y=_(s+'custom'),h=m.t.lazyHtmlGeneration;for(const e of p)A(e,'aria-haspopup','dialog'),B(e,f,(e=>{T(e),c()})),h&&(B(e,'mouseenter',(e=>{T(e),m.o.N||o(t,n)}),!0),B(e,'focus',(()=>{m.o.N||o(t,n)})));for(let e of g)A(e,'aria-haspopup','dialog'),B(e,f,(e=>{T(e),a(!0)}),!0);for(let e of b)B(e,f,(e=>{u(e,'all')}),!0);for(let e of y)B(e,f,(e=>{u(e)}),!0);for(let e of v)B(e,f,(e=>{u(e,[])}),!0)},z=(e,t)=>{e&&(t&&(e.tabIndex=-1),e.focus(),t&&e.removeAttribute('tabindex'))},q=(e,t)=>{const o=n=>{n.target.removeEventListener('transitionend',o),'opacity'===n.propertyName&&'1'===getComputedStyle(e).opacity&&z((e=>1===e?m.ne.be:m.ne.ve)(t))};B(e,'transitionend',o)};let K;const Q=e=>{clearTimeout(K),e?j(m.ne.ye,a):K=setTimeout((()=>{F(m.ne.ye,a)}),500)},W=['M 19.5 4.5 L 4.5 19.5 M 4.5 4.501 L 19.5 19.5','M 3.572 13.406 L 8.281 18.115 L 20.428 5.885','M 21.999 6.94 L 11.639 17.18 L 2.001 6.82 '],X=(e=0,t=1.5)=>`<svg viewBox="0 0 24 24" stroke-width="${t}"><path d="${W[e]}"/></svg>`,Y=e=>{const t=m.ne,o=m.o;(e=>{const n=e===t.he,s=o.i.disablePageInteraction?t.ye:n?t.Ce:t.ye;B(s,'keydown',(t=>{if('Tab'!==t.key||!(n?o.k&&!o.A:o.A))return;const s=M(),a=n?o.q:o.K;0!==a.length&&(t.shiftKey?s!==a[0]&&e.contains(s)||(T(t),z(a[1])):s!==a[1]&&e.contains(s)||(T(t),z(a[0])))}),!0)})(e)},Z=['[href]',i,'input','details','[tabindex]'].map((e=>e+':not([tabindex="-1"])')).join(','),ee=e=>{const{o:t,ne:o}=m,n=(e,t)=>{const o=D(e,Z);t[0]=o[0],t[1]=o[o.length-1]};1===e&&t.D&&n(o.he,t.q),2===e&&t.N&&n(o.we,t.K)},te=(e,t,o)=>{const{de:n,le:s,ie:a,_e:c,ue:r,fe:i}=m.ce,l=m.re;if(t){const n={modalName:t};return e===l.fe?w(i)&&i(n):e===l._e?w(c)&&c(n):(n.modal=o,w(r)&&r(n)),R(e,n)}const d={cookie:m.o.p};e===l.ie?w(a)&&a(P(d)):e===l.le?w(s)&&s(P(d)):(d.changedCategories=m.o.I,d.changedServices=m.o.ee,w(n)&&n(P(d))),R(e,P(d))},oe=(e,t)=>{try{return e()}catch(e){return!t&&console.warn('CookieConsent:',e),!1}},ne=e=>{const{Y:t,ee:o,O:n,X:s,oe:a,p:r,I:i}=m.o;for(const e of n){const n=o[e]||t[e]||[];for(const o of n){const n=s[e][o];if(!n)continue;const{onAccept:a,onReject:c}=n;!n.Se&&v(t[e],o)?(n.Se=!0,w(a)&&a()):n.Se&&!v(t[e],o)&&(n.Se=!1,w(c)&&c())}}if(!m.t.manageScriptTags)return;const l=a,d=e||r.categories||[],f=(e,n)=>{if(n>=e.length)return;const s=a[n];if(s.xe)return f(e,n+1);const r=s.Me,l=s.Te,_=s.De,u=v(d,l),p=!!_&&v(t[l],_);if(!_&&!s.ke&&u||!_&&s.ke&&!u&&v(i,l)||_&&!s.ke&&p||_&&s.ke&&!p&&v(o[l]||[],_)){s.xe=!0;const t=H(r,'type',!0);N(r,'type',!!t),N(r,c);let o=H(r,'src',!0);o&&N(r,'src',!0);const a=E('script');a.textContent=r.innerHTML;for(const{nodeName:e}of r.attributes)A(a,e,r[e]||H(r,e));t&&(a.type=t),o?a.src=o:o=r.src;const i=!!o&&(!t||['text/javascript','module'].includes(t));if(i&&(a.onload=a.onerror=()=>{f(e,++n)}),r.replaceWith(a),i)return}f(e,++n)};f(l,0)},se='bottom',ae='left',ce='center',re='right',ie='inline',le='wide',de='pm--',fe=['middle','top',se],_e=[ae,ce,re],ue={box:{Ee:[le,ie],Ae:fe,Ne:_e,He:se,Ve:re},cloud:{Ee:[ie],Ae:fe,Ne:_e,He:se,Ve:ce},bar:{Ee:[ie],Ae:fe.slice(1),Ne:[],He:se,Ve:''}},pe={box:{Ee:[],Ae:[],Ne:[],He:'',Ve:''},bar:{Ee:[le],Ae:[],Ne:[ae,re],He:'',Ve:ae}},ge=e=>{const t=m.o.i.guiOptions,o=t&&t.consentModal,n=t&&t.preferencesModal;0===e&&me(m.ne.he,ue,o,'cm--','box','cm'),1===e&&me(m.ne.we,pe,n,de,'box','pm')},me=(e,t,o,n,s,a)=>{e.className=a;const c=o&&o.layout,r=o&&o.position,i=o&&o.flipButtons,l=!o||!1!==o.equalWeightButtons,d=c&&c.split(' ')||[],f=d[0],_=d[1],u=f in t?f:s,p=t[u],g=v(p.Ee,_)&&_,b=r&&r.split(' ')||[],y=b[0],h=n===de?b[0]:b[1],C=v(p.Ae,y)?y:p.He,w=v(p.Ne,h)?h:p.Ve,S=t=>{t&&j(e,n+t)};S(u),S(g),S(C),S(w),i&&S('flip');const x=a+'__btn--secondary';if('cm'===a){const{je:e,Ie:t}=m.ne;e&&(l?F(e,x):j(e,x)),t&&(l?F(t,x):j(t,x))}else{const{Le:e}=m.ne;e&&(l?F(e,x):j(e,x))}},be=(e,t)=>{const o=m.o,n=m.ne,{hide:s,hidePreferences:a,acceptCategory:c}=e,u=e=>{c(e),a(),s()},g=o.u&&o.u.preferencesModal;if(!g)return;const b=g.title,v=g.closeIconLabel,y=g.acceptAllBtn,w=g.acceptNecessaryBtn,x=g.savePreferencesBtn,M=g.sections||[],T=y||w||x;if(n.Fe)n.Pe=E(r),L(n.Pe,'body');else{n.Fe=E(r),j(n.Fe,'pm-wrapper');const e=E('div');j(e,'pm-overlay'),V(n.Fe,e),B(e,f,a),n.we=E(r),j(n.we,'pm'),A(n.we,'role','dialog'),A(n.we,l,!0),A(n.we,'aria-modal',!0),A(n.we,'aria-labelledby','pm__title'),B(n.ye,'keydown',(e=>{27===e.keyCode&&a()}),!0),n.Oe=E(r),L(n.Oe,'header'),n.Re=E('h2'),L(n.Re,'title'),n.Re.id='pm__title',n.Be=E(i),L(n.Be,'close-btn'),A(n.Be,'aria-label',g.closeIconLabel||''),B(n.Be,f,a),n.$e=E('span'),n.$e.innerHTML=X(),V(n.Be,n.$e),n.Ge=E(r),L(n.Ge,'body'),n.Je=E(r),L(n.Je,'footer');var D=E(r);j(D,'btns');var k=E(r),N=E(r);L(k,d),L(N,d),V(n.Je,k),V(n.Je,N),V(n.Oe,n.Re),V(n.Oe,n.Be),n.ve=E(r),A(n.ve,'tabIndex',-1),V(n.we,n.ve),V(n.we,n.Oe),V(n.we,n.Ge),T&&V(n.we,n.Je),V(n.Fe,n.we)}let H;b&&(n.Re.innerHTML=b,v&&A(n.Be,'aria-label',v)),M.forEach(((e,t)=>{const s=e.title,a=e.description,c=e.linkedCategory,d=c&&o.P[c],_=e.cookieTable,u=_&&_.body,p=_&&_.caption,m=u&&u.length>0,b=!!d,v=b&&o.X[c],y=C(v)&&S(v)||[],w=b&&(!!a||!!m||S(v).length>0);var x=E(r);if(L(x,'section'),w||a){var M=E(r);L(M,'section-desc-wrapper')}let T=y.length;if(w&&T>0){const e=E(r);L(e,'section-services');for(const t of y){const o=v[t],n=o&&o.label||t,s=E(r),a=E(r),i=E(r),l=E(r);L(s,'service'),L(l,'service-title'),L(a,'service-header'),L(i,'service-icon');const f=ve(n,t,d,!0,c);l.innerHTML=n,V(a,i),V(a,l),V(s,a),V(s,f),V(e,s)}V(M,e)}if(s){var D=E(r),k=E(b?i:r);if(L(D,'section-title-wrapper'),L(k,'section-title'),k.innerHTML=s,V(D,k),b){const e=E('span');e.innerHTML=X(2,3.5),L(e,'section-arrow'),V(D,e),x.className+='--toggle';const t=ve(s,c,d);let o=g.serviceCounterLabel;if(T>0&&h(o)){let e=E('span');L(e,'badge'),L(e,'service-counter'),A(e,l,!0),A(e,'data-servicecounter',T),o&&(o=o.split('|'),o=o.length>1&&T>1?o[1]:o[0],A(e,'data-counterlabel',o)),e.innerHTML=T+(o?' '+o:''),V(k,e)}if(w){L(x,'section--expandable');var N=c+'-desc';A(k,'aria-expanded',!1),A(k,'aria-controls',N)}V(D,t)}else A(k,'role','heading'),A(k,'aria-level','3');V(x,D)}if(a){var I=E('p');L(I,'section-desc'),I.innerHTML=a,V(M,I)}if(w&&(A(M,l,'true'),M.id=N,((e,t,o)=>{B(k,f,(()=>{t.classList.contains('is-expanded')?(F(t,'is-expanded'),A(o,'aria-expanded','false'),A(e,l,'true')):(j(t,'is-expanded'),A(o,'aria-expanded','true'),A(e,l,'false'))}))})(M,x,k),m)){const e=E('table'),o=E('thead'),s=E('tbody');if(p){const t=E('caption');L(t,'table-caption'),t.innerHTML=p,e.appendChild(t)}L(e,'section-table'),L(o,'table-head'),L(s,'table-body');const a=_.headers,c=S(a),i=n.Ue.createDocumentFragment(),l=E('tr');for(const e of c){const o=a[e],n=E('th');n.id='cc__row-'+o+t,A(n,'scope','col'),L(n,'table-th'),n.innerHTML=o,V(i,n)}V(l,i),V(o,l);const d=n.Ue.createDocumentFragment();for(const e of u){const o=E('tr');L(o,'table-tr');for(const n of c){const s=a[n],c=e[n],i=E('td'),l=E(r);L(i,'table-td'),A(i,'data-column',s),A(i,'headers','cc__row-'+s+t),l.insertAdjacentHTML('beforeend',c),V(i,l),V(o,i)}V(d,o)}V(s,d),V(e,o),V(e,s),V(M,e)}(w||a)&&V(x,M);const P=n.Pe||n.Ge;b?(H||(H=E(r),L(H,'section-toggles')),H.appendChild(x)):H=null,V(P,H||x)})),y&&(n.ze||(n.ze=E(i),L(n.ze,'btn'),A(n.ze,_,'all'),V(k,n.ze),B(n.ze,f,(()=>u('all')))),n.ze.innerHTML=y),w&&(n.Le||(n.Le=E(i),L(n.Le,'btn'),A(n.Le,_,'necessary'),V(k,n.Le),B(n.Le,f,(()=>u([])))),n.Le.innerHTML=w),x&&(n.qe||(n.qe=E(i),L(n.qe,'btn'),L(n.qe,'btn--secondary'),A(n.qe,_,'save'),V(N,n.qe),B(n.qe,f,(()=>u()))),n.qe.innerHTML=x),n.Pe&&(n.we.replaceChild(n.Pe,n.Ge),n.Ge=n.Pe),ge(1),o.N||(o.N=!0,te(m.re.ue,p,n.we),t(e),V(n.Ce,n.Fe),Y(n.we),setTimeout((()=>j(n.Fe,'cc--anim')),100)),ee(2)};function ve(e,t,o,n,s){const a=m.o,r=m.ne,i=E('label'),d=E('input'),_=E('span'),u=E('span'),p=E('span'),g=E('span'),b=E('span');if(g.innerHTML=X(1,3),b.innerHTML=X(0,3),d.type='checkbox',j(i,'section__toggle-wrapper'),j(d,'section__toggle'),j(g,'toggle__icon-on'),j(b,'toggle__icon-off'),j(_,'toggle__icon'),j(u,'toggle__icon-circle'),j(p,'toggle__label'),A(_,l,'true'),n?(j(i,'toggle-service'),A(d,c,s),r.ae[s][t]=d):r.se[t]=d,n?(e=>{B(d,'change',(()=>{const t=r.ae[e],o=r.se[e];a.Z[e]=[];for(let o in t){const n=t[o];n.checked&&a.Z[e].push(n.value)}o.checked=a.Z[e].length>0}))})(s):(e=>{B(d,f,(()=>{const t=r.ae[e],o=d.checked;a.Z[e]=[];for(let n in t)t[n].checked=o,o&&a.Z[e].push(n)}))})(t),d.value=t,p.textContent=e.replace(/<.*>.*<\/.*>/gm,''),V(u,b),V(u,g),V(_,u),a.T)(o.readOnly||o.enabled)&&(d.checked=!0);else if(n){const e=a.Y[s];d.checked=o.readOnly||v(e,t)}else v(a.R,t)&&(d.checked=!0);return o.readOnly&&(d.disabled=!0),V(i,d),V(i,_),V(i,p),i}const ye=()=>{const e=E('span');return m.ne.Ke||(m.ne.Ke=e),e},he=(e,t)=>{const o=m.o,n=m.ne,{hide:s,showPreferences:a,acceptCategory:c}=e,p=o.u&&o.u.consentModal;if(!p)return;const g=p.acceptAllBtn,b=p.acceptNecessaryBtn,v=p.showPreferencesBtn,y=p.closeIconLabel,h=p.footer,C=p.label,w=p.title,S=e=>{s(),c(e)};if(!n.Qe){n.Qe=E(r),n.he=E(r),n.We=E(r),n.Xe=E(r),n.Ye=E(r),j(n.Qe,'cm-wrapper'),j(n.he,'cm'),I(n.We,'body'),I(n.Xe,'texts'),I(n.Ye,'btns'),A(n.he,'role','dialog'),A(n.he,'aria-modal','true'),A(n.he,l,'false'),A(n.he,'aria-describedby','cm__desc'),C?A(n.he,'aria-label',C):w&&A(n.he,'aria-labelledby','cm__title');const e='box',t=o.i.guiOptions,s=t&&t.consentModal,a=(s&&s.layout||e).split(' ')[0]===e;w&&y&&a&&(n.Ie||(n.Ie=E(i),n.Ie.innerHTML=X(),I(n.Ie,'btn'),I(n.Ie,'btn--close'),B(n.Ie,f,(()=>{S([])})),V(n.We,n.Ie)),A(n.Ie,'aria-label',y)),V(n.We,n.Xe),(g||b||v)&&V(n.We,n.Ye),n.be=E(r),A(n.be,'tabIndex',-1),V(n.he,n.be),V(n.he,n.We),V(n.Qe,n.he)}w&&(n.Ze||(n.Ze=E('h2'),n.Ze.className=n.Ze.id='cm__title',V(n.Xe,n.Ze)),n.Ze.innerHTML=w);let x=p.description;if(x&&(o.V&&(x=x.replace('{{revisionMessage}}',o.j?'':p.revisionMessage||'')),n.et||(n.et=E('p'),n.et.className=n.et.id='cm__desc',V(n.Xe,n.et)),n.et.innerHTML=x),g&&(n.tt||(n.tt=E(i),V(n.tt,ye()),I(n.tt,'btn'),A(n.tt,_,'all'),B(n.tt,f,(()=>{S('all')}))),n.tt.firstElementChild.innerHTML=g),b&&(n.je||(n.je=E(i),V(n.je,ye()),I(n.je,'btn'),A(n.je,_,'necessary'),B(n.je,f,(()=>{S([])}))),n.je.firstElementChild.innerHTML=b),v&&(n.ot||(n.ot=E(i),V(n.ot,ye()),I(n.ot,'btn'),I(n.ot,'btn--secondary'),A(n.ot,_,'show'),B(n.ot,'mouseenter',(()=>{o.N||be(e,t)})),B(n.ot,f,a)),n.ot.firstElementChild.innerHTML=v),n.nt||(n.nt=E(r),I(n.nt,d),g&&V(n.nt,n.tt),b&&V(n.nt,n.je),(g||b)&&V(n.We,n.nt),V(n.Ye,n.nt)),n.ot&&!n.st&&(n.st=E(r),n.je&&n.tt?(I(n.st,d),V(n.st,n.ot),V(n.Ye,n.st)):(V(n.nt,n.ot),I(n.nt,d+'--uneven'))),h){if(!n.ct){let e=E(r),t=E(r);n.ct=E(r),I(e,'footer'),I(t,'links'),I(n.ct,'link-group'),V(t,n.ct),V(e,t),V(n.he,e)}n.ct.innerHTML=h}ge(0),o.D||(o.D=!0,te(m.re.ue,u,n.he),t(e),V(n.Ce,n.Qe),Y(n.he),setTimeout((()=>j(n.Qe,'cc--anim')),100)),ee(1),U(n.We,e,be,t)},Ce=e=>{if(!h(e))return null;if(e in m.o._)return e;let t=e.slice(0,2);return t in m.o._?t:null},we=()=>m.o.l||m.o.i.language.default,Se=e=>{e&&(m.o.l=e)},xe=async e=>{const t=m.o;let o=Ce(e)?e:we(),n=t._[o];if(h(n)?n=await(async e=>{try{const t=await fetch(e);return await t.json()}catch(e){return console.error(e),!1}})(n):w(n)&&(n=await n()),!n)throw`Could not load translation for the '${o}' language`;return t.u=n,Se(o),!0},Me=()=>{let e=m.o.i.language.rtl,t=m.ne.Ce;e&&t&&(y(e)||(e=[e]),v(e,m.o.l)?j(t,'cc--rtl'):F(t,'cc--rtl'))},Te=()=>{const e=m.ne;if(e.Ce)return;e.Ce=E(r),e.Ce.id='cc-main',e.Ce.setAttribute('data-nosnippet',''),Me();let t=m.o.i.root;t&&h(t)&&(t=document.querySelector(t)),(t||e.Ue.body).appendChild(e.Ce)},De=e=>oe((()=>localStorage.removeItem(e))),ke=(e,t)=>{if(t instanceof RegExp)return e.filter((e=>t.test(e)));{const o=b(e,t);return o>-1?[e[o]]:[]}},Ee=e=>{const{hostname:t,protocol:o}=location,{name:n,path:s,domain:a,sameSite:c,useLocalStorage:r,secure:i}=m.t.cookie,l=e?(()=>{const e=m.o.S,t=e?new Date-e:0;return 864e5*$()-t})():864e5*$(),d=new Date;d.setTime(d.getTime()+l),m.o.p.expirationTime=d.getTime();const f=JSON.stringify(m.o.p);let _=n+'='+encodeURIComponent(f)+(0!==l?'; expires='+d.toUTCString():'')+'; Path='+s+'; SameSite='+c;v(t,'.')&&(_+='; Domain='+a),i&&'https:'===o&&(_+='; Secure'),r?((e,t)=>{oe((()=>localStorage.setItem(e,t)))})(n,f):document.cookie=_,m.o.p},Ae=(e,t,o)=>{if(0===e.length)return;const n=o||m.t.cookie.domain,s=t||m.t.cookie.path,a='www.'===n.slice(0,4),c=a&&n.substring(4),r=(e,t)=>{t&&'.'!==t.slice(0,1)&&(t='.'+t),document.cookie=e+'=; path='+s+(t?'; domain='+t:'')+'; expires=Thu, 01 Jan 1970 00:00:01 GMT;'};for(const t of e)r(t,o),o||r(t,n),a&&r(t,c)},Ne=e=>{const t=e||m.t.cookie.name,o=m.t.cookie.useLocalStorage;return((e,t)=>{let o;return o=oe((()=>JSON.parse(t?e:decodeURIComponent(e))),!0)||{},o})(o?(n=t,oe((()=>localStorage.getItem(n)))||''):He(t,!0),o);var n},He=(e,t)=>{const o=document.cookie.match('(^|;)\\s*'+e+'\\s*=\\s*([^;]+)');return o?t?o.pop():e:''},Ve=e=>{const t=document.cookie.split(/;\s*/),o=[];for(const n of t){let t=n.split('=')[0];e?oe((()=>{e.test(t)&&o.push(t)})):o.push(t)}return o},je=(e,n=[])=>{((e,t)=>{const{O:o,R:n,B:s,N:a,Z:c,$:r,X:i}=m.o;let l=[];if(e){y(e)?l.push(...e):h(e)&&(l='all'===e?o:[e]);for(const e of o)c[e]=v(l,e)?S(i[e]):[]}else l=[...n,...r],a&&(l=(()=>{const e=m.ne.se;if(!e)return[];let t=[];for(let o in e)e[o].checked&&t.push(o);return t})());l=l.filter((e=>!v(o,e)||!v(t,e))),l.push(...s),J(l)})(e,n),(()=>{const e=m.o,{Z:t,B:o,Y:n,X:s,O:a}=e,c=a;e.te=P(n);for(const a of c){const c=s[a],r=S(c),i=t[a]&&t[a].length>0,l=v(o,a);if(0!==r.length){if(n[a]=[],l)n[a].push(...r);else if(i){const e=t[a];n[a].push(...e)}else n[a]=e.Z[a];n[a]=x(n[a])}}})(),(()=>{const e=m.o;e.I=m.t.mode===o&&e.T?G(e.$,e.R):G(e.R,e.p.categories);let n=e.I.length>0,s=!1;for(const t of e.O)e.ee[t]=G(e.Y[t],e.te[t]),e.ee[t].length>0&&(s=!0);const a=m.ne.se;for(const t in a)a[t].checked=v(e.R,t);for(const t of e.O){const o=m.ne.ae[t],n=e.Y[t];for(const e in o)o[e].checked=v(n,e)}e.C||(e.C=new Date),e.M||(e.M=([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,(e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16)))),e.p={categories:P(e.R),revision:m.t.revision,data:e.h,consentTimestamp:e.C.toISOString(),consentId:e.M,services:P(e.Y),languageCode:m.o.l},e.S&&(e.p.lastConsentTimestamp=e.S.toISOString());let c=!1;const r=n||s;(e.T||r)&&(e.T&&(e.T=!1,c=!0),e.S=e.S?new Date:e.C,e.p.lastConsentTimestamp=e.S.toISOString(),Ee(),m.t.autoClearCookies&&(c||r)&&(e=>{const t=m.o,o=Ve(),n=(e=>{const t=m.o;return(e?t.O:t.I).filter((e=>{const o=t.P[e];return!!o&&!o.readOnly&&!!o.autoClear}))})(e);for(const e in t.ee)for(const n of t.ee[e]){const s=t.X[e][n].cookies;if(!v(t.Y[e],n)&&s)for(const e of s){const t=ke(o,e.name);Ae(t,e.path,e.domain)}}for(const s of n){const n=t.P[s].autoClear,a=n&&n.cookies||[],c=v(t.I,s),r=!v(t.R,s),i=c&&r;if(e?r:i){n.reloadPage&&i&&(t.L=!0);for(const e of a){const t=ke(o,e.name);Ae(t,e.path,e.domain)}}}})(c),ne()),c&&(te(m.re.ie),te(m.re.le),m.t.mode===t)||(r&&te(m.re.de),e.L&&(e.L=!1,location.reload()))})()},Ie=e=>{const t=m.o.T?[]:m.o.R;return v(t,e)},Le=(e,t)=>{const o=m.o.T?[]:m.o.Y[t]||[];return v(o,e)},Fe=(e,t,o)=>{let n=[];const s=e=>{if(h(e)){let t=He(e);''!==t&&n.push(t)}else n.push(...Ve(e))};if(y(e))for(let t of e)s(t);else s(e);Ae(n,t,o)},Pe=e=>{const{ne:t,o:o}=m;if(!o.k){if(!o.D){if(!e)return;he($e,Te)}o.k=!0,o.J=M(),o.v&&Q(!0),q(t.he,1),j(t.ye,n),A(t.he,l,'false'),setTimeout((()=>{z(m.ne.be)}),100),te(m.re.fe,u)}},Oe=()=>{const{ne:e,o:t,re:o}=m;t.k&&(t.k=!1,t.v&&Q(),z(e.Ke,!0),F(e.ye,n),A(e.he,l,'true'),z(t.J),t.J=null,te(o._e,u))},Re=()=>{const e=m.o;e.A||(e.N||be($e,Te),e.A=!0,e.k?e.U=M():e.J=M(),q(m.ne.we,2),j(m.ne.ye,s),A(m.ne.we,l,'false'),setTimeout((()=>{z(m.ne.ve)}),100),te(m.re.fe,p))},Be=()=>{const e=m.o;e.A&&(e.A=!1,(()=>{const e=Je(),t=m.o.P,o=m.ne.se,n=m.ne.ae,s=e=>v(m.o.$,e);for(const a in o){const c=!!t[a].readOnly;o[a].checked=c||(e?Ie(a):s(a));for(const t in n[a])n[a][t].checked=c||(e?Le(t,a):s(a))}})(),z(m.ne.$e,!0),F(m.ne.ye,s),A(m.ne.we,l,'true'),e.k?(z(e.U),e.U=null):(z(e.J),e.J=null),te(m.re._e,p))};var $e={show:Pe,hide:Oe,showPreferences:Re,hidePreferences:Be,acceptCategory:je};const Ge=(e,t)=>{const o=Ne(t);return e?o[e]:o},Je=()=>!m.o.T;e.acceptCategory=je,e.acceptService=(e,t)=>{const{O:o,X:n}=m.o;if(!(e&&t&&h(t)&&v(o,t)&&0!==S(n[t]).length))return!1;((e,t)=>{const o=m.o,{X:n,Z:s,N:a}=o,c=m.ne.ae[t]||{},r=m.ne.se[t]||{},i=S(n[t]);if(s[t]=[],h(e)){if('all'===e){if(s[t].push(...i),a)for(let e in c)c[e].checked=!0,k(c[e])}else if(v(i,e)&&s[t].push(e),a)for(let t in c)c[t].checked=e===t,k(c[t])}else if(y(e))for(let o of i){const n=v(e,o);n&&s[t].push(o),a&&(c[o].checked=n,k(c[o]))}const l=0===s[t].length;o.R=l?o.R.filter((e=>e!==t)):x([...o.R,t]),a&&(r.checked=!l,k(r))})(e,t),je()},e.acceptedCategory=Ie,e.acceptedService=Le,e.eraseCookies=Fe,e.getConfig=e=>{const t=m.t,o=m.o.i;return e?t[e]||o[e]:{...t,...o,cookie:{...t.cookie}}},e.getCookie=Ge,e.getUserPreferences=()=>{const{F:e,Y:t}=m.o,{accepted:o,rejected:n}=(()=>{const{T:e,R:t,O:o}=m.o;return{accepted:t,rejected:e?[]:o.filter((e=>!v(t,e)))}})();return P({acceptType:e,acceptedCategories:o,rejectedCategories:n,acceptedServices:t,rejectedServices:O()})},e.hide=Oe,e.hidePreferences=Be,e.loadScript=(e,t)=>{let o=document.querySelector('script[src="'+e+'"]');return new Promise((n=>{if(o)return n(!0);if(o=E('script'),C(t))for(const e in t)A(o,e,t[e]);o.onload=()=>n(!0),o.onerror=()=>{o.remove(),n(!1)},o.src=e,V(document.head,o)}))},e.reset=e=>{const{Ce:t,ye:o}=m.ne,{name:c,path:r,domain:i,useLocalStorage:l}=m.t.cookie;e&&(l?De(c):Fe(c,r,i));for(const{pe:e,ge:t,me:o}of m.o.m)e.removeEventListener(t,o);t&&t.remove(),o&&o.classList.remove(a,s,n);const d=new g;for(const e in m)m[e]=d[e];window._ccRun=!1},e.run=async e=>{const{o:t,t:n,re:s}=m,a=window;if(!a._ccRun){if(a._ccRun=!0,(e=>{const{ne:t,t:n,o:s}=m,a=n,r=s,{cookie:i}=a,l=m.ce,d=e.cookie,f=e.categories,_=S(f)||[],u=navigator,p=document;t.Ue=p,t.ye=p.documentElement,i.domain=location.hostname,r.i=e,r.P=f,r.O=_,r._=e.language.translations,r.v=!!e.disablePageInteraction,l.ie=e.onFirstConsent,l.le=e.onConsent,l.de=e.onChange,l._e=e.onModalHide,l.fe=e.onModalShow,l.ue=e.onModalReady;const{mode:g,autoShow:b,lazyHtmlGeneration:y,autoClearCookies:h,revision:w,manageScriptTags:x,hideFromBots:M}=e;g===o&&(a.mode=g),'boolean'==typeof h&&(a.autoClearCookies=h),'boolean'==typeof x&&(a.manageScriptTags=x),'number'==typeof w&&w>=0&&(a.revision=w,r.V=!0),'boolean'==typeof b&&(a.autoShow=b),'boolean'==typeof y&&(a.lazyHtmlGeneration=y),!1===M&&(a.hideFromBots=!1),!0===a.hideFromBots&&u&&(r.G=u.userAgent&&/bot|crawl|spider|slurp|teoma/i.test(u.userAgent)||u.webdriver),C(d)&&(a.cookie={...i,...d}),a.autoClearCookies,r.V,a.manageScriptTags,(e=>{const{P:t,X:o,Y:n,Z:s,B:a}=m.o;for(let c of e){const e=t[c],r=e.services||{},i=C(r)&&S(r)||[];o[c]={},n[c]=[],s[c]=[],e.readOnly&&(a.push(c),n[c]=i),m.ne.ae[c]={};for(let e of i){const t=r[e];t.Se=!1,o[c][e]=t}}})(_),(()=>{if(!m.t.manageScriptTags)return;const e=m.o,t=D(document,'script['+c+']');for(const o of t){let t=H(o,c),n=o.dataset.service||'',s=!1;if(t&&'!'===t.charAt(0)&&(t=t.slice(1),s=!0),'!'===n.charAt(0)&&(n=n.slice(1),s=!0),v(e.O,t)&&(e.oe.push({Me:o,xe:!1,ke:s,Te:t,De:n}),n)){const o=e.X[t];o[n]||(o[n]={Se:!1})}}})(),Se((()=>{const e=m.o.i.language.autoDetect;if(e){const t={browser:navigator.language,document:document.documentElement.lang},o=Ce(t[e]);if(o)return o}return we()})())})(e),t.G)return;(()=>{const e=m.o,t=m.t,n=Ne(),{categories:s,services:a,consentId:c,consentTimestamp:r,lastConsentTimestamp:i,data:l,revision:d}=n,f=y(s);e.p=n,e.M=c;const _=!!c&&h(c);e.C=r,e.C&&(e.C=new Date(r)),e.S=i,e.S&&(e.S=new Date(i)),e.h=void 0!==l?l:null,e.V&&_&&d!==t.revision&&(e.j=!1),e.T=!(_&&e.j&&e.C&&e.S&&f),t.cookie.useLocalStorage&&!e.T&&(e.T=(new Date).getTime()>(n.expirationTime||0),e.T&&De(t.cookie.name)),e.T,(()=>{const e=m.o;for(const t of e.O){const n=e.P[t];if(n.readOnly||n.enabled){e.$.push(t);const n=e.X[t]||{};for(let s in n)e.Z[t].push(s),e.i.mode===o&&e.Y[t].push(s)}}})(),e.T?t.mode===o&&(e.R=[...e.$]):(e.Y={...e.Y,...a},e.Z={...e.Y},J([...e.B,...s]))})();const i=Je();if(!await xe())return!1;if(U(null,r=$e,be,Te),m.o.T&&he(r,Te),m.t.lazyHtmlGeneration||be(r,Te),n.autoShow&&!i&&Pe(!0),i)return ne(),te(s.le);n.mode===o&&ne(t.$)}var r},e.setCookieData=e=>{let t,o=e.value,n=e.mode,s=!1;const a=m.o;if('update'===n){a.h=t=Ge('data');const e=typeof t==typeof o;if(e&&'object'==typeof t){!t&&(t={});for(let e in o)t[e]!==o[e]&&(t[e]=o[e],s=!0)}else!e&&t||t===o||(t=o,s=!0)}else t=o,s=!0;return s&&(a.h=t,a.p.data=t,Ee(!0)),s},e.setLanguage=async(e,t)=>{if(!Ce(e))return!1;const o=m.o;return!(e===we()&&!0!==t||!await xe(e)||(Se(e),o.D&&he($e,Te),o.N&&be($e,Te),Me(),0))},e.show=Pe,e.showPreferences=Re,e.validConsent=Je,e.validCookie=e=>''!==He(e,!0)},'object'==typeof exports&&'undefined'!=typeof module?t(exports):'function'==typeof define&&define.amd?define(['exports'],t):t((e='undefined'!=typeof globalThis?globalThis:e||self).CookieConsent={});
var CookieConsent = module.exports;
// Plain Consent: the code that runs on the site owner's page, around vanilla-cookieconsent (MIT, pinned in
// package.json, see src/versions.ts). scripts/build.mjs compiles this file into the published banner
// (releases/v<version>/plain-consent.js) and the generator imports the same functions, so a generator
// validates the inputs exactly as the banner will.
//
// Rules this file keeps, because it runs on other people's sites:
// - no network: it loads nothing, sends nothing and never passes the library a translation URL;
// - no eval, no `new Function`, no inline style attributes (colours and sizes go through CSSOM, which a strict
//   Content-Security-Policy allows), no globals besides the library's own `dataLayer` contract; the only thing
//   it tells the page is the `plain-consent:update` event on the document;
// - every text from the configuration is HTML-escaped and every link is checked before it reaches the library,
//   which renders texts as HTML; the placeholders of blocked embeds are built with textContent, never markup;
// - an embed (iframe) is tagged with data-category and data-src and loads nothing until its category is accepted;
// - fail closed: a missing or broken configuration falls back to the defaults, so a banner still asks
//   and nothing optional runs without consent.
//
// Only erasable TypeScript here (no enums, namespaces or parameter properties): the build only strips types.
// The element the snippet carries the configuration in, as JSON.
const configElementId = "plain-consent-config";
// The library's default consent cookie, kept so its documentation stays true for site owners.
const consentCookieName = "cc_cookie";
const consentDays = 182;
// The opt-in credit link of the hosted variant (config credit: true). Its text is fixed, not editable by the
// site owner: only the language of the banner changes it.
const creditUrl = "https://socionet.cz/";
// The words before the linked brand "Socionet", per banner language.
const creditPrefixes = {
    cs: "Lištu poskytuje ",
    sk: "Lištu poskytuje ",
    en: "Consent bar by ",
    de: "Consent-Leiste von ",
    pl: "Pasek zgody od ",
};
const optionalCategories = ["preferences", "analytics", "marketing"];
const languages = ["cs", "sk", "en", "de", "pl"];
// The built-in texts of every language. Czech is the default (and the only language before 2.1.0); each text
// stays within textLimits, which src/runtime.test.ts checks for all languages.
const translations = {
    cs: {
        title: "Používáme cookies",
        description: "Nezbytné cookies potřebujeme, aby web fungoval. Ostatní použijeme, jen když s nimi souhlasíte. Svou volbu můžete kdykoli změnit.",
        acceptAll: "Přijmout vše",
        rejectAll: "Odmítnout vše",
        settings: "Nastavení",
        save: "Uložit výběr",
        privacyLabel: "Zásady ochrany osobních údajů",
        preferencesTitle: "Nastavení cookies",
        preferencesDescription: "Vyberte, které cookies smíme používat. Nezbytné jsou zapnuté vždy, bez nich web nefunguje. Souhlas můžete kdykoli změnit nebo odvolat.",
        necessaryTitle: "Nezbytné",
        necessaryDescription: "Zajišťují základní funkce webu a zapamatují si vaši volbu cookies. Nejdou vypnout.",
        preferencesCategoryTitle: "Funkční",
        preferencesCategoryDescription: "Pamatují si vaše nastavení, například jazyk nebo region.",
        analyticsTitle: "Analytické",
        analyticsDescription: "Měří návštěvnost a ukazují, jak lidé web používají, abychom ho mohli zlepšovat.",
        marketingTitle: "Marketingové",
        marketingDescription: "Měří a cílí reklamu, i na jiných webech a sociálních sítích.",
        embedMessage: "Tento obsah poskytuje třetí strana. Zobrazí se po souhlasu s cookies: {category}.",
        embedButton: "Povolit a zobrazit",
        gpcNotice: "Váš prohlížeč odesílá signál Global Privacy Control, proto marketingové cookies nenabízíme a nepoužíváme.",
        close: "Zavřít",
    },
    sk: {
        title: "Používame cookies",
        description: "Nevyhnutné cookies potrebujeme, aby web fungoval. Ostatné použijeme, len keď s nimi súhlasíte. Svoju voľbu môžete kedykoľvek zmeniť.",
        acceptAll: "Prijať všetko",
        rejectAll: "Odmietnuť všetko",
        settings: "Nastavenia",
        save: "Uložiť výber",
        privacyLabel: "Zásady ochrany osobných údajov",
        preferencesTitle: "Nastavenia cookies",
        preferencesDescription: "Vyberte, ktoré cookies môžeme používať. Nevyhnutné sú zapnuté vždy, bez nich web nefunguje. Súhlas môžete kedykoľvek zmeniť alebo odvolať.",
        necessaryTitle: "Nevyhnutné",
        necessaryDescription: "Zabezpečujú základné funkcie webu a zapamätajú si vašu voľbu cookies. Nedajú sa vypnúť.",
        preferencesCategoryTitle: "Funkčné",
        preferencesCategoryDescription: "Pamätajú si vaše nastavenia, napríklad jazyk alebo región.",
        analyticsTitle: "Analytické",
        analyticsDescription: "Merajú návštevnosť a ukazujú, ako ľudia web používajú, aby sme ho mohli zlepšovať.",
        marketingTitle: "Marketingové",
        marketingDescription: "Merajú a cielia reklamu, aj na iných weboch a sociálnych sieťach.",
        embedMessage: "Tento obsah poskytuje tretia strana. Zobrazí sa po súhlase s cookies: {category}.",
        embedButton: "Povoliť a zobraziť",
        gpcNotice: "Váš prehliadač odosiela signál Global Privacy Control, preto marketingové cookies neponúkame ani nepoužívame.",
        close: "Zavrieť",
    },
    en: {
        title: "We use cookies",
        description: "Necessary cookies keep our site working. We only use other cookies with your consent. You can change your choice anytime.",
        acceptAll: "Accept all",
        rejectAll: "Reject all",
        settings: "Customize",
        save: "Save choices",
        privacyLabel: "Privacy Policy",
        preferencesTitle: "Cookie settings",
        preferencesDescription: "Choose which cookies you allow. Essential cookies cannot be turned off. You can change or revoke consent anytime.",
        necessaryTitle: "Essential",
        necessaryDescription: "Required for core functionality and saving your consent choices. Always active.",
        preferencesCategoryTitle: "Preferences",
        preferencesCategoryDescription: "Remember settings such as preferred language and region.",
        analyticsTitle: "Analytics",
        analyticsDescription: "Help us understand site usage and visitor interactions to improve performance.",
        marketingTitle: "Marketing",
        marketingDescription: "Used for relevant advertising and marketing campaigns across websites.",
        embedMessage: "This content is provided by a third party. It is shown after you consent to cookies: {category}.",
        embedButton: "Allow and show",
        gpcNotice: "Your browser sends the Global Privacy Control signal, so we do not offer or use marketing cookies.",
        close: "Close",
    },
    de: {
        title: "Wir verwenden Cookies",
        description: "Notwendige Cookies brauchen wir, damit die Website funktioniert. Andere Cookies setzen wir nur mit Ihrer Einwilligung ein. Sie können Ihre Wahl jederzeit ändern.",
        acceptAll: "Alle akzeptieren",
        rejectAll: "Alle ablehnen",
        settings: "Einstellungen",
        save: "Auswahl speichern",
        privacyLabel: "Datenschutzerklärung",
        preferencesTitle: "Cookie-Einstellungen",
        preferencesDescription: "Wählen Sie, welche Cookies wir verwenden dürfen. Notwendige Cookies sind immer aktiv, ohne sie funktioniert die Website nicht. Ihre Einwilligung können Sie jederzeit ändern oder widerrufen.",
        necessaryTitle: "Notwendig",
        necessaryDescription: "Sie sorgen für die Grundfunktionen der Website und speichern Ihre Cookie-Auswahl. Sie lassen sich nicht abschalten.",
        preferencesCategoryTitle: "Funktional",
        preferencesCategoryDescription: "Merken sich Ihre Einstellungen, zum Beispiel Sprache oder Region.",
        analyticsTitle: "Analyse",
        analyticsDescription: "Messen die Besucherzahlen und zeigen, wie die Website genutzt wird, damit wir sie verbessern können.",
        marketingTitle: "Marketing",
        marketingDescription: "Messen und steuern Werbung, auch auf anderen Websites und in sozialen Netzwerken.",
        embedMessage: "Dieser Inhalt stammt von einem Drittanbieter. Er wird nach Ihrer Einwilligung in Cookies angezeigt: {category}.",
        embedButton: "Zulassen und anzeigen",
        gpcNotice: "Ihr Browser sendet das Signal Global Privacy Control, deshalb bieten wir keine Marketing-Cookies an und setzen sie nicht ein.",
        close: "Schließen",
    },
    pl: {
        title: "Używamy plików cookies",
        description: "Niezbędne pliki cookies są potrzebne, aby strona działała. Pozostałych użyjemy tylko za Twoją zgodą. Swój wybór możesz w każdej chwili zmienić.",
        acceptAll: "Zaakceptuj wszystkie",
        rejectAll: "Odrzuć wszystkie",
        settings: "Ustawienia",
        save: "Zapisz wybór",
        privacyLabel: "Polityka prywatności",
        preferencesTitle: "Ustawienia cookies",
        preferencesDescription: "Wybierz, których plików cookies możemy używać. Niezbędne są zawsze włączone, bez nich strona nie działa. Zgodę możesz w każdej chwili zmienić lub wycofać.",
        necessaryTitle: "Niezbędne",
        necessaryDescription: "Zapewniają podstawowe funkcje strony i zapamiętują Twój wybór dotyczący cookies. Nie można ich wyłączyć.",
        preferencesCategoryTitle: "Funkcjonalne",
        preferencesCategoryDescription: "Zapamiętują Twoje ustawienia, na przykład język lub region.",
        analyticsTitle: "Analityczne",
        analyticsDescription: "Mierzą ruch i pokazują, jak ludzie korzystają ze strony, abyśmy mogli ją ulepszać.",
        marketingTitle: "Marketingowe",
        marketingDescription: "Mierzą i kierują reklamy, także na innych stronach i w mediach społecznościowych.",
        embedMessage: "Ta treść pochodzi od podmiotu trzeciego. Wyświetli się po zgodzie na cookies: {category}.",
        embedButton: "Zezwól i pokaż",
        gpcNotice: "Twoja przeglądarka wysyła sygnał Global Privacy Control, dlatego nie oferujemy ani nie używamy marketingowych cookies.",
        close: "Zamknij",
    },
};
// The Czech texts: the default, and the only ones before 2.1.0.
const defaultTexts = translations.cs;
// "auto" follows <html lang>: a supported language is used, any other page gets English rather than Czech.
function resolveLanguage(setting, htmlLang) {
    if (setting !== "auto")
        return setting;
    const primary = htmlLang.trim().toLowerCase().split(/[-_]/)[0] ?? "";
    return languages.includes(primary) ? primary : "en";
}
// Longest text the banner accepts per field; a longer one is cut at a word boundary.
const textLimits = {
    title: 80,
    description: 600,
    acceptAll: 40,
    rejectAll: 40,
    settings: 40,
    save: 40,
    privacyLabel: 80,
    preferencesTitle: 80,
    preferencesDescription: 600,
    necessaryTitle: 60,
    necessaryDescription: 300,
    preferencesCategoryTitle: 60,
    preferencesCategoryDescription: 300,
    analyticsTitle: 60,
    analyticsDescription: 300,
    marketingTitle: 60,
    marketingDescription: 300,
    embedMessage: 240,
    embedButton: 40,
    gpcNotice: 300,
    close: 40,
};
const defaultConfig = {
    accent: "#1f2937",
    categories: ["analytics", "marketing"],
    texts: defaultTexts,
    privacyUrl: "",
    consentMode: true,
    credit: false,
    revision: 0,
    language: "cs",
    respectGpc: true,
    textOverrides: {},
};
const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
// One line of plain text: control characters and runs of white space become one space and the ends are trimmed.
function flatText(value) {
    return value.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029\s]+/g, " ").trim();
}
// flatText, and a text over the limit is cut at the last space before it.
function cleanText(value, limit) {
    const flat = flatText(value);
    if (flat.length <= limit)
        return flat;
    const cut = flat.slice(0, limit);
    const space = cut.lastIndexOf(" ");
    return (space > limit / 2 ? cut.slice(0, space) : cut).trim();
}
function isHexColor(value) {
    return /^#[0-9a-f]{6}$/i.test(value);
}
// A link the banner may show: an absolute http(s) URL without credentials, or a path on the same site
// ("/..."). Anything else (javascript:, data:, protocol-relative //host, backslashes) gives "".
function safeUrl(value) {
    const text = value.trim();
    if (text === "" || text.length > 2000 || /[\s\\<>"'`]/.test(text))
        return "";
    if (text.startsWith("/")) {
        if (text.startsWith("//"))
            return "";
        try {
            const base = "https://site.invalid";
            const url = new URL(text, base);
            const path = `${url.pathname}${url.search}${url.hash}`;
            return url.origin === base && !path.startsWith("//") ? path : "";
        }
        catch {
            return "";
        }
    }
    try {
        const url = new URL(text);
        if (url.protocol !== "https:" && url.protocol !== "http:")
            return "";
        if (url.username || url.password || !url.hostname.includes("."))
            return "";
        return url.href;
    }
    catch {
        return "";
    }
}
// The configuration as the banner will use it, whatever came in: unknown keys are dropped, a wrong value
// falls back to its default, and each fallback is named in `problems` (Czech, shown by the generator and
// written to the browser console by the banner). `htmlLang` is the page's <html lang>, read only when the
// language is "auto".
function normalizeConfig(raw, htmlLang = "") {
    const problems = [];
    if (!isRecord(raw)) {
        return {
            config: { ...defaultConfig, texts: { ...defaultTexts }, categories: [...defaultConfig.categories], textOverrides: {} },
            problems: ["Nastavení chybí nebo není platný JSON, lišta použije výchozí."],
        };
    }
    const pick = (key, ok, fallback, label) => {
        const value = raw[key];
        if (value === undefined)
            return fallback;
        if (ok(value))
            return value;
        problems.push(`${label}: neplatná hodnota, použije se výchozí.`);
        return fallback;
    };
    const isBool = (v) => typeof v === "boolean";
    const isColor = (v) => typeof v === "string" && isHexColor(v);
    const isRevision = (v) => typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 9999;
    let categories = [...defaultConfig.categories];
    if (raw["categories"] !== undefined) {
        if (Array.isArray(raw["categories"])) {
            const wanted = raw["categories"].filter((c) => typeof c === "string" && optionalCategories.includes(c));
            if (wanted.length !== raw["categories"].length)
                problems.push("Kategorie: neznámé kategorie byly vynechány.");
            categories = optionalCategories.filter((c) => wanted.includes(c));
        }
        else {
            problems.push("Kategorie: neplatná hodnota, použijí se výchozí.");
        }
    }
    const isLanguage = (v) => typeof v === "string" && (v === "auto" || languages.includes(v));
    const language = pick("language", isLanguage, defaultConfig.language, "Jazyk");
    const baseTexts = translations[resolveLanguage(language, htmlLang)];
    const texts = { ...baseTexts };
    const textOverrides = {};
    const rawTexts = raw["texts"];
    if (rawTexts !== undefined && !isRecord(rawTexts))
        problems.push("Texty: neplatná hodnota, použijí se výchozí.");
    if (isRecord(rawTexts)) {
        for (const key of Object.keys(defaultTexts)) {
            const value = rawTexts[key];
            if (value === undefined)
                continue;
            if (typeof value !== "string") {
                problems.push(`Text ${key}: není to text, použije se výchozí.`);
                continue;
            }
            const clean = cleanText(value, textLimits[key]);
            if (clean === "")
                continue;
            if (flatText(value).length > textLimits[key])
                problems.push(`Text ${key}: je delší než ${textLimits[key]} znaků, byl zkrácen.`);
            texts[key] = clean;
            if (clean !== baseTexts[key])
                textOverrides[key] = clean;
        }
    }
    let privacyUrl = "";
    if (raw["privacyUrl"] !== undefined) {
        const value = raw["privacyUrl"];
        privacyUrl = typeof value === "string" ? safeUrl(value) : "";
        if (privacyUrl === "" && !(typeof value === "string" && value.trim() === ""))
            problems.push("Odkaz na zásady: není to adresa http(s) ani cesta začínající /, odkaz se nezobrazí.");
    }
    return {
        config: {
            accent: pick("accent", isColor, defaultConfig.accent, "Barva tlačítek").toLowerCase(),
            categories,
            texts,
            privacyUrl,
            consentMode: pick("consentMode", isBool, defaultConfig.consentMode, "Consent Mode"),
            credit: pick("credit", isBool, defaultConfig.credit, "Odkaz Socionet"),
            revision: pick("revision", isRevision, defaultConfig.revision, "Verze nastavení"),
            language,
            respectGpc: pick("respectGpc", isBool, defaultConfig.respectGpc, "Global Privacy Control"),
            textOverrides,
        },
        problems,
    };
}
// ---- Colours ----
function channels(hex) {
    return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}
function luminance(hex) {
    const [r, g, b] = channels(hex).map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
}
function mix(hex, toward, amount) {
    const from = channels(hex);
    const to = channels(toward);
    return `#${from.map((c, i) => Math.round(c + ((to[i] ?? c) - c) * amount).toString(16).padStart(2, "0")).join("")}`;
}
// The library's background and text colour (vanilla-cookieconsent 3.1.0 CSS, light scheme).
const bannerBackground = "#ffffff";
const bannerText = "#2c2f31";
// The CSS custom properties of the library that carry the owner's colour. Button text is black or white,
// whichever reads better on the accent (one of them always reaches 4.5:1); links take the accent only when
// it reads on the banner's background, otherwise the text colour.
function themeVariables(config) {
    const accent = config.accent;
    const onAccent = contrast(accent, "#000000") >= contrast(accent, "#ffffff") ? "#000000" : "#ffffff";
    const hover = mix(accent, onAccent === "#ffffff" ? "#000000" : "#ffffff", 0.18);
    return {
        "--cc-btn-primary-bg": accent,
        "--cc-btn-primary-color": onAccent,
        "--cc-btn-primary-border-color": accent,
        "--cc-btn-primary-hover-bg": hover,
        "--cc-btn-primary-hover-color": onAccent,
        "--cc-btn-primary-hover-border-color": hover,
        "--cc-toggle-on-bg": accent,
        "--cc-toggle-on-knob-bg": onAccent,
        "--cc-toggle-enabled-icon-color": accent,
        "--cc-link-color": contrast(accent, bannerBackground) >= 4.5 ? accent : bannerText,
    };
}
// Which Consent Mode types each accepted category grants. Everything not accepted stays denied;
// security_storage (fraud protection, authentication) counts as necessary.
function consentState(accepted) {
    const has = (category) => (accepted.includes(category) ? "granted" : "denied");
    return {
        ad_storage: has("marketing"),
        ad_user_data: has("marketing"),
        ad_personalization: has("marketing"),
        analytics_storage: has("analytics"),
        functionality_storage: has("preferences"),
        personalization_storage: has("preferences"),
        security_storage: "granted",
    };
}
// The categories of a still valid earlier choice, read from the library's cookie with the library's own rules
// (vanilla-cookieconsent 3.1.0 retrieveState: consent id, both timestamps, the categories array and, when the
// revision is used, the same revision). Read synchronously while the page head is parsed, so Consent Mode
// gets the right state before any Google tag runs. null = no valid choice.
function storedCategories(cookieHeader, revision) {
    const escaped = consentCookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const found = cookieHeader.match(new RegExp(`(?:^|;)\\s*${escaped}\\s*=\\s*([^;]+)`));
    if (!found || found[1] === undefined)
        return null;
    let value;
    try {
        value = JSON.parse(decodeURIComponent(found[1]));
    }
    catch {
        return null;
    }
    if (!isRecord(value))
        return null;
    const { consentId, consentTimestamp, lastConsentTimestamp, categories } = value;
    if (typeof consentId !== "string" || consentId === "" || !consentTimestamp || !lastConsentTimestamp || !Array.isArray(categories))
        return null;
    if (value["revision"] !== revision)
        return null;
    return categories.filter((c) => typeof c === "string");
}
// ---- The library's configuration ----
// First-party cookies of common tools that the library deletes when their category is refused or withdrawn.
const autoClearCookies = {
    preferences: [],
    analytics: [/^_ga/, /^_gid$/, /^_gat/, /^_clck$/, /^_clsk$/, /^_hj/],
    marketing: [/^_fbp$/, /^_fbc$/, /^_gcl_/, /^_ttp$/, /^_uet/, /^_pin_unauth$/],
};
const categoryTexts = {
    preferences: ["preferencesCategoryTitle", "preferencesCategoryDescription"],
    analytics: ["analyticsTitle", "analyticsDescription"],
    marketing: ["marketingTitle", "marketingDescription"],
};
// The categories the banner offers: the configured ones, minus marketing when the owner honours Global Privacy
// Control and the browser sends it (GPC is an opt-out of sale and sharing of data for advertising). A category
// that is not offered can never be accepted, so its scripts and embeds stay blocked and Consent Mode keeps its
// types denied.
function offeredCategories(config, env) {
    return config.categories.filter((category) => !(category === "marketing" && config.respectGpc && env.gpc));
}
// What the banner hands vanilla-cookieconsent. Fixed, not configurable, because the law asks for it
// (§ 89 odst. 3 zákona č. 127/2005 Sb., GDPR, ÚOOÚ guidance): opt-in, nothing optional enabled in advance,
// "Odmítnout vše" next to "Přijmout vše" in the first layer and styled the same, no cookie wall, scripts
// managed by category, refused categories' cookies deleted.
function vendorConfig(config, callbacks, env = { gpc: false }) {
    const t = config.texts;
    const e = (key) => escapeHtml(t[key]);
    const privacyLink = config.privacyUrl ? `<a href="${escapeHtml(config.privacyUrl)}">${e("privacyLabel")}</a>` : "";
    const lang = env.lang ?? resolveLanguage(config.language, "");
    const credit = config.credit
        ? `<span class="plain-consent-credit">${creditPrefixes[lang]}<a href="${creditUrl}" target="_blank" rel="nofollow noopener">Socionet</a></span>`
        : "";
    const offered = offeredCategories(config, env);
    const categories = { necessary: { enabled: true, readOnly: true } };
    for (const category of offered) {
        const cookies = autoClearCookies[category].map((name) => ({ name }));
        categories[category] = { enabled: false, readOnly: false, ...(cookies.length > 0 && { autoClear: { cookies } }) };
    }
    const sections = [
        { description: e("preferencesDescription") },
        { title: e("necessaryTitle"), description: e("necessaryDescription"), linkedCategory: "necessary" },
        ...offered.map((category) => {
            const [title, description] = categoryTexts[category];
            return { title: e(title), description: e(description), linkedCategory: category };
        }),
    ];
    // A category withheld because of Global Privacy Control is explained instead of silently missing.
    if (config.categories.some((category) => !offered.includes(category))) {
        sections.push({ title: e("marketingTitle"), description: e("gpcNotice") });
    }
    if (privacyLink)
        sections.push({ description: privacyLink });
    return {
        mode: "opt-in",
        autoShow: true,
        revision: config.revision,
        manageScriptTags: true,
        autoClearCookies: true,
        hideFromBots: true,
        disablePageInteraction: false,
        lazyHtmlGeneration: true,
        cookie: { name: consentCookieName, expiresAfterDays: consentDays, sameSite: "Lax" },
        guiOptions: {
            consentModal: { layout: "box", position: "bottom left", equalWeightButtons: true, flipButtons: false },
            preferencesModal: { layout: "box", equalWeightButtons: true, flipButtons: false },
        },
        categories,
        language: {
            default: lang,
            translations: {
                [lang]: {
                    consentModal: {
                        title: e("title"),
                        description: e("description"),
                        acceptAllBtn: e("acceptAll"),
                        acceptNecessaryBtn: e("rejectAll"),
                        showPreferencesBtn: e("settings"),
                        footer: [privacyLink, credit].filter(Boolean).join(""),
                    },
                    preferencesModal: {
                        title: e("preferencesTitle"),
                        acceptAllBtn: e("acceptAll"),
                        acceptNecessaryBtn: e("rejectAll"),
                        savePreferencesBtn: e("save"),
                        closeIconLabel: e("close"),
                        sections,
                    },
                },
            },
        },
        onConsent: callbacks.onConsent,
        onChange: callbacks.onChange,
    };
}
// ---- Embeds ----
// An iframe that loads content from another site is tagged like a script and given its address in data-src,
// never in src (a src would load before any consent):
//   <iframe data-category="marketing" data-src="https://www.youtube-nocookie.com/embed/ID" data-title="Video" width="560" height="315"></iframe>
// Until the category is accepted the iframe stays empty and hidden and a placeholder with the reason and an
// "allow" button stands in its place. Withdrawing consent unloads the iframe and brings the placeholder back.
const embedSelector = "iframe[data-category][data-src]";
const embedBlockedClass = "plain-consent-blocked";
// The size a placeholder takes from the iframe's width and height attributes (plain pixel numbers), so the page
// does not jump when the content loads; null for anything else (percentages, missing).
function embedSize(width, height) {
    const number = (value) => (value !== null && /^\d{1,4}$/.test(value.trim()) ? Number(value) : 0);
    const [w, h] = [number(width), number(height)];
    return w > 0 && h > 0 ? { width: w, height: h } : null;
}
function createEmbeds(doc, host) {
    const frames = new Map();
    let accepted = [];
    const placeholderFor = (frame, category, withheld) => {
        const box = doc.createElement("div");
        box.className = "plain-consent-embed";
        box.setAttribute("role", "group");
        const title = frame.getAttribute("data-title");
        const label = cleanText(title ?? "", 80);
        if (label) {
            box.setAttribute("aria-label", label);
            const heading = doc.createElement("strong");
            heading.className = "plain-consent-embed-title";
            heading.textContent = label;
            box.appendChild(heading);
        }
        const message = doc.createElement("p");
        message.textContent = withheld ? host.texts.gpcNotice : host.texts.embedMessage.replace("{category}", host.texts[categoryTexts[category][0]]);
        box.appendChild(message);
        if (!withheld) {
            const actions = doc.createElement("div");
            actions.className = "plain-consent-embed-actions";
            const allow = doc.createElement("button");
            allow.type = "button";
            allow.className = "plain-consent-embed-allow";
            allow.textContent = host.texts.embedButton;
            allow.addEventListener("click", () => {
                host.allow(category);
                // The button is gone; keyboard focus goes to the content it asked for, not to the top of the page.
                if (frame.isConnected && !frame.hidden)
                    frame.focus();
            });
            const settings = doc.createElement("button");
            settings.type = "button";
            settings.className = "plain-consent-embed-settings";
            settings.textContent = host.texts.settings;
            settings.addEventListener("click", host.openSettings);
            actions.append(allow, settings);
            box.appendChild(actions);
        }
        const size = embedSize(frame.getAttribute("width"), frame.getAttribute("height"));
        if (size) {
            // CSSOM, not a style attribute: allowed under a Content-Security-Policy without 'unsafe-inline'.
            box.style.setProperty("aspect-ratio", `${size.width} / ${size.height}`);
            box.style.setProperty("max-width", `${size.width}px`);
            // On a narrow screen the ratio would leave less room than the text and buttons need: grow with them.
            box.style.setProperty("min-height", "auto");
        }
        return box;
    };
    const block = (frame, state, category) => {
        if (state.loaded || frame.getAttribute("src"))
            frame.setAttribute("src", "about:blank");
        state.loaded = false;
        frame.classList.add(embedBlockedClass);
        frame.setAttribute("hidden", "");
        const offered = host.offered.includes(category);
        const withheld = host.withheld.includes(category);
        // No placeholder for an embed that could never load (no valid address): an "allow" button would do nothing.
        if (!state.placeholder && (offered || withheld) && safeUrl(frame.getAttribute("data-src") ?? "") !== "") {
            state.placeholder = placeholderFor(frame, category, withheld);
            frame.parentNode?.insertBefore(state.placeholder, frame);
        }
    };
    const load = (frame, state) => {
        const src = safeUrl(frame.getAttribute("data-src") ?? "");
        if (src === "")
            return;
        if (state.placeholder) {
            state.placeholder.remove();
            state.placeholder = null;
        }
        if (!frame.hasAttribute("title")) {
            const title = cleanText(frame.getAttribute("data-title") ?? "", 80);
            if (title)
                frame.setAttribute("title", title);
        }
        frame.classList.remove(embedBlockedClass);
        frame.removeAttribute("hidden");
        frame.setAttribute("src", src);
        state.loaded = true;
    };
    const apply = (frame, state) => {
        const category = frame.getAttribute("data-category") ?? "";
        if (accepted.includes(category) && host.offered.includes(category) && safeUrl(frame.getAttribute("data-src") ?? "") !== "") {
            if (!state.loaded)
                load(frame, state);
        }
        else {
            block(frame, state, category);
        }
    };
    return {
        scan(root) {
            const found = Array.from(root.querySelectorAll(embedSelector));
            if ("matches" in root && root.matches(embedSelector))
                found.unshift(root);
            for (const frame of found) {
                if (frames.has(frame))
                    continue;
                const category = frame.getAttribute("data-category") ?? "";
                if (![...host.offered, ...host.withheld].includes(category)) {
                    host.warn(`an embed has data-category="${category}", which is not one of the categories in the configuration, so it stays blocked.`);
                }
                if (safeUrl(frame.getAttribute("data-src") ?? "") === "") {
                    host.warn("data-src of an embed is not an http(s) address or a path starting with /, the embed stays blocked.");
                }
                // A src would have loaded the content before any consent; it is replaced and reported.
                if (frame.hasAttribute("src") && frame.getAttribute("src") !== "about:blank") {
                    host.warn("an embed has a src attribute and may load before consent: use data-src only.");
                }
                const state = { placeholder: null, loaded: false };
                frames.set(frame, state);
                apply(frame, state);
            }
        },
        refresh(next) {
            accepted = next;
            for (const [frame, state] of frames) {
                if (!frame.isConnected) {
                    state.placeholder?.remove();
                    frames.delete(frame);
                    continue;
                }
                apply(frame, state);
            }
        },
    };
}
const svgNs = "http://www.w3.org/2000/svg";
function settingsButton(doc, label, open) {
    const button = doc.createElement("button");
    button.type = "button";
    button.className = "plain-consent-settings";
    button.setAttribute("aria-label", label);
    button.title = label;
    const svg = doc.createElementNS(svgNs, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const shape = doc.createElementNS(svgNs, "path");
    // A cookie with a bite and three crumbs.
    shape.setAttribute("d", "M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Zm-3.5 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-5 3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z");
    svg.appendChild(shape);
    button.appendChild(svg);
    button.addEventListener("click", open);
    return button;
}
// Called once by the published file, synchronously while the page's head is parsed: the Consent Mode default
// lands in the dataLayer before any Google tag after the snippet; the banner itself waits for the DOM.
function start(win, doc, cc) {
    const element = doc.getElementById(configElementId);
    let raw;
    try {
        raw = element ? JSON.parse(element.textContent ?? "") : undefined;
    }
    catch {
        raw = undefined;
    }
    const htmlLang = doc.documentElement.lang ?? "";
    const { config, problems } = normalizeConfig(raw, htmlLang);
    for (const problem of problems)
        win.console?.warn(`Plain Consent: ${problem}`);
    const gpc = win.navigator?.globalPrivacyControl === true;
    const env = { gpc, lang: resolveLanguage(config.language, htmlLang) };
    const offered = offeredCategories(config, env);
    const withheld = config.categories.filter((category) => !offered.includes(category));
    // What counts as accepted: only a category the banner offers, whatever an older choice in the cookie says.
    const effective = (accepted) => accepted.filter((category) => category === "necessary" || offered.includes(category));
    const dataLayer = (win.dataLayer = Array.isArray(win.dataLayer) ? win.dataLayer : []);
    // gtag.js reads Arguments objects from the dataLayer, not arrays (Google's own gtag() stub does the same).
    const gtag = function (..._args) {
        dataLayer.push(arguments);
    };
    let lastSent = "";
    const update = (accepted) => {
        if (!config.consentMode)
            return;
        const state = consentState(accepted);
        const key = JSON.stringify(state);
        if (key === lastSent)
            return;
        lastSent = key;
        gtag("consent", "update", state);
    };
    if (config.consentMode) {
        const denied = consentState([]);
        lastSent = JSON.stringify(denied);
        gtag("consent", "default", { ...denied, wait_for_update: 500 });
        gtag("set", "ads_data_redaction", true);
        const stored = storedCategories(doc.cookie, config.revision);
        if (stored)
            update(effective(stored));
    }
    const root = doc.documentElement;
    for (const [name, value] of Object.entries(themeVariables(config)))
        root.style.setProperty(name, value);
    const warn = (message) => win.console?.warn(`Plain Consent: ${message}`);
    const embeds = createEmbeds(doc, {
        texts: config.texts,
        offered,
        withheld,
        // An explicit choice, recorded like any other: the banner has nothing left to ask, the settings button stays.
        allow: (category) => {
            cc.acceptCategory([...new Set([...cc.getUserPreferences().acceptedCategories, category])]);
            cc.hide();
        },
        openSettings: () => cc.showPreferences(),
        warn,
    });
    // The library calls onConsent on the first choice and on every later page with a valid choice, so the round
    // settings button appears only once there is a choice to change (before it, the banner itself is open).
    let button;
    let lastEvent = "";
    const sync = () => {
        const accepted = effective(cc.getUserPreferences().acceptedCategories);
        update(accepted);
        embeds.refresh(accepted);
        if (!button && doc.body) {
            button = settingsButton(doc, config.texts.preferencesTitle, () => cc.showPreferences());
            doc.body.appendChild(button);
        }
        // The page's own code can listen: document.addEventListener("plain-consent:update", (e) => e.detail.categories).
        const key = JSON.stringify(accepted);
        if (key !== lastEvent && typeof win.CustomEvent === "function") {
            lastEvent = key;
            doc.dispatchEvent(new win.CustomEvent("plain-consent:update", { detail: { categories: accepted } }));
        }
    };
    const go = () => {
        // Embeds are blocked before the banner is even built, and also the ones the page adds later.
        const stored = storedCategories(doc.cookie, config.revision);
        embeds.refresh(stored ? effective(stored) : []);
        embeds.scan(doc);
        if (typeof win.MutationObserver === "function") {
            new win.MutationObserver((records) => {
                for (const record of records)
                    for (const node of Array.from(record.addedNodes))
                        if (node.nodeType === 1)
                            embeds.scan(node);
            }).observe(root, { childList: true, subtree: true });
        }
        cc.run(vendorConfig(config, { onConsent: sync, onChange: sync }, env));
    };
    if (doc.readyState === "loading")
        doc.addEventListener("DOMContentLoaded", go, { once: true });
    else
        go();
}
start(window, document, CookieConsent);
})();
